import jwt from "jsonwebtoken";

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not authorised login again",
      });
    }
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
    // if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
    //   return res.json({
    //     success: false,
    //     message: "Not authorised login again",
    //   });
    // }
    req.user = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
