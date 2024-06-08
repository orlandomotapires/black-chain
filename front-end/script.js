document.addEventListener('DOMContentLoaded', () => {
    const serverUrl = "http://localhost:8000";
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
    
    async function fetchPlayerDetails(id) {
        try {
            const response = await fetch(`${serverUrl}/get_player_by_id`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_id: id })
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
            return await response.json();
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }
    
    async function hit() {
        try {
            const response = await fetch(`${serverUrl}/client_throw_card`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            return await response.json();
        } catch (error) {
            console.error('Error hitting:', error);
        }
    }
    
    async function stand() {
        try {
            const response = await fetch(`${serverUrl}/stand`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            return await response.json();
        } catch (error) {
            console.error('Error standing:', error);
        }
    }
    
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
            await startGame(playerId);
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
    
    function updateGameState(gameState) {
        clientHandDiv.innerHTML = `Your hand: ${gameState.client_hand}`;
        handSumP.innerHTML = `Your hand sum: ${gameState.client_hand_sum}`;
        messageP.innerHTML = gameState.message;
    }
    
    function showResult(gameState) {
        resultDiv.innerHTML = `
            <p>${gameState.feed}</p>
            <p>${gameState.winner}</p>
            <p>New amount of NFTs: ${gameState.nft_amount}</p>
        `;
        newGameBtn.style.display = 'block';
    }
});
