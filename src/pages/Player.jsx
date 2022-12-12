import { useParams } from 'react-router-dom';
import WatchGame from '../components/WatchGame';

function Player() {
  const { gameId } = useParams();

  return (
    <div className='content'>
      <WatchGame gameId={gameId} />;
    </div>
  );
}

export default Player;
