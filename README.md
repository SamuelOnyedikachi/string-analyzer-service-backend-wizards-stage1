# 🧙‍♂️ String Analyzer Service - Backend Wizards Stage 1

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)

A complete RESTful API service that analyzes strings and stores their computed properties. Built for **Backend Wizards Stage 1 Task** with all requirements implemented and deployed to production.

## 🚀 Live Deployment

**Live API URL:** https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app

## 📋 Stage 1 Requirements Checklist

| Requirement | Status | Details |
|-------------|--------|---------|
| **POST /strings** - Analyze string | ✅ **Complete** | Returns all 6 properties with 201 status |
| **GET /strings/{value}** - Get specific string | ✅ **Complete** | Returns full analysis with 200 status |
| **GET /strings** - Filter strings | ✅ **Complete** | Supports all query parameters |
| **GET /strings/filter-by-natural-language** | ✅ **Complete** | Parses natural language queries |
| **DELETE /strings/{value}** - Delete string | ✅ **Complete** | Returns 204 on success |
| **String Analysis Properties** | ✅ **Complete** | All 6 properties implemented |
| **Error Handling** | ✅ **Complete** | 400, 404, 409, 422, 500 status codes |
| **Testing** | ✅ **Complete** | 11/11 tests passing |
| **Deployment** | ✅ **Complete** | Live on Railway |

## 🛠️ API Endpoints

### 🔍 POST /api/strings
Analyze a string and store its properties.

**Request:**
```bash
curl -X POST https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/api/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}'
```
Response (201 Created):
json

{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    "character_frequency_map": {
      "h": 1, "e": 1, "l": 3, "o": 2, " ": 1, "w": 1, "r": 1, "d": 1
    }
  },
  "created_at": "2025-10-22T10:00:00.000Z"
}

Error Responses:

    400 Bad Request - Missing value field

    409 Conflict - String already exists

    422 Unprocessable Entity - Value must be a string


**📖 GET /api/strings/{string_value}**

Retrieve analysis for a specific string.

Request:
bash

curl https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/api/strings/hello%20world

Response (200 OK):
json

{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    "character_frequency_map": {
      "h": 1, "e": 1, "l": 3, "o": 2, " ": 1, "w": 1, "r": 1, "d": 1
    }
  },
  "created_at": "2025-10-22T10:00:00.000Z"
}

Error Response:

    404 Not Found - String does not exist
**
🔎 GET /api/strings**

Get all strings with advanced filtering.

Query Parameters:

    is_palindrome (boolean) - Filter by palindrome status

    min_length (integer) - Minimum string length

    max_length (integer) - Maximum string length

    word_count (integer) - Exact word count

    contains_character (string) - Single character to search for

Examples:
bash

# Get palindromic strings
curl "https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/api/strings?is_palindrome=true"

# Get strings between 5-10 characters
curl "https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/api/strings?min_length=5&max_length=10"

# Get single-word strings
curl "https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/api/strings?word_count=1"

# Get strings containing 'a'
curl "https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/api/strings?contains_character=a"

Response (200 OK):
json

{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": { /* analysis data */ },
      "created_at": "2025-10-22T10:00:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true
  }
}

**🗣️ GET /api/strings/filter-by-natural-language**

Filter strings using natural language queries.

Supported Queries:

    "all single word palindromic strings" → word_count=1, is_palindrome=true

    "strings longer than 10 characters" → min_length=11

    "palindromic strings that contain the first vowel" → is_palindrome=true, contains_character=a

    "strings containing the letter z" → contains_character=z

Example:
bash

curl "https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/api/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"

Response (200 OK):
json

{
  "data": [ /* array of matching strings */ ],
  "count": 2,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}

**🗑️ DELETE /api/strings/{string_value}**

Remove a string from the system.

Request:
bash

curl -X DELETE https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/api/strings/hello%20world

Response: 204 No Content

Error Response:

    404 Not Found - String does not exist

**📊 String Analysis Properties**

