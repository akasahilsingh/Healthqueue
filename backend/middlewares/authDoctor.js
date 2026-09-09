import jwt from "jsonwebtoken";
import { parseCookies, ACCESS_TOKEN_COOKIE } from "../config/jwt.js";

const authDoctor = async (req, res, next) => {
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
    req.user = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authDoctor;
