# User-Centric Mobile Addiction Prediction System

A web application that assesses smartphone addiction risk. A user fills in a short questionnaire, the frontend sends the answers to a Flask backend, and the backend returns a risk level (Low, Moderate or High), an estimated addiction percentage and personalised recommendations. The prediction comes from an ensemble of six scikit-learn models.

## Features

- Questionnaire with 20 inputs: age, gender, 16 Yes/No behaviour questions, phone-check frequency and daily gaming hours
- Form validation in the browser, including a check that every question is answered
- Prediction through a Flask REST API (`POST /predict`)
- Six machine learning models combined into an ensemble result
- Overall risk label, addiction percentage and model accuracy in the response
- Risk-specific written recommendations
- Loading spinner, double-submit prevention and a back-to-assessment button
- Responsive layout for desktop and mobile

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, Flask |
| Machine learning | scikit-learn, pandas, NumPy |
| Models | Decision Tree, Random Forest, SVM, Logistic Regression, Naive Bayes, Gradient Boosting |
| Data | CSV files (`Training.csv`, `Testing.csv`) |

## How It Works

```
Questionnaire (browser)
  -> script.js validates the form and sends JSON
  -> POST http://localhost:5001/predict
  -> ml_service.py converts the 20 features (data_processor.py)
  -> six models in ml_models.py predict
  -> ensemble result: risk level, percentage, accuracy
  -> results and recommendations shown on the page
```

The name field is only used for display. It does not affect the prediction.

## Project Structure

```
Mobile-Addiction-Prediction-System/
├── frontend/
│   ├── index.html          # Questionnaire and results page
│   ├── script.js           # Validation, API call, result display
│   └── style.css           # Layout and responsive styling
├── backend/
│   ├── ml_service.py       # Flask API with the scikit-learn models (port 5001)
│   ├── ml_models.py        # The six model implementations
│   ├── data_processor.py   # CSV loading and feature conversion
│   ├── app.py              # Standalone rule-based demo API (port 5000)
│   ├── Training.csv        # Training data
│   ├── Testing.csv         # Evaluation data (1000 records)
│   └── requirements.txt
└── README.md
```

`app.py` is a separate rule-based version that does not train or load real models. The frontend uses `ml_service.py`.

## Dataset

- `Testing.csv` has 1000 records and 23 columns.
- Target classes: `NOT Adicted` (685), `Maybe addicted` (285) and `Adicted` (30). The labels keep the spelling used in the dataset.
- The data is imbalanced, with only about 3% in the high-risk class.
- Source of the data: <describe honestly, for example "collected through a survey" or "public dataset from <name/link>">.

## Run Locally

**Prerequisites:** Python 3.9 or newer, pip

**1. Clone and install**
```
git clone git@github.com:Santhosh-kido/Mobile-Addiction-Prediction-System.git
cd Mobile-Addiction-Prediction-System
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

**2. Start the backend** (`Training.csv` and `Testing.csv` must be in `backend/`)
```
cd backend
python ml_service.py
```
The API runs on http://localhost:5001.

**3. Start the frontend** (in a second terminal)
```
cd frontend
python -m http.server 8000
```
Open http://localhost:8000.

## API

**POST** `/predict`

Request: JSON with the 20 questionnaire fields (age and gaming hours as numbers, the other answers as text).

Response: JSON with the overall risk label, the addiction percentage and the model accuracy.

## Model Results

| Model | Accuracy |
|---|---|
| Decision Tree | <value> |
| Random Forest | <value> |
| SVM | <value> |
| Logistic Regression | <value> |
| Naive Bayes | <value> |
| Gradient Boosting | <value> |

Accuracy is measured on `Testing.csv`. Because the classes are imbalanced, accuracy alone can look better than the model really is.
## Screenshot
<img width="1918" height="945" alt="image" src="https://github.com/user-attachments/assets/9a1daeeb-269a-41ac-9df6-c49fe4caacdb" />
<img width="1918" height="943" alt="image" src="https://github.com/user-attachments/assets/4347b7da-d590-408f-b503-1a0ae4161b2b" />
<img width="1915" height="945" alt="image" src="https://github.com/user-attachments/assets/61acdd26-b754-46e5-bf96-8b9b2afa5f86" />
<img width="1918" height="946" alt="image" src="https://github.com/user-attachments/assets/63ed6ffe-2939-4bcc-94ed-edd318baa7c0" />



## Known Limitations

- The dataset is imbalanced, so the models lean toward the "not addicted" class.
- Reported accuracies are not calibrated probabilities.
- Results are not stored: there is no database and no user login.
- This is a learning project and not a medical or diagnostic tool.

## Future Improvements

- Balance the classes (resampling or class weights) and report precision and recall per class
- Show each model's individual prediction in the UI
- Save a trained model file instead of retraining at startup
- Deploy the backend and frontend online

## Author

**Santhosh R**
B.E. Computer Science and Engineering
[LinkedIn](https://www.linkedin.com/in/santhosh-r10/) | [GitHub](https://github.com/Santhosh-kido)
