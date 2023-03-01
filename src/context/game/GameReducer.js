import {
  SET_PLAYERS,
  SET_SCORECARD,
  CLEAR_PLAYERS,
  CLEAR_SCORECARD,
  SET_PLAYER_TOTALS,
  SET_CURRENT_ROUND,
  SET_GAME_COMPLETE,
  SET_GAME_NAME,
  SET_GAME_ID,
  SET_GAME_STATUS,
  RESET_GAME_CONTEXT,
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
    case SET_PLAYER_TOTALS:
      return { ...state, playerTotals: action.payload };
    case SET_CURRENT_ROUND:
      return { ...state, currentRound: action.payload };
    case SET_GAME_COMPLETE:
      return { ...state, gameComplete: action.payload };
    case SET_GAME_NAME:
      return {
        ...state,
        selectedGame: { ...state.selectedGame, name: action.payload },
      };
    case SET_GAME_ID:
      return {
        ...state,
        selectedGame: { ...state.selectedGame, gameId: action.payload },
      };
    case SET_GAME_STATUS:
      return {
        ...state,
        selectedGame: { ...state.selectedGame, status: action.payload },
      };
    case RESET_GAME_CONTEXT:
      return {
        players: [],
        scorecard: [],
        playerTotals: [],
        currentRound: 1,
        gameComplete: false,
        selectedGame: {
          gameId: '',
          name: '',
          status: 'STARTED',
        },
      };
    default:
      return state;
  }
};

export default gameReducer;
