document.addEventListener('DOMContentLoaded', () => {
    const serverUrl = "http://localhost:5000"; // Alterado para a porta padrão do Flask
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
    });

    standBtn.addEventListener('click', async () => {
        const gameState = await stand();
        updateGameState(gameState);
        showResult(gameState);
    });

    newGameBtn.addEventListener('click', () => {
        gameAreaDiv.style.display = 'none';
        playerInfoDiv.style.display = 'block';
        resultDiv.innerHTML = '';
    });

    async function fetchPlayerDetails(id) {
        try {
            const response = await fetch(`${serverUrl}/get_player_by_id?player_id=${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching player details:', error);
        }
    }

    async function startGame(id) {
        try {
            const response = await fetch(`${serverUrl}/start_game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_id: id })
            });
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
                headers: { 'Content-Type': 'application/json' }
            });
            return await response.json();
        } catch (error) {
            console.error('Error hitting:', error);
        }
    }

    async function stand() {
        try {
            const response = await fetch(`${serverUrl}/stand`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            return await response.json();
        } catch (error) {
            console.error('Error standing:', error);
        }
    }

    function updateGameState(data) {
        const playerHand = data.client_hand.join(", ");
        const handSum = data.client_hand_sum;
        clientHandDiv.textContent = `Your hand: ${playerHand}`;
        handSumP.textContent = `Your hand sum: ${handSum}`;
        messageP.textContent = data.message || "";
        hitBtn.disabled = data.game_over;
        standBtn.disabled = data.game_over;
    }

    function showResult(data) {
        resultDiv.innerHTML = `
            <p>${data.feed}</p>
            <p>${data.winner}</p>
            <p>New amount of NFTs: ${data.nft_amount}</p>
        `;
        newGameBtn.style.display = 'block';
    }
});
