import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';

function Player({ selectedGame }) {

  const [scorecard, setScorecard] = useState([]);
  const [playerTotals, setPlayerTotals] = useState([]);

  useEffect(() => {
    async function getGame() {
      try {
        const res = await axios.get(`http://192.168.1.25:5000/api/v1/scorecards/${selectedGame.id}`);
        if (res.status === 200) {
          setScorecard(res.data[0].scorecard);
          setPlayerTotals(res.data[0].playerTotals);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getGame();

  }, [selectedGame]);

  return (
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
          )
        })}
      </Row>

      <hr />

      <Accordion defaultActiveKey='' className='mb-4'>
        {playerTotals.map((player) => {
          return (
            <Accordion.Item eventKey={player.playerName} key={player.playerName}>
              <Accordion.Header>
                <h4>Player: {player.playerName}</h4>
              </Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  {
                    scorecard
                      .filter((roundScore) => roundScore.playerName === player.playerName)
                      .map((score) => {
                        return (
                          <ListGroup.Item key={`${score.playername}-${score.roundNumber}`}>
                            {`Round ${score.roundNumber}: ${score.roundTotal}`}
                          </ListGroup.Item>
                        )
                      })
                  }
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          )
        })}
      </Accordion>

    </Container>
  )
}

export default Player;