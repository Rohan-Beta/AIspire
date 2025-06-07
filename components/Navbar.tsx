import React from "react";
import "../app/globals.css";
import Link from "next/link";
import Navitems from "./Navitems";

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
        <p>Sign In</p>
      </div>
    </nav>
  );
};

export default Navbar;
