import { useState } from "react";
import PlayerSetupForm from "./PlayerSetup";
import Scorecard from "./Scorecard";

function Game(){
  const [players, setPlayers] = useState("");
  const [playersExist, setPlayersExist] = useState(false);

  const handlePlayerSetupSubmit = (event) => {
    event.preventDefault();
    // TODO: Do some input validation before moving on to the scorecard
    console.log(players);
    setPlayersExist(true);
  }

  function InitPlayers(){
    return (
      <PlayerSetupForm
        players={players}
        setPlayers={setPlayers}
        handleSubmit={handlePlayerSetupSubmit}
        />
    )
  }

  if(!playersExist){
    return <InitPlayers/>
  }
  return <Scorecard/>

}


export default Game;