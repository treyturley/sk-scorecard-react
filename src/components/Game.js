import axios from 'axios';
import { useState } from "react";
import Player from './Player';
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

  // TODO: figure out how to toggle this automatically. maybe with env vars?
  // const api_endpoint = 'https://polar-atoll-53052.herokuapp.com
  // const api_endpoint = 'https://localhost:5000'
  
	const api_endpoint = 'http://3.15.44.207:5000'


  // TODO: consider rolling up scorecard,playerTotals, and selectedGame into one state ogject called game
  const [selectedGame, setSelectedGame] = useState({
    id: '',
    name: '',
    status: ''
  });


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

  async function addScorecard(scorecard, playerTotals) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const game = {
      name: selectedGame.name,
      status: "STARTED",
      scorecard: scorecard,
      playerTotals: playerTotals
    }
    try {
      const res = await axios.post(`${api_endpoint}/api/v1/scorecards`, game, config);
      if (res.status === 201) {
        setSelectedGame(prevGame => ({ ...prevGame, id: res.data.id }));
      } else {
        console.error(`Error occured on POST ${api_endpoint}/api/v1/scorecards. Received ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error('Error occured during POST /api/v1/scorecards');
      console.error(error);
    }
  }

  async function updateScorecard() {
    if (scorecard.length > 0 && selectedGame.id !== '') {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const trimmedScorecard = scorecard.filter(score => {
        if (score.bid === 0 && score.tricks === 0 && score.bonus === 0 && score.roundTotal === 0) {
          return null;
        } else {
          return score;
        }
      });
      const game = {
        scorecard: trimmedScorecard,
        playerTotals: playerTotals
      }
      try {
        const res = await axios.put(
          `${api_endpoint}/api/v1/scorecards/${selectedGame.id}`,
          game,
          config);
        if (res.status === 200) {
          // success
        } else {
          console.error(`Error occured during PUT /api/v1/scorecards/${selectedGame.id}. Received ${res.status} ${res.statusText}`);
        }
      } catch (error) {        
        console.error(`PUT /api/v1/scorecards/${selectedGame.id} failed!`);
        console.error(error);
      }
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

    //post to api
    addScorecard(newScoreCard, newPlayerTotals);

    //update state
    setScorecard(newScoreCard);
    setPlayerTotals(newPlayerTotals);
    setPlayersExist(true);
  }

  if (
    (playerType === PlayerTypes.PLAYER_NOT_SET) ||
    (playerType === PlayerTypes.SCORE_KEEPER && !playersExist) ||
    (playerType === PlayerTypes.PLAYER && selectedGame.id === '')) {

    return (
      <PlayerSetupForm
        players={players}
        setPlayers={setPlayers}
        handleSubmit={handlePlayerSetupSubmit}
        playerType={playerType}
        setPlayerType={setPlayerType}
        PlayerTypes={PlayerTypes}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        api_endpoint={api_endpoint}
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
        updateScorecard={updateScorecard}
        selectedGame={selectedGame}
        api_endpoint={api_endpoint}
      />
    )

  } else if (playersExist && playerType === PlayerTypes.SCORE_KEEPER && gameComplete) {
    return (
      <Summary
        playerTotals={playerTotals}
        scorecard={scorecard}
        setGameComplete={setGameComplete}
        updateScorecard={updateScorecard}
      />
    )

  } else if (playerType === PlayerTypes.PLAYER && selectedGame.id !== '') {
    return (
      <Player
        selectedGame={selectedGame}
        api_endpoint={api_endpoint}
      />
    )
  }
}

export default Game;
