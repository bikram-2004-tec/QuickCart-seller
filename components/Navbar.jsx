"use client";

import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const context = useAppContext();
  const { openSignIn } = useClerk();

  if (!context) return null;

  const { router, user, isSeller } = context;

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 bg-white">

      {/* LOGO */}
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      {/* MENU */}
      <div className="flex items-center gap-6 max-md:hidden">
        <Link href="/">Home</Link>
        <Link href="/all-products">Shop</Link>
        <Link href="/">About</Link>
        <Link href="/">Contact</Link>

        {isSeller && (
          <button onClick={() => window.open("/seller", "_blank")}>
            Seller Dashboard
          </button>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {user ? (
          <UserButton>
            <UserButton.MenuItems>

              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/cart")}
              />

              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/my-orders")}
              />

            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2"
          >
            <Image src={assets.user_icon} alt="user" />
            Account
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;