const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const router = express.Router();

// Register endpoint
router.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the username already exists
    db.db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, userExists) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userExists) {
            console.log('Username already taken');
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            // Insert the new user into the database
            db.db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
                [username, hashedPassword, role],
                function (err) {
                    if (err) {
                        console.error('Error inserting user into DB:', err);
                        return res.status(500).json({ error: 'Error registering user' });
                    }
                    console.log('User registered successfully');
                    res.status(201).json({ message: 'User registered successfully' });
                });
        });
    });
});

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Login attempt for username:', username); // Log the login attempt

    db.db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (!isMatch) {
                console.log('Invalid credentials');
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
            console.log('Login successful');
            res.status(200).json({ message: 'Login successful', token, role: user.role });
        });
    });
});

module.exports = router;
