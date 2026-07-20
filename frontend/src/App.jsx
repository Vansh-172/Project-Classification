import { useState } from 'react';
import MushroomPredictionForm from './components/MushroomPredictionForm.jsx';
import PredictionResult from './components/PredictionResult.jsx';

export default function App() {
  const [prediction, setPrediction] = useState(null);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Classification dashboard</span>
          <h1>Mushroom edibility predictor</h1>
          <p>
            Enter the same mushroom feature columns prepared in the project notebook to preview
            whether a sample is more likely edible or poisonous.
          </p>
        </div>
      </section>

      <div className="dashboard-grid">
        <MushroomPredictionForm onPrediction={setPrediction} />
        <PredictionResult result={prediction} />
      </div>
    </main>
  );
}
