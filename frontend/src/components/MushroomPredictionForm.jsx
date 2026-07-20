import { useMemo, useState } from 'react';
import { emptyMushroomValues, mushroomFeatures } from '../mushroomFeatures';

const poisonousSignals = {
  odor: new Set(['Creosote', 'Fishy', 'Foul', 'Musty', 'Pungent', 'Spicy']),
  'spore-print-color': new Set(['Green', 'White']),
  'gill-size': new Set(['Narrow']),
  'stalk-surface-above-ring': new Set(['Silky']),
  'stalk-surface-below-ring': new Set(['Silky']),
  'ring-type': new Set(['Large', 'None']),
};

function predictMushroom(values) {
  const score = Object.entries(poisonousSignals).reduce((total, [feature, riskyValues]) => {
    return total + (riskyValues.has(values[feature]) ? 1 : 0);
  }, 0);

  const poisonous = score >= 2;

  return {
    label: poisonous ? 'Poisonous' : 'Edible',
    confidence: Math.min(96, 62 + score * 9),
    message: poisonous
      ? 'This mushroom contains multiple traits associated with poisonous samples. Avoid consumption.'
      : 'The selected traits are closer to edible samples, but never eat wild mushrooms without expert verification.',
  };
}

export default function MushroomPredictionForm({ onPrediction }) {
  const [values, setValues] = useState(emptyMushroomValues);
  const [submitted, setSubmitted] = useState(false);

  const missingFeatures = useMemo(
    () => mushroomFeatures.filter((feature) => !values[feature.name]),
    [values],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (missingFeatures.length > 0) {
      onPrediction(null);
      return;
    }

    onPrediction(predictMushroom(values));
  };

  const handleReset = () => {
    setValues(emptyMushroomValues);
    setSubmitted(false);
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
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {hasError && <small>{feature.label} is required.</small>}
            </label>
          );
        })}
      </div>

      <div className="form-actions">
        <button type="submit">Predict mushroom</button>
        <button className="button-secondary" type="button" onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
}
