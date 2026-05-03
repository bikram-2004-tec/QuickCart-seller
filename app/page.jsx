"use client";

import Navbar from "@/components/seller/Navbar";
import Sidebar from "@/components/seller/Sidebar";
import AddProduct from "./seller/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex">
        <div className="w-60 bg-white border-r min-h-screen">
          <Sidebar />
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <AddProduct />
        </div>
      </div>
    </div>
  );
}