"use client";

import React, { useState } from 'react';
import { Dumbbell, User, Lock, Eye, EyeOff, Mail, Phone, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link'

export default function TrainerSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    experience: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Trainer Signup:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-900 px-8">
      {/* Left Side - Branding */}
      <div className="w-1/2 flex flex-col items-center text-center p-10">
        <div className="relative mb-4">
          <Dumbbell className="text-green-500 animate-pulse" size={70} fill="currentColor" fillOpacity={0.3} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Dumbbell className="text-green-600" size={32} strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">Trainer Portal</h1>
        <p className="text-lg text-green-800 tracking-wide mt-2">Join our community of expert trainers</p>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-2/3 flex items-center justify-center">
        <div className="shadow-lg rounded-3xl p-10 w-full max-w-2xl bg-white">
          <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">Trainer Sign Up</h2>
          <form onSubmit={handleSignup} className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <Label htmlFor="name" className="text-sm text-green-700 font-semibold">Name</Label>
              <div className="flex items-center rounded-full p-3 bg-gray-50 shadow-md">
                <User className="text-green-600 mr-2" size={20} />
                <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="w-full bg-transparent text-gray-900 placeholder-gray-500 border-none focus:ring-0" required />
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="email" className="text-sm text-green-700 font-semibold">Email</Label>
              <div className="flex items-center rounded-full p-3 bg-gray-50 shadow-md">
                <Mail className="text-green-600 mr-2" size={20} />
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="w-full bg-transparent text-gray-900 placeholder-gray-500 border-none focus:ring-0" required />
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="password" className="text-sm text-green-700 font-semibold">Password</Label>
              <div className="flex items-center rounded-full p-3 bg-gray-50 shadow-md relative">
                <Lock className="text-green-600 mr-2" size={20} />
                <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Enter your password" className="w-full bg-transparent text-gray-900 placeholder-gray-500 border-none focus:ring-0" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-green-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="phone" className="text-sm text-green-700 font-semibold">Phone Number</Label>
              <div className="flex items-center rounded-full p-3 bg-gray-50 shadow-md">
                <Phone className="text-green-600 mr-2" size={20} />
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" className="w-full bg-transparent text-gray-900 placeholder-gray-500 border-none focus:ring-0" required />
              </div>
            </div>
            <div className="col-span-2 flex flex-col">
              <Label htmlFor="experience" className="text-sm text-green-700 font-semibold">Experience (in years)</Label>
              <div className="flex items-center rounded-full p-3 bg-gray-50 shadow-md">
                <Briefcase className="text-green-600 mr-2" size={20} />
                <Input id="experience" name="experience" type="number" min="0" value={formData.experience} onChange={handleChange} placeholder="Years of experience" className="w-full bg-transparent text-gray-900 placeholder-gray-500 border-none focus:ring-0" required />
              </div>
            </div>
            <div className="col-span-2">
              <Button type="submit" className="w-full bg-green-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition">
                Sign Up
              </Button>
            </div>
            <Link href="/LoginPage/trainer" className="block">
            <p className="col-span-2 text-green-600 hover:text-green-800 cursor-pointer text-sm text-center" onClick={() => router.push('/trainer-login')}>
              Already have an account? Login
            </p>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}