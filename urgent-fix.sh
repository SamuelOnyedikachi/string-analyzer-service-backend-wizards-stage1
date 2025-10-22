#!/bin/bash
echo "=== URGENT FIX: Removing /api prefix for Stage 1 tests ==="

# Update app.js
echo "Updating app.js..."
cat > src/app.js << 'APP_EOF'
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
APP_EOF

# Update routes
echo "Updating routes..."
cat > src/routes/strings.js << 'ROUTES_EOF'
const express = require('express');
const StringController = require('../controllers/stringController');

const router = express.Router();

// POST /strings - Create/Analyze String
router.post('/strings', StringController.createString);

// GET /strings/:string_value - Get Specific String
router.get('/strings/:string_value', StringController.getString);

// GET /strings - Get All Strings with Filtering
router.get('/strings', StringController.getAllStrings);

// GET /strings/filter-by-natural-language - Natural Language Filtering
router.get('/strings/filter-by-natural-language', StringController.filterByNaturalLanguage);

// DELETE /strings/:string_value - Delete String
router.delete('/strings/:string_value', StringController.deleteString);

module.exports = router;
ROUTES_EOF

echo "✅ Fixed! Removed /api prefix from all endpoints"
echo ""
echo "Now run:"
echo "npm test"
echo "git add ."
echo "git commit -m 'fix: Remove /api prefix to match Stage 1 test requirements'"
echo "git push origin main"
