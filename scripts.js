const express = require('express');
const mysql = require('mysql');
const app = express();

// Use built-in JSON parser middleware
app.use(express.json());

// Configure your MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'chirprapp',
  password: 'cawl_admech',
  database: 'chirpr'
});

// Connect to MySQL
connection.connect();

// API endpoint to get all chirps
app.get('/api/chirps', (req, res) => {
  const query = 'SELECT * FROM chirps';
  
  connection.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).send('Error fetching chirps');
      return;
    }
    res.json(results);
  });
});

app.post('/api/chirps', (req, res) => {
    const newChirp = req.body; // Assume this contains the chirp data
    const query = `INSERT INTO chirps (userid, text) VALUES (?, ?)`;

    connection.query(query, [newChirp.userid, newChirp.text], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error in creating new chirp', error });
        } else {
            res.status(201).json({ message: 'Chirp created successfully', insertId: results.insertId });
        }
    });
});

app.get('/api/chirps', (req, res) => {
    const query = 'SELECT * FROM chirps';

    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error in fetching chirps', error });
        } else {
            res.json(results);
        }
    });
});

// Get a single chirp by ID
app.get('/api/chirps/:id', (req, res) => {
    const query = 'SELECT * FROM chirps WHERE id = ?';
    const chirpId = req.params.id;

    connection.query(query, [chirpId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error in fetching chirp', error });
        } else {
            res.json(results[0] || null);
        }
    });
});

app.put('/api/chirps/:id', (req, res) => {
    const chirpId = req.params.id;
    const chirpData = req.body;
    const query = `UPDATE chirps SET text = ? WHERE id = ?`;

    connection.query(query, [chirpData.text, chirpId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error in updating chirp', error });
        } else {
            res.json({ message: 'Chirp updated successfully' });
        }
    });
});

app.delete('/api/chirps/:id', (req, res) => {
    const chirpId = req.params.id;
    const query = `DELETE FROM chirps WHERE id = ?`;

    connection.query(query, [chirpId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error in deleting chirp', error });
        } else {
            res.json({ message: 'Chirp deleted successfully' });
        }
    });
});

const PORT = 3000; // Replace with your desired port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});