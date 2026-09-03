import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      availability: !docData.availability,
    });
    res.status(200).json({
      success: true,
      message: "Availability changed successfully",
    });
  } catch (error) {
    console.log(
      "Error while changing availability status of doctor: ",
      error.message,
    );
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");

    res.status(200).json({
      success: true,
      doctors,
      message: "Successfully fetched all doctors",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Not able to fetch doctors",
    });
  }
};

const logInDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      token,
      message: "Successfully logged in!",
    });
  } catch (error) {
    console.log("Error while login doctor: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to login doctor",
    });
  }
};

// API to get doctor appointments for doctor panel

const appointmentsDoctor = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.user });
    res.status(200).json({
      success: true,
      appointments,
      message: "Successfully fetched doctor's all appointments",
    });
  } catch (error) {
    console.log("Error while fetching doctor appointments: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to login doctor",
    });
  }
};

// API to mark appointment completed for doctor panel

const appointmentComplete = async (req, res) => {
  try {
    const docId = req.user;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (
      appointmentData &&
      appointmentData.docId.toString() === docId.toString()
    ) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.status(200).json({
        success: true,
        message: "Successfully marked appointment completed",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Mark failed",
      });
    }
  } catch (error) {
    console.log("Error while marking complete of appointment: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to mark complete appointment",
    });
  }
};

// API to cancel appointment for doctor panel

const appointmentCancel = async (req, res) => {
  try {
    const docId = req.user;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (
      appointmentData &&
      appointmentData.docId.toString() === docId.toString()
    ) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.status(200).json({
        success: true,
        message: "Successfully marked appointment cancelled",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Cancellation failed",
      });
    }
  } catch (error) {
    console.log("Error while marking complete of appointment: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to mark complete appointment",
    });
  }
};

//APT to get dashboard data for doctor panel

const doctordashboard = async (req, res) => {
  try {
    const docId = req.user;
    const appointments = await appointmentModel.find({ docId });
    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    return res.status(200).json({
      success: true,
      dashData,
      message: "Successfully fetched doctor Dashboard data",
    });
  } catch (error) {
    console.log(
      "Error while getting appointment data for doctor dashboard: ",
      error.message,
    );
    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to get appointment data for doctor dashboard",
    });
  }
};

//  API to get doctor profile for Doctor panel
const doctorProfile = async (req, res) => {
  try {
    const docId = req.user;

    const profileData = await doctorModel.findById(docId).select("-password");

    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    return res.status(200).json({
      success: true,
      profileData,
      message: "Successfully fetched doctor profile data",
    });
  } catch (error) {
    console.log(
      "Error while fetching doctor profile for doctor dashboard: ",
      error.message,
    );
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch doctor profile data for doctor dashboard",
    });
  }
};

// API to update doctor profile data from doctor panel

const updateDoctorProfile = async (req, res) => {
  try {
    const { fees, address, availability } = req.body;
    const docId = req.user;

    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      availability,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor profile updated successfully",
    });
  } catch (error) {
    console.log("Error while updating doctor profile: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable update doctor profile",
    });
  }
};
export {
  changeAvailability,
  doctorList,
  logInDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctordashboard,
  doctorProfile,
  updateDoctorProfile,
};
