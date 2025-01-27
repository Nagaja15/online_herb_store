const express = require("express");
const router = express.Router();
const {db} = require("../models/db.js"); // Adjust path based on your setup

// GET all herbs
router.get("/", (req, res) => {
    db.all("SELECT * FROM herbs", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to retrieve herbs" });
        }
        res.json(rows);
    });
});

// POST a new herb
router.post("/", (req, res) => {
    const { name, description, image_url } = req.body;

    if (!name || !description || !image_url) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `INSERT INTO herbs (name, description, image_url) VALUES (?, ?, ?)`;
    db.run(query, [name, description, image_url], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to add herb" });
        }
        res.status(201).json({ message: "Herb added successfully!", herbId: this.lastID });
    });
});

// POST associate a herb with a disease
router.post("/associate", (req, res) => {
    const { diseaseId, herbId } = req.body;  // Expect diseaseId and herbId in the request body

    // Ensure both diseaseId and herbId are provided
    if (!diseaseId || !herbId) {
        return res.status(400).json({ error: "Both diseaseId and herbId are required" });
    }

    // Query to associate herb with disease in the disease_resources table
    const query = `INSERT INTO disease_resources (resource_id, disease_id,resource_type) VALUES (?, ?,'herb')`;
    
    db.run(query, [herbId, diseaseId], 
        
        function (err) {
            if (err) {
            console.log(herbId,diseaseId);
            console.error(err);
            return res.status(500).json({ error: "Failed to associate herb with disease" });
        }
        res.status(201).json({ message: "Herb associated with disease successfully!", associationId: this.lastID });
    });
});

// GET all diseases associated with a specific herb
router.get("/:herbId/diseases", (req, res) => {
    const { herbId } = req.params;

    // Query to find diseases associated with the given herb
    const query = `
        SELECT d.name AS disease_name, d.description AS disease_description
        FROM diseases d
        JOIN disease_resources dr ON dr.disease_id = d.id
        WHERE dr.herb_id = ?
    `;
    
    db.all(query, [herbId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to retrieve associated diseases" });
        }
        res.json(rows);
    });
});

module.exports = router;
