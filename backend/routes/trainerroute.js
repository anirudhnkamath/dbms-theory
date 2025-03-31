import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
const router = express.Router();

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "Asmm@9035",
  database: "mydb",
  multipleStatements: true,
};

const pool = mysql.createPool(dbconfig);

router.post("/create-food", async (req, res) => {
  const {trainer_t_id,name,calories,protein,fat,carbs}=req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO food (name, calories, protein, fat, carbs, trainer_t_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, calories, protein, fat, carbs, trainer_t_id]
      );
      res.status(201).json({
        message: 'Food created successfully',
        foodId: result.insertId
      });
  } catch (error) {
    console.error('Food creation error:', error);
    res.status(500).json({ 
      message: 'Food creation failed', 
      error: error.message 
    });
  }
})

router.post("/create-exercise", async (req, res) => {
  const { trainer_t_id, name } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO exercise (name, trainer_t_id) VALUES (?, ?)',
      [name, trainer_t_id]
    );
    res.status(201).json({
      message: 'Exercise created successfully',
      exerciseId: result.insertId
    });
  } catch (error) {
    console.error('Exercise creation error:', error);
    res.status(500).json({ 
      message: 'Exercise creation failed', 
      error: error.message 
    });
  }
});

router.post("/create-diet", async (req, res) => {
  const { trainer_t_id, foods } = req.body;

  try {
   
    if (!foods || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({
        message: 'At least one food item is required'
      });
    }

    // Calculate total nutritional values
    const totalNutrition = foods.reduce((acc, food) => ({
      total_cals: acc.total_cals + (food.calories || 0),
      total_protein: acc.total_protein + (food.protein || 0),
      total_fat: acc.total_fat + (food.fat || 0),
      total_carbs: acc.total_carbs + (food.carbs || 0)
    }), {
      total_cals: 0,
      total_protein: 0,
      total_fat: 0,
      total_carbs: 0
    });

    // Insert diet
    const [dietResult] = await pool.query(
      'INSERT INTO diet (total_cals, total_protein, total_fat, total_carbs) VALUES (?, ?, ?, ?)',
      [
        totalNutrition.total_cals, 
        totalNutrition.total_protein, 
        totalNutrition.total_fat, 
        totalNutrition.total_carbs
      ]
    );
    const dietId = dietResult.insertId;

    // Insert diet-food associations
    const dietFoodInserts = foods.map(food => 
      pool.query(
        'INSERT INTO diet_has_food (diet_d_id, food_f_id) VALUES (?, ?)', 
        [dietId, food.f_id]
      )
    );
    await Promise.all(dietFoodInserts);

    // Insert trainer-diet association
    await pool.query(
      'INSERT INTO trainer_has_diet (trainer_t_id, diet_d_id) VALUES (?, ?)',
      [trainer_t_id, dietId]
    );

    res.status(201).json({
      message: 'Diet created successfully',
      dietId: dietId,
      totalNutrition
    });

  } catch (error) {
    console.error('Diet creation error:', error);
    
    // Handle specific error types
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        message: 'Invalid food or trainer ID',
        error: error.message
      });
    }

    res.status(500).json({ 
      message: 'Diet creation failed', 
      error: error.message 
    });
  }
});

router.post("/create-workout", async (req, res) => {
  const { trainer_t_id, name, duration, difficulty, exercises } = req.body;
  try {
    // Validate input
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        message: 'At least one exercise is required'
      });
    }


    // Insert workout
    const [workoutResult] = await pool.query(
      'INSERT INTO workout (name, duration, difficulty) VALUES (?, ?, ?)',
      [name, duration, difficulty]
    );
    const workoutId = workoutResult.insertId;


    // Insert workout-exercise associations with reps and sets
    const workoutExerciseInserts = exercises.map(exercise => 
      pool.query(
        'INSERT INTO workout_has_exercise (workout_w_id, exercise_e_id, REPS, SETS) VALUES (?, ?, ?, ?)', 
        [workoutId, exercise.e_id, exercise.reps, exercise.sets]
      )
    );
    await Promise.all(workoutExerciseInserts);


    // Insert trainer-workout association
    await pool.query(
      'INSERT INTO trainer_has_workout (trainer_t_id, workout_w_id) VALUES (?, ?)',
      [trainer_t_id, workoutId]
    );
    

    res.status(201).json({
      message: 'Workout created successfully',
      workoutId: workoutId,
      exercises: exercises
    });


  } catch (error) {
    console.error('Workout creation error:', error);
    
    // Handle specific error types
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        message: 'Invalid exercise or trainer ID',
        error: error.message
      });
    }

    // Handle unique constraint violation for workout name
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'A workout with this name already exists',
        error: error.message
      });
    }

    res.status(500).json({ 
      message: 'Workout creation failed', 
      error: error.message 
    });
  }
});

