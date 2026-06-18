# Architecture

MarketSite Analyst uses a modular MERN architecture.

## Request Flow

1. The React client posts an analysis request to `POST /api/analysis`.
2. Express validates and normalizes the request with Zod.
3. `competitorService` geocodes the location and discovers nearby competitors using Google Places Nearby Search.
4. `googlePlacesService` enriches each competitor using Google Place Details.
5. `competitorService` normalizes the data and marks missing evidence such as absent reviews.
6. `mistralService` sends only normalized competitor data to Mistral using a structured JSON schema response format.
7. `analysisService` validates the AI payload, enforces score and grade consistency, and saves the result.
8. Repositories persist records in `searches`, `competitors`, and `analyses`.
9. The API returns a formatted analysis document to the client.

## Boundaries

- Controllers translate HTTP requests and responses.
- Validators reject malformed input before side effects.
- Services contain business logic and external API orchestration.
- Repositories isolate persistence.
- Models define collection shape and indexes.
- Middleware handles logging, rate limiting, and errors.

## Security

- Google and Mistral keys are read only in the server process.
- The client uses a relative `/api` route in development through Vite proxying.
- CORS is restricted by `CLIENT_ORIGIN`.
- Helmet sets defensive HTTP headers.
- Rate limiting protects the analysis endpoint from expensive abuse.

## Data Integrity

- Competitor fields are populated only from Google API responses.
- AI competitor assessments are reconciled against known competitor names.
- The server overwrites AI-provided ratings and review counts with API-derived values.
- Score grades are recalculated server-side.
