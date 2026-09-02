import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: "Not authorised login again",
      });
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (
      token_decode.id !== "admin" ||
      token_decode.email !== process.env.ADMIN_EMAIL
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorised login again",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authAdmin;
