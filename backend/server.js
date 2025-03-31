import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import {readFile} from "fs/promises";
import userroute from "./routes/userroute.js";
import trainerroute from "./routes/trainerroute.js";

const app = express();

app.use(express.json());
app.use(cors());

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "mydb",
  multipleStatements: true,
};

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection(dbconfig);
    console.log("Connected to MySQL");
    const sql = await readFile("./scripts/initialise.sql", "utf8");
    await connection.query(sql);
    console.log("Database initialized successfully");
    // const rows = await connection.query("SHOW TABLES;");
    // console.log(rows[0]);
  }
  catch(error){
    console.error("Error initializing database:", error);
  }
}

initializeDatabase();


app.use("/user", userroute);
app.use("/trainer", trainerroute);


const curport = 8000;
app.listen(curport, () => {
  console.log(`Server running at port ${curport}`);
})


