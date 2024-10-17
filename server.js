const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the root directory if public folder contains the required CSS and JSON files.
app.use(express.static(path.join(__dirname)));

// Serve the schools.json file
app.use('/schools.json', express.static(path.join(__dirname, 'schools.json')));

// Static HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/grades', (req, res) => {
    res.sendFile(path.join(__dirname, 'grades.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});