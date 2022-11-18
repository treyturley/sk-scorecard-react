import { Container, Row, Col } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h4>Skull King Scorecard</h4>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <a href="/skullking-scorecard">New Game</a>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <a href="https://cdn.shopify.com/s/files/1/0565/3230/4053/files/sk_rulebook_optimized.pdf?v=1652992950" target="_blank" rel="noreferrer">Rules</a>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <a href="/" >treyturley.com</a>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer;