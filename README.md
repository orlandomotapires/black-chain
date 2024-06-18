# Blackjack Game

This is a simple Blackjack game developed using Flask on the backend and JavaScript on the frontend. The game allows players to play Blackjack and manage their NFTs.

The game begins with the player receiving two cards from a standard 52-card deck. The Dealer (House) also receives two cards, but only one of the Dealer's cards is visible to the player. The round starts with the player having a total score based on the sum of their two cards, where the value of each card is equal to its number, face cards (King, Queen, Jack) are worth 10 points, and the Ace can be worth either 1 or 11 points.

The objective of the game is to beat the Dealer by drawing cards and increasing your score as close to 21 as possible without exceeding it. If the player exceeds 21 points, they automatically lose, and the same rule applies to the Dealer. After the player decides to stop drawing cards or busts (exceeds 21), it is the Dealer's turn. The Dealer will draw cards until they reach 21 or as close to it as possible without busting.

If the Dealer busts or stops drawing with a total that is lower than the player's total (but not exceeding 21), the player wins. Conversely, if the Dealer's total is closer to 21 than the player's, the Dealer wins. In either case, the hand is then reset for the next round.

## Project Structure

- `backend/`
  - `Player.py`: Defines the `Player` class to manage players.
  - `blackjack.py`: Implements the XML-RPC server that manages the game logic.

- `frontend/`
  - `index.html`: Main HTML file.
  - `styles.css`: CSS file to style the game interface.
  - `script.js`: JavaScript file for frontend logic.

- `app.py`: Main Flask file to start the web server.

## Setup and Execution

### Requirements

- Python 3.8+
- Flask
- Flask-CORS

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/orlandomotapires/black-chain.git
   ```

2. Create and activate a virtual environment within the cloned repository:

   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the dependencies:

   ```sh
   pip install -r requirements.txt
   ```

### Server Execution

1. Start the XML-RPC server on one terminal:

   ```sh
   bash up_backend.sh
   ```

2. In another terminal with venv environment activated, start the Flask server:

   ```sh
   bash up_frontend.sh
   ```

3. Open a web browser and access `http://localhost:5000` to play the game.

## Features

- Start the game with a player ID.
- View player details.
- Play Blackjack (HIT and STAND).
- Check the game result.
- Reset the game for a new round.

## API Routes

- `GET /`: Main route to load the game page.
- `POST /get_player_by_id`: Get player details by ID.
- `POST /start_game`: Start a new game for the player.
- `GET /client_throw_card`: Add a card to the player's hand.
- `GET /stand`: Finish the player's turn and calculate the result.
- `POST /reset_game`: Reset the game for the player.

## Contribution

Feel free to contribute with improvements or fixes. To contribute:

1. Fork the repository.
2. Create a branch for your feature (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add a new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This README.md covers the project structure, setup and execution instructions, main features, API routes, and contribution information. Adjust as needed to better reflect your project.
