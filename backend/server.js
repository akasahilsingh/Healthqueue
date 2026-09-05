import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
// import adminRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware

app.use(express.static("public"));
app.use(express.json());
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
  process.env.ADMIN_FRONTEND_URL?.replace(/\/$/, ""),
  "https://healthqueue-olive.vercel.app",
  "https://healthqueue-admin.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const isRenderOrigin = origin?.endsWith(".onrender.com");
      if (!origin || allowedOrigins.includes(origin) || isRenderOrigin) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
  }),
);

//API endpoints
app.use("/api/admin", adminRouter);
//http://localhost:4000/api/admin/
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.get("/", (req, res) => {
  res.send("Our API is working fine");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
