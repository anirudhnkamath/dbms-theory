'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Heart, Dumbbell, Utensils, UserCircle, LogOut, Clock, BarChart3, ChevronRight } from 'lucide-react';

export default function UserDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [userId, setUserId] = useState(null);
    const [workouts, setWorkouts] = useState({ total_workouts: 0, workouts: [] });
    const [diets, setDiets] = useState({ total_diets: 0, diets: [] });
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

    function getAge(dobString) {
        const birthDate = new Date(dobString);
        const today = new Date();
    
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();
    
        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
    
        if (months < 0) {
            years--;
            months += 12;
        }
    
        return `${years} years, ${months} months, ${days} days`;
    }
  
    useEffect(() => {
      if (!userId) return;
  
      const fetchData = async () => {
        setLoading(true);
        try {
          const [workoutsResponse, dietsResponse] = await Promise.all([
            axios.get(`http://localhost:8000/user/${userId}/workouts`).then(res => res.data),
            axios.get(`http://localhost:8000/user/${userId}/diets`).then(res => res.data)
          ]);
          setWorkouts(workoutsResponse || { total_workouts: 0, workouts: [] });
          setDiets(dietsResponse || { total_diets: 0, diets: [] });
          console.log(workouts.workouts);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Heart 
                className="text-red-500 animate-pulse" 
                size={48} 
                fill="currentColor" 
                fillOpacity={0.2}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart 
                  className="text-red-600" 
                  size={24} 
                  strokeWidth={3}
                />
              </div>
            </div>
            <div className="text-xl font-semibold text-blue-800">Loading your health data...</div>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="text-red-500 mb-4 font-medium">{error}</div>
            <Link href="/LoginPage/user" className="block w-full text-center py-3 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              Return to Login
            </Link>
          </div>
        </div>
      );
    }

    // Determine difficulty color
    const getDifficultyColor = (difficulty) => {
      const level = difficulty?.toLowerCase();
      if (level === 'easy') return 'bg-green-100 text-green-700';
      if (level === 'medium') return 'bg-yellow-100 text-yellow-700';
      if (level === 'hard') return 'bg-red-100 text-red-700';
      return 'bg-gray-100 text-gray-700';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <header className="bg-white shadow-md px-6 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart 
                  className="text-red-500 animate-pulse" 
                  size={36} 
                  fill="currentColor" 
                  fillOpacity={0.2}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart 
                    className="text-red-600" 
                    size={18} 
                    strokeWidth={3}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  HealthSync
                </h1>
                <p className="text-xs text-blue-800 tracking-wider uppercase">
                  Fitness Tracker
                </p>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center space-x-6">
                <span className="font-medium text-blue-800">Welcome, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow container mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b">
              {[
                { key: 'profile', icon: <UserCircle size={18} /> },
                { key: 'workouts', icon: <Dumbbell size={18} /> },
                { key: 'diets', icon: <Utensils size={18} /> }
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`px-6 py-4 font-medium flex-1 transition flex items-center justify-center space-x-2 
                    ${activeTab === tab.key 
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                      : 'text-blue-800 hover:bg-blue-50'}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.icon}
                  <span>{tab.key.charAt(0).toUpperCase() + tab.key.slice(1)}</span>
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'profile' && user && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <UserCircle className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-blue-900">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100 transition hover:shadow-md">
                        <strong className="block text-blue-700 mb-1">Name</strong>
                        <p className="text-blue-900 font-medium text-lg">{user.name}</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100 transition hover:shadow-md">
                        <strong className="block text-blue-700 mb-1">Email</strong>
                        <p className="text-blue-900 font-medium text-lg">{user.email}</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100 transition hover:shadow-md">
                        <strong className="block text-blue-700 mb-1">Gender</strong>
                        <p className="text-blue-900 font-medium text-lg">{user.gender}</p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100 transition hover:shadow-md">
                        <strong className="block text-blue-700 mb-1">Age</strong>
                        <p className="text-blue-900 font-medium text-lg">{getAge(user.DOB)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100 transition hover:shadow-md">
                        <strong className="block text-blue-700 mb-2">Height</strong>
                        <div className="relative w-full bg-white rounded-full h-6 overflow-hidden shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-6 rounded-full transition-all duration-500" 
                            style={{ width: `${(user.height / 250) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-blue-900 font-medium text-lg mt-2">{user.height} cm</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100 transition hover:shadow-md">
                        <strong className="block text-blue-700 mb-2">Weight</strong>
                        <div className="relative w-full bg-white rounded-full h-6 overflow-hidden shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-600 h-6 rounded-full transition-all duration-500" 
                            style={{ width: `${(user.weight / 150) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-blue-900 font-medium text-lg mt-2">{user.weight} kg</p>
                      </div>
                    </div>
                  </div>
                  
                  {user.trainer && (
                    <div className="mt-8 pt-6 border-t border-blue-100">
                      <div className="flex items-center space-x-3 mb-4">
                        <Dumbbell className="text-green-600" size={20} />
                        <h3 className="text-xl font-bold text-blue-900">Trainer Information</h3>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium text-green-800 mb-1">
                              <span className="font-semibold">Trainer:</span> {user.trainer.name}
                            </p>
                            <p className="text-green-700">
                              <span className="font-semibold">Trainer ID:</span> {user.trainer.id}
                            </p>
                          </div> 
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'workouts' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <Dumbbell className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-blue-900">Your Workout Plans</h2>
                  </div>

                  {workouts.total_workouts === 0 ? (
                    <div className="bg-blue-50 p-8 rounded-lg border border-blue-100 text-center">
                      <div className="flex justify-center mb-4">
                        <Dumbbell size={48} className="text-blue-300" />
                      </div>
                      <p className="text-blue-700 font-medium">No workouts assigned yet.</p>
                      <p className="text-blue-600 mt-2">Connect with your trainer to get personalized workout plans.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {workouts.workouts.map(workout => (
                        <div key={workout.workout_id} className="bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 border-b">
                            <div className="flex justify-between items-center">
                              <h3 className="text-xl font-bold text-white">{workout.name}</h3>
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center space-x-1 text-white text-base px-4 py-2 rounded-full bg-[rgb(71,180,86)]">
                                  <Clock size={14} />
                                  <span>{workout.duration} min</span>
                                </span>
                                <span className={`text-sm px-3 py-1 rounded-full font-medium ${getDifficultyColor(workout.difficulty)}`}>
                                  {workout.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-center space-x-2 mb-4">
                              <BarChart3 size={18} className="text-blue-600" />
                              <h4 className="font-semibold text-blue-800">Exercise List</h4>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-blue-100 rounded-lg overflow-hidden">
                                <thead className="bg-blue-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Exercise</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Sets</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Reps</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-50">
                                  {workout.exercises.length === 0 ? (
                                    <tr>
                                      <td colSpan="3" className="px-4 py-4 text-sm text-blue-600 text-center">No exercises in this workout</td>
                                    </tr>
                                  ) : (
                                    workout.exercises.map((exercise, idx) => (
                                      <tr key={`${workout.workout_id}-${idx}`} className="hover:bg-blue-50 transition">
                                        <td className="px-4 py-3 text-sm font-medium text-blue-800">{exercise.name}</td>
                                        <td className="px-4 py-3 text-sm text-blue-700">{exercise.sets}</td>
                                        <td className="px-4 py-3 text-sm text-blue-700">{exercise.reps}</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'diets' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <Utensils className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-blue-900">Your Diet Plans</h2>
                  </div>

                  {diets.total_diets === 0 ? (
                    <div className="bg-blue-50 p-8 rounded-lg border border-blue-100 text-center">
                      <div className="flex justify-center mb-4">
                        <Utensils size={48} className="text-blue-300" />
                      </div>
                      <p className="text-blue-700 font-medium">No diet plans assigned yet.</p>
                      <p className="text-blue-600 mt-2">Connect with your trainer to get personalized nutrition plans.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {diets.diets.map(diet => (
                        <div key={diet.diet_id} className="bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 border-b">
                            <h3 className="text-xl font-bold text-white">Diet Plan #{diet.diet_id}</h3>
                          </div>
                          
                          <div className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                                <p className="text-xs text-blue-600 uppercase font-semibold tracking-wider mb-1">Calories</p>
                                <p className="text-2xl font-bold text-blue-700">{diet.total_calories}</p>
                                <p className="text-xs text-blue-500">kcal</p>
                              </div>
                              <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                                <p className="text-xs text-red-600 uppercase font-semibold tracking-wider mb-1">Protein</p>
                                <p className="text-2xl font-bold text-red-700">{diet.total_protein}</p>
                                <p className="text-xs text-red-500">grams</p>
                              </div>
                              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-center">
                                <p className="text-xs text-yellow-600 uppercase font-semibold tracking-wider mb-1">Fat</p>
                                <p className="text-2xl font-bold text-yellow-700">{Math.round(diet.total_fat)}</p>
                                <p className="text-xs text-yellow-500">grams</p>
                              </div>
                              <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                                <p className="text-xs text-green-600 uppercase font-semibold tracking-wider mb-1">Carbs</p>
                                <p className="text-2xl font-bold text-green-700">{diet.total_carbs}</p>
                                <p className="text-xs text-green-500">grams</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-4">
                              <Utensils size={18} className="text-green-600" />
                              <h4 className="font-semibold text-blue-800">Food List</h4>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-green-100 rounded-lg overflow-hidden">
                                <thead className="bg-green-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Food</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Calories</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Protein</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Fat</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Carbs</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-50">
                                  {diet.foods.length === 0 ? (
                                    <tr>
                                      <td colSpan="5" className="px-4 py-4 text-sm text-green-600 text-center">No foods in this diet plan</td>
                                    </tr>
                                  ) : (
                                    diet.foods.map((food, idx) => (
                                      <tr key={`${diet.diet_id}-${idx}`} className="hover:bg-green-50 transition">
                                        <td className="px-4 py-3 text-sm font-medium text-blue-800">{food.name}</td>
                                        <td className="px-4 py-3 text-sm text-blue-700">{food.calories} kcal</td>
                                        <td className="px-4 py-3 text-sm text-blue-700">{food.protein}g</td>
                                        <td className="px-4 py-3 text-sm text-blue-700">{Math.round(food.fat)}g</td>
                                        <td className="px-4 py-3 text-sm text-blue-700">{food.carbs}g</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
        
        <footer className="bg-blue-900 text-white py-4 mt-auto">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; 2024 HealthSync. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
}
