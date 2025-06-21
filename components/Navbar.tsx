"use client";

import React, { useState } from "react";
import "../app/globals.css";
import Link from "next/link";
import Navitems from "./Navitems";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";

const Navbar = () => {
  const [isDropDown, setIsDropDown] = useState(false);

  const toggleDropDown = () => {
    setIsDropDown(!isDropDown);
  };

  return (
    <nav className="navbar">
      <Link href={"/"}>
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="text-4xl font-bold">
            <span className="gradientText">AI</span>
            <span className="text-blue-600">spire</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-8">
        <div className="md:block hidden">
          <Navitems />
        </div>

        {/* drop down menu */}

        <div className="relative block md:hidden">
          <button
            onClick={toggleDropDown}
            className="focus:outline-none hover:font-bold hover:underline"
          >
            <Image
              className="cursor-pointer"
              src={"/icons/menu.svg"}
              alt="menu"
              width={40}
              height={40}
            />
          </button>

          {isDropDown && (
            <div className="absolute right-0 bg-black text-white mt-2 w-48 rounded-lg shadow-lg z-10">
              <Link
                onClick={toggleDropDown}
                href="/"
                className="block px-4 py-2
            hover:bg-white hover:text-black"
              >
                Home
              </Link>
              <Link
                onClick={toggleDropDown}
                href="/companions"
                className="block px-4 py-2 hover:bg-white hover:text-black"
              >
                Companion
              </Link>
              <Link
                onClick={toggleDropDown}
                href={"/my-journey"}
                className="block px-4 py-2 hover:bg-white hover:text-black"
              >
                My Journey
              </Link>
            </div>
          )}
        </div>

        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton>
              <button className="btn-signin">Sign In</button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
