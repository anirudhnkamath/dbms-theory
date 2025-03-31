'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { HeartPulse } from 'lucide-react';

export default function UserDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [userId, setUserId] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserId(parsedUser.id);
      } else {
        router.push("/LoginPage/user");
      }
    }, []);
  
    const handleLogout = () => {
      localStorage.removeItem("user");
      router.push("/LoginPage/user");
    };
  
    useEffect(() => {
      if (!userId) return;
  
      const fetchData = async () => {
        setLoading(true);
        try {
          const [workoutsResponse, dietsResponse] = await Promise.all([
            axios.get(`http://localhost:8000/user/${userId}/workouts`).then(res => res.data),
            axios.get(`http://localhost:8000/user/${userId}/diets`).then(res => res.data)
          ]);
          setWorkouts(workoutsResponse || []);
          setDiets(dietsResponse || []);
        } catch (err) {
          setError("Failed to fetch data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [userId]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading...</div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="text-red-500 mb-4">{error}</div>
            <Link href="/LoginPage/user" className="block w-full text-center py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
              Go to Login
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <HeartPulse className="w-8 h-8 animate-pulse" />
            <h1 className="text-2xl font-bold">HealthSync</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="font-medium">Welcome, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <main className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex border-b">
              {['profile', 'workouts', 'diets'].map(tab => (
                <button
                  key={tab}
                  className={`px-6 py-3 font-medium flex-1 transition ${activeTab === tab ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'profile' && user && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-100 rounded shadow-sm">
                        <strong className="block text-blue-600">Name</strong>
                        <p className="text-gray-700">{user.name}</p>
                      </div>
                      <div className="p-4 bg-gray-100 rounded shadow-sm">
                        <strong className="block text-blue-600">Email</strong>
                        <p className="text-gray-700">{user.email}</p>
                      </div>
                      <div className="p-4 bg-gray-100 rounded shadow-sm">
                        <strong className="block text-blue-600">Gender</strong>
                        <p className="text-gray-700">{user.gender}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-100 rounded shadow-sm">
                        <strong className="block text-blue-600">Height</strong>
                        <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                          <div className="bg-blue-500 h-6 rounded-full" style={{ width: `${(user.height / 250) * 100}%` }}></div>
                        </div>
                        <p className="text-gray-700 mt-2">{user.height} cm</p>
                      </div>
                      <div className="p-4 bg-gray-100 rounded shadow-sm">
                        <strong className="block text-blue-600">Weight</strong>
                        <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                          <div className="bg-green-500 h-6 rounded-full" style={{ width: `${(user.weight / 150) * 100}%` }}></div>
                        </div>
                        <p className="text-gray-700 mt-2">{user.weight} kg</p>
                      </div>
                    </div>
                  </div>
                  {user.trainer && (
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Trainer Information</h3>
                      <div className="bg-gray-50 p-4 rounded border">
                        <p><strong>Trainer:</strong> {user.trainer.name}</p>
                        <p><strong>Trainer ID:</strong> {user.trainer.id}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
}