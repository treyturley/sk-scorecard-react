import axios from 'axios';

import { useCallback, useContext, useState, useEffect } from 'react';

import Player from './Player';
import PlayerSetupForm from './PlayerSetup';
import Scorecard from './Scorecard';
import Summary from './Summary';

import GameContext from '../context/game/GameContext';
import { SET_PLAYERTOTALS } from '../context/game/GameActionTypes';

function Game() {
  const [currentRound, setCurrentRound] = useState(1);

  const [playersExist, setPlayersExist] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const { players, scorecard, playerTotals, dispatch } =
    useContext(GameContext);

  let api_endpoint = process.env.REACT_APP_PROD_API;

  if (process.env.NODE_ENV !== 'production') {
    api_endpoint = process.env.REACT_APP_DEV_API;
  }

  // disable all but error logs in prod
  if (process.env.NODE_ENV === 'production') {
    if (!window.console) window.console = {};
    var methods = ['log', 'debug', 'warn', 'info'];
    for (var i = 0; i < methods.length; i++) {
      console[methods[i]] = function () {};
    }
  }

  // TODO: consider rolling up scorecard,playerTotals, and selectedGame into one state object called game
  /* game would have:
     - game id, game name, and status for the game (everything currently in selectedGame) plus gameComplete Bool
     - currently active round number (currentRound)
     - list of players (players), the array of PlayerScores (scorecard),
     - each players overall score (PlayerTotal.total)
     - Each players current bid (PlayerTotal.currentBid)
   */

  const [selectedGame, setSelectedGame] = useState({
    id: '',
    name: '',
    status: '',
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
      this.currentBid = 0;
    }
  }

  /**
   * Pushes the game state to the SK API
   */
  const putGame = useCallback(
    (game) => {
      async function asyncPutGame() {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        try {
          const res = await axios.put(
            `${api_endpoint}/v1/scorecards/${selectedGame.id}`,
            game,
            config
          );
          if (res.status === 200) {
            // success
          } else {
            console.error(
              `Error occured during PUT /v1/scorecards/${selectedGame.id}. Received ${res.status} ${res.statusText}`
            );
          }
        } catch (error) {
          console.error(
            `PUT /v1/scorecards/${selectedGame.id} failed! ${error.message}`
          );
          if (error.response && error.response.status === 400) {
            // TODO: notify the user that this game no longer exists for some reason
            // needs popup message and link to go back to home screen
          }
          // console.error(error);
        }
      }
      asyncPutGame();
    },
    [api_endpoint, selectedGame.id]
  );

  /**
   * Pushes the initial game state to the SK API
   * @param {*} scorecard - the scoreacard to push
   * @param {*} playerTotals
   */
  async function addScorecard(scorecard, playerTotals) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const game = {
      name: selectedGame.name,
      status: 'STARTED',
      scorecard: scorecard,
      playerTotals: playerTotals,
      currentRound: currentRound,
    };

    try {
      const res = await axios.post(
        `${api_endpoint}/v1/scorecards`,
        game,
        config
      );
      if (res.status === 201) {
        setSelectedGame((prevGame) => ({ ...prevGame, id: res.data.id }));
      } else {
        console.error(
          `Error occured on POST ${api_endpoint}/v1/scorecards. Received ${res.status} ${res.statusText}`
        );
      }
    } catch (error) {
      console.error('Error occured during POST /v1/scorecards');
      console.error(error);
    }
  }

  /**
   * Puts the scorecard, status, playerTotals, and current round together
   * and calls putGame to push it to the SK API
   */
  const updateScorecard = useCallback(() => {
    if (scorecard.length > 0 && selectedGame.id !== '') {
      const game = {
        scorecard: scorecard,
        status: selectedGame.status,
        playerTotals: playerTotals,
        currentRound: currentRound,
      };
      putGame(game);
    }
  }, [
    scorecard,
    playerTotals,
    currentRound,
    putGame,
    selectedGame.id,
    selectedGame.status,
  ]);

  /**
   * Debounce changes made to the scorecard and
   * push changes to SK API no more than once every 2 seconds
   */
  useEffect(() => {
    // TODO: recalculate the players total scores?
    const timeoutId = setTimeout(() => {
      updateScorecard();
    }, 250);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [scorecard, updateScorecard]);

  /**
   * Initializes the game by created the player totals and
   * scorecard and then pushes these to SK API
   * @param {*} event - the event that triggered this method
   */
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
    addScorecard(newScoreCard, newPlayerTotals);

    dispatch({ type: 'SET_SCORECARD', payload: newScoreCard });

    dispatch({ type: SET_PLAYERTOTALS, payload: newPlayerTotals });
    setPlayersExist(true);
  };

  if (
    playerType === PlayerTypes.PLAYER_NOT_SET ||
    (playerType === PlayerTypes.SCORE_KEEPER && !playersExist) ||
    (playerType === PlayerTypes.PLAYER && selectedGame.id === '')
  ) {
    return (
      <PlayerSetupForm
        handleSubmit={handlePlayerSetupSubmit}
        playerType={playerType}
        setPlayerType={setPlayerType}
        PlayerTypes={PlayerTypes}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        api_endpoint={api_endpoint}
      />
    );
  } else if (
    playersExist &&
    playerType === PlayerTypes.SCORE_KEEPER &&
    !gameComplete
  ) {
    return (
      <Scorecard
        setGameComplete={setGameComplete}
        PlayerScore={PlayerScore}
        setGameCurrentRound={setCurrentRound}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        api_endpoint={api_endpoint}
      />
    );
  } else if (
    playersExist &&
    playerType === PlayerTypes.SCORE_KEEPER &&
    gameComplete
  ) {
    return (
      <Summary
        setGameComplete={setGameComplete}
        updateScorecard={updateScorecard}
        currentRound={currentRound}
        gameComplete={gameComplete}
        setSelectedGame={setSelectedGame}
      />
    );
  } else if (playerType === PlayerTypes.PLAYER && selectedGame.id !== '') {
    return <Player selectedGame={selectedGame} />;
  }
}

export default Game;
