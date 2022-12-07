const gameReducer = (state, action) => {
  switch (action.type) {
    // TODO: set state for cases we need to handle
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    case 'CLEAR_PLAYERS':
      return { ...state, players: [] };
    case 'SET_SCORECARD':
      return { ...state, scorecard: action.payload };
    case 'CLEAR_SCORECARD':
      return { ...state, scorecard: [] };
    default:
      return state;
  }
};

export default gameReducer;
