const sqlite3 = require('sqlite3').verbose();
const dbPath = 'C:/Users/hi/OneDrive/Desktop/.idea/online_herb_store/data/database.db'; // Adjust path if needed

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Query to check table schema
db.all("PRAGMA table_info(disease_resources);", [], (err, rows) => {
    if (err) {
        console.error('Error fetching table info:', err.message);
        return;
    }

    console.log("Columns in disease_resources table:");
    rows.forEach((row) => {
        console.log(`${row.name} (${row.type})`);
    });
});

// Close the database after the query
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database closed.');
    }
});
