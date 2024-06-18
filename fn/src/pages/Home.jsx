import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getPlayer from '../stores/useCurrentUser';
import './Home.css'; // Import CSS

function BlackjackGame() {
  const [gameAreaVisible, setGameAreaVisible] = useState(false);
  const [clientHand, setClientHand] = useState([]);
  const [handSum, setHandSum] = useState(0);
  const [dealerHand, setDealerHand] = useState([]);
  const [dealerHandSum, setDealerHandSum] = useState(0);
  const [message, setMessage] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [nftAmount, setNftAmount] = useState(0);
  const player = getPlayer();

  useEffect(() => {
    const playerId = player.player_id;
    if (playerId !== '') {
      handleStartGame(playerId);
    }
  }, [player]);

  const handleStartGame = async (playerId) => {
    try {
      const response = await axios.post('http://localhost:5001/start_game',
        { player_id: playerId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
      setGameAreaVisible(true);
      setClientHand(response.data.player_hand);
      setHandSum(response.data.player_hand_sum);
      setMessage(response.data.dealer_message);
      setGameResult(null);
      setNftAmount(player.nft_amount); // Set initial NFT amount
    } catch (error) {
      console.error('Error starting the game:', error);
    }
  };

  const handleHit = async () => {
    try {
      const response = await axios.get('http://localhost:5001/client_throw_card', {
        headers: {
          'Access-Control-Allow-Origin': '*',
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
      const response = await axios.get('http://localhost:5001/stand', {
        headers: {
          'Access-Control-Allow-Origin': '*',  // Add CORS header
        },
      });
      setClientHand(response.data.player_final_hand);
      setHandSum(response.data.player_final_hand_sum);
      setDealerHand(response.data.dealer_final_hand);
      setDealerHandSum(response.data.dealer_final_hand_sum);
      setMessage(response.data.feed);

      // Display the game result and update NFT amount
      setGameResult(response.data.winner);
      setNftAmount(response.data.nft_amount);
    } catch (error) {
      console.error('Error standing:', error);
    }
  };

  const handleNewGame = () => {
    setGameAreaVisible(false);
    setClientHand([]);
    setHandSum(0);
    setDealerHand([]);
    setDealerHandSum(0);
    setMessage('');
    setGameResult(null);
    handleStartGame(player.player_id); // Start a new game without resetting NFT amount
  };

  return (
    <div className="container">
      <h1>Welcome to Blackjack</h1>
      <div id="player-details">
        <p>Player: {player.player_name}</p>
        <p>NFT Amount: {nftAmount}</p>
      </div>
      {gameAreaVisible ? (
        <div id="game-area">
          <div id="game-status">
            <h2>Your Hand:</h2>
            <div id="client-hand">
              {clientHand.length > 0 && clientHand.map((card, index) => (
                <span key={index}>{card[0]} of {card[1]}</span>
              ))}
            </div>
            <p id="hand-sum">Hand Sum: {handSum}</p>
            <h2>Dealer's Hand:</h2>
            <div id="dealer-hand">
              {dealerHand.length > 0 && dealerHand.map((card, index) => (
                <span key={index}>{card[0]} of {card[1]}</span>
              ))}
            </div>
            <p id="dealer-hand-sum">Dealer Hand Sum: {dealerHandSum}</p>
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
