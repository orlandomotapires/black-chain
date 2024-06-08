from flask import Flask, request, jsonify
from Player import *
import random

app = Flask(__name__)

class BlackJack:
    def __init__(self):
        self.values = {'2': 2, '3': 3, '4': 5, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'A': 1, 'J': 10, 'Q': 10, 'K': 10}
        self.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
        self.start_game()
        self.messages = {
            range(0, 6): [
                "We're just getting started.",
                "Make yourself comfortable.",
                "The journey has just begun.",
            ],
            range(6, 11): [
                "Things are getting interesting.",
                "You're doing well.",
                "The heat is on.",
            ],
            range(11, 16): [
                "Think twice before your next move.",
                "The game is in your hands.",
                "Time to make a smart choice.",
            ],
            range(16, 22): [
                "It looks like we have a winner...",
                "That was a good move!",
                "You're about to win!",
            ],
            range(22, 100): [
                "It seems you've gone over the limit!",
                "You busted!",
                "That was too much!",
            ]
        }

    def start_game(self, player_id=None):
        self.dig_cards = [(value, suit) for value in self.values.keys() for suit in self.suits]
        if player_id is not None:
            self.player = Player.get_player_by_id(player_id)
            if self.player is None:
                raise ValueError(f"Player with ID {player_id} not found.")
        else:
            self.player = Player.get_player_test()

        self.client_hand = []
        self.dealer_hand = self.start_dealer_hand()

    def get_message(self, hand_sum):
        for key in self.messages:
            if hand_sum in key:
                return random.choice(self.messages[key])
        return ""

    def get_client_hand(self):
        return self.client_hand

    def client_throw_card(self):
        random_card = random.choice(self.dig_cards)
        self.dig_cards.remove(random_card)
        self.client_hand.append(random_card)
        return {'client_hand': self.client_hand}

    def stand(self):
        return self.define_winner()

    def start_dealer_hand(self):
        dealer_hand = []
        for _ in range(0, 3):
            random_card = random.choice(self.dig_cards)
            self.dig_cards.remove(random_card)
            dealer_hand.append(random_card)
        return dealer_hand

    def dealer_hand_sum(self):
        total = sum(self.values[card[0]] for card in self.dealer_hand)
        ace_count = sum(1 for card in self.dealer_hand if card[0] == 'A')

        while ace_count > 0 and total + 10 <= 21:
            total += 10
            ace_count -= 1

        return total

    def client_hand_sum(self):
        total = sum(self.values[card[0]] for card in self.client_hand)
        ace_count = sum(1 for card in self.client_hand if card[0] == 'A')

        while ace_count > 0 and total + 10 <= 21:
            total += 10
            ace_count -= 1

        return total

    def define_winner(self):
        dealer_hand_sum = self.dealer_hand_sum()
        client_hand_sum = self.client_hand_sum()

        if dealer_hand_sum > 21 and client_hand_sum <= 21:
            return {"feed": "Dealer busted, you won!", "winner": "You won!", "nft_amount": self.player.nft_amount + 1}
        elif dealer_hand_sum <= 21 and (dealer_hand_sum > client_hand_sum or client_hand_sum > 21):
            return {"feed": "Dealer's hand is stronger, you lost!", "winner": "Dealer won!", "nft_amount": self.player.nft_amount - 1}
        elif dealer_hand_sum == client_hand_sum:
            return {"feed": "It's a tie!", "winner": "It's a tie!", "nft_amount": self.player.nft_amount}
        else:
            return {"feed": "Your hand is stronger, you won!", "winner": "You won!", "nft_amount": self.player.nft_amount + 1}
    
    def get_feed(self):
        feed_string = ""
        feed_string += "Your final hand: {}\n".format(self.client_hand)
        feed_string += "Your final hand sum: {}\n".format(self.client_hand_sum())
        feed_string += "My final hand: {}\n".format(self.dealer_hand)
        feed_string += "My final hand sum: {}\n".format(self.dealer_hand_sum())
        return feed_string
    
    def get_winner(self):
        result = self.define_winner()
        if result == 1:
            Player.get_update_nft_coins(self.player.player_id, 1)
            return "You won!"
        elif result == 0:
            Player.get_update_nft_coins(self.player.player_id, 0)
            return "Draw!"
        elif result == -1:
            Player.get_update_nft_coins(self.player.player_id, -1)
            return "I won!"
    
    def show_nft_amount(self):
        player = Player.get_player_by_id(self.player.player_id)
        return f"New amount of NFTs:  {player.nft_amount}"

blackjack = BlackJack()

@app.route("/start_game", methods=["POST"])
def start_game():
    data = request.get_json()
    player_id = data.get("player_id")
    blackjack.start_game(player_id)
    return jsonify(success=True)

@app.route("/client_throw_card", methods=["POST"])
def client_throw_card():
    response = blackjack.client_throw_card()
    return jsonify(response)

@app.route("/stand", methods=["POST"])
def stand():
    response = blackjack.stand()
    return jsonify(response)

@app.route("/get_feed", methods=["GET"])
def get_feed():
    response = blackjack.get_feed()
    return jsonify(feed=response)

@app.route("/get_winner", methods=["GET"])
def get_winner():
    response = blackjack.get_winner()
    return jsonify(winner=response)

@app.route("/show_nft_amount", methods=["GET"])
def show_nft_amount():
    response = blackjack.show_nft_amount()
    return jsonify(nft_amount=response)

if __name__ == "__main__":
    print("Let the game begin!")
    app.run(debug=True, port=8000)
