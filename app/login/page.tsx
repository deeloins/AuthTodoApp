"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // clear previous errors

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address in the format: name@example.com");
      return;
    }
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      // Clear form on successful login
      formRef.current?.reset();
      setError("");
      router.push("/todos");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(`Login failed: ${err.response.data.message}`);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }
  };

  return (
  <div>
        <div className="text-center pt-6">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
             YESLIST!
          </h1>
            <p className="text-gray-600 mt-2">Get things done with style</p>
        </div>
    <div className="flex h-screen items-center justify-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-gray-100 p-8 rounded-lg shadow-lg w-96 h-100"
        autoComplete="off"
      >
        <h2 className="text-4xl text-center font-bold mt-8 mb-10 text-cyan-900">
          Welcome Back
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          className="border text-gray-400 p-2 w-full mb-4 rounded"
          autoComplete="off"
          name="email-login"
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="border text-gray-400 p-2 w-full mb-6 rounded"
          autoComplete="new-password"
          name="password-login"
        />
        <button className="bg-cyan-600 hover:bg-cyan-400 text-white cursor-pointer w-full p-2 rounded">
          Login
        </button>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a 
            href="/register" 
            className="text-cyan-600 hover:text-cyan-800 cursor-pointer"
          >
            Sign up here
          </a>
        </p>
      </form>
    </div>
    </div>
  );
}