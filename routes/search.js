const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Assuming you're using SQLite or another database

// Disease Search Route
router.get('/search', async (req, res) => {
    const { disease } = req.query; // Get disease name from query

    if (!disease) {
        return res.status(400).json({ message: 'Disease name is required' });
    }

    try {
        // Fetch related herbs, fruits, and hospitals for the given disease
        const herbsQuery = `SELECT * FROM herbs WHERE disease_association LIKE ?`;
        const fruitsQuery = `SELECT * FROM fruits WHERE disease_association LIKE ?`;
        const hospitalsQuery = `SELECT * FROM hospitals WHERE disease_association LIKE ?`;

        const herbs = await db.all(herbsQuery, [`%${disease}%`]);
        const fruits = await db.all(fruitsQuery, [`%${disease}%`]);
        const hospitals = await db.all(hospitalsQuery, [`%${disease}%`]);

        res.json({
            herbs: herbs,
            fruits: fruits,
            hospitals: hospitals,
        });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Failed to search for disease data' });
    }
});

module.exports = router;
