const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Use a more secure key in production

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        req.user = user; // Attach user info to request
        next();
    });
};

module.exports = authMiddleware;
