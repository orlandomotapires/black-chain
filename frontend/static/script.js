document.addEventListener("DOMContentLoaded", () => {
	const serverUrl = "http://localhost:8001";
	let playerId;
	let player;

	const startGameButton = document.getElementById("start-game-btn");
	const hitButton = document.getElementById("hit-btn");
	const standButton = document.getElementById("stand-btn");
	const newGameButton = document.getElementById("new-game-btn");
	const playerInfoDiv = document.getElementById("player-info");
	const gameAreaDiv = document.getElementById("game-area");
	const playerDetailsDiv = document.getElementById("player-details");
	const clientHandDiv = document.getElementById("client-hand");
	const handSumParagraph = document.getElementById("hand-sum");
	const messageParagraph = document.getElementById("message");
	const resultDiv = document.getElementById("result");

	startGameButton.addEventListener("click", async () => {
		playerId = document.getElementById("player-id").value;
		console.log("Player ID entered:", playerId);
		player = await fetchPlayerDetails(playerId);
		if (player) {
			playerDetailsDiv.innerHTML = `
							<p>Your name: ${player.player_name}</p>
							<p>Your age: ${player.player_age}</p>
							<p>Your identification: ${player.player_id}</p>
							<p>Your NFT Amount: ${player.nft_amount}</p>
					`;
			gameAreaDiv.style.display = "block";
			playerInfoDiv.style.display = "none";
			startGame(playerId);
		} else {
			alert("Player not found");
		}
	});

	hitButton.addEventListener("click", async () => {
		const gameState = await hit();
		updateGameState(gameState);
		if (gameState.player_hand_sum >= 21) {
			const finalFeed = await stand();
			const finalResult = await updateNFTAmount();
			console.log("New NFT amount:", finalResult);
			showGameResult(finalResult);
			showFinalFeed(finalFeed);
		}
	});

	standButton.addEventListener("click", async () => {
		console.log("Stand button clicked");
		const gameState = await stand();
		console.log("Stand response:", gameState);
		const finalResult = await updateNFTAmount();
		showGameResult(finalResult);
	});

	newGameButton.addEventListener("click", async () => {
		try {
			resetGame(playerId);
			window.location.reload();
		} catch (error) {
			console.error("Error resetting game:", error);
		}
	});

	async function fetchPlayerDetails(id) {
		try {
			const response = await fetch(`${serverUrl}/get_player_by_id`, {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ player_id: id }),
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return await response.json();
		} catch (error) {
			console.error("Error fetching player details:", error);
			return null;
		}
	}

	async function startGame(id) {
		try {
			const response = await fetch(`${serverUrl}/start_game`, {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ player_id: id }),
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const gameState = await response.json();
			updateGameState(gameState);
		} catch (error) {
			console.error("Error starting game:", error);
		}
	}

	async function hit() {
		try {
			const response = await fetch(`${serverUrl}/client_throw_card`, {
				method: "GET",
				mode: "cors",
				headers: { "Content-Type": "application/json" },
			});
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error hitting:", error);
			return null;
		}
	}

	async function stand() {
		try {
			const response = await fetch(`${serverUrl}/stand`, {
				method: "GET",
				mode: "cors",
				headers: { "Content-Type": "application/json" },
			});
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error standing:", error);
			return null;
		}
	}

	async function resetGame(playerId) {
		try {
			const response = await fetch(`${serverUrl}/reset_game`, {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ player_id: playerId }),
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const gameState = await response.json();
			updateGameState(gameState);
			console.log(gameState);
			console.log("Game reset successfully");
		} catch (error) {
			throw new Error("Error resetting game:", error);
		}
	}

	async function updateNFTAmount() {
		try {
			const response = await fetch(`${serverUrl}/update_nft_amount`, {
				method: "PUT",
				mode: "cors",
				headers: { "Content-Type": "application/json" },
			});
			const newNFTAmount = await response.json();
			return newNFTAmount;
		} catch (error) {
			console.error("Error updating NFT amount:", error);
			return null;
		}
	}

	function updateGameState(data) {
		if (data) {
			const playerHand = data.player_hand;
			const playerHandSum = data.player_hand_sum;
			const message = data.dealer_message;

			console.log(playerHand);
			console.log(data);

			clientHandDiv.textContent = `Your hand: ${playerHand}`;
			handSumParagraph.textContent = `Your hand sum: ${playerHandSum}`;
			messageParagraph.textContent = message || "";

			if (playerHandSum >= 21) {
				stopGame();
			}
		}
	}

	function showGameResult(result) {
		const feed = result.feed;
		const newNFTAmount = result.nft_amount;
		const winner = result.winner;

		resultDiv.innerHTML = `
					${feed} <br><br>
					New NFT amount: ${newNFTAmount} <br><br>
					${winner}  
			`;
		stopGame();
	}

	function showFinalFeed(finalFeed) {
		const playerHand = finalFeed.player_final_hand;
		const playerHandSum = finalFeed.player_final_hand_sum;

		const dealerHand = finalFeed.dealer_final_hand;
		const dealerHandSum = finalFeed.dealer_final_hand_sum;

		resultDiv.innerHTML = `
					Your final hand sum: ${playerHandSum} <br>
					Your final hand: <br> ${playerHand} <br><br>
					
					My final hand sum: ${dealerHandSum} <br>
					My final hand: <br> ${dealerHand}   
			`;
		stopGame();
	}

	function stopGame() {
		hitButton.disabled = 1;
		standButton.disabled = 1;
		newGameButton.style.display = "block";
	}
});
async function fetchPlayerDetails(id) {
	try {
		const response = await fetch(`${serverUrl}/get_player_by_id`, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ player_id: id }),
		});
		console.log("Response:", response);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		console.log("Data:", data);
		return data;
	} catch (error) {
		console.error("Error fetching player details:", error);
		return null;
	}
}
