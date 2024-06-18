import React, { useState, useEffect } from 'react';
import useCurrentUser from '../stores/useCurrentUser';

function BlackjackGame() {
  const [gameAreaVisible, setGameAreaVisible] = useState(false);
  const [clientHand, setClientHand] = useState([]);
  const [handSum, setHandSum] = useState(0);
  const [message, setMessage] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [newGameVisible, setNewGameVisible] = useState(false);
  const playerId = useCurrentUser((state) => state.playerId);

  const handleStartGame = () => {
    setGameAreaVisible(true);
    setClientHand([]);
    setHandSum(0);
    setMessage('');
    setGameResult(null);
    setNewGameVisible(false);
  };

  useEffect(() => {
    if (playerId) {
      handleStartGame();
    }
  }, [playerId]);

  const handleHit = () => {
    const newCard = Math.floor(Math.random() * 11) + 1;
    const newHand = [...clientHand, newCard];
    setClientHand(newHand);
    const newSum = newHand.reduce((a, b) => a + b, 0);
    setHandSum(newSum);

    if (newSum > 21) {
      setMessage('Bust! You lose.');
      setGameResult('Loss');
      setNewGameVisible(true);
    }
  };

  const handleStand = () => {
    const dealerHand = Math.floor(Math.random() * 11) + 15;
    if (handSum > dealerHand) {
      setMessage('You win!');
      setGameResult('Win');
    } else {
      setMessage('You lose.');
      setGameResult('Loss');
    }
    setNewGameVisible(true);
  };

  const handleNewGame = () => {
    setGameAreaVisible(false);
  };

  return (
    <div className="container">
      <h1>Welcome to Blackjack</h1>
      {!gameAreaVisible && (
        <div id="player-info">
          <p>Enter your Player ID to start the game.</p>
        </div>
      )}
      {gameAreaVisible && (
        <div id="game-area">
          <div id="player-details">
            <p>Player: {playerId}</p>
          </div>
          <div id="game-status">
            <h2>Your Hand:</h2>
            <div id="client-hand">
              {clientHand.map((card, index) => (
                <span key={index}>{card} </span>
              ))}
            </div>
            <p id="hand-sum">Hand Sum: {handSum}</p>
            <p id="message">{message}</p>
          </div>
          <div id="controls">
            <button onClick={handleHit} id="hit-btn">
              HIT
            </button>
            <button onClick={handleStand} id="stand-btn">
              STAND
            </button>
          </div>
          <div id="result">{gameResult && <p>Result: {gameResult}</p>}</div>
          {newGameVisible && (
            <button onClick={handleNewGame} id="new-game-btn">
              New Game
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default BlackjackGame;
