import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("You Are Connected to MongoDB");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/healthqueue`);
};

export default connectDB;
