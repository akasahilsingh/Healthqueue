import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";


// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

//API endpoints
app.get("/", (req, res) => {
  res.send("Our API is working fine");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
