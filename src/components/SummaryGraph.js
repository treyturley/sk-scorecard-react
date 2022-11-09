import React from 'react'

// react chartjs 2 docs - https://react-chartjs-2.js.org/
// line chart example - https://react-chartjs-2.js.org/examples/line-chart
// sample color pallettes - https://personal.sron.nl/~pault/

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SummaryGraph({ playerTotals, scorecard, currentRound, gameComplete }) {

  const lineColors = [
    '#332288',
    '#88CCEE',
    '#44AA99',
    '#117733',
    '#999933',
    '#DDCC77',
    '#CC6677',
    '#882255',
    '#AA4499',
    '#CC3311'
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Scores by Round',
      },
    },
  };

  const labels = [
    'Round 1',
    'Round 2',
    'Round 3',
    'Round 4',
    'Round 5',
    'Round 6',
    'Round 7',
    'Round 8',
    'Round 9',
    'Round 10'
  ];

  const data = {
    labels,
    datasets: []
  };

  class DataSet {
    constructor(label, data, color) {
      this.label = label;
      this.data = data;
      this.backgroundColor = color;
      this.borderColor = color;
    }
  }

  playerTotals.forEach((player, index) => {
    const roundTotals = [];
    const roundScore = [];

    scorecard.forEach((score) => {
      if (score.playerName === player.playerName) {
        if (gameComplete || (score.roundNumber !== currentRound)) {
          roundScore.push(score.roundTotal);
        }
      }
    });

    //calculate the score totals at each round
    for (let x = 0; x < 10; x++) {
      let total = 0;
      for (let y = 0; y <= x; y++) {
        total += roundScore[y];
      }
      roundTotals.push(total);
    }

    data.datasets.push(new DataSet(player.playerName, roundTotals, lineColors[index]));

  });

  return (
    <Line options={options} data={data} />
  )
}

export default SummaryGraph;