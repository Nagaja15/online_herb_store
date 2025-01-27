const bcrypt = require('bcrypt');

// The stored hash from the database
const storedHash = "$2b$10$bPW8s1Q1McrLhKW7TrcINeBgaegBYI/ZUvXkD/SiyEMr0pDb8SRkW"; // Replace with the actual hash from your DB

// The plain text password to test
const plainTextPassword = "password123"; // Replace with the plain text password

bcrypt.compare(plainTextPassword, storedHash, (err, isMatch) => {
    if (err) {
        console.error('Error comparing passwords:', err);
    } else {
        console.log('Password match:', isMatch); // true if the password matches
    }
});
