import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    console.log("URI EXISTS:", !!process.env.MONGODB_URI);
    console.log("URI START:", process.env.MONGODB_URI?.slice(0, 40));

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "quickcart",
      serverSelectionTimeoutMS: 10000,
    });

    return NextResponse.json({
      success: true,
      message: "MongoDB connected ✅",
    });
  } catch (error) {
    console.log("REAL MONGO ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        name: error.name,
        message: error.message,
        code: error.code,
        reason: error.reason?.message,
      },
      { status: 500 }
    );
  }
}