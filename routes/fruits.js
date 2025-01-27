// fruits.js - Express Router for Fruits

const express = require("express");
const router = express.Router();
const { db } = require("../models/db.js"); // Adjust path based on your setup

// GET all fruits
router.get("/", (req, res) => {
    db.all("SELECT * FROM fruits", [], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Failed to retrieve fruits" });
        }
        res.json(rows);
    });
});

// POST a new fruit
router.post("/", (req, res) => {
    const { name, health_benefits } = req.body;

    if (!name || !health_benefits) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `INSERT INTO fruits (name, health_benefits) VALUES (?, ?)`;
    db.run(query, [name, health_benefits], function (err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Failed to add fruit" });
        }
        res.status(201).json({ message: "Fruit added successfully!", fruitId: this.lastID });
    });
});

// POST associate a fruit with a disease
router.post("/associate", (req, res) => {
    const { diseaseId, fruitId } = req.body; // Expect diseaseId and fruitId in the request body

    // Ensure both diseaseId and fruitId are provided
    if (!diseaseId || !fruitId) {
        return res.status(400).json({ error: "Both diseaseId and fruitId are required" });
    }

    // Query to associate fruit with disease in the disease_resources table
    const query = `INSERT INTO disease_resources (resource_id, disease_id, resource_type) VALUES (?, ?, 'fruit')`;
    db.run(query, [fruitId, diseaseId], function (err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Failed to associate fruit with disease" });
        }
        res.status(201).json({ message: "Fruit associated with disease successfully!", associationId: this.lastID });
    });
});

// GET all diseases associated with a specific fruit
router.get("/:fruitId/diseases", (req, res) => {
    const { fruitId } = req.params;
    console.log(`Fetching diseases for fruitId: ${fruitId}`);

    // Query to find diseases associated with the given fruit
    const query = `
        SELECT d.name AS disease_name, d.description AS disease_description
        FROM diseases d
        JOIN disease_resources dr ON dr.disease_id = d.id
        WHERE dr.resource_id = ? AND dr.resource_type = 'fruit'
    `;

    db.all(query, [fruitId], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Failed to retrieve associated diseases" });
        }
        res.json(rows);
    });
});

module.exports = router;
