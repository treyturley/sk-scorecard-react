import { useState } from "react";
import Round from "./Round"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles/Scorecard.css'
import backgroundVideo from '../video/Sea_Loop.mp4'

function Scorecard({ players }) {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerTotals, setPlayerTotals] = useState([
    {
      playerName: players[0],
      total: 0
    },
    {
      playerName: players[1],
      total: 0
    },
    {
      playerName: players[2],
      total: 0
    },
    {
      playerName: players[3],
      total: 0
    },
  ]);

  const [scorecard, setScorecard] = useState([
    {
      playerName: players[0],
      roundNumber: 1,
      bid: 0,
      tricks: 0,
      bonus: 0,
      roundTotal: 0
    },
    {
      playerName: players[1],
      roundNumber: 1,
      bid: 0,
      tricks: 0,
      bonus: 0,
      roundTotal: 0
    },
    {
      playerName: players[2],
      roundNumber: 1,
      bid: 0,
      tricks: 0,
      bonus: 0,
      roundTotal: 0
    },
    {
      playerName: players[3],
      roundNumber: 1,
      bid: 0,
      tricks: 0,
      bonus: 0,
      roundTotal: 0
    },
  ]);

  const playerScoreTemplate = {
    playerName: "",
    roundNumber: 0,
    bid: 0,
    tricks: 0,
    bonus: 0,
    roundTotal: 0
  }

  /**
   * Initializes new roundScore objs for each player for a new round.
   * @param {number} roundNumber - The current round number.
   */
  function startRound(roundNumber) {
    const newScoreCard = [...scorecard];

    players.forEach(player => {
      // TODO: Figure out why we are doing this for newPlayerScore. Why not just do new PlayerScore()
      let newPlayerScore = JSON.parse(JSON.stringify(playerScoreTemplate));
      newPlayerScore.playerName = player;
      newPlayerScore.roundNumber = roundNumber;
      newScoreCard.push(newPlayerScore);
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
        const roundNumberExists = (round) => round.roundNumber === currentRound + 1;
        if (!scorecard.some(roundNumberExists)) {
          startRound(currentRound + 1);
        }
      }
      scorecard.filter((round) => round.roundNumber === currentRound).forEach((roundScore) => updateRoundAndPlayerTotal(roundScore));
    } else {
      if (currentRound > 1) {
        setCurrentRound(currentRound - 1);
      }
    }
    // Do we want to update score totals when clicking previous or next round?
    // scorecard.filter((round) => round.roundNumber === currentRound).forEach((roundScore) => updateRoundTotal(roundScore));
  }

  /**
   * Updates the round score with the new bid value.
   * @param {int} bid - The new bid value. 
   * @param {RounDScore} roundScoreToUpdate - The round score obj to be updated.
   */
  function onBidChange(bid, roundScoreToUpdate) {
    if (bid >= 0 && bid <= 10) {
      setScorecard(
        scorecard.map((roundScore) =>
          roundScore.playerName === roundScoreToUpdate.playerName
            && roundScore.roundNumber === roundScoreToUpdate.roundNumber
            ? { ...roundScore, bid: bid }
            : roundScore));
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
        scorecard.map((roundScore) =>
          roundScore.playerName === roundScoreToUpdate.playerName
            && roundScore.roundNumber === roundScoreToUpdate.roundNumber
            ? { ...roundScore, tricks: tricks }
            : roundScore));
    }
  }

  /**
   * Updates the bonus amout for the player and round specified in roundScoreToUpdate.
   * @param {*} bonus - The new bonus amout to set in the roundScore
   * @param {*} roundScoreToUpdate - The roundScore obj that will be updated with the new trick count.
   */
  function onBonusChange(bonus, roundScoreToUpdate) {
    if (roundScoreToUpdate.bid === roundScoreToUpdate.tricks) {
      if (bonus >= 0 && bonus <= 200) {
        roundScoreToUpdate.bonus = bonus;
      } else {
        // maybe alert user as to why no update was made
      }
    } else {
      roundScoreToUpdate.bonus = 0;
    }
    
    setScorecard(prevScorecard =>
      prevScorecard.map((score) =>
        score.playerName === roundScoreToUpdate.playerName
          && score.roundNumber === roundScoreToUpdate.roundNumber ? roundScoreToUpdate : score));
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

    // check to see if we need to clear bonus first
    if (roundScoreToUpdate.bid !== roundScoreToUpdate.tricks) {
      roundScoreToUpdate.bonus = 0;
    }

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
      prevScorecard.map((score) => {
        if (score.playerName === roundScoreToUpdate.playerName
          && score.roundNumber === roundScoreToUpdate.roundNumber) {
          return { ...score, roundTotal: total, bonus: roundScoreToUpdate.bonus };
        }
        return score;
      })
    );

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
      total+= bonus;
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

  return (
    <>
      <Container>
        <h1 className='text-center'>Score Totals</h1>
        <Row xs={2} md={4} className='text-center'>
          <Col><h4 className='player-total'>{playerTotals[0].playerName} : {playerTotals[0].total}</h4></Col>
          <Col><h4 className='player-total'>{playerTotals[1].playerName} : {playerTotals[1].total}</h4></Col>
          <Col><h4 className='player-total'>{playerTotals[2].playerName} : {playerTotals[2].total}</h4></Col>
          <Col><h4 className='player-total'>{playerTotals[3].playerName} : {playerTotals[3].total}</h4></Col>
        </Row>
        <hr />

        <div className="round-header">
          <Row xs={3}>
            <Col className='text-center'>
              <div className='round-button'>
                <input type='button' value='Previus Round' onClick={changeRound}></input>
              </div>
            </Col>
            <Col className='text-center'>
              <h1 className='text-center round-title'>Round {currentRound}</h1>
            </Col>
            <Col className='text-center'>
              <div className='round-button'>
                <input type='button' value='Next Round' onClick={changeRound}></input>
              </div>
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
      </Container>

      <video id='scorecard-video' autoPlay loop muted>
        <source src={backgroundVideo} type='video/mp4'></source>
      </video>
    </>
  )
}

export default Scorecard;