import jwt from "jsonwebtoken";
import { parseCookies, ACCESS_TOKEN_COOKIE } from "../config/jwt.js";

const authUser = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie || "");
    const token = cookies[ACCESS_TOKEN_COOKIE];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorised login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};

const optionalAuthUser = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie || "");
    const token = cookies[ACCESS_TOKEN_COOKIE];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};

export { optionalAuthUser };
export default authUser;
