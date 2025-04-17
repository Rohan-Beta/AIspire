"use client";

import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import NotFound from "../not-found";

const OTPPage = () => {
  const inputsRef = useRef([]);
  const [error, setError] = useState(false);

  const router = useRouter();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otp = inputsRef.current.map((input) => input.value).join("");
    const isAnyEmpty = inputsRef.current.some((input) => input.value === "");

    if (isAnyEmpty) {
      setError(true);
    } else {
      setError(false);

      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      try {
        let res = await fetch("http://localhost:4000/api/verifyotp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({ otp: otp }),
        });
        const data = await res.json();

        if (res.status == 400) {
          alert(data.message);
          localStorage.clear();
          router.push("/signup");
        }

        if (res.status == 200) {
          alert(data.message);
          router.push("/signin");
        }

        if (res.status == 500) {
          alert(data.error);
        }
      } catch (error) {
        alert("Server Issue");
      }
    }
  };

  const [user, setUser] = useState(null);

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
    <>
      {user && user.isVerified ? (
        <NotFound />
      ) : (
        <div>
          <nav className="flex justify-between items-center h-14 border px-4">
            <div className="text-blue-600 font-bold text-2xl md:text-3xl">
              AIspire
            </div>
          </nav>
          <div className="min-h-[90vh] flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Enter the 6-digit OTP
              </h2>
              <form
                action=""
                onSubmit={verifyOtp}
                className="flex flex-col items-center"
              >
                <div className="flex gap-3 mb-6">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className={`w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 ${
                        error && !inputsRef.current[index]?.value
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      ref={(el) => (inputsRef.current[index] = el)}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-red-500 text-sm mb-4">
                    Please enter all 6 digits of the OTP.
                  </p>
                )}
                <Button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Verify OTP
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OTPPage;
