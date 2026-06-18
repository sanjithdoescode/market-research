import { BriefcaseBusiness, MapPin, Radar, Search } from 'lucide-react';
import { useState } from 'react';

const initialValues = {
  location: '',
  businessType: '',
  niche: '',
  radius: 5000,
  maxCompetitors: 10
};

function SearchForm({ onSubmit, loading }) {
  const [values, setValues] = useState(initialValues);

  function updateField(field, value) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
  }

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

      <label className="field">
        <span>
          <MapPin size={16} aria-hidden="true" />
          Location
        </span>
        <input
          type="text"
          value={values.location}
          onChange={(event) => updateField('location', event.target.value)}
          placeholder="Downtown Austin, TX"
          required
          minLength={2}
          maxLength={180}
        />
      </label>

      <label className="field">
        <span>
          <BriefcaseBusiness size={16} aria-hidden="true" />
          Business type
        </span>
        <input
          type="text"
          value={values.businessType}
          onChange={(event) => updateField('businessType', event.target.value)}
          placeholder="Coffee shop"
          required
          minLength={2}
          maxLength={100}
        />
      </label>

      <label className="field">
        <span>Niche</span>
        <input
          type="text"
          value={values.niche}
          onChange={(event) => updateField('niche', event.target.value)}
          placeholder="Specialty espresso"
          maxLength={120}
        />
      </label>

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

      <button className="primary-button" type="submit" disabled={loading}>
        <Search size={18} aria-hidden="true" />
        {loading ? 'Analyzing' : 'Run analysis'}
      </button>
    </form>
  );
}

export default SearchForm;
