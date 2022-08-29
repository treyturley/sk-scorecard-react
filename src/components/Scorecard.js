import { useState } from "react";
import Round from "./Round"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Scorecard({ players }) {
  const [currentRound, setCurrentRound] = useState(1);
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
   * At the start of a round we need to add a roundScore for each player.
   */
  function startRound(roundNumber) {
    let scoresToAdd = [];

    players.forEach(player => {
      let newPlayerScore = JSON.parse(JSON.stringify(playerScoreTemplate));
      newPlayerScore.playerName = player;
      newPlayerScore.roundNumber = roundNumber;
      scoresToAdd = [...scoresToAdd, newPlayerScore];
    });
    console.log(scorecard);
    setScorecard([...scorecard, ...scoresToAdd]);
    console.log(scorecard);
  }

  /**
   * Changes the round to the next or previous round depending on the event value
   * @param {HTML Event} e 
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
    } else {
      if (currentRound > 1) {
        setCurrentRound(currentRound - 1);
      }
    }
  }

  /**
   * 
   * @param {HTML Event} event 
   * @param {} roundScoreToUpdate 
   */
  function onBidChange(event, roundScoreToUpdate) {
    // TODO: bounds checking on the bid
    // a standard game can have bids from 0 to 10
    setScorecard(
      scorecard.map((roundScore) =>
        roundScore.playerName === roundScoreToUpdate.playerName
          && roundScore.roundNumber === roundScoreToUpdate.roundNumber
          ? { ...roundScore, bid: event.target.value }
          : roundScore));
  }

  return (
    <Container>
      <h1 className='text-center'>Score Totals</h1>
      <hr />
      <Row>
        <Col className='text-center'>
          <input type='button' value='Previus Round' onClick={changeRound}></input>
        </Col>
        <Col>
          <h1 className='text-center'>Round {currentRound}</h1>
        </Col>
        <Col className='text-center'>
          <input type='button' value='Next Round' onClick={changeRound}></input>
        </Col>
      </Row>

      {/* This should probably be filter to get just this rounds scores */}
      <div>
        {scorecard.filter(roundScore => roundScore.roundNumber === currentRound)
          .map((roundScore, index) =>
            <Round key={index} roundScore={roundScore} onBidChange={onBidChange} />
          )}
      </div>
    </Container>
  )
}

export default Scorecard;