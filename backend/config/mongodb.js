import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("You Are Connected to MongoDB");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/healthqueue`, {
    maxPoolSize: 50,       // match max concurrent VUs/requests
    maxIdleTimeMS: 30000,  // close idle connections after 30s
  });
};

export default connectDB;
