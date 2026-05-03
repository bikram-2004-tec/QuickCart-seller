import connectDB from "@/lib/db";
import Address from "@/model/addressModel";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDB();

    const { id } = await req.json();
    await Address.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}