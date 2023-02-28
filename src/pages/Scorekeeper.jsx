import { useParams } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Round from '../components/Round';
import WatchGame from '../components/WatchGame';
import GameContext from '../context/game/GameContext';
import {
  SET_PLAYERS,
  SET_PLAYER_TOTALS,
  SET_CURRENT_ROUND,
  SET_SCORECARD,
  SET_GAME_COMPLETE,
  SET_GAME_STATUS,
  SET_GAME_NAME,
  SET_GAME_ID,
} from '../context/game/GameActionTypes';
import {
  createRoundScore,
  updateGame,
  getGame,
} from '../context/game/GameActions';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../styles/Scorekeeper.css';

function Scorekeeper() {
  const { gameId } = useParams();

  const [nextRoundBtnTxt, setNextRoundBtnTxt] = useState('Next Round');

  const navigate = useNavigate();

  /* TODO: consider rolling up scorecard, playerTotals, and selectedGame 
     into one state object called game
     game would have:
      - game id, game name, and status (everything currently in selectedGame) 
      - gameComplete Bool (gameComplete)
      - currently active round number (currentRound)
      - list of players (players), the array of PlayerScores (scorecard),
      - each players overall score (PlayerTotal.total)
      - Each players current bid (PlayerTotal.currentBid)
   */

  const {
    players,
    scorecard,
    playerTotals,
    currentRound,
    selectedGame,
    dispatch,
  } = useContext(GameContext);

  useEffect(() => {
    if (gameId !== selectedGame.gameId) {
      console.warn('gameId does not match with selectedGame.gameId!');
      console.warn(
        `gameId: ${gameId}. selectedGame.gameId: ${selectedGame.gameId}`
      );
      try {
        getGame(gameId).then((data) => {
          if (data === null) {
            navigate('/skullking-scorecard/game-not-found');
          } else {
            // TODO: This is dumb, players and playerTotals need to become one thing...
            // Whole game object needs to be looked at again along with how its saved on server
            const players = data.playerTotals.map(
              (player) => player.playerName
            );

            dispatch({ type: SET_PLAYERS, payload: players });
            dispatch({ type: SET_SCORECARD, payload: data.scorecard });
            dispatch({ type: SET_PLAYER_TOTALS, payload: data.playerTotals });
            dispatch({ type: SET_CURRENT_ROUND, payload: data.currentRound });
            dispatch({ type: SET_GAME_NAME, payload: data.name });
            dispatch({ type: SET_GAME_ID, payload: data.gameId });
            dispatch({ type: SET_GAME_STATUS, payload: data.status });
          }
        });
      } catch (err) {
        console.warn('error occured while retrieving a game!');
      }
    }

    if (currentRound === 10) {
      setNextRoundBtnTxt('To Summary');
    }

    // we only ever want to run this on first render so ignore lint rule for exhaustive-deps
    // eslint-disable-next-line
  }, []);

  /**
   * Debounce changes made to the scorecard, currentRound, playerTotals, game status, and game id
   * and push these changes to SK API no more than once every 300 ms
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateGame(
        gameId,
        scorecard,
        playerTotals,
        currentRound,
        selectedGame.status
      );
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [scorecard, gameId, currentRound, playerTotals, selectedGame.status]);

  /**
   * Initializes new roundScore objs for each player for a new round.
   * @param {number} roundNumber - The current round number.
   */
  function startRound(roundNumber) {
    const newScoreCard = [...scorecard];

    players.forEach((player) => {
      const newScore = createRoundScore(player, roundNumber, 0, 0, 0, 0);

      newScoreCard.push(newScore);
      //set player's current bid back to zero for the new round
      updatePlayerBid(player, 0);
    });
    dispatch({ type: SET_SCORECARD, payload: newScoreCard });
  }

  /**
   * Changes the round to the next or previous round depending on the event value
   * @param {Event} e - The event that was fired which represents which round button was clicked.
   */
  function changeRound(e) {
    if (e.target.value === 'Next Round') {
      if (currentRound < 10) {
        scorecard
          .filter((round) => round.roundNumber === currentRound)
          .forEach((roundScore) => updateRoundAndPlayerTotal(roundScore));

        dispatch({ type: SET_CURRENT_ROUND, payload: currentRound + 1 });

        const roundNumberExists = (round) =>
          round.roundNumber === currentRound + 1;

        // if scores for next round dont exist, create them
        if (!scorecard.some(roundNumberExists)) {
          startRound(currentRound + 1);
        }

        if (currentRound === 9) {
          setNextRoundBtnTxt('To Summary');
        }
      }
    } else if (e.target.value === 'Previous Round') {
      if (currentRound > 1) {
        dispatch({ type: SET_CURRENT_ROUND, payload: currentRound - 1 });
        setNextRoundBtnTxt('Next Round');
      }
    } else if (e.target.value === 'To Summary') {
      scorecard
        .filter((round) => round.roundNumber === currentRound)
        .forEach((roundScore) => updateRoundAndPlayerTotal(roundScore));

      dispatch({ type: SET_GAME_STATUS, payload: 'FINISHED' });
      dispatch({ type: SET_GAME_COMPLETE, payload: true });

      //update
      updateGame(gameId, scorecard, playerTotals, currentRound, 'FINISHED');
      // nav to summary
      navigate('/skullking-scorecard/summary');
    }
  }

  /**
   * Updates the round score with the new bid value.
   * @param {int} bid - The new bid value.
   * @param {RounDScore} roundScoreToUpdate - The round score obj to be updated.
   */
  function onBidChange(bid, roundScoreToUpdate) {
    if (bid >= 0 && bid <= 10) {
      const newScoreCard = scorecard.map((roundScore) => {
        if (
          roundScore.playerName === roundScoreToUpdate.playerName &&
          roundScore.roundNumber === roundScoreToUpdate.roundNumber
        ) {
          roundScore.bid = bid;
        }
        return roundScore;
      });
      dispatch({ type: SET_SCORECARD, payload: newScoreCard });

      updatePlayerBid(roundScoreToUpdate.playerName, bid);
    }
  }

  /**
   *
   * @param {*} roundScoreToUpdate - The round score obj that needs to be updated.
   */
  function updateRoundAndPlayerTotal(roundScoreToUpdate) {
    let total = 0;

    // calc total
    total = calculateRoundScore(
      roundScoreToUpdate.roundNumber,
      roundScoreToUpdate.bid,
      roundScoreToUpdate.tricks,
      roundScoreToUpdate.bonus
    );

    const newScorecard = scorecard.map((roundScore) => {
      if (
        roundScore.playerName === roundScoreToUpdate.playerName &&
        roundScore.roundNumber === roundScoreToUpdate.roundNumber
      ) {
        roundScore.roundTotal = total;
      }
      return roundScore;
    });

    dispatch({ type: SET_SCORECARD, payload: newScorecard });

    updatePlayerTotal(newScorecard, roundScoreToUpdate.playerName);
  }

  /**
   * Looks through the scorecard to find all of this players scores and adds them up.
   * @param {string} player - The players name.
   */
  function updatePlayerTotal(newScoreCard, playerToUpdate) {
    // filter scorecard array for this players rounds then reduce to a score total
    let totalScore = newScoreCard
      .filter((score) => score.playerName === playerToUpdate)
      .reduce((total, score) => (total += score.roundTotal), 0);

    const newPlayerTotals = [...playerTotals];
    newPlayerTotals.find(
      (player) => player.playerName === playerToUpdate
    ).total = totalScore;

    dispatch({ type: SET_PLAYER_TOTALS, payload: newPlayerTotals });
  }

  /**
   * Updates the playerTotals state with the new bid amount for the given player
   * @param {*} playerToUpdate - name of the player to update
   * @param {*} bid - the new bid amount
   */
  function updatePlayerBid(playerToUpdate, bid) {
    const newPlayerTotals = [...playerTotals];
    newPlayerTotals.find(
      (player) => player.playerName === playerToUpdate
    ).currentBid = bid;
    dispatch({ type: SET_PLAYER_TOTALS, payload: newPlayerTotals });
  }

  /**
   * Calculates the score for one round given a bid, number of tricks taken, and any bonus points.
   * @param {number} bid - The number the player bid for this round.
   * @param {number} tricks - The number of tricks the player took this round.
   * @param {number} bonus - The amout of bonus points the player got this round.
   * @returns The total score for this round.
   */
  function calculateRoundScore(roundNumber, bid, tricks, bonus) {
    let total = 0;

    if (bid === 0 && tricks === 0) {
      total += 10 * roundNumber;
      total += bonus;
    } else if (bid === 0 && tricks !== 0) {
      total -= 10 * roundNumber;
    } else {
      if (bid === tricks) {
        total += 20 * bid;
        total += bonus;
      } else {
        const bidDiff = Math.abs(bid - tricks);
        total -= 10 * bidDiff;
        // if bonues is negative (rascal of rotan bet) need to also take it into account
        if (bonus < 0) {
          total += bonus;
        }
      }
    }
    return total;
  }

  /**
   * Clears round totals for each player on the given round.
   * @param {number} roundNumber - The round to clear.
   */
  function clearRound(roundNumber) {
    const newScoreCard = scorecard.map((score) => {
      if (score.roundNumber === roundNumber) {
        score.bid = 0;
        score.tricks = 0;
        score.bonus = 0;
        score.roundTotal = 0;
        return score;
      } else {
        return score;
      }
    });

    dispatch({ type: SET_SCORECARD, payload: newScoreCard });

    // call updatePlayerTotal for each player and pass updated scorecard
    playerTotals.forEach((player) =>
      updatePlayerTotal(newScoreCard, player.playerName)
    );
  }

  return (
    <div className='content'>
      <Container>
        <h1 className='text-center'>Score Totals</h1>

        <Row xs={2} md={4} className='text-center'>
          {playerTotals.map((playerTotal) => {
            return (
              <Col key={playerTotal.playerName}>
                <h4 className='player-total'>
                  {playerTotal.playerName} : {playerTotal.total}
                </h4>
              </Col>
            );
          })}
        </Row>

        <hr />

        <div className='round-header'>
          <Row xs={3} className='round-row'>
            <Col className='text-center round-col'>
              <input
                type='button'
                className='btn btn-secondary'
                value='Previous Round'
                onClick={changeRound}
              />
            </Col>
            <Col className='text-center round-col'>
              <div className=''>
                <h1 className='round-title'>Round {currentRound}</h1>
              </div>
            </Col>
            <Col className='text-center round-col'>
              <input
                type='button'
                className='btn btn-secondary'
                value={nextRoundBtnTxt}
                onClick={changeRound}
              />
            </Col>
          </Row>
        </div>

        <div className='scores'>
          {scorecard
            .filter((roundScore) => roundScore.roundNumber === currentRound)
            .map((roundScore, index) => (
              <Round
                key={index}
                roundScore={roundScore}
                onBidChange={onBidChange}
                updateRoundAndPlayerTotal={updateRoundAndPlayerTotal}
              />
            ))}
        </div>

        <div className='d-flex justify-content-center'>
          <input
            className='btn btn-danger m-4'
            type='button'
            value='Clear Round Scores'
            onClick={() => clearRound(currentRound)}
          />
        </div>

        <hr />
        <WatchGame gameId={gameId} />
      </Container>
    </div>
  );
}

export default Scorekeeper;
