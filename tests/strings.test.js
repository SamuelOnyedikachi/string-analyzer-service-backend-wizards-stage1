const request = require('supertest');
const app = require('../src/app');
const storage = require('../src/storage/inMemoryStorage');

describe('String Analyzer API', () => {
  beforeEach(() => {
    storage.clear();
  });

  describe('POST /strings', () => {
    test('should analyze a string and return 201', async () => {
      const response = await request(app)
        .post('/strings')  // REMOVED /api
        .send({ value: 'hello world' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.value).toBe('hello world');
      expect(response.body.properties.length).toBe(11);
      expect(response.body.properties.is_palindrome).toBe(false);
      expect(response.body.properties.word_count).toBe(2);
      expect(response.body.properties.sha256_hash).toBeDefined();
      expect(response.body.properties.character_frequency_map).toBeDefined();
      expect(response.body.created_at).toBeDefined();
    });

    test('should return 409 for duplicate string', async () => {
      await request(app).post('/strings').send({ value: 'test' });
      
      const response = await request(app)
        .post('/strings')
        .send({ value: 'test' })
        .expect(409);

      expect(response.body.error).toBe('String already exists');
    });

    test('should return 400 for missing value', async () => {
      const response = await request(app)
        .post('/strings')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Missing required field: value');
    });

    test('should return 422 for non-string value', async () => {
      const response = await request(app)
        .post('/strings')
        .send({ value: 123 })
        .expect(422);

      expect(response.body.error).toBe('Value must be a string');
    });
  });

  describe('GET /strings/:string_value', () => {
    test('should return string analysis for existing string', async () => {
      await request(app).post('/strings').send({ value: 'racecar' });

      const response = await request(app)
        .get('/strings/racecar')
        .expect(200);

      expect(response.body.value).toBe('racecar');
      expect(response.body.properties.is_palindrome).toBe(true);
    });

    test('should return 404 for non-existent string', async () => {
      const response = await request(app)
        .get('/strings/nonexistent')
        .expect(404);

      expect(response.body.error).toBe('String not found');
    });
  });

  describe('GET /strings', () => {
    beforeEach(async () => {
      await request(app).post('/strings').send({ value: 'a' });
      await request(app).post('/strings').send({ value: 'racecar' });
      await request(app).post('/strings').send({ value: 'hello world' });
      await request(app).post('/strings').send({ value: 'test string with words' });
    });

    test('should return all strings without filters', async () => {
      const response = await request(app)
        .get('/strings')
        .expect(200);

      expect(response.body.data.length).toBe(4);
      expect(response.body.count).toBe(4);
    });

    test('should filter by palindrome', async () => {
      const response = await request(app)
        .get('/strings?is_palindrome=true')
        .expect(200);

      expect(response.body.data.length).toBe(2); // 'a' and 'racecar'
      expect(response.body.data.every(s => s.properties.is_palindrome)).toBe(true);
    });

    test('should filter by word count', async () => {
      const response = await request(app)
        .get('/strings?word_count=2')
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].value).toBe('hello world');
    });
  });

  describe('DELETE /strings/:string_value', () => {
    test('should delete existing string', async () => {
      await request(app).post('/strings').send({ value: 'to delete' });
      
      await request(app)
        .delete('/strings/to delete')
        .expect(204);

      await request(app)
        .get('/strings/to delete')
        .expect(404);
    });

    test('should return 404 for non-existent string', async () => {
      const response = await request(app)
        .delete('/strings/nonexistent')
        .expect(404);

      expect(response.body.error).toBe('String not found');
    });
  });
});
