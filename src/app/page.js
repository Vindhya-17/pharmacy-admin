"use client"
import Login from "@/components/Login";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      // Redirect to dashboard
      window.location.href = "/dashboard";
    }
  }, []);
  return <Login />;
}
