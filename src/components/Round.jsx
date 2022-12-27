import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import '../styles/Round.css';

function Round({ roundScore, onBidChange, updateRoundAndPlayerTotal }) {
  return (
    <>
      <Card className='mb-3'>
        <Card.Header>
          <Row className='align-items-center'>
            <Col>
              <h2>Player: {roundScore.playerName}</h2>
            </Col>
          </Row>
        </Card.Header>

        <ListGroup variant='flush'>
          <ListGroup.Item>
            <Row xs={3} className='align-items-center'>
              <Col>
                <h4>Bid: {roundScore.bid}</h4>
              </Col>
              <Col>
                <input
                  type='button'
                  className='btn btn-dark'
                  value='Bid  -1'
                  onClick={() => onBidChange(roundScore.bid - 1, roundScore)}
                />
              </Col>
              <Col>
                <input
                  type='button'
                  className='btn btn-dark'
                  value='Bid  +1'
                  onClick={() => onBidChange(roundScore.bid + 1, roundScore)}
                />
              </Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row xs={3} className='align-items-center'>
              <Col>
                <h4>Tricks: {roundScore.tricks}</h4>
              </Col>
              <Col>
                <input
                  type='button'
                  className='btn btn-dark'
                  value='Tricks  -1'
                  onClick={() => {
                    if (roundScore.tricks > 0 && roundScore.tricks <= 10) {
                      roundScore.tricks -= 1;
                      updateRoundAndPlayerTotal(roundScore);
                    }
                  }}
                />
              </Col>
              <Col>
                <input
                  type='button'
                  className='btn btn-dark'
                  value='Tricks  +1'
                  onClick={() => {
                    if (roundScore.tricks >= 0 && roundScore.tricks < 10) {
                      roundScore.tricks += 1;
                      updateRoundAndPlayerTotal(roundScore);
                    }
                  }}
                />
              </Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row xs={3} className='align-items-center'>
              <Col>
                <h4 className='bonus-header'>Bonus: {roundScore.bonus}</h4>
              </Col>
              <Col>
                <input
                  type='button'
                  className='btn btn-dark'
                  value='Bonus  -10'
                  onClick={() => {
                    if (roundScore.bonus > 0) {
                      roundScore.bonus -= 10;
                      updateRoundAndPlayerTotal(roundScore);
                    }
                  }}
                />
              </Col>
              <Col>
                <input
                  type='button'
                  className='btn btn-dark'
                  value='Bonus  +10'
                  onClick={() => {
                    roundScore.bonus += 10;
                    updateRoundAndPlayerTotal(roundScore);
                  }}
                />
              </Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row xs={2} className='align-items-center'>
              <Col>
                <h4 className='round-total-header'>
                  Round Total: {roundScore.roundTotal}
                </h4>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </>
  );
}

export default Round;
