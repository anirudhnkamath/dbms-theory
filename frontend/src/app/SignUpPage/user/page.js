"use client";

import React, { useState } from 'react';
import { Heart, User, Lock, Eye, EyeOff, Calendar, Phone, Ruler, Weight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from "axios";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    DOB: '',
    gender: 'male',
    phone_no: '',
    height: '',
    weight: '',
    trainer_t_id: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:8000/user/register", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      // Redirect to login page after successful signup
      router.push("/LoginPage/user");
    } else {
      console.error("Signup failed:", response.data.error);
      alert(response.data.error); // Show error message
    }
  } catch (error) {
    console.error("Error:", error.response?.data?.error || error);
    alert(error.response?.data?.error || "Something went wrong. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-900">
      {/* Left Side - Logo and Branding */}
      <div className="w-1/3 flex flex-col items-center justify-center text-center p-10">
        <div className="relative mb-4">
          <Heart className="text-red-500 animate-pulse" size={70} fill="currentColor" fillOpacity={0.3} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="text-red-600" size={32} strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">HealthSync</h1>
        <p className="text-lg text-blue-800 tracking-wide mt-2">Your Personal Fitness Tracker</p>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-3/4 text-center border border-gray-300">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">User Sign Up</h2>
          <form onSubmit={handleSignup} className="grid grid-cols-2 gap-4 text-left">
            <div>
              <label className="text-sm text-blue-700 font-semibold">Name</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <User className="text-blue-600 mr-2" size={20} />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name" 
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-blue-700 font-semibold">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <User className="text-blue-600 mr-2" size={20} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email" 
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-blue-700 font-semibold">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50 relative">
                <Lock className="text-blue-600 mr-2" size={20} />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password" 
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 text-blue-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-blue-700 font-semibold">Date of Birth</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <Calendar className="text-blue-600 mr-2" size={20} />
                <input 
                  type="date" 
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-gray-900" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-blue-700 font-semibold">Gender</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <User className="text-blue-600 mr-2" size={20} />
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-gray-900" 
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-blue-700 font-semibold">Phone Number</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <Phone className="text-blue-600 mr-2" size={20} />
                <input 
                  type="tel" 
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleChange}
                  placeholder="Enter your phone number" 
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500" 
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-blue-700 font-semibold">Height (cm)</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <Ruler className="text-blue-600 mr-2" size={20} />
                <input 
                  type="number" 
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Enter your height (cm)" 
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-blue-700 font-semibold">Weight (kg)</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <Weight className="text-blue-600 mr-2" size={20} />
                <input 
                  type="number" 
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Enter your weight (kg)" 
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-blue-700 font-semibold">Trainer ID</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <User className="text-blue-600 mr-2" size={20} />
                <input 
                  type="text" 
                  name="trainer_t_id"
                  value={formData.trainer_t_id}
                  onChange={handleChange}
                  placeholder="Enter trainer ID" 
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500" 
                  required
                />
              </div>
            </div>
            
            <div className="col-span-2 mt-6">
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition"
              >
                Sign Up
              </button>
            </div>
          </form>
          
          <p className="mt-4 text-gray-700 text-sm">
            Already have an account? <Link href="/LoginPage/user" className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
