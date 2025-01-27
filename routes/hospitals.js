const express = require("express");
const router = express.Router();
const db = require("../models/db.js");

// Helper function to calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// 1. Add a new hospital
router.post("/", (req, res) => {
    const { name, location, contact_info, latitude, longitude } = req.body;

    if (!name || !location || !contact_info || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `INSERT INTO hospitals (name, location, contact_info, latitude, longitude) VALUES (?, ?, ?, ?, ?)`;
    db.db.run(query, [name, location, contact_info, latitude, longitude], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to add hospital" });
        }
        res.status(201).json({ message: "Hospital added successfully", hospitalId: this.lastID });
    });
});

// 2. Associate a hospital with a disease
router.post("/associate-hospital-disease", (req, res) => {
    const { hospitalId, diseaseId } = req.body;

    if (!hospitalId || !diseaseId) {
        return res.status(400).json({ error: "Hospital ID and Disease ID are required" });
    }

    const query = `INSERT INTO disease_resources (hospital_id, disease_id) VALUES (?, ?)`;
    db.db.run(query, [hospitalId, diseaseId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to associate hospital with disease" });
        }
        res.status(201).json({ message: "Hospital successfully associated with disease", associationId: this.lastID });
    });
});

// 3. Associate a user with a hospital
router.post("/associate-user-hospital", (req, res) => {
    const { userId, hospitalId } = req.body;

    if (!userId || !hospitalId) {
        return res.status(400).json({ error: "User ID and Hospital ID are required" });
    }

    const query = `INSERT INTO user_hospitals (user_id, hospital_id) VALUES (?, ?)`;
    db.db.run(query, [userId, hospitalId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to associate user with hospital" });
        }
        res.status(201).json({ message: "User successfully associated with hospital", associationId: this.lastID });
    });
});

// 4. Search hospitals by location and disease
router.get("/search-hospitals", (req, res) => {  // Updated to match frontend
    const { disease, userLat, userLon } = req.query;

    if (!disease || !userLat || !userLon) {
        return res.status(400).json({ error: "Disease and user location are required" });
    }

    const lat = parseFloat(userLat);
    const lon = parseFloat(userLon);
    if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: "Invalid latitude or longitude" });
    }

    const query = `
        SELECT hospitals.id, hospitals.name, hospitals.location, hospitals.contact_info, hospitals.latitude, hospitals.longitude
        FROM hospitals
        JOIN disease_resources ON hospitals.id = disease_resources.hospital_id
        JOIN diseases ON diseases.id = disease_resources.disease_id
        WHERE diseases.name = ?
    `;

    db.db.all(query, [disease], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to retrieve hospitals" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "No hospitals found for the specified disease" });
        }

        // Filter hospitals based on distance (e.g., within 50 km)
        const nearbyHospitals = rows.filter((hospital) => {
            const distance = getDistance(lat, lon, hospital.latitude, hospital.longitude);
            return distance <= 50; // Hospitals within 50 km
        });

        if (nearbyHospitals.length === 0) {
            return res.status(404).json({ message: "No nearby hospitals found within 50 km" });
        }

        res.json(nearbyHospitals);
    });
});

// 5. List all hospitals
router.get("/", (req, res) => {
    const query = `SELECT * FROM hospitals`;
    db.db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to retrieve hospitals" });
        }
        res.json(rows);
    });
});

module.exports = router;
