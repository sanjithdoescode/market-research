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

      {state.loading && (
        <div className="panel fade-in">
          <LoadingSpinner label="Running market analysis" />
        </div>
      )}
      {state.error && <div className="error-banner">{state.error}</div>}
    </div>
  );
}

export default Dashboard;
