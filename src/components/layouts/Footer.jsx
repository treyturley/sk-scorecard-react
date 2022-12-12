import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <Link to='/skullking-scorecard'>
              <h4>Skull King Scorecard</h4>
            </Link>
          </Col>
        </Row>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <Link to='/skullking-scorecard/new-game'>New Game</Link>
          </Col>
        </Row>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <Link to='/skullking-scorecard/join-game'>Join Game</Link>
          </Col>
        </Row>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <a
              href='https://cdn.shopify.com/s/files/1/0565/3230/4053/files/sk_rulebook_optimized.pdf?v=1652992950'
              target='_blank'
              rel='noreferrer'
            >
              Rules
            </a>
          </Col>
        </Row>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <a href='/'>treyturley.com</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
