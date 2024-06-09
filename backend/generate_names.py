import random
import json

# Função para gerar um objeto de jogador com nome completo
def generate_player(player_id):
    first_names = [
        "Alex", "Maria", "John", "Jane", "Robert", "Emily", "Michael", "Sarah", "David", "Anna",
        "Daniel", "Jessica", "James", "Laura", "William", "Sophia", "Joseph", "Linda", "Charles", "Megan"
    ]
    last_names = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
        "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"
    ]
    full_name = f"{random.choice(first_names)} {random.choice(last_names)}"
    player_age = random.randint(18, 70)
    nft_amount = random.randint(0, 100)
    return {
        "player_name": full_name,
        "player_age": player_age,
        "player_id": player_id,
        "nft_amount": nft_amount
    }

# Gerar uma lista de objetos de jogador com nomes completos
players = [generate_player(player_id) for player_id in range(1000)]

# Salvar os objetos de jogador em um arquivo JSON
with open('players.json', 'w') as f:
    json.dump(players, f, indent=4)

# Imprimir os primeiros 20 objetos de jogador para visualização
for player in players[:20]:
    print(player)
