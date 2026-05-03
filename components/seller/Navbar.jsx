"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="flex items-center px-4 md:px-8 py-3 justify-between border-b">
      <Image
        onClick={() => router.push("/")}
        className="w-28 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      <button
        onClick={() => router.push("/seller")}
        className="bg-gray-600 text-white px-5 py-2 rounded-full text-sm"
      >
        Go to Store
      </button>
    </div>
  );
};

export default Navbar;