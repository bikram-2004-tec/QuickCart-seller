import connectDB from "@/lib/db";
import Order from "@/model/orderModel";
import { NextResponse } from "next/server";

// =====================
// CREATE ORDER (POST)
// =====================
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const order = await Order.create(body);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// =====================
// GET ORDERS (GET)
// =====================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const orders = await Order.find(
      userId ? { userId } : {}
    ).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// =====================
// UPDATE ORDER STATUS (PATCH)
// =====================
export async function PATCH(req) {
  try {
    await connectDB();

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({
        success: false,
        message: "Order ID and status required",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

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
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}