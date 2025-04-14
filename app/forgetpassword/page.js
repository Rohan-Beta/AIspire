"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const [form, setForm] = useState({
    email: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSubmit = async (e) => {

    try {
        
        let res = await fetch("http://localhost:4000/api/forgetpassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          });
          const data = await res.json();
      
          if (res.status == 400) {
            alert(data.error);
            router.push("/");
          }
          if (res.status == 200) {
            alert("Otp sent to your EmailId");
      
            localStorage.setItem("authToken", data.authToken);
            router.push("/forgetpassword-otp");
          }
          if (res.status == 500) {
            alert(data.error);
          }
    } catch (error) {
        alert("Server Issue")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ForgetPassword
        </h2>
        <form action="" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                minLength: { value: 5, message: "Min lenght is 5" },
              })}
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="text-sm">
          Remember Password?{" "}
            <Link className="text-indigo-600 hover:underline" href={"/signin"}>
            Sign In
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition hover:cursor-pointer"
          >
            Send Otp
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
