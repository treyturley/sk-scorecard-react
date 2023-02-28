import axios from 'axios';

let api_endpoint = process.env.REACT_APP_PROD_API;

if (process.env.NODE_ENV !== 'production') {
  api_endpoint = process.env.REACT_APP_DEV_API;
}

class RoundScore {
  constructor(name, roundNumber, bid, tricks, bonus, roundTotal) {
    this.playerName = name;
    this.roundNumber = roundNumber;
    this.bid = bid;
    this.tricks = tricks;
    this.bonus = bonus;
    this.roundTotal = roundTotal;
  }

  calculateRoundTotal(roundNumber, bid, tricks, bonus) {
    let total = 0;

    if (bid === 0 && tricks === 0) {
      total += 10 * roundNumber;
      total += bonus;
    } else if (bid === 0 && tricks !== 0) {
      total -= 10 * roundNumber;
    } else {
      if (bid === tricks) {
        total += 20 * bid;
        total += bonus;
      } else {
        const bidDiff = Math.abs(bid - tricks);
        total -= 10 * bidDiff;
        // if bonues is negative (rascal of rotan bet) need to also take it into account
        if (bonus < 0) {
          total += bonus;
        }
      }
    }
    return total;
  }
}

class PlayerTotal {
  constructor(name) {
    this.playerName = name;
    this.total = 0;
    this.currentBid = 0;
  }
}

export const createRoundScore = (
  name,
  roundNumber,
  bid,
  tricks,
  bonus,
  roundTotal
) => {
  return new RoundScore(name, roundNumber, bid, tricks, bonus, roundTotal);
};

export const createPlayer = (playerName) => {
  return new PlayerTotal(playerName);
};

/**
 * Pushes the initial game state to the SK API. Returns the game ID of the created game or -1 if game creation failed.
 * @param {*} scorecard The initial scorecard state
 * @param {*} playerTotals The initial player totals
 * @returns The game id of the newly created game.
 */
export const createGame = async (scorecard, playerTotals, selectedGame) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const game = {
    name: selectedGame.name,
    status: 'STARTED',
    scorecard: scorecard,
    playerTotals: playerTotals,
    currentRound: 1,
  };

  try {
    const res = await axios.post(`${api_endpoint}/v1/scorecards`, game, config);
    if (res.status === 201) {
      return res.data.gameId;
    } else {
      console.error(
        `Error occured on POST ${api_endpoint}/v1/scorecards. Received ${res.status} ${res.statusText}`
      );
    }
  } catch (error) {
    console.error('Error occured during POST /v1/scorecards');
    console.error(error);
  }
  return -1;
};

/**
 * Combines the state components together into one game state
 * that then gets pushed to the to the SK API.
 * @param {*} gameId The game Id for this game
 * @param {*} scorecard The scorecard containing the latest score info
 * @param {*} playerTotals The player's total score info
 * @param {*} currentRound The current active round in the game
 * @param {*} status - The current game status
 */
export const updateGame = async (
  gameId,
  scorecard,
  playerTotals,
  currentRound,
  status
) => {
  const game = {
    scorecard: scorecard,
    status: status,
    playerTotals: playerTotals,
    currentRound: currentRound,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put(
      `${api_endpoint}/v1/scorecards/${gameId}`,
      game,
      config
    );
    if (res.status === 200) {
      // success
    } else {
      console.error(
        `Error occured during PUT /v1/scorecards/${gameId}. Received ${res.status} ${res.statusText}`
      );
    }
  } catch (error) {
    console.error(`PUT /v1/scorecards/${gameId} failed! ${error.message}`);
    if (error.response && error.response.status === 400) {
      // TODO: notify the user that this game no longer exists for some reason
      // needs popup message and link to go back to home screen
    }
    // console.error(error);
  }
};

/**
 * Gets a list of currently active games from the SK API
 * @param {AbortController} controller - an abort controller for the axios request
 * @returns an array of active games or an empty array if none found
 */
export const getActiveGames = async (controller) => {
  const res = await axios.get(`${api_endpoint}/v1/scorecards`, {
    signal: controller.signal,
  });
  if (res.status === 200) {
    return res.data;
  }
};

export const getGame = async (gameId) => {
  try {
    const res = await axios.get(`${api_endpoint}/v1/scorecards/${gameId}`);
    if (res.status === 200) {
      //console.log(res.data);
      return res.data;
    }
  } catch (err) {
    console.warn(`Failed to get game with gameId: ${gameId}`);
    return null;
  }
};
