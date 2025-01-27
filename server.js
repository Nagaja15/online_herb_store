const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS for cross-origin requests
const db = require('./models/db'); // SQLite database setup
const searchRoutes = require('./routes/search'); // Search functionality routes
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const diseasesRouter = require('./routes/diseases'); // Disease routes
const herbsRoutes = require('./routes/herbs'); // Herbs routes
const fruitsRoutes = require('./routes/fruits'); // Fruits routes
const hospitalsRoutes = require('./routes/hospitals'); // Hospitals routes
const authMiddleware = require('./Middlware/authMiddleware'); // Token authentication middleware

dotenv.config(); // Load environment variables from .env file

const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow frontend from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware to parse JSON body
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Database setup (ensure database file path is resolved correctly)
const dbPath = path.resolve(__dirname, 'data', 'database.db');
console.log(`Database located at: ${dbPath}`);

// API routes
app.use('/api/auth', authRoutes); // User authentication routes
app.use('/api/diseases', diseasesRouter); // Disease-related routes
app.use('/api/herbs', herbsRoutes); // Herbs-related routes
app.use('/api/fruits', fruitsRoutes); // Fruits-related routes
app.use('/api/hospitals', hospitalsRoutes); // Hospital-related routes
app.use('/api/search', searchRoutes); // Search functionality routes

// Serve the home page (root route)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Middleware to handle 404 errors for invalid routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Middleware for global error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
