# Project-Classification

Mushroom classification web app with a React frontend and Flask prediction API.

## Backend API

The Flask API loads the trained decision tree from `pred.pkl`, applies the same one-hot encoding layout used in the notebook, and exposes:

- `GET /health` for a simple health check.
- `POST /predict` with all mushroom feature values as JSON. The response contains `prediction` (`edible` or `poisonous`) and `confidence` when the model supports probabilities.

### Run the API

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Frontend

The React app posts completed prediction forms to the API. Set `VITE_API_BASE_URL` if the API is not running on `http://localhost:5000`.

```bash
cd frontend
npm install
npm run dev
```
