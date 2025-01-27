const bcrypt = require('bcrypt');

// The stored hash from the database (replace with actual hash from your DB)
const storedHash = "$2b$10$z6xOD1BqV2iyft70ru79YO5YPZlYS8BaN1bwEo4fJ2yT2KoQsJYWK";

// The password you want to check (the plain text password entered by the user)
const plainTextPassword = "password123";

bcrypt.compare(plainTextPassword, storedHash, (err, isMatch) => {
    if (err) {
        console.error('Error comparing passwords:', err);
    } else {
        console.log('Password match:', isMatch); // true if the password matches
    }
});
