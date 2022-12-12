import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveGames } from '../context/game/GameActions';

function SelectGame() {
  const [refreshGames, setRefreshGames] = useState(true);
  const [activeGames, setActiveGames] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (refreshGames) {
      getActiveGames().then((value) => {
        setActiveGames(value.reverse());
      });
      setRefreshGames(false);
    }
    // eslint-disable-next-line
  }, [refreshGames]);

  function listActiveGames() {
    let rows = [];

    if (activeGames.length === 0) {
    } else {
      activeGames.forEach((game) => {
        // TODO: wrap this up in card or something nice looking
        if (game.status === 'STARTED') {
          rows.push(
            <h4 key={`${game.id}`}>
              {game.name} - {game.playerTotals.length} players
            </h4>
          );

          game.playerTotals.forEach((player) => {
            rows.push(
              <p key={`${game.id}-${player.playerName}`}>
                {player.playerName} : {player.total}
              </p>
            );
          });

          rows.push(
            <Button
              key={`${game.id}-View`}
              className='mb-4'
              onClick={() => navigate(`/skullking-scorecard/player/${game.id}`)}
              variant='dark'
            >
              Join Game
            </Button>
          );
        }
      });
    }
    return rows;
  }
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
        {listActiveGames()}
      </div>
    </div>
  );
}

export default SelectGame;
