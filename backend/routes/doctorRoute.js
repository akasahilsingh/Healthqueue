import express from "express";
import upload from "../middlewares/multer.js";
import {
  appointmentCancel,
  appointmentComplete,
  appointmentsDoctor,
  doctordashboard,
  doctorList,
  logInDoctor,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

//Endpoint
// adminRouter.post('/add-doctor', upload.single('image'), (req, res, next) => {
//     console.log('File in route:', req.file);
//     next();
// }, addDoctor)
doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", logInDoctor);
doctorRouter.get("/appointment", authDoctor, appointmentsDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/dashboard", authDoctor, doctordashboard);

export default doctorRouter;
