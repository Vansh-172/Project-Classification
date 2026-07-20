import { useMemo, useState } from 'react';
import { emptyMushroomValues, mushroomFeatures } from '../data/mushroomFeatures';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

function formatPrediction(apiResult) {
  const label = apiResult.prediction === 'poisonous' ? 'Poisonous' : 'Edible';
  const confidence = apiResult.confidence == null ? null : Math.round(apiResult.confidence * 100);

  return {
    label,
    confidence,
    message: label === 'Poisonous'
      ? 'The trained model classified this mushroom as poisonous. Avoid consumption.'
      : 'The trained model classified this mushroom as edible, but never eat wild mushrooms without expert verification.',
  };
}

export default function MushroomPredictionForm({ onPrediction }) {
  const [values, setValues] = useState(emptyMushroomValues);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const missingFeatures = useMemo(
    () => mushroomFeatures.filter((feature) => !values[feature.name]),
    [values],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setApiError('');

    if (missingFeatures.length > 0) {
      onPrediction(null);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Prediction request failed.');
      }

      onPrediction(formatPrediction(data));
    } catch (error) {
      onPrediction(null);
      setApiError(error.message || 'Unable to reach the prediction API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setValues(emptyMushroomValues);
    setSubmitted(false);
    setApiError('');
    onPrediction(null);
  };

  return (
    <form className="prediction-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <div>
          <span className="eyebrow">Model inputs</span>
          <h2>Mushroom features</h2>
        </div>
        <span className="feature-count">{mushroomFeatures.length} required fields</span>
      </div>

      {submitted && missingFeatures.length > 0 && (
        <div className="validation-banner" role="alert">
          Please select all mushroom features before requesting a prediction.
        </div>
      )}

      {apiError && (
        <div className="validation-banner" role="alert">
          {apiError}
        </div>
      )}

      <div className="feature-grid">
        {mushroomFeatures.map((feature) => {
          const hasError = submitted && !values[feature.name];

          return (
            <label className={`field ${hasError ? 'field--error' : ''}`} key={feature.name}>
              <span>{feature.label}</span>
              <select
                aria-invalid={hasError}
                name={feature.name}
                onChange={handleChange}
                required
                value={values[feature.name]}
              >
                <option value="">Select {feature.label.toLowerCase()}</option>
                {feature.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {hasError && <small>{feature.label} is required.</small>}
            </label>
          );
        })}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Predicting…' : 'Predict mushroom'}
        </button>
        <button className="button-secondary" type="button" onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
}
