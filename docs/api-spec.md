# API Spec

Base path: `/api`

## POST `/analysis`

Creates a market analysis.

Request body:

```json
{
  "location": "string, required",
  "businessType": "string, required",
  "niche": "string, optional",
  "radius": "integer meters, optional, 100-50000",
  "maxCompetitors": "integer, optional, 1-20"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "id": "analysis id",
    "input": {},
    "search": {},
    "competitors": [],
    "analysis": {
      "overallScore": 82,
      "grade": "B",
      "confidence": "medium",
      "summary": "...",
      "competitorAssessment": [],
      "marketAnalysis": {},
      "recommendation": {}
    },
    "createdAt": "ISO timestamp"
  }
}
```

## GET `/history`

Query parameters:

- `limit`: optional integer from 1 to 100.

Returns recent analyses.

## GET `/history/:id`

Returns one analysis.

## DELETE `/history/:id`

Deletes one analysis and related records.

## Error Format

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error",
    "details": {}
  }
}
```
