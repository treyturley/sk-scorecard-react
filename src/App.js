import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import { GameProvider } from './context/game/GameContext';
import Home from './pages/Home';
import JoinGame from './pages/JoinGame';
import Player from './pages/Player';
import Scorekeeper from './pages/Scorekeeper';
import NewGame from './pages/NewGame';
import GameNotFound from './pages/GameNotFound';
import PageNotFound from './pages/PageNotFound';
import GameSummary from './pages/GameSummary';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className='header'>
          <Header />
        </div>
        <Routes>
          <Route path='/skullking-scorecard' element={<Home />} />
          <Route path='/skullking-scorecard/new-game' element={<NewGame />} />
          <Route path='/skullking-scorecard/join-game' element={<JoinGame />} />
          <Route
            path='/skullking-scorecard/scorekeeper/:gameId'
            element={<Scorekeeper />}
          />
          <Route
            path='/skullking-scorecard/player/:gameId'
            element={<Player />}
          />
          <Route
            path='/skullking-scorecard/summary'
            element={<GameSummary />}
          />
          <Route
            path='/skullking-scorecard/game-not-found/*'
            element={<GameNotFound />}
          />
          <Route path='/skullking-scorecard/*' element={<PageNotFound />} />
        </Routes>
        <div className='footer'>
          <Footer />
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
