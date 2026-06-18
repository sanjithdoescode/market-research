function formatRating(value) {
  return Number.isFinite(value) ? value.toFixed(1) : 'N/A';
}

function formatPrice(metadata) {
  if (metadata?.priceRange?.displayString) {
    return metadata.priceRange.displayString;
  }
  if (Number.isFinite(metadata?.priceLevel)) {
    if (metadata.priceLevel === 0) return 'Free';
    return '$'.repeat(metadata.priceLevel);
  }
  return 'N/A';
}

function getThreatClass(threat) {
  if (!threat || threat === 'Not assessed') return 'threat-badge--default';
  const lower = threat.toLowerCase();
  if (lower.includes('high')) return 'threat-badge--high';
  if (lower.includes('medium') || lower.includes('moderate')) return 'threat-badge--medium';
  if (lower.includes('low')) return 'threat-badge--low';
  return 'threat-badge--default';
}

function StarRating({ rating }) {
  if (!Number.isFinite(rating)) return null;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars && i < 5; i++) {
    stars.push('★');
  }
  if (hasHalf && stars.length < 5) {
    stars.push('½');
  }
  return <span className="rating-stars" aria-hidden="true">{stars.join('')}</span>;
}

function CompetitorTable({ competitors = [], assessment = [] }) {
  const threatByName = new Map(assessment.map((item) => [item.name, item.threatLevel]));

  return (
    <section className="panel animate-in stagger-6">
      <div className="panel-heading compact">
        <div>
          <p className="eyebrow">Competitors</p>
          <h2>Google-derived market set</h2>
        </div>
        <span className="count-pill">{competitors.length}</span>
      </div>

      <div className="table-wrap">
        <table className="competitor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Threat</th>
              <th>Price</th>
              <th>Evidence</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {competitors.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">
                  No competitors were returned by Google Places for this query.
                </td>
              </tr>
            ) : (
              competitors.map((competitor) => {
                const threat = threatByName.get(competitor.name) || 'Not assessed';
                return (
                  <tr key={competitor.placeId || competitor.id}>
                    <td>
                      <strong>{competitor.name}</strong>
                      <span>{competitor.address || 'Address unavailable'}</span>
                    </td>
                    <td>
                      <span className="rating-display">
                        <span className="rating-value">{formatRating(competitor.rating)}</span>
                        <StarRating rating={competitor.rating} />
                      </span>
                    </td>
                    <td>{competitor.reviewCount ?? 0}</td>
                    <td>
                      <span className={`threat-badge ${getThreatClass(threat)}`}>
                        {threat}
                      </span>
                    </td>
                    <td>{formatPrice(competitor.googleMetadata)}</td>
                    <td>
                      <span className={competitor.evidence?.reviewsAvailable ? 'status ok' : 'status missing'}>
                        {competitor.evidence?.reviewsAvailable ? 'Reviews' : 'Missing reviews'}
                      </span>
                    </td>
                    <td>{competitor.businessCategory?.primaryType || 'Uncategorized'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CompetitorTable;
