import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from '../stores/useCurrentUser';

function Login() {
  const [playerIdInput, setPlayerIdInput] = useState('');
  const setPlayer = useCurrentUser(state => state.setPlayer);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8001/login', { player_id: playerIdInput });
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        setPlayer(response.data); // Define todas as informações do jogador no Zustand
        navigate('/home');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="playerId">Player ID:</label>
          <input
            type="text"
            id="playerId"
            value={playerIdInput}
            onChange={(e) => setPlayerIdInput(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;