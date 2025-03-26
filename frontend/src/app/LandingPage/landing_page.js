import React from 'react';
import { Heart, UserCheck, Dumbbell, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Heart 
              className="text-red-500 animate-pulse" 
              size={40} 
              fill="currentColor" 
              fillOpacity={0.2}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart 
                className="text-red-600" 
                size={20} 
                strokeWidth={3}
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              HealthSync
            </h1>
            <p className="text-xs text-blue-800 tracking-wider uppercase">
              Fitness Tracker
            </p>
          </div>
        </div>
        <div className="space-x-4">
          <a href="/login" className="text-blue-700 hover:text-blue-900 transition">
            Login
          </a>
          <a 
            href="/signup" 
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-6 grid md:grid-cols-2 items-center gap-10 py-16">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-5xl font-extrabold text-blue-900 leading-tight">
            Transform Your Fitness Journey
          </h2>
          <p className="text-xl text-blue-800 opacity-80">
            Track your progress, connect with trainers, and achieve your health goals with HealthSync – your comprehensive fitness companion.
          </p>
          
          {/* Login Options */}
          <div className="space-y-4">
            <a href="/login/user" className="block">
              <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition">
                <div className="flex items-center space-x-4">
                  <UserCheck className="text-blue-600" size={24} />
                  <span className="text-lg font-semibold text-blue-800">Login as User</span>
                </div>
                <ChevronRight className="text-blue-600" />
              </div>
            </a>
            
            <a href="/login/trainer" className="block">
              <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition">
                <div className="flex items-center space-x-4">
                  <Dumbbell className="text-green-600" size={24} />
                  <span className="text-lg font-semibold text-green-800">Login as Trainer</span>
                </div>
                <ChevronRight className="text-green-600" />
              </div>
            </a>
          </div>
        </div> 
      </main>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Why Choose HealthSync?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="text-red-500" size={48} />,
                title: "Personalized Tracking",
                description: "Monitor your fitness progress with detailed insights and personalized recommendations."
              },
              {
                icon: <Dumbbell className="text-green-500" size={48} />,
                title: "Expert Guidance",
                description: "Connect with professional trainers who can help you achieve your fitness goals."
              },
              {
                icon: <UserCheck className="text-blue-500" size={48} />,
                title: "Community Support",
                description: "Join a supportive community of fitness enthusiasts and stay motivated."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-4 p-6 rounded-xl hover:shadow-lg transition">
                <div className="flex justify-center">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-blue-800">{feature.title}</h4>
                <p className="text-blue-700 opacity-80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 HealthSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;