export default function PredictionResult({ result }) {
  if (!result) {
    return (
      <section className="result-card result-card--empty">
        <span className="result-eyebrow">Prediction</span>
        <h2>Complete the mushroom profile</h2>
        <p>Select every required feature, then run a prediction to see the classification.</p>
      </section>
    );
  }

  const isPoisonous = result.label === 'Poisonous';

  return (
    <section className={`result-card ${isPoisonous ? 'result-card--danger' : 'result-card--safe'}`}>
      <span className="result-eyebrow">Prediction result</span>
      <h2>{result.label}</h2>
      <p>{result.message}</p>
      {result.confidence != null && (
        <>
          <div className="confidence-meter" aria-label={`Confidence ${result.confidence}%`}>
            <span style={{ width: `${result.confidence}%` }} />
          </div>
          <strong>{result.confidence}% confidence</strong>
        </>
      )}
    </section>
  );
}
