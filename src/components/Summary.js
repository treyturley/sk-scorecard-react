import React from 'react'

function Summary({playerTotals, scorecard}){
  return (
    <>
      <h1>Game Summary</h1>
      <ul>
        {playerTotals.map((player) =>
          <li key={player.playerName}>{player.playerName} : {player.total}</li>
        )}
      </ul>
    </>
  )
}

export default Summary;