Each analyzed string includes these 6 computed properties:
Property	Type	Description	Example
length	integer	Number of characters	11 for "hello world"
is_palindrome	boolean	Reads same forwards/backwards (case-insensitive)	true for "racecar"
unique_characters	integer	Count of distinct characters	8 for "hello world"
word_count	integer	Number of words separated by whitespace	2 for "hello world"
sha256_hash	string	SHA-256 hash for unique identification	b94d27b9...
character_frequency_map	object	Mapping of characters to occurrence counts	{"h":1,"e":1,"l":3,"o":2," ":1,"w":1,"r":1,"d":1}

**🚀 Quick Start
Prerequisites**

    Node.js (v14 or higher)

    npm or yarn

Local Development
bash

# Clone repository
git clone https://github.com/SamuelOnyedikachi/string-analyzer-service-backend-wizards-stage1.git
cd string-analyzer-service-backend-wizards-stage1

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server (with auto-reload)
npm run dev

# Run tests
npm test

# Start production server
npm start

API Testing
bash

# Test the root endpoint
curl https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/

# Test health check
curl https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/health

# Test string analysis
curl -X POST https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app/api/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "test string"}'

**🧪 Testing
**
The project includes comprehensive test coverage with Jest:
bash

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

Test Results:

    ✅ 11/11 tests passing

    ✅ All endpoints covered

    ✅ Error handling validated

    ✅ Edge cases tested

    ✅ Natural language parsing verified

**🏗️ Project Structure
text**

string-analyzer-service/
├── src/
│   ├── app.js                 # Main application entry point
│   ├── routes/
│   │   └── strings.js         # API route definitions
│   ├── controllers/
│   │   └── stringController.js # Request handlers and business logic
│   ├── services/
│   │   ├── stringAnalysisService.js    # Core string analysis logic
│   │   └── naturalLanguageParser.js    # Natural language query processing
│   ├── models/
│   │   └── stringAnalysis.js  # Data model for string analysis
│   ├── storage/
│   │   └── inMemoryStorage.js # Data storage layer (in-memory)
│   └── utils/
│       └── logger.js          # Logging utilities
├── tests/
│   └── strings.test.js        # Comprehensive test suite
├── package.json               # Project dependencies and scripts
├── README.md                  # Project documentation
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
└── LICENSE                    # MIT License

**🛠️ Technology Stack**

    Runtime: Node.js

    Framework: Express.js

    Testing: Jest + Supertest

    Deployment: Railway

    Storage: In-memory (production-ready)

    Validation: Built-in error handling

    Logging: Custom logging middleware

🔒 Error Handling

The API implements comprehensive error handling:
Status Code	Scenario	Example
400 Bad Request	Missing or invalid request body	{"error": "Missing value field"}
404 Not Found	String does not exist	{"error": "String not found"}
409 Conflict	String already exists	{"error": "String already exists"}
422 Unprocessable Entity	Invalid data type for value	{"error": "Value must be a string"}
500 Internal Server Error	Server-side issues	{"error": "Internal server error"}
🌐 Deployment

This API is deployed on Railway with automatic deployments from the main branch.

Deployment Platforms Supported:

    Railway (current)

    Heroku

    AWS EC2/Elastic Beanstalk

    Google Cloud Platform

    DigitalOcean App Platform

Environment Variables:

    PORT - Server port (default: 3000)

    NODE_ENV - Environment mode (development/production)

🤝 Contributing

    Fork the repository

    Create a feature branch: git checkout -b feature/amazing-feature

    Commit your changes: git commit -m 'Add amazing feature'

    Push to the branch: git push origin feature/amazing-feature

    Open a Pull Request

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
👨‍💻 Author

Samuel Onyedikachi

    GitHub: @SamuelOnyedikachi

    Backend Wizards Cohort Member

🙏 Acknowledgments

    Backend Wizards program for the comprehensive task specification

    Railway for the seamless deployment platform

    Jest team for the excellent testing framework

<div align="center">
🎉 Stage 1 Task Successfully Completed!

Live API: https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app

Backend Wizards - Building the future, one endpoint at a time! 🧙‍♂️
</div> ```
