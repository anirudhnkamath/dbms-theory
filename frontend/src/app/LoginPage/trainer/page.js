"use client";
import Link from "next/link";

import React, { useState } from "react";
import { Dumbbell, User, Lock, Eye, EyeOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function TrainerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('http://localhost:8000/trainer/login', {
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
      
      // Save trainer data to localStorage or state management solution
      localStorage.setItem('trainer', JSON.stringify(data.trainer));
      
      // Navigate to trainer dashboard
      router.push(`/Trainer/`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-900">
      {/* Left Side - Logo and Name */}
      <div className="w-1/2 flex flex-col items-center justify-center text-center p-10">
        <div className="relative mb-4">
          <Dumbbell
            className="text-green-500 animate-pulse"
            size={70}
            fill="currentColor"
            fillOpacity={0.3}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Dumbbell className="text-green-600" size={32} strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
          Trainer Portal
        </h1>
        <p className="text-lg text-green-800 tracking-wide mt-2">
          Exclusive Access for Trainers
        </p>
      </div>

      {/* Right Side - Login Box */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="shadow-lg rounded-2xl p-8 w-96 text-center border border-gray-300 bg-white">
          <button
            onClick={handleGoHome}
            className="hover:cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-transparent transition-all"
          >
            <div className="relative">
              <Heart
                className="text-red-500 animate-pulse"
                size={48}
                fill="currentColor"
                fillOpacity={0.4}
              />
              
              {/* Inner solid heart */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="text-red-600" size={24} strokeWidth={3} />
              </div>
            </div>
          </button>
          <h2 className="text-2xl font-bold text-green-900 mb-6">
            Trainer Login
          </h2>
          {error && (
            <p className="text-red-500 mb-4 text-sm">{error}</p>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col text-left">
              <Label
                htmlFor="trainer-email"
                className="text-sm text-green-700 font-semibold"
              >
                Email
              </Label>
              <div className="flex items-center rounded-lg p-3 bg-gray-50 border border-gray-300">
                <User className="text-green-600 mr-2" size={20} />
                <Input
                  id="trainer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500 border-none focus:ring-0"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <Label
                htmlFor="trainer-password"
                className="text-sm text-green-700 font-semibold"
              >
                Password
              </Label>
              <div className="flex items-center rounded-lg p-3 bg-gray-50 border border-gray-300">
                <Lock className="text-green-600 mr-2" size={20} />
                <Input
                  id="trainer-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500 border-none focus:ring-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-green-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="mt-4 text-green-600 hover:text-green-800 cursor-pointer text-sm">
              Forgot Password?
            </p>
            <Link href="/SignUpPage/trainer" className="block">
              <p className="mt-2 text-green-600 hover:text-green-800 cursor-pointer text-sm">
                New Trainer? Sign Up
              </p>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
