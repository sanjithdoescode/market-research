import { Award, Gauge, ShieldCheck, TrendingUp, Zap, BarChart2, Target } from 'lucide-react';

function ScoreRing({ score, color }) {
  if (score === null || score === undefined) return null;
  const clampedScore = Math.min(100, Math.max(0, score));
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  return (
    <svg className="score-ring" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r={radius} className="ring-track" />
      <circle
        cx="24"
        cy="24"
        r={radius}
        className="ring-fill"
        style={{
          stroke: color,
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          '--circumference': circumference,
          '--final-offset': offset
        }}
      />
    </svg>
  );
}

function MetricCard({ icon: Icon, label, value, color = 'var(--accent)', ringScore = null, large = false, delay = 0 }) {
  return (
    <article
      className={`metric-card animate-in${large ? ' metric-card--large' : ''}`}
      style={{ animationDelay: `${0.1 + delay * 0.06}s` }}
    >
      <div className="metric-icon" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>
        <Icon size={20} aria-hidden="true" />
      </div>
      {ringScore !== null && <ScoreRing score={ringScore} color={color} />}
      <span className="metric-label">{label}</span>
      <strong>{value ?? '—'}</strong>
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
      {/* ── Existing cards ─────────────────────────────────── */}
      <MetricCard
        icon={Gauge}
        label="Overall score"
        value={score}
        color="var(--accent)"
        ringScore={score}
        delay={0}
      />
      <MetricCard
        icon={Award}
        label="Grade"
        value={analysis.grade}
        color="var(--green)"
        delay={1}
      />
      <MetricCard
        icon={ShieldCheck}
        label="Confidence"
        value={analysis.confidence ? analysis.confidence.charAt(0).toUpperCase() + analysis.confidence.slice(1) : '—'}
        color="var(--amber)"
        delay={2}
      />
      <MetricCard
        icon={TrendingUp}
        label="Market opportunity"
        value={analysis.marketAnalysis?.opportunityLevel}
        color="var(--blue)"
        delay={3}
      />

      {/* ── New Demand Signal Engine cards ──────────────────── */}
      <MetricCard
        icon={BarChart2}
        label="Demand score"
        value={demandScore ?? '—'}
        color="var(--teal)"
        ringScore={demandScore}
        delay={4}
      />
      <MetricCard
        icon={ShieldCheck}
        label="Supply pressure"
        value={supplyScore ?? '—'}
        color="var(--orange)"
        ringScore={supplyScore}
        delay={5}
      />
      <MetricCard
        icon={Target}
        label="Opportunity score"
        value={opportunityScore ?? '—'}
        color={opportunityScore >= 60 ? 'var(--green)' : opportunityScore >= 35 ? 'var(--amber)' : 'var(--red)'}
        ringScore={opportunityScore}
        large
        delay={6}
      />
      {opportunityTier && (
        <article
          className="metric-card opportunity-tier-card animate-in"
          style={{ animationDelay: '0.52s' }}
        >
          <div className="metric-icon" style={{ background: 'rgba(167, 139, 250, 0.12)', color: 'var(--purple)' }}>
            <Zap size={20} aria-hidden="true" />
          </div>
          <span className="metric-label">Opportunity tier</span>
          <strong
            className={`tier-label tier-${opportunityTier?.toLowerCase().replace(' ', '-')}`}
          >
            {opportunityTier}
          </strong>
        </article>
      )}
    </section>
  );
}

export default ScoreCard;
