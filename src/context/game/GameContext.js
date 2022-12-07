import { createContext, useReducer } from 'react';
import gameReducer from './GameReducer';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  //initial state goes here
  const initialState = {
    players: [],
    scorecard: [],
    playerTotals: [],
    currentRound: 1,
    gameComplete: false,
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
