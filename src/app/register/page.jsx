"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { OpenAxios } from "@/utils/intercepters";
import { showSuccessToast } from "@/utils/toastNotifications";
import { useRouter } from "next/navigation";
import Progress from "@/components/common/Progress";

const Register = () => {
  const router = useRouter();

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role: "Staff", // Default role
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      role: Yup.string()
        .oneOf(["Admin", "Staff"], "Invalid role")
        .required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await OpenAxios.post("/auth/register", values);
        if (res.status === 201) {
          showSuccessToast("Registration successful");
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <img
            src="/pharmacy.jpg"
            alt="App Logo"
            className="mx-auto h-16 w-16"
          />
        </div>

        {/* Form Section */}
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={`mt-1 p-2 w-full border ${
                formik.touched.username && formik.errors.username
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.username}
              </p>
            ) : null}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`mt-1 p-2 w-full border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            ) : null}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`mt-1 p-2 w-full border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            ) : null}
          </div>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              className={`mt-1 p-2 w-full border ${
                formik.touched.role && formik.errors.role
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
            >
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
            {formik.touched.role && formik.errors.role ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
            ) : null}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none flex items-center justify-center"
            >
              {formik.isSubmitting ? <Progress /> : "Register"}
            </button>
          </div>
        </form>

        {/* Link to login page */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:text-blue-600">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
