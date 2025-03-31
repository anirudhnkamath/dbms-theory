// app/dashboard/[userId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const params = useParams();
  const router = useRouter();
  
  // For demo purposes, we'll use params or a default value
  const userId = params.userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Assuming the user data is stored in localStorage after login
        const userData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
        if (userData) {
          setUser(userData);
        }
        
        // Fetch workouts
        const workoutsResponse = await axios.get(`/api/users/${userId}/workouts`);
        setWorkouts(workoutsResponse.data.workouts);
        
        // Fetch diets
        const dietsResponse = await axios.get(`/api/users/${userId}/diets`);
        setDiets(dietsResponse.data.diets);
        
      } catch (err) {
        setError('Failed to fetch user data. Please try again later.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    } else {
      setError('User not authenticated. Please log in.');
      setLoading(false);
    }
  }, [userId]);
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fitness Tracker</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        {user ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-6 py-3 font-medium ${activeTab === 'workouts' ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('workouts')}
              >
                Workouts
              </button>
              <button
                className={`px-6 py-3 font-medium ${activeTab === 'diets' ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('diets')}
              >
                Diet Plans
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                      <div className="bg-gray-50 p-3 rounded border">{user.name}</div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                      <div className="bg-gray-50 p-3 rounded border">{user.email}</div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                      <div className="bg-gray-50 p-3 rounded border">{new Date(user.DOB).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                      <div className="bg-gray-50 p-3 rounded border">{user.gender}</div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Height (cm)</label>
                      <div className="bg-gray-50 p-3 rounded border">{user.height}</div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Weight (kg)</label>
                      <div className="bg-gray-50 p-3 rounded border">{user.weight}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Trainer Information</h3>
                  <div className="bg-gray-50 p-4 rounded border">
                    <p><span className="font-bold">Trainer:</span> {user.trainer.name}</p>
                    <p><span className="font-bold">Trainer ID:</span> {user.trainer.id}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Workouts Tab */}
            {activeTab === 'workouts' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Your Workout Plans</h2>
                
                {workouts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No workouts assigned yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workouts.map((workout) => (
                      <div key={workout.workout_id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-blue-500 text-white p-4">
                          <h3 className="text-lg font-semibold">{workout.name}</h3>
                          <div className="flex justify-between mt-2 text-sm">
                            <span>Duration: {workout.duration} min</span>
                            <span className="capitalize">Difficulty: {workout.difficulty}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium mb-2">Exercises:</h4>
                          {workout.exercises.length > 0 ? (
                            <ul className="divide-y">
                              {workout.exercises.map((exercise, index) => (
                                <li key={index} className="py-2">
                                  <div className="font-medium">{exercise.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {exercise.sets} sets × {exercise.reps} reps
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No exercises in this workout.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Diets Tab */}
            {activeTab === 'diets' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Your Diet Plans</h2>
                
                {diets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No diet plans assigned yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {diets.map((diet) => (
                      <div key={diet.diet_id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-green-500 text-white p-4">
                          <h3 className="text-lg font-semibold">Diet Plan #{diet.diet_id}</h3>
                          <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
                            <div>
                              <div className="font-medium">Calories</div>
                              <div>{diet.total_calories} kcal</div>
                            </div>
                            <div>
                              <div className="font-medium">Protein</div>
                              <div>{diet.total_protein}g</div>
                            </div>
                            <div>
                              <div className="font-medium">Carbs</div>
                              <div>{diet.total_carbs}g</div>
                            </div>
                            <div>
                              <div className="font-medium">Fat</div>
                              <div>{diet.total_fat}g</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium mb-2">Foods:</h4>
                          {diet.foods.length > 0 ? (
                            <ul className="divide-y">
                              {diet.foods.map((food, index) => (
                                <li key={index} className="py-2">
                                  <div className="font-medium">{food.name}</div>
                                  <div className="grid grid-cols-4 gap-2 mt-1 text-sm text-gray-600">
                                    <div>Cal: {food.calories}</div>
                                    <div>Protein: {food.protein}g</div>
                                    <div>Carbs: {food.carbs}g</div>
                                    <div>Fat: {food.fat}g</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No foods in this diet plan.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-xl text-red-500 mb-4">User not found</div>
            <Link href="/LoginPage/user" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Go to Login
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}