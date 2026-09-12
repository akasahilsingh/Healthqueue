import jwt from "jsonwebtoken";
import vaildator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";
import {
  uploadTempFileToCloudinary,
  deleteCloudinaryAssetByUrl,
} from "../config/cloudinary.js";
import {
  setAuthCookies,
  clearAuthCookies,
  signAccessToken,
  accessCookieOptions,
  parseCookies,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_COOKIE,
} from "../config/jwt.js";

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

    setAuthCookies(res, { id: user._id, role: "user", email: user.email });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      phone: user.phone,
      address: user.address,
      dob: user.dob,
      gender: user.gender,
    };

    return res.status(201).json({
      success: true,
      user: safeUser,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to register user",
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
      return res.status(401).json({
        success: false,
        message: "Wrong credentials",
      });
    }

    setAuthCookies(res, { id: userExists._id, role: "user", email: userExists.email });

    const safeUser = {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      image: userExists.image,
      phone: userExists.phone,
      address: userExists.address,
      dob: userExists.dob,
      gender: userExists.gender,
    };

    return res.status(200).json({
      success: true,
      user: safeUser,
      message: "Logged In successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to login user",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    clearAuthCookies(res);
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to logout user",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        user: null,
        message: "No active user session",
      });
    }

    const user = await userModel.findById(userId).select("-password").lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        user: null,
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
      user: null,
      message: "Unable to fetch user profile",
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

    const currentUser = await userModel.findById(userId).select("image");

    await userModel.findByIdAndUpdate(userId, {
      name: name.trim(),
      phone: phone.trim(),
      address: JSON.parse(address),
      dob: dob.trim(),
      gender: gender.trim(),
    });

    if (imageFile) {
      const imageUrl = await uploadTempFileToCloudinary(imageFile, "image");

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });

      if (
        currentUser?.image &&
        currentUser.image !== imageUrl &&
        !currentUser.image.startsWith("data:")
      ) {
        await deleteCloudinaryAssetByUrl(currentUser.image);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfuly",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update user profile",
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

    const existingAppointment = await appointmentModel.findOne({
      userId,
      slotDate,
      slotTime,
      cancelled: { $ne: true },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment at this time",
      });
    }

    const duplicateDoctorAppointment = await appointmentModel.findOne({
      docId,
      slotDate,
      slotTime,
      cancelled: { $ne: true },
    });

    if (duplicateDoctorAppointment) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
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

    try {
      await newAppointment.save();
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "This slot is already booked",
        });
      }
      throw error;
    }

    try {
      await doctorModel.findByIdAndUpdate(docId, {
        $addToSet: {
          [`slots_booked.${slotDate}`]: slotTime,
        },
      });
    } catch (updateError) {
      await appointmentModel.findByIdAndDelete(newAppointment._id);
      throw updateError;
    }

    return res.status(201).json({
      success: true,
      newAppointment,
      message: "Successfully booked Appointment",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to book appointment",
    });
  }
};

const listAppointment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skipIndex = (page - 1) * limit;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorised login again",
      });
    }

    const [appointments, totalAppointments] = await Promise.all([
      appointmentModel
        .find({ userId })
        .sort({ date: -1 })
        .skip(skipIndex)
        .limit(limit)
        .lean(),
      appointmentModel.countDocuments({ userId }),
    ]);

    const totalPages = Math.ceil(totalAppointments / limit);

    return res.status(200).json({
      success: true,
      appointments,
      pagination: {
        totalAppointments,
        limit,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      message: "Appointment fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch appointments",
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { appointmentId } = req.body;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel appointment",
      });
    }

    appointment.cancelled = true;
    await appointment.save();

    const { docId, slotTime, slotDate } = appointment;

    await doctorModel.findByIdAndUpdate(docId, {
      $pull: {
        [`slots_booked.${slotDate}`]: slotTime,
      },
    });

    return res.status(200).json({
      success: true,
      cancelledAppointment: appointment,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to cancel appointment",
    });
  }
};

const getRazorpayInstance = () => {
  const { RAZORPAY_KEY_ID: keyId, RAZORPAY_KEY_SECRET: keySecret } = process.env;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay environment variables are not configured");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};
const razorpayCurrency = (process.env.CURRENCY || "INR").toUpperCase();

const paymentRazorPay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.status(404).json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    // creating options for razorpay
    const amount = Number(appointmentData.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment amount",
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: razorpayCurrency,
      receipt: String(appointmentId),
    };

    const order = await getRazorpayInstance().orders.create(options);
    return res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
      message: "Payment successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

// API to verify payment of razorpay

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await getRazorpayInstance().orders.fetch(razorpay_order_id);

    // console.log(orderInfo);
    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      return res.status(200).json({
        success: true,
        message: "Payment successful",
      });
    } else {
      return res.status(402).json({
        success: false,
        message: "Payment failed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to verify payment",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const cookies = parseCookies(req.headers.cookie || "");
    const token = cookies[REFRESH_TOKEN_COOKIE];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token. Please log in again.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired or invalid. Please log in again.",
      });
    }

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type.",
      });
    }

    // Issue a new access token
    const newAccessToken = signAccessToken({
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    });
    res.cookie(ACCESS_TOKEN_COOKIE, newAccessToken, accessCookieOptions);

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to refresh access token",
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorPay,
  verifyRazorpay,
  refreshToken,
};
