from flask import Flask
from routes import blackjack_bp
from flask_cors import CORS

app = Flask(
    __name__,
    static_folder="../frontend/static",
    template_folder="../frontend/templates",
)

# Apply CORS to the Blueprint
CORS(blackjack_bp, resources={r"/*": {"origins": "*"}})  # Permitir todas as origens

app.register_blueprint(blackjack_bp, url_prefix="/")

if __name__ == "__main__":
    app.run(debug=True)
