const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user'); // Adjust the path if necessary

// Password to hash
const password = 'password123'; // The original plain text password
const saltRounds = 10; // Salt rounds for bcrypt

bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed Password:', hashedPassword);

        // Assuming you already have a user instance
        const user = await User.findOne({ username: 'newuser' }); // Find user
        if (user) {
            user.password = hashedPassword; // Update the password field
            await user.save();
            console.log('Password updated in database');
        } else {
            console.log('User not found');
        }
    }
});
