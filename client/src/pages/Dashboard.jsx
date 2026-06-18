import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SearchForm from '../components/SearchForm.jsx';
import { useAnalysis } from '../hooks/useAnalysis.js';

function Dashboard() {
  const navigate = useNavigate();
  const { createAnalysis, state } = useAnalysis();

  async function handleSubmit(values) {
    const result = await createAnalysis(values);
    navigate(`/analysis/${result.id}`);
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <h1>Market Intelligence</h1>
        <p className="hero-tagline">
          AI-powered site analysis &amp; competitor intelligence
        </p>
      </div>

      <SearchForm onSubmit={handleSubmit} loading={state.loading} />

      <aside className="panel operations-panel">
        <p className="eyebrow">Workflow</p>
        <h2>Analysis pipeline</h2>
        <ol className="pipeline-list">
          <li>Validate request</li>
          <li>Discover nearby competitors</li>
          <li>Enrich place details</li>
          <li>Resolve audience profile (cache or AI)</li>
          <li>Gather demand signals via Google Places</li>
          <li>Calculate demand, supply &amp; opportunity scores</li>
          <li>Generate AI interpretation</li>
          <li>Save &amp; return analysis</li>
        </ol>

        {state.loading && <LoadingSpinner label="Running market analysis" />}
        {state.error && <div className="error-banner">{state.error}</div>}
      </aside>
    </div>
  );
}

export default Dashboard;
