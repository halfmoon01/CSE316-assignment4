// Sanghyun Jun
// Sanghyun.Jun.1@stonybrook.edu

import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import cloudinary from 'cloudinary';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

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

// Update the image URL of a facility in the datase to cloudinary fixed URL
async function updateImageUrl(imageFileName) {
    // parse facility name from image file name
    const facilityName = path.parse(imageFileName).name.replace(/_/g, ' '); 
    const imagePath = path.join(path.resolve(), 'images', imageFileName);
    try {
        // upload image to Cloudinary in "facilities" folder
        const result = await cloudinary.v2.uploader.upload(imagePath, {
            folder: "facilities",
            public_id: facilityName.replace(/\s+/g, '_')
        });
        const imageUrl = result.secure_url;
        const updateQuery = `
            UPDATE facilities
            SET image_url = ?
            WHERE name = ?
        `;
        await db.promise().query(updateQuery, [imageUrl, facilityName]);
        console.log(`facility "${facilityName}" URL updated!! `);
    } catch (error) {
        console.error(`Failure for facility "${facilityName}":`, error);
    }
}
async function updateImageURL() {
    try {
        const files = await fs.readdir(path.join(path.resolve(), 'Images'));
        for (const f of files) {
            await updateImageUrl(f);
        }
    } catch (error) {
        console.error("Failed to process images:", error);
    }
}


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

// Get every facility data 
app.get('/facilities', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM facilities');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed getting facilities' });
    }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
  updateImageURL();
});


//create new reservation 
app.post('/reservations', async (req, res) => {
    const { facility_id, reservation_date, user_number, purpose, user_name } = req.body;
    //insert reservation info to reservations table
    const insertQuery = `
        INSERT INTO reservations (facility_id, reservation_date, user_number, purpose, user_name) 
        VALUES (?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await db.promise().query(insertQuery, [
            facility_id,
            reservation_date,
            user_number,
            purpose,
            user_name
        ]);
        res.status(201).json({ message: 'Reservation success!', reservationId: result.insertId });
    } catch (error) {
        console.error('Reservation fail:', error);
        res.status(500).json({ error: 'Reservation fail' });
    }
});


// from reservations, get needed data , and also from facilites using JOIN
app.get('/reservations', async (req, res) => {
    const query = `
        SELECT 
            reservations.id AS reservation_id,
            reservations.reservation_date,
            reservations.user_number,
            reservations.purpose,
            reservations.user_name,
            facilities.name AS reservation_name,
            facilities.only_for_suny AS is_suny_korea,
            facilities.location AS facility_location,  
            facilities.image_url AS facility_image    
        FROM 
            reservations
        JOIN 
            facilities ON reservations.facility_id = facilities.id
    `;
    try {
        const [rows] = await db.promise().query(query);
        res.json(rows);
    } catch (error) {
        console.error('Failed to retrieve reservations:', error);
        res.status(500).json({ error: 'Failed to retrieve reservations' });
    }
});
