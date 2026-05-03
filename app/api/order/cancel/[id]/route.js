import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/model/orderModel";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { cancelReason } = await req.json();

    if (!cancelReason) {
      return NextResponse.json({
        success: false,
        message: "Cancel reason is required",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Delivered") {
      return NextResponse.json({
        success: false,
        message: "Delivered order cannot be cancelled",
      });
    }

    order.status = "Cancelled";
    order.cancelReason = cancelReason;
    order.cancelledAt = new Date();

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}