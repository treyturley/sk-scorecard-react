import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Round = ({ roundScore, onBidChange, onTrickChange, onBonusChange, onClickUpdateTotal }) => {

  return (
    <div className='mb-4'>
      <Col>
        <Row>
          <Col><h2>Player {roundScore.playerName}</h2></Col>
          <Col></Col>
        </Row>

        <Row xs={3}>
          <Col>
            <h4>Bid: {roundScore.bid}</h4>
          </Col>
          <Col>
            <input type="button" value="Bid -1" onClick={() => onBidChange(roundScore.bid - 1, roundScore)} />
          </Col>
          <Col>
            <input type="button" value="Bid +1" onClick={() => onBidChange(roundScore.bid + 1, roundScore)} />
          </Col>
        </Row>

        <Row xs={3}>
          <Col>
            <h4>Tricks: {roundScore.tricks}</h4>
          </Col>
          <Col>
            <input type="button" value="Tricks -1" onClick={() => onTrickChange(roundScore.tricks - 1, roundScore)} />
          </Col>
          <Col>
            <input type="button" value="Tricks +1" onClick={() => onTrickChange(roundScore.tricks + 1, roundScore)} />
          </Col>
        </Row>

        <Row xs={3}>
          <Col>
            <h4>Bonus: {roundScore.bonus}</h4>
          </Col>
          <Col>
            <input type="button" value="Bonus -10" onClick={() => onBonusChange(roundScore.bonus - 10, roundScore)} />
          </Col>
          <Col>
            <input type="button" value="Bonus +10" onClick={() => onBonusChange(roundScore.bonus + 10, roundScore)} />
          </Col>
        </Row>

        <Row  xs={2}>
          <Col>
            <h4>Round Total: {roundScore.roundTotal}</h4>
          </Col>
          <Col>
          <input type="button" value="Update Totals" onClick={() => onClickUpdateTotal(roundScore)} />
          </Col>
        </Row>

      </Col>
      
    </div>
  )
}

export default Round