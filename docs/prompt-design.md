# Prompt Design

The Mistral prompt enforces four rules:

- Use only provided data.
- Do not invent competitors.
- Do not invent reviews, ratings, or ratings volume.
- Return JSON only.

The backend sends a compact normalized competitor payload containing names, addresses, ratings, review counts, location, categories, review samples, and evidence flags. Missing reviews are represented explicitly so the model can lower confidence instead of fabricating sentiment.

Mistral is called with `response_format.type = "json_schema"` and the server validates the returned object again before persistence.
