class InMemoryStorage {
  constructor() {
    this.strings = new Map(); // sha256 -> analysis
    this.byValue = new Map(); // original string -> sha256
  }

  save(analysis) {
    this.strings.set(analysis.id, analysis);
    this.byValue.set(analysis.value, analysis.id);
    return analysis;
  }

  findByHash(hash) {
    return this.strings.get(hash);
  }

  findByValue(value) {
    const hash = this.byValue.get(value);
    return hash ? this.strings.get(hash) : null;
  }

  findAll() {
    return Array.from(this.strings.values());
  }

  deleteByValue(value) {
    const hash = this.byValue.get(value);
    if (hash) {
      this.strings.delete(hash);
      this.byValue.delete(value);
      return true;
    }
    return false;
  }

  clear() {
    this.strings.clear();
    this.byValue.clear();
  }
}

module.exports = new InMemoryStorage();
