import mongoose from "mongoose";

const connectDB = async () => {
  const opts = {
    serverSelectionTimeoutMS: 5000, // fail fast if Atlas is unreachable
    socketTimeoutMS: 45000,
    maxPoolSize: 10, // reuse up to 10 TCP connections instead of opening one per request
    retryWrites: true,
  };

  const attemptConnect = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, opts);
      console.log("MongoDB connected");
    } catch (err) {
      console.error(
        `MongoDB initial connection failed — retrying in 5s: ${err.message}`,
      );
      setTimeout(attemptConnect, 5000); // retry indefinitely until connected
    }
  };

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected — Mongoose will attempt to reconnect");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

  await attemptConnect();
};

export default connectDB;
