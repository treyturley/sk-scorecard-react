import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from "./components/Game";
import Header from './layouts/Header';
import Footer from './layouts/Footer'


function App() {
  return (
    <>
      <Header />
      <Game />
      <Footer />
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
