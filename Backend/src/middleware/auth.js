import User from "../models/User.js";
import JWTService from "../services/JWTService.js";

const auth = async (req, res, next) => {
  try {
    // 1. Get access token from cookies or headers
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return next({
        status: 401,
        message: "Unauthorized",
      });
    }

    // 2. Verify access token
    let _id;
    try {
      _id = JWTService.verifyAccessToken(accessToken)._id;
    } catch (error) {
      return next(error);
    }

    // 3. Find user
    let user;
    try {
      user = await User.findOne({ _id });
      if (!user) {
        return next({ status: 404, message: "User not found" });
      }
    } catch (error) {
      return next(error);
    }

    // 4. Attach User to req.user
    req.user = user;

    next();
  } catch (error) {
    return next(error);
  }
};

export default auth;
