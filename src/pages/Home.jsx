import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../styles/Home.css';

function Home() {
  return (
    <div className='content sea-bg-image'>
      <div className='container'>
        <div>
          <h1 className='text-center mt-4'>
            Welcome to the Skull King Scorecard
          </h1>
        </div>
        <div className='home-buttons'>
          <Button
            as={Link}
            to={'/skullking-scorecard/new-game'}
            variant='dark'
            size='lg'
            className='my-5'
          >
            Start a game
          </Button>

          <Button
            as={Link}
            to='/skullking-scorecard/join-game'
            variant='dark'
            size='lg'
            className='mb-5'
          >
            Join a game
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
