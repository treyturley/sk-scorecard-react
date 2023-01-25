# Project Info

The goal of this project is to create a scorecard that can be used while playing the [Skull King](https://www.grandpabecksgames.com/products/skull-king) card game. The scorecard will automate some of the score keeping so that it is easier to keep track of each players score while also prividing real-time score info to all players. [SK Scorecard API](https://github.com/treyturley/sk-scorecard-api) is the backend service that tracks game state and pushes updates to the players. 

The scorecard is hosted at https://treyturley.com/skullking-scorecard

## How to play
One player acts as the scorekeeper and after bidding takes place they enter each player's bid. The round is then played and at the end the scorekeeper enters the tricks taken and bonus points for each player. The rest of the players can also use the app to see their opponent's bid for the current round along with overall and round-by-round scores.

# Production Deployments

Automated deployments to treyturley.com are configured for this project. Any changes made to the main branch will trigger a GitHub webhook which then starts a Jenkins pipeline to build and deploy the branch. Changes to main can only be made via pull request.

# Running the Source Code

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
