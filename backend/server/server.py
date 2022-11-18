from flask import Flask
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route("/")
def landing():
    return json.dumps({"message": "Landing page"})

@app.route("/analyze")
def analyze():
    return json.dumps({"message": "Your program is being analyzed"})