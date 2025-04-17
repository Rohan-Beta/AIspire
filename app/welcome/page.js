"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { BookOpen, Mic } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";

const Welcome = () => {
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

  return (
    <div className="h-full pb-6">
      <Navbar />

      <div className="flex justify-center mt-30 md:text-5xl text-4xl font-bold">
        Revolutionize Learning With
      </div>
      <div className="flex justify-center mt-3 md:text-6xl text-5xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-600 text-transparent bg-clip-text items-center pb-2">
        AI-Powered Voice Agent
        <Mic className="w-8 h-8 text-gray-700 mx-2 mt-2" />
        <BookOpen className="w-8 h-8 text-red-500 mt-2" />
      </div>

      <div className="flex justify-center mt-15 mb-2">
        <Link href={user && user.isVerified ? "/home" : "/signup"}>
          <Button className="bg-black text-white md:px-8 px-4 py-2 rounded-lg shadow-2xl hover:cursor-pointer">
            Get Started
          </Button>
        </Link>
      </div>
      <div className="flex justify-center px-2">
        <img
          className="rounded-4xl shadow-2xl"
          src="./logo1.jpg"
          alt="welcome logo"
        />
      </div>
    </div>
  );
};

export default Welcome;
