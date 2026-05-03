"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const context = useAppContext();

  if (!context) return null;

  const { products, router } = context;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-14">

      {/* TITLE */}
      <p className="text-2xl md:text-3xl font-semibold text-center">
        Popular Products
      </p>

      {/* GRID */}
      <div
        className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-6
        mt-8
      "
      >
        {products?.slice(0, 10).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={() => router.push("/all-products")}
          className="mt-10 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default HomeProducts;