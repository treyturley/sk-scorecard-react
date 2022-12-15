import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getActiveGames } from '../context/game/GameActions';
import '../styles/SelectGame.css';
import GameListing from './GameListing';

function SelectGame() {
  const [refreshGames, setRefreshGames] = useState(true);
  const [activeGames, setActiveGames] = useState([]);

  useEffect(() => {
    if (refreshGames) {
      getActiveGames().then((value) => {
        setActiveGames(value.reverse());
      });
      setRefreshGames(false);
    }
  }, [refreshGames]);

  return (
    <div className='content'>
      <div className='my-container'>
        <h1>Games in Progress</h1>
        <Button
          variant='dark'
          className='mb-4'
          onClick={() => setRefreshGames(true)}
        >
          Refresh
        </Button>
        {activeGames
          .filter((game) => game.status === 'STARTED')
          .map((game) => (
            <GameListing key={game.id} game={game} />
          ))}
      </div>
    </div>
  );
}

export default SelectGame;
