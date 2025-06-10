import React from "react";
import "../app/globals.css";
import Link from "next/link";
import Navitems from "./Navitems";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = () => {
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
        <Navitems />

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
