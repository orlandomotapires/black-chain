# Blackjack Game

This is a simple Blackjack game developed using Flask on the backend and JavaScript on the frontend. The game allows players to play Blackjack and manage their NFTs.

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

2. Go to backend directory using the command.

`````sh
cd backend

````

Then create and activate a virtual environment within the cloned repository:

```sh
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
`````

3. Install the dependencies:

   ```sh
   pip install -r requirements.txt
   ```

   use the cd command to go back to the root directory

```cd ..

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
