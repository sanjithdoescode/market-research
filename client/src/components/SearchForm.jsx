import { BriefcaseBusiness, MapPin, Radar, Search, Coffee, Utensils, BookOpen, Dumbbell, Shirt, Croissant, Sparkles, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import MapPicker from './MapPicker.jsx';

const initialValues = {
  location: '',
  businessType: '',
  niche: '',
  radius: 5000,
  maxCompetitors: 10
};

const BUSINESS_TILES = [
  { id: 'coffee', label: 'Coffee shop', icon: Coffee, image: '/images/coffee_shop.png' },
  { id: 'restaurant', label: 'Restaurant', icon: Utensils, image: '/images/restaurant.png' },
  { id: 'bookstore', label: 'Bookstore', icon: BookOpen, image: '/images/bookstore.png' },
  { id: 'gym', label: 'Gym', icon: Dumbbell, image: '/images/gym.png' },
  { id: 'boutique', label: 'Clothing boutique', icon: Shirt, image: '/images/boutique.png' },
  { id: 'bakery', label: 'Bakery', icon: Croissant, image: '/images/bakery.png' }
];

function SearchForm({ onSubmit, loading }) {
  const [values, setValues] = useState(initialValues);
  const [selectedTile, setSelectedTile] = useState(null);
  const [nicheSuggestions, setNicheSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);

  function updateField(field, value) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
  }

  // Handle tile selection
  function handleTileSelect(tile) {
    if (tile === 'custom') {
      setSelectedTile('custom');
      updateField('businessType', '');
    } else {
      setSelectedTile(tile.id);
      updateField('businessType', tile.label);
    }
    setNicheSuggestions([]); // Clear suggestions when business type changes
  }

  // Fetch niche suggestions using Mistral AI
  async function fetchNicheSuggestions() {
    if (!values.businessType || values.businessType.trim().length < 2) return;
    
    setLoadingSuggestions(true);
    setSuggestionError(null);
    try {
      const response = await fetch('/api/analysis/niche-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessType: values.businessType,
          location: values.location || undefined
        })
      });
      
      const payload = await response.json();
      if (payload?.success && Array.isArray(payload.data)) {
        setNicheSuggestions(payload.data);
      } else {
        setSuggestionError(payload?.error?.message || 'Failed to fetch suggestions');
      }
    } catch (err) {
      console.error('Niche suggestions fetch failed:', err);
      setSuggestionError('Error calling suggestions API');
    } finally {
      setLoadingSuggestions(false);
    }
  }

  // Fetch suggestions automatically when businessType changes (after typing stop or on tile click)
  useEffect(() => {
    if (selectedTile && selectedTile !== 'custom') {
      fetchNicheSuggestions();
    }
  }, [values.businessType]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...values,
      radius: Number(values.radius),
      maxCompetitors: Number(values.maxCompetitors),
      niche: values.niche.trim() || undefined
    });
  }

  return (
    <form className="search-form panel" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">New analysis</p>
          <h1>Evaluate a launch location</h1>
        </div>
      </div>

      {/* Pinpoint Location (Map Selection) */}
      <div className="field">
        <span>
          <MapPin size={16} aria-hidden="true" />
          Location
        </span>
        <MapPicker
          value={values.location}
          onChange={(val) => updateField('location', val)}
        />
      </div>

      {/* Business Type Tiles */}
      <div className="field">
        <span>
          <BriefcaseBusiness size={16} aria-hidden="true" />
          Business type
        </span>
        <div className="business-tiles-grid">
          {BUSINESS_TILES.map((tile) => {
            const IconComponent = tile.icon;
            const isActive = selectedTile === tile.id;
            return (
              <button
                key={tile.id}
                type="button"
                className={`business-tile ${isActive ? 'active' : ''}`}
                onClick={() => handleTileSelect(tile)}
                style={{ '--tile-bg': `url(${tile.image})` }}
              >
                <div className="business-tile-bg" />
                <div className="business-tile-content">
                  <IconComponent size={24} className="tile-icon" />
                  <span className="tile-label">{tile.label}</span>
                </div>
              </button>
            );
          })}
          
          {/* Custom option tile */}
          <button
            type="button"
            className={`business-tile custom-tile ${selectedTile === 'custom' ? 'active' : ''}`}
            onClick={() => handleTileSelect('custom')}
          >
            <div className="business-tile-content">
              <Plus size={24} className="tile-icon" />
              <span className="tile-label">Custom type</span>
            </div>
          </button>
        </div>

        {/* Input box for Custom Business Type if selected */}
        {selectedTile === 'custom' && (
          <div className="custom-business-input-container fade-in">
            <input
              type="text"
              value={values.businessType}
              onChange={(event) => updateField('businessType', event.target.value)}
              placeholder="Enter custom business type (e.g. Pet Grooming, Laundromat)..."
              required
              minLength={2}
              maxLength={100}
              className="custom-business-input"
            />
          </div>
        )}
      </div>

      {/* Niche Input with AI suggestions */}
      <div className="field">
        <span>Niche (Optional)</span>
        
        {/* Niche Suggestions Section */}
        {values.businessType && values.businessType.trim().length >= 2 && (
          <div className="niche-suggestions-section">
            <div className="suggestions-header">
              <span className="suggestions-title">
                <Sparkles size={12} className="sparkle-icon" />
                AI Niche Suggestions
              </span>
              {!selectedTile || selectedTile === 'custom' ? (
                <button
                  type="button"
                  onClick={fetchNicheSuggestions}
                  disabled={loadingSuggestions}
                  className="suggestions-fetch-btn"
                >
                  {loadingSuggestions ? 'Generating...' : 'Generate with AI'}
                </button>
              ) : null}
            </div>

            {loadingSuggestions && (
              <div className="suggestions-loading-dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                Generating modern niches...
              </div>
            )}

            {suggestionError && (
              <div className="suggestions-error">{suggestionError}</div>
            )}

            {nicheSuggestions.length > 0 && (
              <div className="suggestions-pills">
                {nicheSuggestions.map((suggestion, idx) => {
                  const isSelected = values.niche === suggestion;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`suggestion-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => updateField('niche', suggestion)}
                    >
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <input
          type="text"
          value={values.niche}
          onChange={(event) => updateField('niche', event.target.value)}
          placeholder="Enter a custom niche (e.g. Specialty espresso, Vegan bakery)..."
          maxLength={120}
        />
      </div>

      <div className="form-row">
        <label className="field">
          <span>
            <Radar size={16} aria-hidden="true" />
            Radius
          </span>
          <select value={values.radius} onChange={(event) => updateField('radius', event.target.value)}>
            <option value={1000}>1 km</option>
            <option value={3000}>3 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={25000}>25 km</option>
          </select>
        </label>

        <label className="field">
          <span>Competitors</span>
          <input
            type="number"
            value={values.maxCompetitors}
            onChange={(event) => updateField('maxCompetitors', event.target.value)}
            min={1}
            max={20}
          />
        </label>
      </div>

      <button
        className="primary-button"
        type="submit"
        disabled={loading || !values.location || !values.businessType}
      >
        <Search size={18} aria-hidden="true" />
        {loading ? 'Analyzing' : 'Run analysis'}
      </button>
    </form>
  );
}

export default SearchForm;
