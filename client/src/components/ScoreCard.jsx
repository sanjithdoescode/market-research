import { Award, Gauge, ShieldCheck, TrendingUp, Zap, BarChart2, Target } from 'lucide-react';

function getBarColor(score, defaultColor) {
  if (score === null || score === undefined) return defaultColor;
  return defaultColor;
}

function MetricWidget({ icon: Icon, label, value, color = 'var(--accent)', score = null, hero = false, delay = 0 }) {
  const clampedScore = score !== null && score !== undefined ? Math.min(100, Math.max(0, score)) : null;

  return (
    <article
      className={`metric-widget animate-in${hero ? ' metric-widget--hero' : ''}`}
      style={{ animationDelay: `${0.1 + delay * 0.06}s` }}
    >
      <div className="metric-widget-header">
        <div className="metric-icon" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>
          <Icon size={18} aria-hidden="true" />
        </div>
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-widget-body">
        <strong className="metric-value">{value ?? '—'}</strong>
        {clampedScore !== null && (
          <div className="metric-progress-track">
            <div
              className="metric-progress-fill"
              style={{
                width: `${clampedScore}%`,
                background: color,
                animationDelay: `${0.3 + delay * 0.08}s`
              }}
              aria-label={`${clampedScore}%`}
            />
          </div>
        )}
      </div>
    </article>
  );
}

function ScoreCard({ analysis, demandScore, supplyScore, opportunityScore, opportunityTier }) {
  if (!analysis) {
    return null;
  }

  const score = analysis.overallScore ?? 0;

  return (
    <section className="score-grid" aria-label="Market score">
      {/* ── Primary Metrics Row ─────────────────────────────────── */}
      <MetricWidget
        icon={Gauge}
        label="Overall score"
        value={score}
        color="var(--accent)"
        score={score}
        hero
        delay={0}
      />
      <MetricWidget
        icon={Award}
        label="Grade"
        value={analysis.grade}
        color="var(--green)"
        delay={1}
      />
      <MetricWidget
        icon={ShieldCheck}
        label="Confidence"
        value={analysis.confidence ? analysis.confidence.charAt(0).toUpperCase() + analysis.confidence.slice(1) : '—'}
        color="var(--amber)"
        delay={2}
      />
      <MetricWidget
        icon={TrendingUp}
        label="Market opportunity"
        value={analysis.marketAnalysis?.opportunityLevel}
        color="var(--blue)"
        delay={3}
      />

      {/* ── Demand Signal Engine Metrics ────────────────────────── */}
      <MetricWidget
        icon={BarChart2}
        label="Demand score"
        value={demandScore ?? '—'}
        color="var(--teal)"
        score={demandScore}
        delay={4}
      />
      <MetricWidget
        icon={ShieldCheck}
        label="Supply pressure"
        value={supplyScore ?? '—'}
        color="var(--red)"
        score={supplyScore}
        delay={5}
      />
      <MetricWidget
        icon={Target}
        label="Opportunity score"
        value={opportunityScore ?? '—'}
        color={opportunityScore >= 60 ? 'var(--green)' : opportunityScore >= 35 ? 'var(--amber)' : 'var(--red)'}
        score={opportunityScore}
        hero
        delay={6}
      />
      {opportunityTier && (
        <article
          className="metric-widget opportunity-tier-card animate-in"
          style={{ animationDelay: '0.52s' }}
        >
          <div className="metric-widget-header">
            <div className="metric-icon" style={{ background: 'rgba(124, 58, 237, 0.08)', color: 'var(--purple)' }}>
              <Zap size={18} aria-hidden="true" />
            </div>
            <span className="metric-label">Opportunity tier</span>
          </div>
          <div className="metric-widget-body">
            <strong
              className={`metric-value tier-label tier-${opportunityTier?.toLowerCase().replace(' ', '-')}`}
            >
              {opportunityTier}
            </strong>
          </div>
        </article>
      )}
    </section>
  );
}

export default ScoreCard;
