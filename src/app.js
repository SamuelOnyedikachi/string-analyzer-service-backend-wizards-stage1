require('dotenv').config();
const express = require('express');
const stringRoutes = require('./routes/strings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 String Analyzer API - Backend Wizards Stage 1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      analyzeString: 'POST /strings',
      getString: 'GET /strings/:value',
      getAllStrings: 'GET /strings',
      naturalLanguage: 'GET /strings/filter-by-natural-language',
      deleteString: 'DELETE /strings/:value'
    },
    example: {
      analyze: 'POST /strings with {"value": "your string"}',
      get: 'GET /strings/hello%20world'
    },
    repository: 'https://github.com/SamuelOnyedikachi/string-analyzer-service-backend-wizards-stage1'
  });
});

// Routes - NO /api prefix!
app.use('/', stringRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'String Analyzer API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
// Trigger deployment - Wed Oct 22 10:30:10 AM WAT 2025
 
