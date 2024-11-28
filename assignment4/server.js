// Sanghyun Jun
// Sanghyun.Jun.1@stonybrook.edu

import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import cloudinary from 'cloudinary';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";

dotenv.config(); 
const app = express(); 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
  }));

app.use(express.json());
app.use(cookieParser());
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

// Generate Access token
const generateAccessToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
// Generate refresh token
const generateRefreshToken = (email) => {
  return jwt.sign({ email }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

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
        console.log("Updating facilty images...");
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
        db.query(query, [email, password, name], (err) => {
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
            return res.status(401).json({ message: "Wrong Email or wrong password." });
        }
  
        const user = results[0];
        if (password !== user.password) {
            return res.status(401).json({ message: "Wrong Email or wrong password." });
        }

        const accessToken = generateAccessToken(user.email);
        const refreshToken = generateRefreshToken(user.email);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        res.status(200).json({
          message: "Login successful.",
          accessToken,
          name: user.name,
      });
    });
});

// Refresh access token using refresh token
app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token is missing." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.email); // Generate new access token

    res.status(200).json({ accessToken });// Respond with new access token
  } catch (error) {
    console.error("Refresh token verification failed:", error.message);
    res.status(403).json({ message: "Invalid or expired refresh token." }); // Handle token expiration
  }
});

// Logout endpoint: Clear the refresh token cookie
app.post('/logout', (req, res) => {
    res.clearCookie("refreshToken"); // remove cookie token
    res.status(200).json({ message: 'Logged out successfully.' });
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

// delete a reservation by id 
app.delete('/reservations/:reservation_id', async (req, res) => {
  const { reservation_id } = req.params;
  const deleteQuery = `DELETE FROM reservations WHERE id = ?`;

  try {
    const [result] = await db.promise().query(deleteQuery, [reservation_id]);
    // see if connection works
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Failed to delete reservation:", error);
    res.status(500).json({ error: "Failed to delete reservation" });
  }
});


app.get('/user', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const userEmail = decoded.email; 
        res.status(200).json({ email: userEmail }); 
      } catch (error) {

        res.status(401).json({ message: "Invalid or expired token." });
      }
  });

  const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "Token is missing." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      req.user = decoded; 
      next(); 
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token." });
    }
  };
  
  app.get('/user-details', authenticateToken, (req, res) => {
    const userEmail = req.user.email; 
  
    if (!userEmail) {
      return res.status(400).json({ message: "Email is missing in token." });
    }
  
    const query = "SELECT email, name, image_url FROM users WHERE email = ?";
    db.query(query, [userEmail], (err, results) => {
      if (err) {
        console.error("Database query error:", err.message);
        return res.status(500).json({ message: "Failed to retrieve user info." });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json(results[0]);
    });
  });
  

app.post('/change-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    if (!newPassword || !newPassword) {
      return res.status(400).json({ message: 'Enter your password' });
    }
  
    try {
        const userEmail = req.user.email; 
        
         // Retrieve the stored hashed password for the user from the database
         const query = 'SELECT password FROM users WHERE email = ?';
         db.query(query, [userEmail], async (err, result) => {
             if (err) {
                 console.error('Database query error:', err);
                 return res.status(500).json({ message: 'Failed to retrieve user data.' });
             }
 
             if (result.length === 0) {
                 return res.status(404).json({ message: 'User not found.' });
             }
 
             const storedHashedPassword = result[0].password;
             // Compare the provided old password with the stored hashed password (no need to hash oldPassword again)
             if (oldPassword !== storedHashedPassword) {
                 return res.status(400).json({ message: 'Incorrect old password.' });
             }
            
             const updatequery = 'UPDATE users SET password = ? WHERE email = ?';
            db.query(updatequery, [newPassword, userEmail], (err) => {
              if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Failed to update password.' });
              }
              res.status(200).json({ message: 'Password changed successfully.' });
            });
        });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ message: 'An error occurred.' });
    }
  });
  

  app.post('/change-name', authenticateToken, (req, res) => {
    const { newName } = req.body;
  
    if (!newName || newName.trim() === '') {
      return res.status(400).json({ message: 'Name cannot be empty.' });
    }
  
    const userEmail = req.user.email;
    const query = 'UPDATE users SET name = ? WHERE email = ?';
  
    db.query(query, [newName, userEmail], (err) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Failed to update name.' });
      }
  
      res.status(200).json({ message: 'Name updated successfully.' });
    });
  });

  app.post('/change-image', authenticateToken, async (req, res) => {
    try {
      const { image } = req.body; 
      const userEmail = req.user.email;
  
      if (!image) {
        return res.status(400).json({ message: 'Image is required.' });
      }
  
      // Cloudinary image upload 
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'user_images',
        public_id: `user_${userEmail}`,
      });
  
      // save converted url to DB
      const query = 'UPDATE users SET image_url = ? WHERE email = ?';
      db.query(query, [uploadResponse.secure_url, userEmail], (err) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ message: 'Failed to update image URL in the database.' });
        }
  
        res.status(200).json({ message: 'Image updated successfully.', imageUrl: uploadResponse.secure_url });
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ message: 'Failed to upload image to Cloudinary.' });
    }
  });
  
  