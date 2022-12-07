import React from 'react';

import Game from './components/Game';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';

import { GameProvider } from './context/game/GameContext';

// TODO: implement routing
// /sk.../:game-id to get to the game

function App() {
  return (
    <GameProvider>
      <div className='header'>
        <Header />
      </div>
      <div className='content'>
        <Game />
      </div>
      <div className='footer'>
        <Footer />
      </div>
    </GameProvider>
  );
}

export default App;
