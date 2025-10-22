class NaturalLanguageParser {
  static parseQuery(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string');
    }

    const lowerQuery = query.toLowerCase().trim();
    const filters = {};

    // Parse palindrome
    if (lowerQuery.includes('palindrom')) {
      filters.is_palindrome = true;
    }

    // Parse word count
    const wordCountMatch = lowerQuery.match(/(\b)single word|one word|1 word(\b)/);
    if (wordCountMatch) {
      filters.word_count = 1;
    } else {
      const wordCountNum = lowerQuery.match(/(\d+)\s*word/);
      if (wordCountNum) {
        filters.word_count = parseInt(wordCountNum[1]);
      }
    }

    // Parse length constraints
    const longerThanMatch = lowerQuery.match(/longer than\s*(\d+)/);
    if (longerThanMatch) {
      filters.min_length = parseInt(longerThanMatch[1]) + 1;
    }

    const shorterThanMatch = lowerQuery.match(/shorter than\s*(\d+)/);
    if (shorterThanMatch) {
      filters.max_length = parseInt(shorterThanMatch[1]) - 1;
    }

    const lengthMatch = lowerQuery.match(/(\d+)\s*character/);
    if (lengthMatch && !longerThanMatch && !shorterThanMatch) {
      filters.min_length = parseInt(lengthMatch[1]);
      filters.max_length = parseInt(lengthMatch[1]);
    }

    // Parse character containment
    const containsMatch = lowerQuery.match(/contain\w*\s*(?:the\s+)?(?:letter\s+)?(['"]?)([a-z])['"]?/);
    if (containsMatch) {
      filters.contains_character = containsMatch[2];
    }

    // Handle "first vowel" heuristic
    if (lowerQuery.includes('first vowel')) {
      filters.contains_character = 'a';
    }

    return {
      original: query,
      parsed_filters: filters
    };
  }
}

module.exports = NaturalLanguageParser;
