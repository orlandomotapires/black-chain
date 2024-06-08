import xmlrpc.client
import os
from Player import Player

# Conecta-se ao servidor RPC
BlackJack = xmlrpc.client.ServerProxy("http://localhost:8000")

# Solicita o ID do jogador
player_id = input("Welcome Stranger! Your Identification, please ")

while True:
    os.system('clear')
    
    # Obtém e exibe os dados do jogador
    player = Player.get_player_by_id(int(player_id))
    if player:
        print("Some information I have about you")
        print(player.show_details())
    else:
        print(f"Player with ID {player_id} not found.")
        continue
    
    # Inicia o jogo com o player_id
    try:
        BlackJack.start_game(int(player_id))
    except ValueError as e:
        print(e)
        continue

    choose = " "

    while choose.upper() != "STAND":
        choose = input("Choose an option HIT or STAND: ")

        while choose.upper() not in ["HIT", "STAND"]:
            print("Incorrect Option! ")
            choose = input("Choose an option HIT or STAND: ")

        if choose.upper() == "HIT":
            BlackJack.client_throw_card()

        os.system('clear')
        print("Your hand:", BlackJack.get_client_hand())
        hand_sum = BlackJack.client_hand_sum()
        print("Your hand sum:", hand_sum)

        print("\n")
        print(BlackJack.get_message(hand_sum))
        print("\n")

    os.system('clear')
    print(BlackJack.get_feed())
    print(BlackJack.get_winner())
    print(BlackJack.show_nft_amount())

    new_game = input("Do you want to play again? (yes/no): ")
    if new_game.lower() != 'yes':
        print("Thanks for your services!")
        break
