from flask import Blueprint, jsonify, render_template, request, url_for
import xmlrpc.client
from flask_cors import CORS

from backend.Player import *

blackjack_bp = Blueprint('blackjack_bp', __name__, template_folder='../frontend')
CORS(blackjack_bp)

BlackJack = xmlrpc.client.ServerProxy("http://localhost:8000")

@blackjack_bp.route("/")
def index():
    return render_template("index.html", css=url_for('static', filename='styles.css'), js=url_for('static', filename='script.js'))

@blackjack_bp.route("/get_player_by_id", methods=["POST"])
def get_player_by_id():
    data = request.get_json()
    player_id = data["player_id"]
    player = Player.get_player_by_id(int(player_id))
    player_return = {
        'player_id': player.player_id,
        'player_name': player.player_name,
        'player_age': player.player_age,
        'nft_amount': player.nft_amount,
    }
    return jsonify(player_return)

@blackjack_bp.route("/start_game", methods=["POST"])
def start_game():
    data = request.get_json()
    player_id = data["player_id"]
    result = BlackJack.start_game(int(player_id))
    return jsonify(result)

@blackjack_bp.route("/client_throw_card", methods=["GET"])
def client_throw_card():
    client_hand = BlackJack.client_throw_card()
    client_hand_sum = BlackJack.client_hand_sum()  # Get the hand sum from the server
    result = {
        'player_hand_sum': client_hand_sum,
        'player_hand': client_hand
    }
    return jsonify(result)

@blackjack_bp.route("/stand", methods=["GET"])
def stand():
    result = BlackJack.get_feed()
    return jsonify(result)

@blackjack_bp.route("/reset_game", methods=["POST"])
def reset_game():
    data = request.get_json()
    player_id = data["player_id"]
    BlackJack.reset_game(int(player_id))
    return jsonify({"status": "game reset"})
