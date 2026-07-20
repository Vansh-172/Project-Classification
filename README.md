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

## Model feature mapping

The prediction form is generated from `frontend/src/data/mushroomFeatures.js`, which maps each user-facing input to the feature column prepared in `Vansh_Goyal_Project_Classification.ipynb`. The notebook converts the original single-letter mushroom category codes into readable category names, drops `veil-type`, imputes missing `stalk-root` values with the mode, and trains on all remaining feature columns after one-hot encoding with `pd.get_dummies(X, drop_first=True)`.

The browser sends the human-readable `value` strings listed below to `POST /predict`. The Flask API validates those values, one-hot encodes them, and reindexes the request to the model's training columns before prediction.

| Model field | Form label | Allowed frontend values | Original encoded categories |
| --- | --- | --- | --- |
| `cap-shape` | Cap shape | Bell, Conical, Convex, Flat, Knobbed, Sunken | b=Bell, c=Conical, x=Convex, f=Flat, k=Knobbed, s=Sunken |
| `cap-surface` | Cap surface | Fibrous, Grooves, Scaly, Smooth | f=Fibrous, g=Grooves, y=Scaly, s=Smooth |
| `cap-color` | Cap color | Brown, Buff, Cinnamon, Gray, Green, Pink, Purple, Red, White, Yellow | n=Brown, b=Buff, c=Cinnamon, g=Gray, r=Green, p=Pink, u=Purple, e=Red, w=White, y=Yellow |
| `bruises` | Bruises | Bruises, No Bruises | t=Bruises, f=No Bruises |
| `odor` | Odor | Almond, Anise, Creosote, Fishy, Foul, Musty, None, Pungent, Spicy | a=Almond, l=Anise, c=Creosote, y=Fishy, f=Foul, m=Musty, n=None, p=Pungent, s=Spicy |
| `gill-attachment` | Gill attachment | Attached, Descending, Free, Notched | a=Attached, d=Descending, f=Free, n=Notched |
| `gill-spacing` | Gill spacing | Close, Crowded, Distant | c=Close, w=Crowded, d=Distant |
| `gill-size` | Gill size | Broad, Narrow | b=Broad, n=Narrow |
| `gill-color` | Gill color | Black, Brown, Buff, Chocolate, Gray, Green, Orange, Pink, Purple, Red, White, Yellow | k=Black, n=Brown, b=Buff, h=Chocolate, g=Gray, r=Green, o=Orange, p=Pink, u=Purple, e=Red, w=White, y=Yellow |
| `stalk-shape` | Stalk shape | Enlarging, Tapering | e=Enlarging, t=Tapering |
| `stalk-root` | Stalk root | Bulbous, Club, Cup, Equal, Rhizomorphs, Rooted | b=Bulbous, c=Club, u=Cup, e=Equal, z=Rhizomorphs, r=Rooted; ?=Missing is imputed in the notebook and is not exposed in the form |
| `stalk-surface-above-ring` | Stalk surface above ring | Fibrous, Scaly, Silky, Smooth | f=Fibrous, y=Scaly, k=Silky, s=Smooth |
| `stalk-surface-below-ring` | Stalk surface below ring | Fibrous, Scaly, Silky, Smooth | f=Fibrous, y=Scaly, k=Silky, s=Smooth |
| `stalk-color-above-ring` | Stalk color above ring | Brown, Buff, Cinnamon, Gray, Orange, Pink, Red, White, Yellow | n=Brown, b=Buff, c=Cinnamon, g=Gray, o=Orange, p=Pink, e=Red, w=White, y=Yellow |
| `stalk-color-below-ring` | Stalk color below ring | Brown, Buff, Cinnamon, Gray, Orange, Pink, Red, White, Yellow | n=Brown, b=Buff, c=Cinnamon, g=Gray, o=Orange, p=Pink, e=Red, w=White, y=Yellow |
| `veil-color` | Veil color | Brown, Orange, White, Yellow | n=Brown, o=Orange, w=White, y=Yellow |
| `ring-number` | Ring number | None, One, Two | n=None, o=One, t=Two |
| `ring-type` | Ring type | Cobwebby, Evanescent, Flaring, Large, None, Pendant, Sheathing, Zone | c=Cobwebby, e=Evanescent, f=Flaring, l=Large, n=None, p=Pendant, s=Sheathing, z=Zone |
| `spore-print-color` | Spore print color | Black, Brown, Buff, Chocolate, Green, Orange, Purple, White, Yellow | k=Black, n=Brown, b=Buff, h=Chocolate, r=Green, o=Orange, u=Purple, w=White, y=Yellow |
| `population` | Population | Abundant, Clustered, Numerous, Scattered, Several, Solitary | a=Abundant, c=Clustered, n=Numerous, s=Scattered, v=Several, y=Solitary |
| `habitat` | Habitat | Grasses, Leaves, Meadows, Paths, Urban, Waste, Woods | g=Grasses, l=Leaves, m=Meadows, p=Paths, u=Urban, w=Waste, d=Woods |

`class` is the target (`Edible` or `Poisonous`) rather than a form input. `veil-type` is not included because the notebook removes it before training.
