import React from 'react';
import { useContext } from 'react';
import SummaryGraph from './SummaryGraph';
import GameContext from '../context/game/GameContext';
import Container from 'react-bootstrap/Container';
import '../styles/Summary.css';

function Summary({
  setGameComplete,
  currentRound,
  gameComplete,
  setSelectedGame,
}) {
  const { scorecard, playerTotals } = useContext(GameContext);

  function onClickBackToScores() {
    //TODO: set current round to 10 instead of going to the first round?
    setGameComplete(false);
    setSelectedGame((prevGame) => ({ ...prevGame, status: 'STARTED' }));
  }

  function getSortedPlayers() {
    let output = null;
    let sortedPlayers = [...playerTotals];

    // TODO: Need to check for ties to ensure correct sizing gets applied

    if (sortedPlayers.length >= 3) {
      output = sortedPlayers
        .sort((a, b) => (a.total < b.total ? 1 : -1))
        .map((player, index) => {
          if (index === 0) {
            //first
            return (
              <li className='first-place' key={player.playerName}>
                {player.playerName} : {player.total}
              </li>
            );
          } else if (index === 1) {
            //second
            return (
              <li className='second-place' key={player.playerName}>
                {player.playerName} : {player.total}
              </li>
            );
          } else if (index === 2) {
            //third
            return (
              <li className='third-place' key={player.playerName}>
                {player.playerName} : {player.total}
              </li>
            );
          } else if (index > 2) {
            return (
              <li className='other-places' key={player.playerName}>
                {player.playerName} : {player.total}
              </li>
            );
          }
          return null;
        });
    } else if (sortedPlayers.length === 2) {
      // handle two player game
      output = sortedPlayers
        .sort((a, b) => (a.total < b.total ? 1 : -1))
        .map((player, index) => {
          if (index === 0) {
            //first
            return (
              <li className='first-place' key={player.playerName}>
                {player.playerName} : {player.total}
              </li>
            );
          } else if (index === 1) {
            //second
            return (
              <li className='second-place' key={player.playerName}>
                {player.playerName} : {player.total}
              </li>
            );
          }
          return null;
        });
    } else {
      // in theory game cant be played with anything less that two players
      console.error(
        `Error occured in function getSortedPlayers. Player count < 2 (${playerTotals.length})`
      );
    }
    return output;
  }

  return (
    <Container className='summary mb-4'>
      <h1 className='d-flex justify-content-center title'>Game Summary</h1>
      <div className='d-flex justify-content-center'>
        <ul className='winners-list'>{getSortedPlayers()}</ul>
      </div>

      <hr />
      <SummaryGraph
        playerTotals={playerTotals}
        scorecard={scorecard}
        currentRound={currentRound}
        gameComplete={gameComplete}
      />
      <hr />

      <div className='d-flex justify-content-center'>
        <button className='btn btn-primary' onClick={onClickBackToScores}>
          Back to Scores
        </button>
      </div>

      {/* TODO: option to delete game from server */}
    </Container>
  );
}

export default Summary;
