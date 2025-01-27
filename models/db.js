const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database
const dbPath = 'C:/Users/hi/OneDrive/Desktop/.idea/online_herb_store/data/database.db'; // Use your actual absolute path here

// Create or open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Initialize the database tables
db.serialize(() => {
    // Create Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        );
    `);

    // Create Herbs table
    db.run(`
        CREATE TABLE IF NOT EXISTS herbs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            image_url TEXT
        );
    `);

    // Create Fruits table
    db.run(`
        CREATE TABLE IF NOT EXISTS fruits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            health_benefits TEXT NOT NULL
        );
    `);

    // Create Hospitals table with geolocation
    db.run(`
        CREATE TABLE IF NOT EXISTS hospitals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            contact_info TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL
        );
    `);

    // Create Diseases table with description column (added description column if not already there)
    db.run(`
        CREATE TABLE IF NOT EXISTS diseases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL
        );
    `, function (err) {
        if (err) {
            console.error('Error creating diseases table:', err.message);
        } else {
            console.log('Diseases table created or already exists.');
        }
    });

    // Create Resource-Disease Associations table
    db.run(`
        CREATE TABLE IF NOT EXISTS disease_resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disease_id INTEGER NOT NULL,
            resource_id INTEGER NOT NULL,
            resource_type TEXT NOT NULL,
            FOREIGN KEY (disease_id) REFERENCES diseases(id)
        );
    `, function (err) {
        if (err) {
            console.error('Error creating disease_resources table:', err.message);
        } else {
            console.log('disease_resources table created successfully.');
        }
    });

    // Create User-Hospital Associations table
    db.run(`
        CREATE TABLE IF NOT EXISTS user_hospital_associations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            hospital_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
        );
    `);
});

// Database utility functions

// Add a new herb
function addHerb(name, description, image_url, callback) {
    const sql = `INSERT INTO herbs (name, description, image_url) VALUES (?, ?, ?)`;
    db.run(sql, [name, description, image_url], function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, name, description, image_url });
    });
}

// Add a new fruit
function addFruit(name, health_benefits, callback) {
    const sql = `INSERT INTO fruits (name, health_benefits) VALUES (?, ?)`;
    db.run(sql, [name, health_benefits], function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, name, health_benefits });
    });
}

// Add a new hospital with geolocation
function addHospital(name, location, contact_info, latitude, longitude, callback) {
    console.log('Adding hospital:', { name, location, contact_info, latitude, longitude });

    const sql = `INSERT INTO hospitals (name, location, contact_info, latitude, longitude) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [name, location, contact_info, latitude, longitude], function (err) {
        if (err) {
            console.error('Error adding hospital:', err.message);
            return callback(err);
        }
        callback(null, { id: this.lastID, name, location, contact_info, latitude, longitude });
    });
}

// Associate a resource with a disease
function associateHerbWithDisease(diseaseId, herbId, callback) {
    const sql = `INSERT INTO disease_resources (disease_id, resource_id, resource_type) VALUES (?, ?, 'herb')`;
    
    // Log the inputs to ensure they are being passed correctly
    console.log(`Inserting diseaseId: ${diseaseId}, herbId: ${herbId}`);
    
    db.run(sql, [diseaseId, herbId], function (err) {
        if (err) {
            console.error('Error inserting into disease_resources table:', err.message);
            return callback(err); // Return the error
        }
        console.log('Successfully associated herb with disease');
        callback(null, { diseaseId, herbId, resourceType: 'herb' });
    });
}


function associateFruitWithDisease(diseaseId, fruitId, callback) {
    const sql = `INSERT INTO disease_resources (disease_id, resource_id, resource_type) VALUES (?, ?, 'fruit')`;
    
    // Log inputs for debugging
    console.log(`Associating fruit with disease. diseaseId: ${diseaseId}, fruitId: ${fruitId}`);
    
    db.run(sql, [diseaseId, fruitId], function (err) {
        if (err) {
            console.error('Error inserting into disease_resources table (fruit):', err.message);
            return callback(err); // Return the error
        }
        console.log('Successfully associated fruit with disease');
        callback(null, { diseaseId, fruitId, resourceType: 'fruit' });
    });
}


function associateHospitalWithDisease(diseaseId, hospitalId, callback) {
    const sql = `INSERT INTO disease_resources (disease_id, resource_id, resource_type) VALUES (?, ?, 'hospital')`;
    db.run(sql, [diseaseId, hospitalId], function (err) {
        if (err) return callback(err);
        callback(null, { diseaseId, hospitalId, resourceType: 'hospital' });
    });
}

// Associate a user with a hospital
function associateUserWithHospital(userId, hospitalId, callback) {
    const sql = `INSERT INTO user_hospital_associations (user_id, hospital_id) VALUES (?, ?)`;
    db.run(sql, [userId, hospitalId], function (err) {
        if (err) return callback(err);
        callback(null, { userId, hospitalId });
    });
}

// Search hospitals by location and radius
function searchHospitalsByLocation(userLatitude, userLongitude, radius, callback) {
    const sql = `
        SELECT id, name, location, contact_info, latitude, longitude,
            (3959 * ACOS(
                COS(RADIANS(?)) * COS(RADIANS(latitude)) *
                COS(RADIANS(longitude) - RADIANS(?)) +
                SIN(RADIANS(?)) * SIN(RADIANS(latitude))
            )) AS distance
        FROM hospitals
        HAVING distance <= ?
        ORDER BY distance;
    `;
    db.all(sql, [userLatitude, userLongitude, userLatitude, radius], (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
    });
}

// Fetch column names from the diseases table
function checkColumnExists(columnName) {
    db.all('PRAGMA table_info(diseases);', (err, rows) => {
        if (err) {
            console.error("Error fetching column information:", err);
            return;
        }

        const columnNames = rows.map(row => row.name);
        
        if (columnNames.includes(columnName)) {
            console.log(`Column ${columnName} exists!`);
        } else {
            console.log(`Column ${columnName} does not exist.`);
        }
    });
}

// Example: Check if the 'description' column exists in the diseases table
checkColumnExists('description');


// Export the db object and utility functions
module.exports = {
    db,
    addHerb,
    addFruit,
    addHospital,
    associateHerbWithDisease,
    associateFruitWithDisease,
    associateHospitalWithDisease,
    associateUserWithHospital,
    searchHospitalsByLocation
};
