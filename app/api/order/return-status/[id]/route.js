import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/model/orderModel";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { status } = await req.json();

    if (!["Return Approved", "Return Rejected"].includes(status)) {
      return NextResponse.json({
        success: false,
        message: "Invalid return status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    order.returnDecisionAt = new Date();

    await order.save();

    return NextResponse.json({
      success: true,
      message: status,
      order,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}