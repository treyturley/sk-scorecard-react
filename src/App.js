import React from 'react';

import Game from './components/Game';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';

function App() {
  return (
    <>
      <div className='header'>
        <Header />
      </div>
      <div className='content'>
        <Game />
      </div>
      <div className='footer'>
        <Footer />
      </div>
    </>
  );
}

export default App;
