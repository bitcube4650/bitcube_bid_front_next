const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allow these HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allow these headers
  credentials: true // Allow cookies and credentials
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Example route
app.get('/api/v1/bid/progressList', (req, res) => {
  res.json({ message: 'Hello from CORS-enabled server!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
