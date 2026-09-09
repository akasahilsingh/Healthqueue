import jwt from "jsonwebtoken";
import { parseCookies, ACCESS_TOKEN_COOKIE } from "../config/jwt.js";

const authAdmin = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie || "");
    const token = cookies[ACCESS_TOKEN_COOKIE];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorised login again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (
      token_decode.id !== "admin" ||
      token_decode.email !== process.env.ADMIN_EMAIL
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorised login again",
      });
    }

    req.user = token_decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authAdmin;
