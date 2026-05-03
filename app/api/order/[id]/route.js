import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/model/orderModel";

export async function GET(req, { params }) {
  try {
    await connectDB();

   const { id } = await params;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}