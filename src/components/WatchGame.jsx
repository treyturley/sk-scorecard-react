import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Container, ListGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import SummaryGraph from './SummaryGraph';

import '../styles/WatchGame.css';

const socketIOEndpoint =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_API_ENDPOINT
    : process.env.REACT_APP_DEV_API_ENDPOINT;

const socket = io(socketIOEndpoint, {
  autoConnect: false,
  path: process.env.REACT_APP_SOCKET_IO_PATH,
});

function WatchGame({ gameId }) {
  const [scorecard, setScorecard] = useState([]);
  const [playerTotals, setPlayerTotals] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameComplete, setGameComplete] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (socket && gameId) {
      socket.connect();

      // on connect, join the game room
      socket.on('connect', () => {
        // join game room and get the current game info
        socket.emit('join-game', gameId, (response) => {
          if (response === 'success') {
            socket.gameId = gameId;
            socket.emit('get-game', gameId, (game) => {
              if (game) {
                setScorecard(game.scorecard);
                setPlayerTotals(game.playerTotals);
                setCurrentRound(game.currentRound);
                if (game.status === 'FINISHED') {
                  setGameComplete(true);
                } else {
                  setGameComplete(false);
                }
              } else {
                // no game found!
                navigate('/skullking-scorecard/game-not-found');
              }
            });
          } else {
            // TODO: error occurred, maybe try again later or use the rest api?
          }
        });
      });

      // on game update event, set the new game state
      socket.on('update-game', (game) => {
        setScorecard(game.scorecard);
        setPlayerTotals(game.playerTotals);
        setCurrentRound(game.currentRound);
        if (game.status === 'FINISHED') {
          setGameComplete(true);
        } else {
          setGameComplete(false);
        }
      });

      socket.on('disconnect', () => {
        console.log('websocket disconnected');
      });

      //cleanup websocket
      return () => {
        socket.off('connect');
        socket.off('update-game');
        socket.off('disconnect');
        socket.close();
      };
    }
    // TODO: figure out if its ok to have navigate in dep array
    // eslint-disable-next-line
  }, [gameId]);

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
          );
        })}
      </Row>

      <hr />

      <Accordion defaultActiveKey='' alwaysOpen className='mb-4'>
        {playerTotals.map((player) => {
          return (
            <Accordion.Item
              eventKey={player.playerName}
              key={player.playerName}
            >
              <Accordion.Header>
                <h4>
                  {player.playerName}
                  {!gameComplete && `: Current Bid ${player.currentBid}`}
                </h4>
              </Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  <ListGroup.Item>
                    <Row className='text-center player-round-header' xs={5}>
                      <Col>
                        <strong>Round</strong>
                      </Col>
                      <Col>Bid</Col>
                      <Col>Tricks</Col>
                      <Col>Bonus</Col>
                      <Col>Score</Col>
                    </Row>
                    {scorecard
                      .filter(
                        (roundScore) =>
                          roundScore.playerName === player.playerName
                      )
                      .map((score) => {
                        return (
                          <Row
                            className='text-center'
                            key={`${score.playerName}-${score.roundNumber}`}
                          >
                            <Col>
                              <strong>{score.roundNumber}</strong>
                            </Col>
                            <Col>{score.bid}</Col>
                            <Col>{score.tricks}</Col>
                            <Col>{score.bonus}</Col>
                            <Col>{score.roundTotal}</Col>
                          </Row>
                        );
                      })}
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          );
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
  );
}

export default WatchGame;
