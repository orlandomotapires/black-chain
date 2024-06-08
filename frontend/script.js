document.addEventListener('DOMContentLoaded', () => {
    const serverUrl = "http://localhost:5000";
    let playerId;
    let player;

    const startGameBtn = document.getElementById('start-game-btn');
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const playerInfoDiv = document.getElementById('player-info');
    const gameAreaDiv = document.getElementById('game-area');
    const playerDetailsDiv = document.getElementById('player-details');
    const clientHandDiv = document.getElementById('client-hand');
    const handSumP = document.getElementById('hand-sum');
    const messageP = document.getElementById('message');
    const resultDiv = document.getElementById('result');

    startGameBtn.addEventListener('click', async () => {
        playerId = document.getElementById('player-id').value;
        console.log("Player ID entered:", playerId); // Debug log
        player = await fetchPlayerDetails(playerId);
        if (player) {
            playerDetailsDiv.innerHTML = `
                <p>Your name: ${player.player_name}</p>
                <p>Your age: ${player.player_age}</p>
                <p>Your identification: ${player.player_id}</p>
                <p>Your NFT Amount: ${player.nft_amount}</p>
            `;
            gameAreaDiv.style.display = 'block';
            playerInfoDiv.style.display = 'none';
            startGame(playerId);
        } else {
            alert('Player not found');
        }
    });

    hitBtn.addEventListener('click', async () => {
        const gameState = await hit();
        updateGameState(gameState);
        if (gameState.player_hand_sum >= 21){
            const gameState = await stand();
            showResult(gameState);
        }
    });

    standBtn.addEventListener('click', async () => {
        console.log("Stand button clicked"); // Debug log
        const gameState = await stand();
        console.log("Stand response:", gameState); // Debug log
        showResult(gameState);
    });

    newGameBtn.addEventListener('click', async () => {
        gameAreaDiv.style.display = 'none';
        playerInfoDiv.style.display = 'block';
        resultDiv.innerHTML = '';
    
        try {
            await resetGame(playerId);
        } catch (error) {
            console.error('Error resetting game:', error);
        }
    });

    async function fetchPlayerDetails(id) {
        try {
            const response = await fetch(`${serverUrl}/get_player_by_id`, {
                method: 'POST',
                mode: 'cors',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ player_id: id })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching player details:', error);
            return null;
        }
    }
    
    async function startGame(id) {
        try {
            const response = await fetch(`${serverUrl}/start_game`, {
                method: 'POST',
                mode: 'cors',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ player_id: id })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const gameState = await response.json();
            updateGameState(gameState);
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }

    async function hit() {
        try {
            const response = await fetch(`${serverUrl}/client_throw_card`, {
                method: 'GET',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error hitting:', error);
            return null;
        }
    }

    async function stand() {
        try {
            const response = await fetch(`${serverUrl}/stand`, {
                method: 'GET',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error standing:', error);
            return null;
        }
    }

    async function resetGame(playerId) {
        try {
            const response = await fetch(`${serverUrl}/reset_game`, {
                method: 'POST',
                mode: 'cors',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ player_id: playerId })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Game reset successfully');
        } catch (error) {
            throw new Error('Error resetting game:', error);
        }
    }

    function updateGameState(data) {
        if (data) {
            const player_hand = data.player_hand;
            const player_hand_sum = data.player_hand_sum;

            console.log(player_hand)

            clientHandDiv.textContent = `Your hand: ${player_hand}`;
            handSumP.textContent = `Your hand sum: ${player_hand_sum}`;
            messageP.textContent = data.message || "";

            if (player_hand_sum >= 21){
                stop_game()
            }
        }
    }

    function showResult(data) {

        const player_hand = data.player_final_hand;
        const player_hand_sum = data.player_final_hand_sum;

        const dealer_hand = data.dealer_final_hand;
        const dealer_hand_sum = data.dealer_final_hand_sum;

        resultDiv.innerHTML = `
            Your final hand sum: ${player_hand_sum} <br>
            Your final hand: <br> ${player_hand} <br><br>
            
            My final hand sum: ${dealer_hand_sum} <br>
            My final hand: <br> ${dealer_hand}   
        `
        stop_game()
    }

    function stop_game(){
        hitBtn.disabled = 1;
        standBtn.disabled = 1;
        newGameBtn.style.display = 'block';    
    }
});
