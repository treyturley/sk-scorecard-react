import { useState } from "react";
import Round from "./Round"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles/Scorecard.css'
import Player from './Player';

function Scorecard({
  players,
  scorecard,
  setScorecard,
  setGameComplete,
  PlayerScore,
  playerTotals,
  setPlayerTotals,
  setGameCurrentRound,
  selectedGame,
  setSelectedGame,
  api_endpoint
}) {
  const [currentRound, setCurrentRound] = useState(1);
  const [nextRoundBtnTxt, setNextRoundBtnTxt] = useState("Next Round");

  /**
   * Initializes new roundScore objs for each player for a new round.
   * @param {number} roundNumber - The current round number.
   */
  function startRound(roundNumber) {
    const newScoreCard = [...scorecard];

    players.forEach(player => {
      const newScore = new PlayerScore(player, roundNumber, 0, 0, 0, 0);
      newScoreCard.push(newScore);
      //set player's current bid back to zero for the new round
      updatePlayerBid(player, 0);
    });

    setScorecard(newScoreCard);
  }

  /**
   * Changes the round to the next or previous round depending on the event value
   * @param {Event} e - The event that was fired which represents which round button was clicked. 
   */
  function changeRound(e) {
    if (e.target.value === 'Next Round') {
      if (currentRound < 10) {
        setCurrentRound(currentRound + 1);
        setGameCurrentRound(currentRound + 1);
        const roundNumberExists = (round) => round.roundNumber === currentRound + 1;
        if (!scorecard.some(roundNumberExists)) {
          startRound(currentRound + 1);
        }
        scorecard.filter((round) => round.roundNumber === currentRound).forEach((roundScore) => updateRoundAndPlayerTotal(roundScore));

        if (currentRound === 9) {
          setNextRoundBtnTxt("To Summary");
        }
      }
    } else if (e.target.value === 'Previous Round') {
      if (currentRound > 1) {
        setCurrentRound(currentRound - 1);
        setNextRoundBtnTxt("Next Round");
      }
    } else if (e.target.value === 'To Summary') {
      scorecard.filter((round) => round.roundNumber === currentRound).forEach((roundScore) => updateRoundAndPlayerTotal(roundScore));
      setSelectedGame(prevGame => ({ ...prevGame, status: "FINISHED" }));
      setGameComplete(true);
    }
  }

  /**
   * Updates the round score with the new bid value.
   * @param {int} bid - The new bid value. 
   * @param {RounDScore} roundScoreToUpdate - The round score obj to be updated.
   */
  function onBidChange(bid, roundScoreToUpdate) {
    if (bid >= 0 && bid <= 10) {
      setScorecard(
        scorecard.map((roundScore) => {
          if (roundScore.playerName === roundScoreToUpdate.playerName
            && roundScore.roundNumber === roundScoreToUpdate.roundNumber) {
            roundScore.bid = bid;
          }
          return roundScore;
        }));
      updatePlayerBid(roundScoreToUpdate.playerName, bid)
    }
  }

  /**
   * Updates the target trick count for the player and round specified in roundScoreToUpdate.
   * @param {number} tricks - The new number of tricks to set in the roundScore
   * @param {*} roundScoreToUpdate - The roundScore obj that will be updated with the new trick count.
   */
  function onTrickChange(tricks, roundScoreToUpdate) {
    if (tricks >= 0 && tricks <= 10) {
      setScorecard(
        scorecard.map((roundScore) => {
          if (roundScore.playerName === roundScoreToUpdate.playerName
            && roundScore.roundNumber === roundScoreToUpdate.roundNumber) {
            roundScore.tricks = tricks;
          }
          return roundScore;
        }));
    }
  }

  /**
   * Updates the bonus amout for the player and round specified in roundScoreToUpdate.
   * @param {*} bonus - The new bonus amout to set in the roundScore
   * @param {*} roundScoreToUpdate - The roundScore obj that will be updated with the new trick count.
   */
  function onBonusChange(bonus, roundScoreToUpdate) {
    roundScoreToUpdate.bonus = bonus;
    setScorecard(
      scorecard.map((roundScore) => {
        if (roundScore.playerName === roundScoreToUpdate.playerName
          && roundScore.roundNumber === roundScoreToUpdate.roundNumber) {
          return roundScoreToUpdate;
        }
        return roundScore;
      }));
  }

  /**
   * Updates the round total for the associated player.
   * @param {roundScore} roundScoreToUpdate - The round score obj that needs to be updated.
   */
  function onClickUpdateTotal(roundScoreToUpdate) {
    updateRoundAndPlayerTotal(roundScoreToUpdate);
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
      roundScoreToUpdate.bonus);

    // create a new score card with the updated round score
    let newScoreCard = scorecard.map((roundScore) =>
      roundScore.playerName === roundScoreToUpdate.playerName
        && roundScore.roundNumber === roundScoreToUpdate.roundNumber
        ? { ...roundScore, roundTotal: total, bonus: roundScoreToUpdate.bonus }
        : roundScore);

    // update scorecard with round total and updated bonus
    setScorecard(prevScorecard =>
      prevScorecard.map((roundScore) => {
        if (roundScore.playerName === roundScoreToUpdate.playerName
          && roundScore.roundNumber === roundScoreToUpdate.roundNumber) {
          roundScore.roundTotal = total;
          roundScore.bonus = roundScoreToUpdate.bonus;
        }
        return roundScore;
      }));

    updatePlayerTotal(newScoreCard, roundScoreToUpdate.playerName);
  }

  /**
   * Looks through the scorecard to find all of this players scores and adds them up.
   * @param {string} player - The players name.
   */
  function updatePlayerTotal(newScoreCard, playerToUpdate) {
    // filter scorecard array for this players rounds then reduce to a score total
    let totalScore = newScoreCard.filter((score) => score.playerName === playerToUpdate).reduce((total, score) => total += score.roundTotal, 0);

    const newPlayerTotals = [...playerTotals];
    newPlayerTotals.find((player) => player.playerName === playerToUpdate).total = totalScore;

    setPlayerTotals(newPlayerTotals);
  }

  /**
   * Updates the playerTotals state with the new bid amount for the given player
   * @param {*} playerToUpdate - name of the player to update
   * @param {*} bid - the new bid amount
   */
  function updatePlayerBid(playerToUpdate, bid) {
    const newPlayerTotals = [...playerTotals];
    newPlayerTotals.find((player) => player.playerName === playerToUpdate).currentBid = bid;
    setPlayerTotals(newPlayerTotals);
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

    setScorecard(newScoreCard);

    // call updatePlayerTotal for each player and pass updated scorecard
    playerTotals.forEach(player =>
      updatePlayerTotal(newScoreCard, player.playerName)
    );
  }

  return (
    <>
      <Container>
        <h1 className='text-center'>Score Totals</h1>

        <Row xs={2} md={4} className='text-center'>
          {playerTotals.map((playerTotal) => {
            return (
              <Col key={playerTotal.playerName}>
                <h4 className='player-total'>{playerTotal.playerName} : {playerTotal.total}</h4>
              </Col>
            )
          })}
        </Row>

        <hr />

        <div className="round-header">
          <Row xs={3} className="round-row">
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
          {scorecard.filter(roundScore => roundScore.roundNumber === currentRound)
            .map((roundScore, index) =>
              <Round
                key={index}
                roundScore={roundScore}
                onBidChange={onBidChange}
                onTrickChange={onTrickChange}
                onBonusChange={onBonusChange}
                onClickUpdateTotal={onClickUpdateTotal}
              />
            )}
        </div>

        <div className='d-flex justify-content-center'>
          <input
            className='btn btn-danger m-4'
            type="button"
            value="Clear Round Scores"
            onClick={() => clearRound(currentRound)} />
        </div>

        <hr />
        <Player
          selectedGame={selectedGame}
        />

      </Container>
    </>
  )
}

export default Scorecard;