from flask import Flask, jsonify, request
from flask_cors import CORS
import xmlrpc.client
from Player import *
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

# Connection to the XML-RPC Blackjack server
BlackJack = xmlrpc.client.ServerProxy("http://localhost:8000")

@app.route("/start_game", methods=["POST"])
def start_game():
    data = request.get_json()
    player_id = data['player_id']
    result = BlackJack.start_game(int(player_id))
    return jsonify(result)

@app.route("/client_throw_card", methods=["GET"])
def client_throw_card():
    client_hand = BlackJack.client_throw_card()
    client_hand_sum = BlackJack.client_hand_sum()
    dealer_message = BlackJack.get_message(client_hand_sum)
    result = {
        "player_hand_sum": client_hand_sum,
        "player_hand": client_hand,
        "dealer_message": dealer_message,
    }
    return jsonify(result)

@app.route("/stand", methods=["GET"])
def stand():
    result = BlackJack.get_feed()
    return jsonify(result)

@app.route("/reset_game", methods=["POST"])
def reset_game():
    data = request.get_json()
    player_id = data["player_id"]
    result = BlackJack.start_game(int(player_id))
    return jsonify(result)

@app.route("/update_nft_amount", methods=["PUT"])
def update_nft_amount():
    result = BlackJack.get_winner()
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)