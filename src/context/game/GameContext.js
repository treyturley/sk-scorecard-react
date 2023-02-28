import { createContext, useReducer } from 'react';
import gameReducer from './GameReducer';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  //initial state goes here
  const initialState = {
    players: [], // TODO: combine players and player totals??
    scorecard: [],
    playerTotals: [],
    currentRound: 1,
    gameComplete: false, // TODO: combine gameComplete with selectedGame.status
    selectedGame: {
      gameId: '',
      name: '',
      status: '',
    },
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
