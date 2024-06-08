from flask import Flask
from backend.routes import blackjack_bp
from flask_cors import CORS

app = Flask(__name__, static_folder='frontend')
CORS(app)

app.register_blueprint(blackjack_bp, url_prefix="/")

if __name__ == "__main__":
    app.run(debug=True)
