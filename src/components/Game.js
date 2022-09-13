import { useState } from "react";
import PlayerSetupForm from "./PlayerSetup";
import Scorecard from "./Scorecard";
import Summary from './Summary';

function Game() {
  // some examples of updating state
  // https://stackoverflow.com/questions/54150783/react-hooks-usestate-with-object
  // https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react

  const [players, setPlayers] = useState([]);
  const [scorecard, setScorecard] = useState([]);
  const [playerTotals, setPlayerTotals] = useState([]);

  const [playersExist, setPlayersExist] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const [selectedGame, setSelectedGame] = useState('');

  class PlayerTypes {
    static PLAYER_NOT_SET = 'none';
    static PLAYER = 'Player';
    static SCORE_KEEPER = 'Score Keeper';
  }

  const [playerType, setPlayerType] = useState(PlayerTypes.PLAYER_NOT_SET);

  class PlayerScore {
    constructor(name, roundNumber, bid, tricks, bonus, roundTotal) {
      this.playerName = name;
      this.roundNumber = roundNumber;
      this.bid = bid;
      this.tricks = tricks;
      this.bonus = bonus;
      this.roundTotal = roundTotal;
    }
  }

  class PlayerTotal {
    constructor(name) {
      this.playerName = name;
      this.total = 0;
    }
  }

  const handlePlayerSetupSubmit = (event) => {
    event.preventDefault();
    // TODO: Do some input validation before moving on to the scorecard

    const newPlayerTotals = [...playerTotals];
    const newScoreCard = [...scorecard];

    players.forEach((player) => {
      const playerScore = new PlayerScore(player, 1, 0, 0, 0, 0);
      newScoreCard.push(playerScore);

      const playerTotal = new PlayerTotal(player);
      newPlayerTotals.push(playerTotal);
    });

    setScorecard(newScoreCard);
    setPlayerTotals(newPlayerTotals);
    setPlayersExist(true);
  }

  if (
    (playerType === PlayerTypes.PLAYER_NOT_SET) ||
    (playerType === PlayerTypes.SCORE_KEEPER && !playersExist) ||
    (playerType === PlayerTypes.PLAYER && selectedGame === '')) {
    
    return (
      <PlayerSetupForm
        players={players}
        setPlayers={setPlayers}
        handleSubmit={handlePlayerSetupSubmit}
        playerType={playerType}
        setPlayerType={setPlayerType}
        PlayerTypes={PlayerTypes}
        setSelectedGame={setSelectedGame}
      />
    )

  } else if (playersExist && playerType === PlayerTypes.SCORE_KEEPER && !gameComplete) {
    return (
      <Scorecard
        players={players}
        scorecard={scorecard}
        setScorecard={setScorecard}
        setGameComplete={setGameComplete}
        PlayerScore={PlayerScore}
        playerTotals={playerTotals}
        setPlayerTotals={setPlayerTotals}
      />
    )

  } else if (playersExist && playerType === PlayerTypes.SCORE_KEEPER && gameComplete) {
    return (
      <Summary
        playerTotals={playerTotals}
        scorecard={scorecard}
        setGameComplete={setGameComplete}
      />
    )

  } else if (playerType === PlayerTypes.PLAYER && selectedGame !== '') {
    return (
      <>
      {/* TODO: Implement player view component */}
        <h1> Player View goes here!</h1>
        <p>{`Selected Game was: ${selectedGame}`}</p>
      </>
    )
  }
}

export default Game;