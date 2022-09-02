import { FormControl, Row, Col, Container, Button, Form } from "react-bootstrap";
import backgroundVideo from '../video/Sea.mp4'
import '../styles/PlayerSetup.css'

function PlayerSetupForm(props) {
  const players = props.players;
  const setPlayers = props.setPlayers;
  const handleSubmit = props.handleSubmit;

  const handleChange = index => event => {
    let newArr = [...players];
    newArr[index] = event.target.value;
    setPlayers(newArr);
  }

  return (
        <Container>
          <Row className="mb-3 justify-content-center">
            <Col></Col>
            <Col sm={4}><h1>Player Setup</h1></Col>
            <Col></Col>
          </Row>
          <Form onSubmit={handleSubmit}>
            {/* TODO: given that we repeat the row element 4 times this
          may be worth extracting into a function or reducing in some other way */}
            <Row sm={3} className="mb-3 justify-content-center">
              <Col>
                <FormControl
                  type="text"
                  name="Player 1"
                  placeholder="Player 1"
                  value={players[0] || ""}
                  onChange={handleChange(0)} />
              </Col>
            </Row>
            <Row sm={3} className="mb-3 justify-content-center">
              <Col>
                <FormControl
                  type="text"
                  name="Player 2"
                  placeholder="Player 2"
                  value={players[1] || ""}
                  onChange={handleChange(1)} />
              </Col>
            </Row>
            <Row sm={3} className="mb-3 justify-content-center">
              <Col>
                <FormControl
                  type="text"
                  name="Player 3"
                  placeholder="Player 3"
                  value={players[2] || ""}
                  onChange={handleChange(2)} />
              </Col>
            </Row>
            <Row sm={3} className="mb-3 justify-content-center">
              <Col>
                <FormControl
                  type="text"
                  name="Player 4"
                  placeholder="Player 4"
                  value={players[3] || ""}
                  onChange={handleChange(3)} />
              </Col>
            </Row>
            <Row xs={1} sm={3} lg={3} className="mb-3 justify-content-center">
              <Col></Col>
              <Col><Button type="submit">Start Game</Button></Col>
              <Col></Col>
            </Row>
          </Form>
            <video id='video' autoPlay loop muted>
              <source src={backgroundVideo} type='video/mp4'></source>
            </video>
        </Container>
  )
}

export default PlayerSetupForm;