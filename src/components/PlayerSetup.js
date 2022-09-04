import backgroundVideo from '../video/pirate-flag-waving.mp4'
// import backgroundVideo from '../video/Sea.mp4'
import '../styles/PlayerSetup.css'

function PlayerSetupForm(props) {
  const players = props.players;
  const setPlayers = props.setPlayers;
  const handleSubmit = props.handleSubmit;

  const handleChange = index => event => {
    let newArr = [...players];
    newArr[index] = event.target.value;
    setPlayers(newArr);
  }

  return (
    <>
      <div className="my-container">
        <form onSubmit={handleSubmit}>


          <input
            type="text"
            name="Player 1"
            placeholder="Player 1"
            value={players[0] || ""}
            onChange={handleChange(0)} />


          <input
            type="text"
            name="Player 2"
            placeholder="Player 2"
            value={players[1] || ""}
            onChange={handleChange(1)} />


          <input
            type="text"
            name="Player 3"
            placeholder="Player 3"
            value={players[2] || ""}
            onChange={handleChange(2)} />


          <input
            type="text"
            name="Player 4"
            placeholder="Player 4"
            value={players[3] || ""}
            onChange={handleChange(3)} />

          <div className="form-button">
            <button type="submit">Set Sail</button>
          </div>

        </form>

      </div>

      <video id='video' autoPlay loop muted>
        <source src={backgroundVideo} type='video/mp4'></source>
      </video>
    </>
  )
}

export default PlayerSetupForm;