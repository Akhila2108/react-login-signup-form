const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser"); // Import bodyParser for parsing JSON

app.use(cors());
app.use(bodyParser.json()); // Use bodyParser for parsing JSON request bodies

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mahadeva",
  database: "miniproject"
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

db.query(`
  CREATE TABLE IF NOT EXISTS users_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
  )
`, (err, results) => {
  if (err) {
    console.error("Error creating 'users_details' table:", err);
  } else {
    console.log("users_details table created");
  }
});

app.post("/api/Signupdata", (req, res) => {
  const userdetails = req.body;

  db.query(
    "INSERT INTO users_details (username, password, email) VALUES (?, ?, ?)",
    [userdetails.username, userdetails.password, userdetails.email],
    (err, results) => {
      if (err) {
        console.error("Error inserting user details:", err);
        res.status(500).json({ message: "Error inserting user details" });
      } else {
        console.log("Sign up successful");
        res.status(201).json({ message: "User registered successfully" });
      }
    }
  );
});

app.post("/api/Logindata", (req, res) => {
  const { userlogindetails } = req.body;

  db.query(
    "SELECT * FROM users_details WHERE username = ? AND password = ?",
    [userlogindetails.username, userlogindetails.password],
    (err, results) => {
      if (err) {
        console.error("Error checking user details:", err);
        res.status(500).json({ message: "Error checking user details" });
      } else {
        if (results.length > 0) {
          // User with the provided username and password exists
          res.status(200).json({ message: "Login successful", user: results[0] });
        } else {
          // No user with matching credentials found
          res.status(401).json({ message: "Invalid credentials" });
        }
      }
    }
  );
});
app.get("/api/userdetails/", async(req, res) => {
  const username = req.query.username;
  console.log(username)

  db.query(
    "SELECT * FROM users_details WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error fetching user details:", err);
        res.status(500).json({ message: "Error fetching user details" });
      } else {
        if (results.length > 0) {
          // User with the provided username exists
          res.status(200).json(results[0]); // Return the user details as JSON
        } else {
          // No user with the provided username found
          res.status(404).json({ message: "User not found" });
        }
      }
    }
  );
});


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





