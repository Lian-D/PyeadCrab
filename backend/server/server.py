from flask import Flask
import json

app = Flask(__name__)


@app.route("/")
def landing():
    return json.dumps({"message": "Landing page"})

@app.route("/analyze")
def analyze():
    return json.dumps({"message": "Your program is being analyzed"})