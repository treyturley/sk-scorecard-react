import { useState } from "react";
import PlayerSetupForm from "./PlayerSetup";
import Scorecard from "./Scorecard";

function Game() {
  const [players, setPlayers] = useState([]);
  const [playersExist, setPlayersExist] = useState(false);

  // TODO: Consider if this is a good way to handle the player setup step.
  // An altenative may be passing setPlayersExist as a prop to PlayerSetupForm instead.
  const handlePlayerSetupSubmit = (event) => {
    event.preventDefault();
    // console.log(players);
    // TODO: Do some input validation before moving on to the scorecard
    setPlayersExist(true);
  }

  if (!playersExist) {
    return (
      <PlayerSetupForm
        players={players}
        setPlayers={setPlayers}
        handleSubmit={handlePlayerSetupSubmit}
      />
    )
  }
  return <Scorecard players={players} />

}


export default Game;