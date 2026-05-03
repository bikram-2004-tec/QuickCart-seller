import connectDB from "@/lib/db";
import Address from "@/model/addressModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const address = await Address.create(body);

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}