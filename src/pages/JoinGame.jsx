import { useState, useEffect } from 'react';
import axios from 'axios';
import GameListing from '../components/GameListing';
import { getActiveGames } from '../context/game/GameActions';
import { Button } from 'react-bootstrap';
import '../styles/JoinGame.css';

function JoinGame() {
  const [refreshGames, setRefreshGames] = useState(true);
  const [activeGames, setActiveGames] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    if (refreshGames) {
      getActiveGames(controller)
        .then((value) => {
          setActiveGames(value.reverse());
          setRefreshGames(false);
        })
        .catch((err) => {
          if (err.name === 'AxiosError') {
            console.log('axios error - connection refused');
            setRefreshGames(false);
          } else if (err.name === 'CanceledError') {
            console.log('axios error - request canceled');
          }
        });
    }
    return () => {
      controller.abort();
    };
  }, [refreshGames]);

  return (
    <div className='content bg-color'>
      <div className='my-container'>
        <h1>Games in Progress</h1>
        <Button
          variant='dark'
          className='mb-4'
          onClick={() => setRefreshGames(true)}
        >
          Refresh
        </Button>
        {refreshGames && <h5>Loading Active Games...</h5>}

        {!refreshGames &&
          (activeGames.length > 0
            ? activeGames
                .filter((game) => game.status === 'STARTED')
                .map((game) => <GameListing key={game.id} game={game} />)
            : 'No games found. Try refreshing.')}
      </div>
    </div>
  );
}

export default JoinGame;
