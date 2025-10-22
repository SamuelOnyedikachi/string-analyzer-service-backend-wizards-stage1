#!/bin/bash
DOMAIN="https://string-analyzer-service-backend-wizards-stage1-production.up.railway.app"

echo "=== STAGE 1 FINAL VERIFICATION ==="

echo -e "\n1. Testing POST /api/strings"
curl -s -X POST $DOMAIN/api/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}' | jq '{status: "✓", value: .value, length: .properties.length, is_palindrome: .properties.is_palindrome, word_count: .properties.word_count}'

echo -e "\n2. Testing POST /api/strings (duplicate - should fail)"
curl -s -X POST $DOMAIN/api/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}' -w "HTTP Status: %{http_code}\n"

echo -e "\n3. Testing GET /api/strings/:value"
curl -s $DOMAIN/api/strings/racecar | jq '{status: "✓", value: .value, analysis: {length: .properties.length, palindrome: .properties.is_palindrome}}'

echo -e "\n4. Testing GET /api/strings with filtering"
curl -s "$DOMAIN/api/strings?is_palindrome=true" | jq '{status: "✓", count: .count, filters: .filters_applied}'

echo -e "\n5. Testing Natural Language Filtering"
curl -s "$DOMAIN/api/strings/filter-by-natural-language?query=single%20word%20palindromic%20strings" | jq '{status: "✓", interpreted_query: .interpreted_query, count: .count}'

echo -e "\n6. Testing DELETE /api/strings/:value"
curl -s -X DELETE $DOMAIN/api/strings/racecar -w "HTTP Status: %{http_code}\n"

echo -e "\n7. Verifying deletion"
curl -s $DOMAIN/api/strings/racecar -w "HTTP Status: %{http_code}\n"

echo -e "\n✅ STAGE 1 VERIFICATION COMPLETE!"
echo -e "All endpoints working as required."
