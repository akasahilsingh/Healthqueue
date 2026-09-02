import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// API For adding doctor

const addDoctor = async (req, res) => {
  try {
    console.log("Headers:", req.headers["content-type"]);
    console.log("Full Request Body:", req.body);
    console.log("File:", req.file);

    // Log each field individually
    console.log("Individual fields:");
    console.log("name:", req.body.name);
    console.log("email:", req.body.email);
    console.log("password:", req.body.password);
    console.log("speciality:", req.body.speciality);
    console.log("degree:", req.body.degree);
    console.log("experience:", req.body.experience);
    console.log("about:", req.body.about);
    console.log("fees:", req.body.fees);
    console.log("address:", req.body.address);

    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      availability,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // Checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      console.log("Missing fields:", {
        name,
        email,
        password,
        speciality,
        degree,
        experience,
        about,
        fees,
        address,
        imageFile: !!imageFile,
      });
      return res.json({ success: false, message: "All fields are required" });
    }

    // Validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // Validating Strong Password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageURL = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageURL,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      availability,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    return res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

// API for the admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { id: "admin", email: process.env.ADMIN_EMAIL },
        process.env.JWT_SECRET,
      );
      res.json({ success: true, message: "Login successful", token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

const getAllDoctor = async (req, res) => {
  try {
    const allDoctors = await doctorModel.find({}).select("-password");
    res.status(200).json({
      success: true,
      doctors: allDoctors,
      message: "All doctors fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting all doctors", error.message);
  }
};

const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    return res.status(200).json({
      success: true,
      appointments,
      message: "Appointements fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting all doctors", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while getting all apoitments",
    });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.cancelled = true;
    await appointment.save();

    const { docId, slotTime, slotDate } = appointment;
    const doctorData = await doctorModel.findById(docId);
    if (!doctorData) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    let slots_booked = doctorData.slots_booked;

    if (slots_booked?.[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime,
      );
    }

    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked,
    });

    return res.status(200).json({
      success: true,
      cancelledAppointment: appointment,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to cancel the appointment",
    });
  }
};

export {
  addDoctor,
  loginAdmin,
  getAllDoctor,
  appointmentAdmin,
  appointmentCancel,
};
