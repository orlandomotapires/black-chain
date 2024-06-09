import json

players_json = "./players.json"

class Player:
    def __init__(self, player_name, player_age, player_id, nft_amount):
        self.player_hand = []
        self.player_name = player_name
        self.player_age = player_age
        self.player_id = player_id
        self.nft_amount = nft_amount

    @staticmethod
    def get_player_by_id(player_id):
        with open(players_json, 'r') as file:
            players = json.load(file)
            for player in players:
                if player["player_id"] == player_id:
                    return player
        return None

    @staticmethod
    def get_player_test():
        return Player("Player_test", 57, 12, 96.76)
    
    @staticmethod
    def update_nft_coins(player_id, result):
        ntf_amount = 0
        with open(players_json, 'r') as file:
            players = json.load(file)
            player_found = False
            for player in players:
                if player["player_id"] == player_id:
                    player["nft_amount"] += result * 3
                    ntf_amount = player["nft_amount"]
                    player_found = True

        if player_found:
            with open(players_json, 'w') as file:
                json.dump(players, file, indent=4)
            return ntf_amount   
        else:
            print(f"Player with ID {player_id} not found.")

    def show_details(self):
        return f"Your name: {self.player_name}\n" \
               f"Your age: {self.player_age}\n" \
               f"Your identification: {self.player_id}\n" \
               f"Your NFT Amount: {self.nft_amount}\n"