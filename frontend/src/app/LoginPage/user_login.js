import React from 'react';
import { Heart, User, Lock, Eye } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-900">
      {/* Left Side - Logo and Name */}
      <div className="w-1/2 flex flex-col items-center justify-center text-center p-10">
        <div className="relative mb-4">
          <Heart className="text-red-500 animate-pulse" size={70} fill="currentColor" fillOpacity={0.3} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="text-red-600" size={32} strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">HealthSync</h1>
        <p className="text-lg text-blue-800 tracking-wide mt-2">Your Personal Fitness Tracker</p>
      </div>

      {/* Right Side - Login Box */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center border border-gray-300">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">User Login</h2>
          <div className="space-y-4">
            <div className="flex flex-col text-left">
              <label className="text-sm text-blue-700 font-semibold">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <User className="text-blue-600 mr-2" size={20} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500" 
                />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <label className="text-sm text-blue-700 font-semibold">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <Lock className="text-blue-600 mr-2" size={20} />
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500" 
                />
                <Eye className="text-blue-600 cursor-pointer" size={20} />
              </div>
            </div>
          </div>
          <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Login
          </button>
          <p className="mt-4 text-blue-600 hover:text-blue-800 cursor-pointer text-sm">Forgot Password?</p>
          <p className="mt-2 text-gray-700 text-sm">
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;