import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from "./components/Game";
import Header from './layouts/Header';
import Footer from './layouts/Footer'
import "./styles/Index.css"


function App() {
  return (
    <>
      <React.StrictMode>
        <div className="header">
          <Header />
        </div>
        <div className="content">
          <Game />
        </div>
        <div className="footer">
          <Footer />
        </div>
      </React.StrictMode>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
