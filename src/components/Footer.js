import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <div className="main-footer">
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h4>Skull King Scorecard</h4>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Link to={'/'} style={{textDecoration:'none'}}>Home</Link>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
          <a href="https://www.flaticon.com/free-icons/shipwreck" title="shipwreck icons" style={{ textDecoration: 'none', fontSize: '.75em' }}>Shipwreck icons created by Eucalyp - Flaticon</a>
          </Col>
        </Row>
      </Container>
    </div>
  )
};

export default Footer;