router.post("/register", async (req, res) => {
  console.log("register");
  const { name, email, password, phone_no, experience } = req.body;

  try { 

    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      'INSERT INTO trainer (name, email, password, phone_no, experience) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone_no, experience]
    );

    res.status(201).json({
      message: 'Trainer registered successfully',
      trainerId: result.insertId
    });

  } catch (error) {
    console.error('Trainer registration error:', error);
    res.status(500).json({ 
      message: 'Trainer registration failed', 
      error: error.message 
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [trainers] = await pool.query(
      'SELECT * FROM trainer WHERE email = ?',
      [email]
    );

    if (trainers.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    const trainer = trainers[0];

    const isPasswordValid = await bcrypt.compare(password, trainer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    res.status(200).json({
      message: 'Login successful',
      trainer: {
        id: trainer.t_id,
        name: trainer.name,
        email: trainer.email,
        experience: trainer.experience
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

router.get('/:trainerId/foods', async (req, res) => {
    try {
        const trainerId = req.params.trainerId;
        if (!trainerId || isNaN(trainerId)) {
            return res.status(400).json({ 
                error: 'Invalid trainer ID' 
            });
        }
        const [foods] = await pool.execute(
            'SELECT f_id, name, calories, protein, fat, carbs FROM food WHERE trainer_t_id = ?', 
            [trainerId]
        );
        if (foods.length === 0) {
            return res.status(404).json({ 
                message: 'No foods found for this trainer' 
            });
        }
        res.json(foods);
    } catch (error) {
        console.error('Error fetching trainer foods:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

router.get('/:trainerId/diets', async (req, res) => {
    try {
        const trainerId = req.params.trainerId;
        
        if (!trainerId || isNaN(trainerId)) {
            return res.status(400).json({ 
                error: 'Invalid trainer ID' 
            });
        }

        // First, get the diets for the trainer
        const [diets] = await pool.execute(`
            SELECT 
                d.d_id AS diet_id,
                d.total_cals,
                d.total_protein,
                d.total_fat,
                d.total_carbs
            FROM trainer_has_diet thd
            JOIN diet d ON thd.diet_d_id = d.d_id
            WHERE thd.trainer_t_id = ?
        `, [trainerId]);

        if (diets.length === 0) {
            return res.status(404).json({ 
                message: 'No diets found for this trainer' 
            });
        }

        // Now, get foods for each diet
        const dietsWithFoods = await Promise.all(diets.map(async (diet) => {
            const [foods] = await pool.execute(`
                SELECT 
                    f.f_id AS food_id,
                    f.name AS food_name,
                    f.calories,
                    f.protein,
                    f.fat,
                    f.carbs
                FROM diet_has_food dhf
                JOIN food f ON dhf.food_f_id = f.f_id
                WHERE dhf.diet_d_id = ?
            `, [diet.diet_id]);

            return {
                ...diet,
                foods: foods
            };
        }));

        res.json(dietsWithFoods);
    } catch (error) {
        console.error('Error fetching trainer diets:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message
        });
    }
});

router.get('/:trainerId/exercises', async (req, res) => {
    try {
        const trainerId = req.params.trainerId;
        
        if (!trainerId || isNaN(trainerId)) {
            return res.status(400).json({ 
                error: 'Invalid trainer ID' 
            });
        }

        // Query to get only exercise id and name created by the trainer
        const [exercises] = await pool.execute(`
            SELECT 
                e_id AS exercise_id, 
                name AS exercise_name
            FROM exercise
            WHERE trainer_t_id = ?
        `, [trainerId]);

        if (exercises.length === 0) {
            return res.status(404).json({ 
                message: 'No exercises found for this trainer' 
            });
        }

        res.json(exercises);
    } catch (error) {
        console.error('Error fetching trainer exercises:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

router.get('/:trainerId/workouts', async (req, res) => {
    try {
        const trainerId = req.params.trainerId;
        
        if (!trainerId || isNaN(trainerId)) {
            return res.status(400).json({ 
                error: 'Invalid trainer ID' 
            });
        }

        // Query to get workouts associated with the trainer
        const [workouts] = await pool.execute(`
          SELECT 
              w.w_id AS workout_id, 
              w.name AS workout_name, 
              w.duration, 
              w.difficulty,
              JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'exercise_id', e.e_id,
                      'exercise_name', e.name
                  )
              ) AS exercises,
              COUNT(DISTINCT e.e_id) AS exercise_count
          FROM trainer_has_workout thw
          JOIN workout w ON thw.workout_w_id = w.w_id
          LEFT JOIN workout_has_exercise whe ON w.w_id = whe.workout_w_id
          LEFT JOIN exercise e ON whe.exercise_e_id = e.e_id
          WHERE thw.trainer_t_id = ?
          GROUP BY w.w_id, w.name, w.duration, w.difficulty
      `, [trainerId]);

        if (workouts.length === 0) {
            return res.status(404).json({ 
                message: 'No workouts found for this trainer' 
            });
        }

        res.json(workouts);
    } catch (error) {
        console.error('Error fetching trainer workouts:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});


export default router;
