import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/model/orderModel";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { returnReason } = await req.json();

    if (!returnReason) {
      return NextResponse.json({
        success: false,
        message: "Return reason required",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "Delivered") {
      return NextResponse.json({
        success: false,
        message: "Only delivered orders can be returned",
      });
    }

    order.status = "Return Requested";
    order.returnReason = returnReason;
    order.returnedAt = new Date();

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Return requested",
      order,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}