import React from 'react'
import { useState } from 'react';

const Round = ({ roundScore, onBidChange }) => {

  return (
    <div className='mb-4'>
      <h2>Player {roundScore.playerName} Round:{roundScore.roundNumber}</h2>
      <h4>Bid: {roundScore.bid}</h4>
      <h4>Tricks</h4>
      <h4>Bonus</h4>
      <h4>Round Total</h4>
      <input type='number' value={roundScore.bid} onChange={(event) => onBidChange(event,roundScore)}/>
    </div>
  )
}

export default Round