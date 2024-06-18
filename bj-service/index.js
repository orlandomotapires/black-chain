const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Player Class
const playersJson = "./players.json";

class Player {
	static getPlayerById(playerId) {
		const players = JSON.parse(fs.readFileSync(playersJson, "utf8"));
		return players.find((player) => player.player_id === playerId);
	}

	static getPlayerTest() {
		return {
			player_name: "Player_test",
			player_age: 57,
			player_id: 12,
			nft_amount: 96.76,
		};
	}

	static updateNftCoins(playerId, result) {
		const players = JSON.parse(fs.readFileSync(playersJson, "utf8"));
		const player = players.find((p) => p.player_id === playerId);

		if (player) {
			player.nft_amount += result * 3;
			fs.writeFileSync(playersJson, JSON.stringify(players, null, 4));
			return player.nft_amount;
		} else {
			console.log(`Player with ID ${playerId} not found.`);
		}
	}
}

// BlackJack Class
class BlackJack {
	constructor() {
		this.values = {
			2: 2,
			3: 3,
			4: 4,
			5: 5,
			6: 6,
			7: 7,
			8: 8,
			9: 9,
			10: 10,
			A: 1,
			J: 10,
			Q: 10,
			K: 10,
		};

		this.suits = ["Hearts", "Diamonds", "Clubs", "Spades"];

		this.messages = {
			"0-5": [
				"We're just getting started.",
				"Make yourself comfortable.",
				"The journey has just begun.",
			],
			"6-10": [
				"Things are getting interesting.",
				"You're doing well.",
				"The heat is on.",
			],
			"11-15": [
				"Think twice before your next move.",
				"The game is in your hands.",
				"Time to make a smart choice.",
			],
			"16-21": [
				"It looks like we have a winner...",
				"That was a good move!",
				"You're about to win!",
			],
			"22-99": [
				"It seems you have gone over the limit!",
				"You busted!",
				"That was too much!",
			],
		};

		this.digCards = [];
		this.startGame();
	}

	startGame(playerId = null) {
		this.digCards = this.suits.flatMap((suit) =>
			Object.keys(this.values).map((value) => [value, suit])
		);

		if (playerId !== null) {
			this.player = Player.getPlayerById(playerId);
			if (!this.player) {
				throw new Error(`Player with ID ${playerId} not found.`);
			}
		} else {
			this.player = Player.getPlayerTest();
		}

		this.clientHand = [];
		this.dealerHand = this.startDealerHand();
	}

	startDealerHand() {
		const dealerHand = [];
		for (let i = 0; i < 3; i++) {
			const randomIndex = Math.floor(Math.random() * this.digCards.length);
			const randomCard = this.digCards[randomIndex];
			this.digCards.splice(randomIndex, 1);
			dealerHand.push(randomCard);
		}
		return dealerHand;
	}

	getDealerHandSum() {
		let total = this.dealerHand.reduce(
			(sum, card) => sum + this.values[card[0]],
			0
		);
		let aceCount = this.dealerHand.filter((card) => card[0] === "A").length;

		while (aceCount > 0 && total + 10 <= 21) {
			total += 10;
			aceCount--;
		}

		return total;
	}

	getClientHandSum() {
		let total = this.clientHand.reduce(
			(sum, card) => sum + this.values[card[0]],
			0
		);
		let aceCount = this.clientHand.filter((card) => card[0] === "A").length;

		while (aceCount > 0 && total + 10 <= 21) {
			total += 10;
			aceCount--;
		}

		return total;
	}

	defineWinner() {
		const dealerHandSum = this.getDealerHandSum();
		const clientHandSum = this.getClientHandSum();

		if (dealerHandSum > 21 && clientHandSum <= 21) {
			return 1;
		} else if (
			dealerHandSum <= 21 &&
			(dealerHandSum > clientHandSum || clientHandSum > 21)
		) {
			return -1;
		} else if (dealerHandSum === clientHandSum) {
			return 0;
		} else {
			return 1;
		}
	}

	getMessage(handSum) {
		for (const key in this.messages) {
			const [min, max] = key.split("-").map(Number);
			if (handSum >= min && handSum <= max) {
				return this.messages[key][
					Math.floor(Math.random() * this.messages[key].length)
				];
			}
		}
		return "";
	}

	clientThrowCard() {
		const randomIndex = Math.floor(Math.random() * this.digCards.length);
		const randomCard = this.digCards[randomIndex];
		this.digCards.splice(randomIndex, 1);
		this.clientHand.push(randomCard);
		return {
			player_hand_sum: this.getClientHandSum(),
			player_hand: this.clientHand,
			dealer_message: this.getMessage(this.getClientHandSum()),
		};
	}

	getFeed() {
		const result = this.defineWinner();
		const nftAmount = Player.updateNftCoins(this.player.player_id, result);

		if (result === 1) {
			return {
				player_final_hand: this.clientHand,
				player_final_hand_sum: this.getClientHandSum(),
				dealer_final_hand: this.dealerHand,
				dealer_final_hand_sum: this.getDealerHandSum(),
				feed: "You won!",
				winner: "You won!",
				nft_amount: nftAmount,
			};
		} else if (result === 0) {
			return {
				player_final_hand: this.clientHand,
				player_final_hand_sum: this.getClientHandSum(),
				dealer_final_hand: this.dealerHand,
				dealer_final_hand_sum: this.getDealerHandSum(),
				feed: "It's a tie!",
				winner: "It's a tie!",
				nft_amount: nftAmount,
			};
		} else if (result === -1) {
			return {
				player_final_hand: this.clientHand,
				player_final_hand_sum: this.getClientHandSum(),
				dealer_final_hand: this.dealerHand,
				dealer_final_hand_sum: this.getDealerHandSum(),
				feed: "Dealer won!",
				winner: "Dealer won!",
				nft_amount: nftAmount,
			};
		}
	}
}

const gameInstance = new BlackJack();

// Routes
app.post("/start_game", (req, res) => {
	const playerId = req.body.player_id;
	gameInstance.startGame(playerId);
	const initialDeal = gameInstance.clientThrowCard();
	res.json({
		player_hand: initialDeal.player_hand,
		player_hand_sum: initialDeal.player_hand_sum,
		dealer_message: initialDeal.dealer_message,
	});
});

app.get("/client_throw_card", (req, res) => {
	const result = gameInstance.clientThrowCard();
	res.json(result);
});

app.get("/stand", (req, res) => {
	const result = gameInstance.getFeed();
	res.json(result);
});

app.post("/reset_game", (req, res) => {
	const playerId = req.body.player_id;
	gameInstance.startGame(playerId);
	res.json(gameInstance.player);
});

app.put("/update_nft_amount", (req, res) => {
	const result = gameInstance.getWinner();
	res.json(result);
});

// Start server
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
