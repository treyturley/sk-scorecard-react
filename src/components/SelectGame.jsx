import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveGames } from '../context/game/GameActions';
import '../styles/SelectGame.css';

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
            <div key={`${game.id}-View`} className='join-buttons'>
              <Button
                className='join-button'
                onClick={() =>
                  navigate(`/skullking-scorecard/player/${game.id}`)
                }
                variant='dark'
              >
                Join as Player
              </Button>
              <Button
                className='join-button'
                onClick={() =>
                  navigate(`/skullking-scorecard/scorekeeper/${game.id}`)
                }
                variant='dark'
              >
                Join as Scorekeeper
              </Button>
            </div>
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
        <div className='active-games'>{listActiveGames()}</div>
      </div>
    </div>
  );
}

export default SelectGame;
