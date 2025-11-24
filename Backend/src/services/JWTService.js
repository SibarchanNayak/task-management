import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../../config/index.js";

class JWTService {
  // Sign access token
  static signAccessToken(payload, expiryTime = null) {
    const options = expiryTime ? { expiresIn: expiryTime } : {};
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
  }

  // Sign refresh token
  static signRefreshToken(payload, expiryTime = null) {
    const options = expiryTime ? { expiresIn: expiryTime } : {};
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
  }

  // Verify access token
  static verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }

  // store refresh token
  static async storeRefreshToken(token, userId) {
    try {
      await RefreshToken.updateOne(
        {
          userId,
        },
        { token: token },
        { upsert: true }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export default JWTService;
