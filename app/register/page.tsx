"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await api.post("/auth/register", { email, password });
      // Clear form on success
      formRef.current?.reset();
      setError("");
      router.push("/login");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div>
        <div className="text-center mt-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
             YESLIST!
          </h1>
            <p className="text-gray-600 mt-2">Todo Your Will!</p>
        </div>
    <div className="flex h-screen items-center justify-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-gray-100 p-8 rounded-lg shadow-lg w-96 h-100"
        autoComplete="off"
      >
        <h2 className="text-4xl text-center font-bold mt-6 mb-10 text-cyan-900">
          Create An Account
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          className="border text-gray-400 p-2 w-full mb-4 rounded"
          autoComplete="new-email"
          name="email-register"
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="border text-gray-400 p-2 w-full mb-6 rounded"
          autoComplete="new-password"
          name="password-register"
        />
        <button className="bg-cyan-600 hover:bg-cyan-400 text-white cursor-pointer w-full p-2 rounded">
          Register
        </button>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a 
            href="/login" 
            className="text-cyan-600 pb-6 hover:text-cyan-800 cursor-pointer"
          >
            Sign in here
          </a>
        </p>
      </form>
    </div>
    </div>
  );
}