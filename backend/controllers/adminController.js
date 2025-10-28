import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";

// API For adding doctor

const addDoctor = async (req, res) => {
  try {
    console.log('Headers:', req.headers['content-type']);
    console.log('Full Request Body:', req.body);
    console.log('File:', req.file);
    
    // Log each field individually
    console.log('Individual fields:');
    console.log('name:', req.body.name);
    console.log('email:', req.body.email);
    console.log('password:', req.body.password);
    console.log('speciality:', req.body.speciality);
    console.log('degree:', req.body.degree);
    console.log('experience:', req.body.experience);
    console.log('about:', req.body.about);
    console.log('fees:', req.body.fees);
    console.log('address:', req.body.address);
    
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
      console.log('Missing fields:', { name, email, password, speciality, degree, experience, about, fees, address, imageFile: !!imageFile });
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

export { addDoctor };
