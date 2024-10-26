const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based MySQL2
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Import bcrypt

const app = express();
const PORT = process.env.PORT || 3000;

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


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);t
    next();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
