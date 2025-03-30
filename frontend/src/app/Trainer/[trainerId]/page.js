"use client"; 
import React, { useState, useEffect } from "react";
import axios from "axios";

const Trainer = ({ params }) => {
  // Access trainerId directly from params (no useParams needed)
  const { trainerId } = params;

  const [activeTab, setActiveTab] = useState("profile");
  const [trainer, setTrainer] = useState(null);
  const [foods, setFoods] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [diets, setDiets] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        setLoading(true);
        // Use the trainerId from params
        setTrainer({
          id: trainerId,
          name: "John Doe",
          email: "john.doe@example.com",
          experience: "5 years"
        });

        const foodsResponse = await axios.get(`/api/${trainerId}/foods`);
        const exercisesResponse = await axios.get(`/api/${trainerId}/exercises`);
        const dietsResponse = await axios.get(`/api/${trainerId}/diets`);
        const workoutsResponse = await axios.get(`/api/${trainerId}/workouts`);

        setFoods(foodsResponse.data);
        setExercises(exercisesResponse.data);
        setDiets(dietsResponse.data);
        setWorkouts(workoutsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trainer data:', err);
        setError('Failed to load trainer data. Please try again later.');
        setLoading(false);
      }
    };

    if (trainerId) {
      fetchTrainerData();
    }
  }, [trainerId]);

  // Food form state
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
  });

  // Exercise form state
  const [newExercise, setNewExercise] = useState({
    name: "",
  });

  // Workout form state
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    duration: "",
    difficulty: "",
    exercises: [],
  });

  // Diet form state
  const [newDiet, setNewDiet] = useState({
    foods: [],
  });

  // Handle food form change
  const handleFoodChange = (e) => {
    const { name, value } = e.target;
    setNewFood((prev) => ({ ...prev, [name]: value }));
  };

  // Handle exercise form change
  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setNewExercise((prev) => ({ ...prev, [name]: value }));
  };

  // Add food to new diet
  const addFoodToDiet = (food) => {
    setNewDiet((prev) => ({
      ...prev,
      foods: [...prev.foods, food],
    }));
  };

  // Add exercise to new workout
  const addExerciseToWorkout = (exercise) => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { ...exercise, reps: 10, sets: 3 }],
    }));
  };

  // Handle food creation
  const createFood = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/create-food", {
        trainer_t_id: trainerId,
        ...newFood,
        calories: parseInt(newFood.calories),
        protein: parseFloat(newFood.protein),
        fat: parseFloat(newFood.fat),
        carbs: parseFloat(newFood.carbs),
      });

      // Add the new food to the list
      setFoods([
        ...foods,
        {
          f_id: response.data.foodId,
          ...newFood,
          calories: parseInt(newFood.calories),
          protein: parseFloat(newFood.protein),
          fat: parseFloat(newFood.fat),
          carbs: parseFloat(newFood.carbs),
        },
      ]);

      // Reset form
      setNewFood({
        name: "",
        calories: "",
        protein: "",
        fat: "",
        carbs: "",
      });
    } catch (err) {
      console.error("Error creating food:", err);
      setError("Failed to create food. Please try again.");
    }
  };

  // Handle exercise creation
  const createExercise = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/create-exercise", {
        trainer_t_id: trainerId,
        name: newExercise.name,
      });

      // Add the new exercise to the list
      setExercises([
        ...exercises,
        {
          exercise_id: response.data.exerciseId,
          exercise_name: newExercise.name,
        },
      ]);

      // Reset form
      setNewExercise({ name: "" });
    } catch (err) {
      console.error("Error creating exercise:", err);
      setError("Failed to create exercise. Please try again.");
    }
  };

  // Handle workout creation
  const createWorkout = async (e) => {
    e.preventDefault(); 
    try {
      const workoutData = {
        trainer_t_id: trainerId,
        name: newWorkout.name,
        duration: parseInt(newWorkout.duration),
        difficulty: newWorkout.difficulty,
        exercises: newWorkout.exercises.map((ex) => ({
          e_id: ex.exercise_id,
          reps: ex.reps,
          sets: ex.sets,
        })),
      };

      const response = await axios.post("/api/create-workout", workoutData);

      // Add the new workout to the list
      setWorkouts([
        ...workouts,
        {
          workout_id: response.data.workoutId,
          workout_name: newWorkout.name,
          duration: parseInt(newWorkout.duration),
          difficulty: newWorkout.difficulty,
          exercises: newWorkout.exercises,
          exercise_count: newWorkout.exercises.length,
        },
      ]);

      // Reset form
      setNewWorkout({
        name: "",
        duration: "",
        difficulty: "",
        exercises: [],
      });
    } catch (err) {
      console.error("Error creating workout:", err);
      setError("Failed to create workout. Please try again.");
    }
  };

  // Handle diet creation
  const createDiet = async (e) => {
    e.preventDefault();
    try {
      const dietData = {
        trainer_t_id: trainerId,
        foods: newDiet.foods.map((food) => ({
          f_id: food.f_id || food.food_id,
          calories: food.calories,
          protein: food.protein,
          fat: food.fat,
          carbs: food.carbs,
        })),
      };

      const response = await axios.post("/api/create-diet", dietData);

      // Add the new diet to the list with calculated totals from response
      setDiets([
        ...diets,
        {
          diet_id: response.data.dietId,
          total_cals: response.data.totalNutrition.total_cals,
          total_protein: response.data.totalNutrition.total_protein,
          total_fat: response.data.totalNutrition.total_fat,
          total_carbs: response.data.totalNutrition.total_carbs,
          foods: newDiet.foods.map((food) => ({
            food_id: food.f_id || food.food_id,
            food_name: food.name || food.food_name,
            calories: food.calories,
            protein: food.protein,
            fat: food.fat,
            carbs: food.carbs,
          })),
        },
      ]);

      // Reset form
      setNewDiet({ foods: [] });
    } catch (err) {
      console.error("Error creating diet:", err);
      setError("Failed to create diet. Please try again.");
    }
  };

  // Remove exercise from workout
  const removeExerciseFromWorkout = (index) => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  // Remove food from diet
  const removeFoodFromDiet = (index) => {
    setNewDiet((prev) => ({
      ...prev,
      foods: prev.foods.filter((_, i) => i !== index),
    }));
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error)
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!trainer)
    return <div className="container mx-auto p-4">Trainer not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Trainer Dashboard</h1>

      {/* Profile Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-medium">Name:</span> {trainer.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {trainer.email}
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">ID:</span> {trainer.id}
            </p>
            <p>
              <span className="font-medium">Experience:</span>{" "}
              {trainer.experience}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Overview
            </button>
            <button
              className={`py-4 px-6 ${
                activeTab === "foods"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("foods")}
            >
              Foods
            </button>
            <button
              className={`py-4 px-6 ${
                activeTab === "exercises"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("exercises")}
            >
              Exercises
            </button>
            <button
              className={`py-4 px-6 ${
                activeTab === "diets"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("diets")}
            >
              Diets
            </button>
            <button
              className={`py-4 px-6 ${
                activeTab === "workouts"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("workouts")}
            >
              Workouts
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {/* Overview Tab */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Foods</p>
                <p className="text-2xl font-bold">{foods.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Exercises</p>
                <p className="text-2xl font-bold">{exercises.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Diets</p>
                <p className="text-2xl font-bold">{diets.length}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Workouts</p>
                <p className="text-2xl font-bold">{workouts.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Recent Foods</h3>
                <ul className="divide-y divide-gray-200">
                  {foods.slice(0, 3).map((food) => (
                    <li key={food.f_id} className="py-2">
                      <p className="font-medium">{food.name}</p>
                      <p className="text-sm text-gray-500">
                        {food.calories} cal | P: {food.protein}g | F: {food.fat}
                        g | C: {food.carbs}g
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Recent Workouts</h3>
                <ul className="divide-y divide-gray-200">
                  {workouts.slice(0, 3).map((workout) => (
                    <li key={workout.workout_id} className="py-2">
                      <p className="font-medium">{workout.workout_name}</p>
                      <p className="text-sm text-gray-500">
                        {workout.duration} min | Difficulty:{" "}
                        {workout.difficulty} | Exercises:{" "}
                        {workout.exercise_count}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Foods Tab */}
        {activeTab === "foods" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Foods</h2>
            </div>

            {/* Create Food Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">Add New Food</h3>
              <form
                onSubmit={createFood}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newFood.name}
                    onChange={handleFoodChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={newFood.calories}
                    onChange={handleFoodChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    name="protein"
                    step="0.1"
                    value={newFood.protein}
                    onChange={handleFoodChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    name="fat"
                    step="0.1"
                    value={newFood.fat}
                    onChange={handleFoodChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    name="carbs"
                    step="0.1"
                    value={newFood.carbs}
                    onChange={handleFoodChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Food
                  </button>
                </div>
              </form>
            </div>

            {/* Foods List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protein (g)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fat (g)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carbs (g)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {foods.length > 0 ? (
                    foods.map((food) => (
                      <tr key={food.f_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {food.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {food.calories}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {food.protein}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {food.fat}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {food.carbs}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => addFoodToDiet(food)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            Add to Diet
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No foods found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === "exercises" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Exercises</h2>
            </div>

            {/* Create Exercise Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">Add New Exercise</h3>
              <form onSubmit={createExercise} className="flex gap-4 items-end">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newExercise.name}
                    onChange={handleExerciseChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Exercise
                </button>
              </form>
            </div>

            {/* Exercises List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exercises.length > 0 ? (
                    exercises.map((exercise) => (
                      <tr key={exercise.exercise_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {exercise.exercise_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {exercise.exercise_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => addExerciseToWorkout(exercise)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Add to Workout
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No exercises found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Diets Tab */}
        {activeTab === "diets" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Diets</h2>
            </div>

            {/* Create Diet Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">Create New Diet</h3>

              {/* Selected Foods */}
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Selected Foods</h4>
                {newDiet.foods.length > 0 ? (
                  <div className="bg-white p-3 rounded border">
                    <ul className="divide-y divide-gray-200">
                      {newDiet.foods.map((food, index) => (
                        <li
                          key={index}
                          className="py-2 flex justify-between items-center"
                        >
                          <span>{food.name || food.food_name}</span>
                          <div>
                            <span className="text-sm text-gray-500 mr-2">
                              {food.calories} cal | P: {food.protein}g | F:{" "}
                              {food.fat}g | C: {food.carbs}g
                            </span>
                            <button
                              onClick={() => removeFoodFromDiet(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Nutrition Summary */}
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-md font-medium mb-2">
                        Nutrition Summary
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Calories</p>
                          <p className="font-medium">
                            {newDiet.foods.reduce(
                              (sum, food) =>
                                sum + (parseFloat(food.calories) || 0),
                              0
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Protein</p>
                          <p className="font-medium">
                            {newDiet.foods.reduce(
                              (sum, food) =>
                                sum + (parseFloat(food.protein) || 0),
                              0
                            )}
                            g
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fat</p>
                          <p className="font-medium">
                            {newDiet.foods.reduce(
                              (sum, food) => sum + (parseFloat(food.fat) || 0),
                              0
                            )}
                            g
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Carbs</p>
                          <p className="font-medium">
                            {newDiet.foods.reduce(
                              (sum, food) =>
                                sum + (parseFloat(food.carbs) || 0),
                              0
                            )}
                            g
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No foods selected. Add foods from the Foods tab.
                  </p>
                )}
              </div>

              <button
                onClick={createDiet}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={newDiet.foods.length === 0}
              >
                Create Diet
              </button>
            </div>

            {/* Diets List */}
            <div>
              <h3 className="text-lg font-medium mb-3">Your Diets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diets.length > 0 ? (
                  diets.map((diet) => (
                    <div
                      key={diet.diet_id}
                      className="bg-white p-4 border rounded-lg"
                    >
                      <h4 className="font-medium mb-2">Diet #{diet.diet_id}</h4>

                      {/* Nutrition Summary */}
                      <div className="mb-4 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">
                            Total Calories
                          </p>
                          <p className="font-medium">{diet.total_cals}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Protein</p>
                          <p className="font-medium">{diet.total_protein}g</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Fat</p>
                          <p className="font-medium">{diet.total_fat}g</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Carbs</p>
                          <p className="font-medium">{diet.total_carbs}g</p>
                        </div>
                      </div>

                      {/* Foods in Diet */}
                      <h5 className="font-medium mb-1">
                        Foods ({diet.foods.length})
                      </h5>
                      <ul className="text-sm divide-y divide-gray-100">
                        {diet.foods.map((food, index) => (
                          <li key={index} className="py-1">
                            {food.food_name} - {food.calories} cal
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic col-span-2">
                    No diets created yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Workouts Tab */}
        {activeTab === "workouts" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Workouts</h2>
            </div>

            {/* Create Workout Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">Create New Workout</h3>
              <form
                onSubmit={createWorkout}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newWorkout.name}
                    onChange={(e) =>
                      setNewWorkout({ ...newWorkout, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={newWorkout.duration}
                    onChange={(e) =>
                      setNewWorkout({ ...newWorkout, duration: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={newWorkout.difficulty}
                    onChange={(e) =>
                      setNewWorkout({
                        ...newWorkout,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </form>

              {/* Selected Exercises */}
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Selected Exercises</h4>
                {newWorkout.exercises.length > 0 ? (
                  <div className="bg-white p-3 rounded border">
                    <ul className="divide-y divide-gray-200">
                      {newWorkout.exercises.map((exercise, index) => (
                        <li
                          key={index}
                          className="py-2 flex flex-wrap items-center"
                        >
                          <span className="mr-4">{exercise.exercise_name}</span>
                          <div className="flex items-center space-x-4 ml-auto">
                            <div>
                              <label className="text-sm text-gray-500 mr-1">
                                Sets
                              </label>
                              <input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => {
                                  const updatedExercises = [
                                    ...newWorkout.exercises,
                                  ];
                                  updatedExercises[index].sets = parseInt(
                                    e.target.value
                                  );
                                  setNewWorkout({
                                    ...newWorkout,
                                    exercises: updatedExercises,
                                  });
                                }}
                                className="w-16 p-1 border border-gray-300 rounded"
                                min="1"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 mr-1">
                                Reps
                              </label>
                              <input
                                type="number"
                                value={exercise.reps}
                                onChange={(e) => {
                                  const updatedExercises = [
                                    ...newWorkout.exercises,
                                  ];
                                  updatedExercises[index].reps = parseInt(
                                    e.target.value
                                  );
                                  setNewWorkout({
                                    ...newWorkout,
                                    exercises: updatedExercises,
                                  });
                                }}
                                className="w-16 p-1 border border-gray-300 rounded"
                                min="1"
                              />
                            </div>
                            <button
                              onClick={() => removeExerciseFromWorkout(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No exercises selected. Add exercises from the Exercises tab.
                  </p>
                )}
              </div>

              <button
                onClick={createWorkout}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={
                  !newWorkout.name ||
                  !newWorkout.duration ||
                  !newWorkout.difficulty ||
                  newWorkout.exercises.length === 0
                }
              >
                Create Workout
              </button>
            </div>

            {/* Workouts List */}
            <div>
              <h3 className="text-lg font-medium mb-3">Your Workouts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workouts.length > 0 ? (
                  workouts.map((workout) => (
                    <div
                      key={workout.workout_id}
                      className="bg-white p-4 border rounded-lg"
                    >
                      <h4 className="font-medium mb-2">
                        {workout.workout_name}
                      </h4>

                      {/* Workout Details */}
                      <div className="mb-3 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">
                            {workout.duration} minutes
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Difficulty</p>
                          <p className="font-medium">{workout.difficulty}</p>
                        </div>
                      </div>

                      {/* Exercises in Workout */}
                      <h5 className="font-medium mb-1">
                        Exercises (
                        {workout.exercise_count ||
                          workout.exercises?.length ||
                          0}
                        )
                      </h5>
                      {workout.exercises ? (
                        <ul className="text-sm divide-y divide-gray-100">
                          {Array.isArray(workout.exercises) ? (
                            // If exercises is an array of objects
                            workout.exercises.map((exercise, index) => (
                              <li key={index} className="py-1">
                                {exercise.exercise_name || exercise.name}
                                {exercise.reps && exercise.sets && (
                                  <span className="text-gray-500">
                                    {" "}
                                    - {exercise.sets} sets x {exercise.reps}{" "}
                                    reps
                                  </span>
                                )}
                              </li>
                            ))
                          ) : (
                            // If exercises is a JSON string that needs parsing
                            <li className="py-1 text-gray-500">
                              Exercises information available
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No exercise details available
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic col-span-2">
                    No workouts created yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trainer;
