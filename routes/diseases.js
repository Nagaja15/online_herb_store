const express = require("express");
const router = express.Router();
const db = require("../models/db.js");

// 1. Create a new disease
router.post("/add-disease", (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Disease name is required" });
    }

    const query = `INSERT INTO diseases (name, description) VALUES (?, ?)`;
    db.db.run(query, [name, description], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to add disease" });
        }
        res.status(201).json({ message: "Disease added successfully!", diseaseId: this.lastID });
    });
});

// 2. Get all diseases
router.get("/", (req, res) => {
    const query = `SELECT * FROM diseases`;

    db.db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch diseases" });
        }

        res.json(rows); // Return list of diseases
    });
});

module.exports = router;
