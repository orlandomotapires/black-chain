import json
players_txt = "./backend/players.txt"

class Player:
    def __init__(self, player_name, player_age, player_id, nft_amount):
        self.player_hand = []
        self.player_name = player_name
        self.player_age = player_age
        self.player_id = player_id
        self.nft_amount = nft_amount

    @staticmethod
    def get_player_by_id(player_id):
        with open(players_txt, 'r') as file:
            for linha in file:
                try:
                    player = json.loads(linha.strip())
                    if player["player_id"] == player_id:
                        return Player(player["player_name"], player["player_age"], player["player_id"], player["nft_amount"])
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON: {e}")
        return None

    @staticmethod
    def get_player_test():
        return Player("Player_test", 57, 12, 96.76)
    
    @staticmethod
    def get_update_nft_coins(player_id, result):
        players = []
        player_found = False

        with open(players_txt, 'r') as file:
            for linha in file:
                try:
                    player = json.loads(linha.strip())
                    if player["player_id"] == player_id:
                        player["nft_amount"] += result * 3
                        player_found = True
                    players.append(player)
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON: {e}")

        if player_found:
            with open(players_txt, 'w') as file:
                for player in players:
                    file.write(json.dumps(player) + '\n')
        else:
            print(f"Player with ID {player_id} not found.")

    def show_details(self):
        return f"Your name: {self.player_name}\n" \
               f"Your age: {self.player_age}\n" \
               f"Your identification: {self.player_id}\n" \
               f"Your NFT Amount: {self.nft_amount}\n"