import vaildator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

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

export { registerUser, loginUser };
