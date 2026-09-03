import vaildator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    if (!vaildator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Enter strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password is required",
      });
    }

    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Email id is not registered",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Wrong credentials",
      });
    }

    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      token,
      message: "Logged In successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorised login again",
      });
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
      message: "User profile fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.user?.id;
    const imageFile = req.file;
    if (!name.trim() || !phone.trim() || !dob.trim() || !gender.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      name: name.trim(),
      phone: phone.trim(),
      address: JSON.parse(address),
      dob: dob.trim(),
      gender: gender.trim(),
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.status(201).json({
      success: true,
      message: "Profile updated successfuly",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user?.id;

    if (!docId || !slotDate || !slotTime || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing booking details",
      });
    }

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!docData.availability) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available for appointment",
      });
    }

    const slotsBooked = docData.slots_booked || {};
    const bookedSlotsForDate = slotsBooked[slotDate] || [];

    if (bookedSlotsForDate.includes(slotTime)) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { slots_booked: _, ...docDataWithoutSlots } = docData.toObject();

    const appointment = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        dob: user.dob,
      },
      docData: docDataWithoutSlots,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointment);
    await newAppointment.save();

    const updatedSlotsBooked = {
      ...slotsBooked,
      [slotDate]: [...bookedSlotsForDate, slotTime],
    };

    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked: updatedSlotsBooked,
    });

    return res.status(201).json({
      success: true,
      newAppointment,
      message: "Successfully booked Appointment",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const listAppointment = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorised login again",
      });
    }

    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      appointments,
      message: "Appointment fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { appointmentId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (appointment.userId !== userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized to cancel appointment",
      });
    }

    appointment.cancelled = true;
    await appointment.save();

    const { docId, slotTime, slotDate } = appointment;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime,
    );

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

const paymentRazorPay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    res.status(201).json({
      success: true,
      message: "Successfull razor pay ment",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorPay,
};


