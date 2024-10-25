const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based MySQL2
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Import bcrypt

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT'], // Specify allowed methods
    credentials: true // If you need to allow cookies or other credentials
}));

// Database connection configuration
const dbConfig = {
    host: 'localhost', // Your database host
    user: 'root',      // Your database username
    password: 'thaalibiya', // Your database password
    database: 'dynamicspeed' // Your database name
};

// Login route for Admin
app.post('/login', async (req, res) => {
    console.log("Received login request:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }

    try {
        // Connect to the database
        const connection = await mysql.createConnection(dbConfig);

        // Query to find the admin user by email
        const [rows] = await connection.execute('SELECT * FROM Admin WHERE email = ?', [email]);

        if (rows.length > 0) {
            const user = rows[0];
            // Compare the provided password with the hashed password stored in the database
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Admin found, send a success message
                return res.json({ message: 'Login successful', admin: { id: user.id, email: user.email } });
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch all Bandwidth records
app.get('/bandwidth', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM Bandwidth'); // Fetch all records
        res.json(rows);
    } catch (error) {
        console.error('Error fetching bandwidth records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to create a new Bandwidth record
app.post('/bandwidth', async (req, res) => {
    const { bandwidthLimit, bandwidthRequested, connectionSpeed, clientId } = req.body;

    if (!bandwidthLimit || !bandwidthRequested || !connectionSpeed || !clientId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('INSERT INTO Bandwidth (bandwidthLimit, bandwidthRequested, connectionSpeed, clientId) VALUES (?, ?, ?, ?)', [bandwidthLimit, bandwidthRequested, connectionSpeed, clientId]);
        res.status(201).json({ id: result.insertId, bandwidthLimit, bandwidthRequested, connectionSpeed, clientId });
    } catch (error) {
        console.error('Error creating bandwidth record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// New Route to Update Bandwidth for a Client
app.post('/update-bandwidth', async (req, res) => {
    const { clientId, bandwidth } = req.body;

    if (!clientId || !bandwidth) {
        return res.status(400).json({ message: 'Missing clientId or bandwidth' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Update the bandwidthLimit for the given clientId
        const [result] = await connection.execute(
            'UPDATE Bandwidth SET bandwidthLimit = ? WHERE clientId = ?',
            [bandwidth, clientId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Client not found or no change in bandwidth' });
        }

        res.json({ message: 'Bandwidth updated successfully', clientId, bandwidth });
    } catch (error) {
        console.error('Error updating bandwidth:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
