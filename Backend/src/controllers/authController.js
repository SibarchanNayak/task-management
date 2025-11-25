import bcrypt from "bcrypt";
import User from "../models/User.js";
import Joi from "joi";
import JWTService from "../services/JWTService.js";
import RefreshToken from "../models/RefreshToken.js";

// REGISTER
export const registerUser = async (req, res, next) => {
  const registerUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required()
      .messages({ "string.email": "Please enter a valid email address" }),
    password: Joi.string().min(8).required(),
  });

  const { error } = registerUserSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      const error = {
        status: 400,
        message: "Email already Exist",
      };
      return next(error);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  const loginUserSchema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({ "string.email": "Please enter a valid email address" }),
    password: Joi.string().min(8).required(),
  });

  const { error } = loginUserSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = {
        status: 400,
        message: "User not found",
      };
      return next(error);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      const error = {
        status: 400,
        message: "Invalid password",
      };
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, "1d");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "2d");
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // send tokens in cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.json({
      user,
      auth: true,
      message: "Login Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//LOGOUT
export const logout = async (req, res, next) => {
  // 1.delete refresh token from db
  const { refreshToken } = req.cookies;
  try {
    await RefreshToken.deleteOne({ token: refreshToken });
  } catch (error) {
    return next(error);
  }

  // delete cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  // 2.response
  res
    .status(200)
    .json({ admin: null, auth: false, message: "Logout Successfully" });
};
//refresh
export const refresh = async (req, res, next) => {
  const originalRefreshToken = req.cookies.refreshToken;
  let id;

  try {
    id = JWTService.verifyRefreshToken(originalRefreshToken)._id;

    const match = RefreshToken.findOne({
      _id: id,
      token: originalRefreshToken,
    });
    if (!match) {
      const error = {
        status: 400,
        message: "Unauthorized",
      };
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: id }, "10d");
    const refreshToken = JWTService.signRefreshToken({ _id: id }, "20d");

    await RefreshToken.updateOne({ userId: id }, { token: refreshToken });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 10,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 20,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    const user = await User.findOne({ _id: id });

    return res.status(200).json({ user, auth: true });
  } catch (e) {
    const error = {
      status: 400,
      message: "Unauthorized",
    };
    return next(error);
  }
};
