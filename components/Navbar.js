"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useState } from "react";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/getuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        const data = await res.json();

        if (res.status == 200) {
          setUser(data);
        }
        if (res.status == 500) {
          setUser(data.error);
        }
      } catch (error) {
        setError("Error fetching user data");
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center">
        <img className="w-10" src="/logo.png" alt="app logo" />
        <div className="text-blue-600 font-bold text-2xl md:text-3xl">
          Ispire
        </div>
      </div>
    );
  }

  return (
    <nav className="flex justify-between items-center h-14 border px-4">
      <div className="flex items-center">
        <img className="w-10" src="/logo.png" alt="app logo" />
        <div className="text-blue-600 font-bold text-2xl md:text-3xl">
          Ispire
        </div>
      </div>
      {user && user.isVerified ? (
        <div>{user.name}</div>
      ) : (
        <div>
          <Link href={"/signin"}>
            <Button className="bg-blue-600 text-white px-4 py-1 rounded-lg mx-4 hover:cursor-pointer hover:bg-indigo-700 transition">
              Sign In
            </Button>
          </Link>

          <Link href={"/signup"}>
            <Button className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:cursor-pointer hover:bg-indigo-700 transition">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
