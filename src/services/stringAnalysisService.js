const crypto = require('crypto');

class StringAnalysisService {
  static analyzeString(inputString) {
    if (typeof inputString !== 'string') {
      throw new Error('Input must be a string');
    }

    const trimmedString = inputString.trim();
    
    return {
      length: trimmedString.length,
      is_palindrome: this.isPalindrome(trimmedString),
      unique_characters: this.countUniqueCharacters(trimmedString),
      word_count: this.countWords(trimmedString),
      sha256_hash: this.generateSHA256(trimmedString),
      character_frequency_map: this.getCharacterFrequency(trimmedString)
    };
  }

  static isPalindrome(str) {
    if (str.length === 0) return false;
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanStr === cleanStr.split('').reverse().join('');
  }

  static countUniqueCharacters(str) {
    return new Set(str.toLowerCase()).size;
  }

  static countWords(str) {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  }

  static generateSHA256(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  static getCharacterFrequency(str) {
    const frequency = {};
    const lowerStr = str.toLowerCase();
    
    for (let char of lowerStr) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    
    return frequency;
  }
}

module.exports = StringAnalysisService;
