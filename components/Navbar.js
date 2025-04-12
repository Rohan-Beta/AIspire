import React from "react";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center h-14 border px-4">
      <div className="text-blue-600 font-bold text-2xl md:text-3xl">AIspire</div>
      <div>

        <Link href={"/signin"}>
        <button className="bg-blue-600 text-white px-4 py-1 rounded-lg mx-4 hover:cursor-pointer">
          Sign In
        </button></Link>
        
        <Link href={"/signup"}>
        <button className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:cursor-pointer">
          Sign Up
        </button>
        </Link>
      </div>
    </nav>
  );
};
