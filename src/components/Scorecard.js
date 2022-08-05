function Scorecard(props) {

  // console.log(props.players);

  return (
    <>
      <h1>Scorecard Component</h1>
      <h2>Players are</h2>
      {props.players.map((player,idx) => (
        <li key={idx}>{player}</li>
      ))}
    </>
  )
}

export default Scorecard;