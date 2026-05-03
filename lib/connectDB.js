import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "quickcart",
  });

  console.log("MongoDB Connected");
};

export default connectDB;
