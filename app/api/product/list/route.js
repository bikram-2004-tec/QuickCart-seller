import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Product list error",
    });
  }
}