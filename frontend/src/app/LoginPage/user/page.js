"use client";

import React, { useState } from "react";
import { Heart, User, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('http://localhost:8000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Save user data to localStorage or state management solution
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Navigate to user dashboard
      // In a real implementation, you would use your routing solution here
      console.log('Login successful, redirecting to dashboard...');
      window.location.href = '/User/';
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-900">
      {/* Left Side - Logo and Name */}
      <div className="w-1/2 flex flex-col items-center justify-center text-center p-10">
        <div className="relative mb-4">
          <Heart
            className="text-red-500 animate-pulse"
            size={70}
            fill="currentColor"
            fillOpacity={0.3}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="text-red-600" size={32} strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          HealthSync
        </h1>
        <p className="text-lg text-blue-800 tracking-wide mt-2">
          Your Personal Fitness Tracker
        </p>
      </div>

      {/* Right Side - Login Box */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="shadow-lg rounded-2xl p-8 w-96 text-center border border-gray-300 bg-white">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            User Login
          </h2>
          {error && (
            <p className="text-red-500 mb-4 text-sm">{error}</p>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col text-left">
              <label
                htmlFor="user-email"
                className="text-sm text-blue-700 font-semibold"
              >
                Email
              </label>
              <div className="flex items-center rounded-lg p-3 bg-gray-50 border border-gray-300">
                <User className="text-blue-600 mr-2" size={20} />
                <input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500 border-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <label
                htmlFor="user-password"
                className="text-sm text-blue-700 font-semibold"
              >
                Password
              </label>
              <div className="flex items-center rounded-lg p-3 bg-gray-50 border border-gray-300">
                <Lock className="text-blue-600 mr-2" size={20} />
                <input
                  id="user-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500 border-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-blue-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <p 
              className="mt-4 text-blue-600 hover:text-blue-800 cursor-pointer text-sm"
              onClick={() => console.log("Forgot password clicked")}
            >
              Forgot Password?
            </p>
            <Link href="/SignUpPage/user" className="block">
              <p 
                className="mt-2 text-blue-600 hover:text-blue-800 cursor-pointer text-sm"
                onClick={() => console.log("Sign up clicked")}
              >
                New User? Sign Up
              </p>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}