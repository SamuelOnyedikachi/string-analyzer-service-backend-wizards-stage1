const express = require('express');
const StringController = require('../controllers/stringController');

const router = express.Router();

// POST /api/strings - Create/Analyze String
router.post('/strings', StringController.createString);

// GET /api/strings/:string_value - Get Specific String
router.get('/strings/:string_value', StringController.getString);

// GET /api/strings - Get All Strings with Filtering
router.get('/strings', StringController.getAllStrings);

// GET /api/strings/filter-by-natural-language - Natural Language Filtering
router.get('/strings/filter-by-natural-language', StringController.filterByNaturalLanguage);

// DELETE /api/strings/:string_value - Delete String
router.delete('/strings/:string_value', StringController.deleteString);

module.exports = router;
