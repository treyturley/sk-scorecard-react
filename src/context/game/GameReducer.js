import {
  SET_PLAYERS,
  SET_SCORECARD,
  CLEAR_PLAYERS,
  CLEAR_SCORECARD,
  SET_PLAYERTOTALS,
} from './GameActionTypes';

const gameReducer = (state, action) => {
  switch (action.type) {
    // TODO: set state for cases we need to handle
    case SET_PLAYERS:
      return { ...state, players: action.payload };
    case CLEAR_PLAYERS:
      return { ...state, players: [] };
    case SET_SCORECARD:
      return { ...state, scorecard: action.payload };
    case CLEAR_SCORECARD:
      return { ...state, scorecard: [] };
    case SET_PLAYERTOTALS:
      return { ...state, playerTotals: action.payload };
    default:
      return state;
  }
};

export default gameReducer;
