import '../styles/PlayerSetup.css'
import { useState } from 'react';

function PlayerSetupForm({ players, setPlayers, handleSubmit }) {

  const [playerCount, setPlayerCount] = useState(4);

  // TODO: Need to define a min players (2)
  const maxPlayers = 10;

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
    for (let i = 0; i < maxPlayers; i++) {
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

        <form onSubmit={handleSubmit}>
          {playerInputRows(playerCount)}
          <div className="d-flex justify-content-center mb-4">
            <button type="submit" className='btn btn-primary'>Set Sail</button>
          </div>
        </form>

      </div>
    </>
  )
}

export default PlayerSetupForm;