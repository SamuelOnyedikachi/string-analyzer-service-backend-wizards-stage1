const crypto = require('crypto');

class StringAnalysis {
  constructor(value, properties) {
    this.id = properties.sha256_hash;
    this.value = value;
    this.properties = properties;
    this.created_at = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      value: this.value,
      properties: this.properties,
      created_at: this.created_at
    };
  }
}

module.exports = StringAnalysis;
