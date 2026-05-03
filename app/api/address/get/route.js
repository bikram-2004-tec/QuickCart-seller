import connectDB from "@/lib/db";
import Address from "@/model/addressModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const addresses = await Address.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}