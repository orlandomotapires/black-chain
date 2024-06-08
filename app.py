from flask import Flask, render_template, request, jsonify, url_for
import xmlrpc.client

app = Flask(__name__, template_folder='./front-end', static_folder='./front-end')

BlackJack = xmlrpc.client.ServerProxy("http://localhost:8000")

@app.route("/")
def index():
    return render_template("index.html", css=url_for('static', filename='styles.css'), js=url_for('static', filename='script.js'))

@app.route("/get_player_by_id", methods=["POST"])
def get_player_by_id():
    data = request.get_json()
    player_id = data["player_id"]
    player = BlackJack.get_player_by_id(int(player_id))
    return jsonify(player)

@app.route("/start_game", methods=["POST"])
def start_game():
    data = request.get_json()
    player_id = data["player_id"]
    result = BlackJack.start_game(int(player_id))
    return jsonify(result)

@app.route("/client_throw_card", methods=["GET"])
def client_throw_card():
    result = BlackJack.client_throw_card()
    return jsonify(result)

@app.route("/stand", methods=["GET"])
def stand():
    result = BlackJack.stand()
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
