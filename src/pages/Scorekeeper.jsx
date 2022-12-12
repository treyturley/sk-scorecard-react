import { useParams } from 'react-router-dom';
import Scorecard from '../components/Scorecard';

function Scorekeeper() {
  const { gameId } = useParams();

  return (
    <div className='content'>
      <Scorecard gameId={gameId} />
    </div>
  );
}

export default Scorekeeper;
