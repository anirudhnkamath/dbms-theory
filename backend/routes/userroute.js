import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
const router = express.Router();

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "mydb",
  multipleStatements: true,
};

const pool = mysql.createPool(dbconfig);

router.post('/register', async (req, res) => {
  let connection;
  try {
    const { 
      name, 
      email, 
      password, 
      DOB, 
      gender, 
      phone_no, 
      height, 
      weight, 
      trainer_t_id 
    } = req.body;

    // Validate input
    if (!name || !email || !password || !DOB || !gender || !height || !weight || !trainer_t_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Start a transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if trainer exists
    const [trainerCheck] = await connection.execute(
      'SELECT * FROM trainer WHERE t_id = ?', 
      [trainer_t_id]
    );

    if (trainerCheck.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM user WHERE email = ?', 
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [userResult] = await connection.execute(
      `INSERT INTO user 
      (name, email, password, DOB, gender, phone_no, height, weight, trainer_t_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [
        name, 
        email, 
        hashedPassword, 
        DOB, 
        gender, 
        phone_no || null, 
        height, 
        weight, 
        trainer_t_id
      ]
    );
    const userId = userResult.insertId;

    // Fetch trainer's diets
    const [trainerDiets] = await connection.execute(
      `SELECT diet_d_id 
       FROM trainer_has_diet 
       WHERE trainer_t_id = ?`, 
      [trainer_t_id]
    );

    // Insert user diets
    if (trainerDiets.length > 0) {
      const dietInsertQuery = `
        INSERT INTO user_diets (user_id, trainer_id, diet_id) 
        VALUES ${trainerDiets.map(() => '(?, ?, ?)').join(', ')}
      `;
      const dietInsertValues = trainerDiets.flatMap(diet => [
        userId, 
        trainer_t_id, 
        diet.diet_d_id
      ]);
      await connection.execute(dietInsertQuery, dietInsertValues);
    }

    // Fetch trainer's workouts
    const [trainerWorkouts] = await connection.execute(
      `SELECT workout_w_id 
       FROM trainer_has_workout 
       WHERE trainer_t_id = ?`, 
      [trainer_t_id]
    );

    // Insert user workouts
    if (trainerWorkouts.length > 0) {
      const workoutInsertQuery = `
        INSERT INTO user_workouts (user_id, trainer_id, workout_id) 
        VALUES ${trainerWorkouts.map(() => '(?, ?, ?)').join(', ')}
      `;
      const workoutInsertValues = trainerWorkouts.flatMap(workout => [
        userId, 
        trainer_t_id, 
        workout.workout_w_id
      ]);
      await connection.execute(workoutInsertQuery, workoutInsertValues);
    }

    // Commit the transaction
    await connection.commit();

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: userId,
      dietsAssigned: trainerDiets.length,
      workoutsAssigned: trainerWorkouts.length
    });

  } catch (error) {
    // Rollback the transaction in case of error
    if (connection) {
      await connection.rollback();
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  } finally {
    // Release the connection
    if (connection) {
      connection.release();
    }
  }
});


router.get('/:userId/workouts', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Check if user exists
    const [userCheck] = await pool.execute(
      'SELECT * FROM user WHERE u_id = ?', 
      [userId]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Query to get user's workouts with their details and exercises
    const [workouts] = await pool.execute(`
      SELECT 
        w.w_id AS workout_id,
        w.name AS workout_name,
        w.duration AS workout_duration,
        w.difficulty AS workout_difficulty,
        e.name AS exercise_name,
        whe.REPS AS exercise_reps,
        whe.SETS AS exercise_sets
      FROM user_workouts uw
      JOIN trainer_has_workout thw ON uw.trainer_id = thw.trainer_t_id AND uw.workout_id = thw.workout_w_id
      JOIN workout w ON thw.workout_w_id = w.w_id
      LEFT JOIN workout_has_exercise whe ON w.w_id = whe.workout_w_id
      LEFT JOIN exercise e ON whe.exercise_e_id = e.e_id
      WHERE uw.user_id = ?
      ORDER BY w.w_id, e.name
    `, [userId]);

    // Group workouts and their exercises
    const groupedWorkouts = workouts.reduce((acc, workout) => {
      // Find existing workout or create new
      let existingWorkout = acc.find(w => w.workout_id === workout.workout_id);
      
      if (!existingWorkout) {
        existingWorkout = {
          workout_id: workout.workout_id,
          name: workout.workout_name,
          duration: workout.workout_duration,
          difficulty: workout.workout_difficulty,
          exercises: []
        };
        acc.push(existingWorkout);
      }

      // Add exercise if it exists
      if (workout.exercise_name) {
        existingWorkout.exercises.push({
          name: workout.exercise_name,
          reps: workout.exercise_reps,
          sets: workout.exercise_sets
        });
      }

      return acc;
    }, []);

    res.status(200).json({
      total_workouts: groupedWorkouts.length,
      workouts: groupedWorkouts
    });

  } catch (error) {
    console.error('Error fetching user workouts:', error);
    res.status(500).json({ error: 'Server error while fetching workouts' });
  }
});

router.get('/:userId/diets', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Check if user exists
    const [userCheck] = await pool.execute(
      'SELECT * FROM user WHERE u_id = ?', 
      [userId]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Query to get user's diets with their food details
    const [diets] = await pool.execute(`
      SELECT 
        d.d_id AS diet_id,
        d.total_cals AS total_calories,
        d.total_protein AS total_protein,
        d.total_fat AS total_fat,
        d.total_carbs AS total_carbs,
        f.name AS food_name,
        f.calories AS food_calories,
        f.protein AS food_protein,
        f.fat AS food_fat,
        f.carbs AS food_carbs
      FROM user_diets ud
      JOIN trainer_has_diet thd ON ud.trainer_id = thd.trainer_t_id AND ud.diet_id = thd.diet_d_id
      JOIN diet d ON thd.diet_d_id = d.d_id
      LEFT JOIN diet_has_food dhf ON d.d_id = dhf.diet_d_id
      LEFT JOIN food f ON dhf.food_f_id = f.f_id
      WHERE ud.user_id = ?
      ORDER BY d.d_id, f.name
    `, [userId]);

    // Group diets and their foods
    const groupedDiets = diets.reduce((acc, diet) => {
      // Find existing diet or create new
      let existingDiet = acc.find(d => d.diet_id === diet.diet_id);
      
      if (!existingDiet) {
        existingDiet = {
          diet_id: diet.diet_id,
          total_calories: diet.total_calories,
          total_protein: diet.total_protein,
          total_fat: diet.total_fat,
          total_carbs: diet.total_carbs,
          foods: []
        };
        acc.push(existingDiet);
      }

      // Add food if it exists
      if (diet.food_name) {
        existingDiet.foods.push({
          name: diet.food_name,
          calories: diet.food_calories,
          protein: diet.food_protein,
          fat: diet.food_fat,
          carbs: diet.food_carbs
        });
      }

      return acc;
    }, []);

    res.status(200).json({
      total_diets: groupedDiets.length,
      diets: groupedDiets
    });

  } catch (error) {
    console.error('Error fetching user diets:', error);
    res.status(500).json({ error: 'Server error while fetching diets' });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const [users] = await pool.execute(
      'SELECT u.*, t.name as trainer_name FROM user u JOIN trainer t ON u.trainer_t_id = t.t_id WHERE u.email = ?',
      [email]
    );

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Prepare response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.u_id,
        name: user.name,
        email: user.email,
        DOB: user.DOB,
        gender: user.gender,
        phone_no: user.phone_no,
        height: user.height,
        weight: user.weight,
        trainer: {
          id: user.trainer_t_id,
          name: user.trainer_name
        }
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

router.post("/health-metrics", async (req, res) => {
  const { user_id, weight, height, heart_rate, BP } = req.body;
  
  try {
    // Validate input
    if (!user_id || !weight || !height) {
      return res.status(400).json({ 
        message: 'User ID, weight, and height are required' 
      });
    }

    // Verify user exists
    const [users] = await pool.execute(
      'SELECT u_id FROM user WHERE u_id = ?',
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Get current date and time
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert health metrics
    const [result] = await pool.execute(
      'INSERT INTO health_metrics (user_id, weight, height, heart_rate, BP, date) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, weight, height, heart_rate || null, BP || null, date]
    );

    // Prepare response
    res.status(201).json({
      message: 'Health metrics recorded successfully',
      metrics: {
        m_id: result.insertId,
        user_id,
        weight,
        height,
        BMI: (weight / (height * height)).toFixed(2),
        heart_rate: heart_rate || null,
        BP: BP || null,
        date
      }
    });
  } catch (error) {
    console.error('Health metrics recording error:', error);
    res.status(500).json({ 
      message: 'Failed to record health metrics', 
      error: error.message 
    });
  }
});

router.get("/health-metrics/:userId", async (req, res) => {
  const userId = req.params.userId;
  
  try {
    // Validate input
    if (!userId) {
      return res.status(400).json({ 
        message: 'User ID is required' 
      });
    }

    // Verify user exists
    const [users] = await pool.execute(
      'SELECT u_id FROM user WHERE u_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Get health metrics for the user
    const [metrics] = await pool.execute(
      'SELECT m_id, user_id, weight, height, BMI, heart_rate, BP, date FROM health_metrics WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );

    // Prepare response
    if (metrics.length === 0) {
      return res.status(404).json({
        message: 'No health metrics found for this user'
      });
    }

    res.status(200).json({
      message: 'Health metrics retrieved successfully',
      user_id: parseInt(userId),
      metrics: metrics
    });
  } catch (error) {
    console.error('Health metrics retrieval error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve health metrics', 
      error: error.message 
    });
  }
});


export default router;
