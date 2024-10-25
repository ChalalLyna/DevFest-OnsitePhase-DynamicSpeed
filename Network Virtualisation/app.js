// Import the required modules
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000
const path = require('path');

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, World! This is your Node.js application running inside a Docker container.');
});

app.get('/a', (req, res) => {
    res.send('test');
});

app.get('/testdwn.txt', (req, res) => {
    const filePath = path.join(__dirname, 'testdwn.txt');
    res.download(filePath);
});

app.get('/largefile.txt', (req, res) => {
    const filePath = path.join(__dirname, 'largefile.txt');
    res.download(filePath);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
