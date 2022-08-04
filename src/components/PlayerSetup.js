import { useState } from "react";
import { FormControl, Row, Col, Container, Button, Form } from "react-bootstrap";
import ReactDOM from "react-dom/client"

function PlayerSetupForm(props) {
  // const [players, setPlayers] = useState("");
  const players = props.players;
  const setPlayers = props.setPlayers;
  const handleSubmit = props.handleSubmit;

  const handleChange = (event) => {
    const player = event.target.name;
    const name = event.target.value;
    setPlayers(prevPlayers => ({ ...prevPlayers, [player]: name }));
  }

  // this handle submit should really be in a parent component 
  // where player names will be used to setup the scorecard.
  // TODO: move to parent
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(players);
  //   // TODO: some cleanup of player names will be needed. Ex empty players will need to be removed?
  // }

  return (
    <>
      <Container>
        <Row className="mb-3">
          <Col md="auto">
            <h1>Player Setup</h1>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <Row sm={3} className="mb-3">
            <Col>
              <FormControl
              type="text"
              name="player1"
              placeholder="Player 1"
              value={players.player1 || ""}
              onChange={handleChange} />
            </Col>
          </Row>
          <Row sm={3} className="mb-3">
            <Col>
            <FormControl
              type="text"
              name="player2"
              placeholder="Player 2"
              value={players.player2 || ""}
              onChange={handleChange} />
            </Col>
          </Row>
          <Row sm={3} className="mb-3">
            <Col>
            <FormControl
              type="text"
              name="player3"
              placeholder="Player 3"
              value={players.player3 || ""}
              onChange={handleChange} />
            </Col>
          </Row>
          <Row sm={3} className="mb-3">
            <Col>
            <FormControl
              type="text"
              name="player4"
              placeholder="Player 4"
              value={players.player4 || ""}
              onChange={handleChange} />
            </Col>
          </Row>
          <Button type="submit">Start Game</Button>
        </Form>
      </Container>
    </>
  )
}

export default PlayerSetupForm;