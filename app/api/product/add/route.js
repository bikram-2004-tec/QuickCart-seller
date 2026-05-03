import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const files = formData.getAll("images").filter((file) => file && file.size > 0);

    const imageUrls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "quickcart/products" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrls.push(result.secure_url);
    }

    const newProduct = await Product.create({
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      offerPrice: Number(formData.get("offerPrice")),
      images: imageUrls,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error adding product" }, { status: 500 });
  }
}