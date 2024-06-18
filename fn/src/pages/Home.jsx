import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useCurrentUser from '../stores/useCurrentUser';

function BlackjackGame() {
  const [gameAreaVisible, setGameAreaVisible] = useState(false);
  const [clientHand, setClientHand] = useState([]);
  const [handSum, setHandSum] = useState(0);
  const [message, setMessage] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const playerId = useCurrentUser((state) => state.player.player_id);

  useEffect(() => {
    if (playerId) {
      handleStartGame(playerId); // Automatically start the game with playerId
    }
  }, [playerId]);

  const handleStartGame = async (playerId) => {
    try {
      const response = await axios.post('http://localhost:5000/start_game',
        { player_id: playerId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  // Add CORS header
          },
        }
      );
      setGameAreaVisible(true);
      setClientHand(response.data.player_hand);
      setHandSum(response.data.player_hand_sum);
      setMessage(response.data.dealer_message);
      setGameResult(null);
    } catch (error) {
      console.error('Error starting the game:', error);
    }
  };

  const handleHit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/client_throw_card', {
        headers: {
          'Access-Control-Allow-Origin': '*',  // Add CORS header
        },
      });
      setClientHand(response.data.player_hand);
      setHandSum(response.data.player_hand_sum);
      setMessage(response.data.dealer_message);

      if (response.data.player_hand_sum > 21) {
        setGameResult('Loss');
      }
    } catch (error) {
      console.error('Error hitting:', error);
    }
  };

  const handleStand = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stand', {
        headers: {
          'Access-Control-Allow-Origin': '*',  // Add CORS header
        },
      });
      setGameResult(response.data.feed);
      setMessage(response.data.winner);
    } catch (error) {
      console.error('Error standing:', error);
    }
  };

  const handleNewGame = () => {
    setGameAreaVisible(false);
    setClientHand([]);
    setHandSum(0);
    setMessage('');
    setGameResult(null);
  };

  return (
    <div className="container">
      <h1>Welcome to Blackjack</h1>
      {gameAreaVisible ? (
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
          {gameResult && (
            <div id="result">
              <p>Result: {gameResult}</p>
              <button onClick={handleNewGame} id="new-game-btn">
                New Game
              </button>
            </div>
          )}
        </div>
      ) : (
        <div id="player-info">
          <p>Starting game...</p>
        </div>
      )}
    </div>
  );
}

export default BlackjackGame;