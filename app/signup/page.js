"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
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
      let res = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // not verified

      if (res.status == 400) {
        alert(data.error);
        localStorage.clear();
      }

      // email in use

      if (res.status == 401) {
        alert(data.error);
      }

      // account created

      if (res.status == 200) {
        alert("Account Created Successfully");

        localStorage.setItem("authToken", data.authToken);
        router.push('/otp');
      }

      // server error

      if (res.status == 500) {
        alert(data.error);
      }
    } 
    catch (error) {
      console.log("server Issue");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create your account
        </h2>
        <form action="" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              {...register("name", {
                required: {
                  value: true,
                  message: "Name is required",
                },
                minLength: { value: 3, message: "Min lenght is 3" },
              })}
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="your name"
              className={`mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
                minLength: { value: 3, message: "Min lenght is 3" },
                maxLength: { value: 10, message: "Max lenght is 10" },
              })}
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition hover:cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href={"/signin"} className="text-indigo-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

// export default SignUp;
