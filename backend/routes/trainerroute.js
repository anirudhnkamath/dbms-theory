import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
const router = express.Router();

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "190106",
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

router.post("/register", async (req, res) => {
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

export default router;
