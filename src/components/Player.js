import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import { useRef } from 'react';
import SummaryGraph from './SummaryGraph';

function Player({ selectedGame, api_endpoint }) {
  const firstRun = useRef(true);
  const [scorecard, setScorecard] = useState([]);
  const [playerTotals, setPlayerTotals] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameComplete, setGameComplete] = useState("");

  async function getGame() {
    try {
      const res = await axios.get(`${api_endpoint}/v1/scorecards/${selectedGame.id}`);
      if (res.status === 200) {
        setScorecard(res.data[0].scorecard);
        setPlayerTotals(res.data[0].playerTotals);
        setCurrentRound(res.data[0].currentRound);
        if (res.data[0].status === "FINISHED") {
          setGameComplete(true);
        } else {
          setGameComplete(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (firstRun.current) {
      getGame();
      firstRun.current = false;
    }
    const intervalCall = setInterval(() => {
      getGame();
    }, 5000);
    return () => {
      clearInterval(intervalCall);
    };
  });

  return (
    <Container className='mb-4'>
      <h1 className='text-center'>
        {gameComplete ? `Game Finished!` : `Current Round: ${currentRound}`}
      </h1>
      <h2 className='text-center'>Score Totals</h2>
      <Row xs={2} md={4} className='text-center'>
        {playerTotals.map((playerTotal) => {
          return (
            <Col key={playerTotal.playerName}>
              <h4 className='player-total'>
                {playerTotal.playerName} : {playerTotal.total}
              </h4>
            </Col>
          )
        })}
      </Row>

      <hr />

      <Accordion defaultActiveKey='' alwaysOpen className='mb-4'>
        {playerTotals.map((player) => {
          return (
            <Accordion.Item eventKey={player.playerName} key={player.playerName}>
              <Accordion.Header>
                <h4>{player.playerName}{!gameComplete && `: Current Bid ${player.currentBid}`}</h4>
              </Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  <ListGroup.Item>
                    <Row className='text-center' >
                      <Col><strong>Round</strong></Col>
                      <Col>Bid</Col>
                      <Col>Tricks</Col>
                      <Col>Bonus</Col>
                      <Col>Score</Col>
                    </Row>
                    {
                      scorecard
                        .filter((roundScore) => roundScore.playerName === player.playerName)
                        .map((score) => {
                          return (
                            <Row className='text-center' key={`${score.playerName}-${score.roundNumber}`}>
                              <Col><strong>{score.roundNumber}</strong></Col>
                              <Col>{score.bid}</Col>
                              <Col>{score.tricks}</Col>
                              <Col>{score.bonus}</Col>
                              <Col>{score.roundTotal}</Col>
                            </Row>
                          )
                        })
                    }
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          )
        })}
      </Accordion>

      <hr />

      <SummaryGraph
        playerTotals={playerTotals}
        scorecard={scorecard}
        currentRound={currentRound}
        gameComplete={gameComplete}
      />
    </Container>
  )
}

export default Player;