import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function GameListing({ game }) {
  const navigate = useNavigate();

  return (
    <div className='text-center'>
      <h4>
        {game.name} - {game.playerTotals.length} players
      </h4>

      {game.playerTotals.map((player) => (
        <p key={`${game.gameId}-${player.playerName}`}>
          {player.playerName} : {player.total}
        </p>
      ))}

      <Button
        className='join-button'
        onClick={() => navigate(`/skullking-scorecard/player/${game.gameId}`)}
        variant='dark'
      >
        Join as Player
      </Button>
      <Button
        className='join-button'
        onClick={() =>
          navigate(`/skullking-scorecard/scorekeeper/${game.gameId}`)
        }
        variant='dark'
      >
        Join as Scorekeeper
      </Button>
    </div>
  );
}

export default GameListing;
