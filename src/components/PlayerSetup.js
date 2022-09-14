import '../styles/PlayerSetup.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function PlayerSetupForm({
  players,
  setPlayers,
  handleSubmit,
  playerType,
  setPlayerType,
  PlayerTypes,
  setSelectedGame
}) {

  const [playerCount, setPlayerCount] = useState(4);
  const [activeGames, setActiveGames] = useState([]);

  // TODO: Need to define a min players (2)
  const MAX_PLAYERS = 10;

  useEffect(() => {
    async function getActiveGames() {
      try {
        // TODO: figure out how to handle endpoints. Maybe just hard code once up on Heroku?
        const res = await axios.get(`http://192.168.1.25:5000/api/v1/scorecards`);

        // activeGames = res.data;
        setActiveGames(res.data);

      } catch (error) {
        console.error('Request to get active games failed');
      }
    }
    getActiveGames();
  }, []);

  const handlePlayerCountChange = (event) => {
    setPlayerCount(event.target.value);
  }

  const handleNameChange = index => event => {
    let newArr = [...players];
    newArr[index] = event.target.value;
    setPlayers(newArr);
  }

  function createOptions() {
    let rows = [];
    for (let i = 0; i < MAX_PLAYERS; i++) {
      rows.push(
        <option key={i} value={i + 1}>{i + 1}</option>
      );
    }
    return rows;
  }

  function playerInputRows(numPlayers) {
    let rows = [];
    for (let i = 0; i < numPlayers; i++) {
      rows.push(
        <input
          key={i}
          type="text"
          name={`Player ${i + 1}`}
          placeholder={`Player ${i + 1}`}
          value={players[i] || ""}
          onChange={handleNameChange(i)}
        />
      );
    }
    return rows;
  }

  function listActiveGames(isScoreKeeper = false) {
    let rows = [];

    if (activeGames.length === 0) {
      // some sort of no games message
    } else {
      activeGames.forEach(game => {
        // TODO: wrap this up in card or something nice looking
        if (game.gameStatus === "STARTED") {
          rows.push(
            <h4 key={`${game.id}`}>{game.name} - {game.playerTotals.length} players</h4>
          );

          game.playerTotals.forEach((player) => {
            rows.push(
              <p key={`${game.id}-${player.playerName}`}>{player.playerName} : {player.total}</p>
            );
          });

          if (!isScoreKeeper) {
            rows.push(
              <button
                key={`${game.id}-View`}
                className='btn btn-primary'
                onClick={() => setSelectedGame({ id: game.id, name: game.name })}
              >
                View Game
              </button>
            );
          }
        }
      });
    }
    return rows;
  }

  if (playerType === PlayerTypes.PLAYER_NOT_SET) {
    return (
      <>
        <div className="my-container">
          <h1>Player Setup</h1>
          <h4>Are you the score keeper or a player?</h4>

          <input
            type="button"
            className='btn btn-primary mb-4'
            value={PlayerTypes.SCORE_KEEPER}
            onClick={() => setPlayerType(PlayerTypes.SCORE_KEEPER)}
          />

          <input
            type="button"
            className='btn btn-primary mb-4'
            value={PlayerTypes.PLAYER}
            onClick={() => setPlayerType(PlayerTypes.PLAYER)}
          />
        </div>
      </>

    )
  }
  else if (playerType === PlayerTypes.SCORE_KEEPER) {
    return (
      <>
        <div className="my-container">

          <div className="title">
            <h1>Player Setup</h1>
          </div>

          <div className="select-player-count">
            <label htmlFor="SelectPlayerCount">How Many Players?</label>
            <select
              id='SelectPlayerCount'
              name='SelectPlayerCount'
              value={playerCount}
              onChange={handlePlayerCountChange}>
              {createOptions()}
            </select>
          </div>

          {/* TODO: Need a input field for the game name here somewhere */}

          <form onSubmit={handleSubmit}>
            {playerInputRows(playerCount)}
            <div className="d-flex justify-content-center mb-4">
              <button type="submit" className='btn btn-primary'>Set Sail</button>
            </div>
          </form>

          {/* <h1>Games in Progress</h1> */}
          {/* {listActiveGames(true)} */}

        </div>
      </>

    )
  } else if (playerType === PlayerTypes.PLAYER) {
    return (
      <>
        <div className="my-container">
          <h1>Games in Progress</h1>
          {listActiveGames()}
        </div>
      </>
    )
  }
}

export default PlayerSetupForm;