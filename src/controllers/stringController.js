const StringAnalysisService = require('../services/stringAnalysisService');
const NaturalLanguageParser = require('../services/naturalLanguageParser');
const StringAnalysis = require('../models/stringAnalysis');
const storage = require('../storage/inMemoryStorage');

class StringController {
  // POST /strings
  static async createString(req, res) {
    try {
      const { value } = req.body;

      if (value === undefined) {
        return res.status(400).json({ error: 'Missing required field: value' });
      }

      if (typeof value !== 'string') {
        return res.status(422).json({ error: 'Value must be a string' });
      }

      if (value.trim().length === 0) {
        return res.status(422).json({ error: 'String cannot be empty' });
      }

      const existing = storage.findByValue(value);
      if (existing) {
        return res.status(409).json({ error: 'String already exists' });
      }

      const properties = StringAnalysisService.analyzeString(value);
      const analysis = new StringAnalysis(value, properties);

      storage.save(analysis);

      res.status(201).json(analysis.toJSON());
    } catch (error) {
      console.error('Error in createString:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /strings/:string_value
  static async getString(req, res) {
    try {
      const { string_value } = req.params;
      const analysis = storage.findByValue(string_value);

      if (!analysis) {
        return res.status(404).json({ error: 'String not found' });
      }

      res.json(analysis.toJSON());
    } catch (error) {
      console.error('Error in getString:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /strings
  static async getAllStrings(req, res) {
    try {
      const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

      let allStrings = storage.findAll();

      // Apply filters
      if (is_palindrome !== undefined) {
        allStrings = allStrings.filter(s => s.properties.is_palindrome === (is_palindrome === 'true'));
      }

      if (min_length !== undefined) {
        const min = parseInt(min_length);
        if (isNaN(min)) {
          return res.status(400).json({ error: 'min_length must be a number' });
        }
        allStrings = allStrings.filter(s => s.properties.length >= min);
      }

      if (max_length !== undefined) {
        const max = parseInt(max_length);
        if (isNaN(max)) {
          return res.status(400).json({ error: 'max_length must be a number' });
        }
        allStrings = allStrings.filter(s => s.properties.length <= max);
      }

      if (word_count !== undefined) {
        const count = parseInt(word_count);
        if (isNaN(count)) {
          return res.status(400).json({ error: 'word_count must be a number' });
        }
        allStrings = allStrings.filter(s => s.properties.word_count === count);
      }

      if (contains_character !== undefined) {
        if (contains_character.length !== 1) {
          return res.status(400).json({ error: 'contains_character must be a single character' });
        }
        const char = contains_character.toLowerCase();
        allStrings = allStrings.filter(s => s.properties.character_frequency_map[char]);
      }

      res.json({
        data: allStrings.map(s => s.toJSON()),
        count: allStrings.length,
        filters_applied: Object.keys(req.query).length > 0 ? req.query : undefined
      });
    } catch (error) {
      console.error('Error in getAllStrings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /strings/filter-by-natural-language
  static async filterByNaturalLanguage(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const interpretedQuery = NaturalLanguageParser.parseQuery(query);

      // Use the same filtering logic as getAllStrings
      const mockReq = { query: interpretedQuery.parsed_filters };
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            const response = {
              ...data,
              interpreted_query: interpretedQuery
            };
            // Remove filters_applied if empty
            if (!response.filters_applied) {
              delete response.filters_applied;
            }
            res.status(code).json(response);
          }
        })
      };

      await this.getAllStrings(mockReq, mockRes);
    } catch (error) {
      console.error('Error in filterByNaturalLanguage:', error);
      if (error.message.includes('Unable to parse') || error.message.includes('Query must be')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /strings/:string_value
  static async deleteString(req, res) {
    try {
      const { string_value } = req.params;
      const deleted = storage.deleteByValue(string_value);

      if (!deleted) {
        return res.status(404).json({ error: 'String not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error in deleteString:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = StringController;
