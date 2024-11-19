// Sanghyun Jun
// Sanghyun.Jun.1@stonybrook.edu

import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import cloudinary from 'cloudinary';
import cors from 'cors';


dotenv.config(); 
const app = express(); 


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MySQL DB configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Connection failed:', err.stack);
        return;
    }
    console.log('Connected to my database');
});

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

app.post("/signup", (req, res) => {
    const { email, password, name } = req.body;
  
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required." });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database query failed." });
        }
  
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const query = "INSERT INTO users (email, password, name) VALUES (?, ?, ?)";
        db.query(query, [email, password, name], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to create user." });
        }
        res.status(201).json({ message: "User registered successfully." });
      });
    });
  });


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: "Database query failed." });
        }
  
        if (results.length === 0) {
            return res.status(404).json({ message: "Wrong Email or wrong password." });
        }
  
        const user = results[0];
        if (password !== user.password) {
            return res.status(401).json({ message: "Wrong Email or wrong password." });
        }
        res.status(200).json({ message: "Login successful.", name: user.name });
    });
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});