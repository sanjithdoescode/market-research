import { CheckCircle2, ListChecks, Target, TrendingDown, TrendingUp, Zap, Users, BarChart2, DollarSign } from 'lucide-react';

function AnalysisBlock({ icon: Icon, label, text, accentColor }) {
  if (!text) return null;
  return (
    <div className="analysis-block" style={{ borderLeftColor: accentColor }}>
      <h3 style={{ color: accentColor }}>
        <Icon size={16} aria-hidden="true" />
        {label}
      </h3>
      <p className="analysis-text">{text}</p>
    </div>
  );
}

function RecommendationPanel({
  recommendation,
  summary,
  marketAnalysis,
  demandAnalysis,
  supplyAnalysis,
  opportunityAnalysis,
  audienceInsights,
  competitorInsights,
  pricingAnalysis
}) {
  if (!recommendation) {
    return null;
  }

  const hasNewInsights =
    demandAnalysis ||
    supplyAnalysis ||
    opportunityAnalysis ||
    audienceInsights ||
    competitorInsights ||
    pricingAnalysis;

  return (
    <section className="recommendation-layout">
      {/* ── Primary recommendation card ────────────────────────────────── */}
      <article className="panel recommendation-panel">
        <div className="panel-heading compact">
          <div>
            <p className="eyebrow">Recommendation</p>
            <h2>{recommendation.decision}</h2>
          </div>
          <CheckCircle2 size={22} aria-hidden="true" style={{ color: 'var(--accent-dim)', opacity: 0.8 }} />
        </div>
        <p className="summary-text">{summary}</p>

        <div className="list-block">
          <h3>
            <ListChecks size={18} aria-hidden="true" />
            Reasoning
          </h3>
          <ul>
            {(recommendation.reasoning || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="list-block">
          <h3>
            <Target size={18} aria-hidden="true" />
            Positioning
          </h3>
          <ul>
            {(recommendation.suggestedPositioning || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </article>

      {/* ── Market entry profile card ──────────────────────────────────── */}
      <article className="panel market-panel">
        <div className="panel-heading compact">
          <div>
            <p className="eyebrow">Market factors</p>
            <h2>Entry profile</h2>
          </div>
        </div>

        <dl className="factor-list">
          <div>
            <dt>Density</dt>
            <dd>{marketAnalysis?.competitorDensity}</dd>
          </div>
          <div>
            <dt>Entry difficulty</dt>
            <dd>{marketAnalysis?.entryDifficulty}</dd>
          </div>
          <div>
            <dt>Saturation</dt>
            <dd>{marketAnalysis?.marketSaturation}</dd>
          </div>
          <div>
            <dt>Opportunity</dt>
            <dd>{marketAnalysis?.opportunityLevel}</dd>
          </div>
        </dl>
      </article>

      {/* ── AI Insight cards (new) ─────────────────────────────────────── */}
      {hasNewInsights && (
        <article className="panel ai-insights-panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">AI Analysis</p>
              <h2>Signal Interpretation</h2>
            </div>
            <Zap size={22} aria-hidden="true" style={{ color: 'var(--accent-dim)', opacity: 0.6 }} />
          </div>

          <div className="insights-grid">
            <AnalysisBlock
              icon={BarChart2}
              label="Demand Analysis"
              text={demandAnalysis}
              accentColor="var(--teal)"
            />
            <AnalysisBlock
              icon={TrendingDown}
              label="Supply Analysis"
              text={supplyAnalysis}
              accentColor="var(--orange)"
            />
            <AnalysisBlock
              icon={Zap}
              label="Opportunity Analysis"
              text={opportunityAnalysis}
              accentColor="var(--purple)"
            />
            <AnalysisBlock
              icon={Users}
              label="Audience Insights"
              text={audienceInsights}
              accentColor="var(--blue)"
            />
            <AnalysisBlock
              icon={TrendingUp}
              label="Competitor Insights"
              text={competitorInsights}
              accentColor="var(--rose)"
            />
            <AnalysisBlock
              icon={DollarSign}
              label="Pricing Analysis"
              text={pricingAnalysis}
              accentColor="var(--green)"
            />
          </div>
        </article>
      )}
    </section>
  );
}

export default RecommendationPanel;
