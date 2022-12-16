import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameContext from '../context/game/GameContext';
import {
  SET_PLAYERS,
  SET_SCORECARD,
  SET_PLAYER_TOTALS,
  SET_GAME_NAME,
  SET_GAME_ID,
  RESET_GAME_CONTEXT,
} from '../context/game/GameActionTypes';

import {
  createRoundScore,
  createPlayer,
  createGame,
} from '../context/game/GameActions';
import { Button } from 'react-bootstrap';
import '../styles/NewGame.css';

function NewGame() {
  const { players, selectedGame, dispatch } = useContext(GameContext);

  const navigate = useNavigate();

  const [playerCount, setPlayerCount] = useState(4);
  const MIN_PLAYERS = 2;
  const MAX_PLAYERS = 10;

  useEffect(() => {
    // reset gamecontext on first render in case user previously created another game
    dispatch({ type: RESET_GAME_CONTEXT });

    // TODO: how to handle dispatch in useEffect? ignoring for now
    // eslint-disable-next-line
  }, []);

  const handlePlayerCountChange = (event) => {
    setPlayerCount(event.target.value);
  };

  const handleNameChange = (index) => (event) => {
    let newPlayers = [...players];
    newPlayers[index] = event.target.value;
    dispatch({ type: SET_PLAYERS, payload: newPlayers });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let readyToLaunch = true;
    if (selectedGame.name === '') {
      readyToLaunch = false;
    }
    for (let index = 0; index < playerCount; index++) {
      if (!players[index] || players[index] === '') {
        readyToLaunch = false;
      }
    }

    if (readyToLaunch) {
      const playerTotals = [];
      const scoreCard = [];

      players.forEach((player) => {
        const playerScore = createRoundScore(player, 1, 0, 0, 0, 0);
        scoreCard.push(playerScore);

        const playerTotal = createPlayer(player);
        playerTotals.push(playerTotal);
      });

      const gameId = await createGame(scoreCard, playerTotals, selectedGame);

      if (gameId !== -1) {
        dispatch({ type: SET_SCORECARD, payload: scoreCard });
        dispatch({ type: SET_PLAYER_TOTALS, payload: playerTotals });
        dispatch({ type: SET_GAME_ID, payload: gameId });

        navigate(`/skullking-scorecard/scorekeeper/${gameId}`);
      } else {
        // TODO: handle game creation failed.
      }
    } else {
      // TODO: notify user that all fields must be filled
    }
  };

  function createOptions() {
    let rows = [];
    for (let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) {
      rows.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return rows;
  }

  return (
    <div className='content sea-bg-image'>
      <div className='my-container'>
        <div className='title mt-4'>
          <h1>Ship Setup</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='game-name'
            value={selectedGame.name}
            placeholder={selectedGame.name || 'Name'}
            onChange={(e) =>
              dispatch({ type: SET_GAME_NAME, payload: e.target.value })
            }
          />

          <div className='select-player-count'>
            <label htmlFor='SelectPlayerCount'>How Many Sailors?</label>
            <select
              id='SelectPlayerCount'
              name='SelectPlayerCount'
              value={playerCount}
              onChange={handlePlayerCountChange}
            >
              {createOptions()}
            </select>
          </div>

          {Array.from({ length: playerCount }).map((it, i) => (
            <input
              key={i}
              type='text'
              name={`Player ${i + 1}`}
              placeholder={`Sailor ${i + 1}`}
              value={players[i] || ''}
              onChange={handleNameChange(i)}
            />
          ))}

          <div className='d-flex justify-content-center mb-4'>
            <Button type='submit' variant='dark'>
              Set Sail
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewGame;
