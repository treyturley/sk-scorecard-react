import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

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
            <Link to={'/'} >Home</Link>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <a href="https://cdn.shopify.com/s/files/1/0565/3230/4053/files/sk_rulebook_optimized.pdf?v=1652992950" target="_blank" rel="noreferrer">Rules</a>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
          <a className="shiplink" href="https://www.flaticon.com/free-icons/shipwreck" target="_blank" rel="noreferrer" title="shipwreck icons">Shipwreck icons created by Eucalyp - Flaticon</a>
          </Col>
        </Row>
      </Container>
    </div>
  )
};

// 

export default Footer;