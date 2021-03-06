# NBA Database

## Deliverables
* [Initial Presentation Google Slides](https://docs.google.com/presentation/d/1KJkIA6Ai0BZvweWNEKbcW7n_YaEc_zuchxba9BY8W9I/edit?usp=sharing)
* [Sprint 1 Plan](https://docs.google.com/document/d/1vhGEjX9edBMyNXJ1CU2zA4r9vIr3i6M9A2rFQYs-AD8/edit?usp=sharing)
* [Sprint 1 Report](https://docs.google.com/document/d/1b-AZ1sWr0hPJQJBzr8ktH7feTw9IG9P5ZyXByoQW3g0/edit?usp=sharing)
* [Sprint 2 Plan](https://docs.google.com/document/d/18SG5_iivvgSS76AtI7EcfZMnXrB4IlHhEpBKrsddRQo/edit?usp=sharing)
* [Sprint 2 Report](https://docs.google.com/document/d/1JfbDNvRw3NlE1pCAG2c65WSvfoK84Y9yfzEmHtkq7QU/edit?usp=sharing)
* [Sprint 3 Plan](https://docs.google.com/document/d/1KXc_8nbs-cNGViP5YPqUC7lDmhc00pSWgkuNrT-BJ9I/edit)
* [Sprint 3 Report](https://docs.google.com/document/d/18Ub32gAbnZThY7ou6OQW-b6G4yuQ51BQShq6zSCOeOs/edit)
* [Sprint 4 Plan](https://docs.google.com/document/d/1IfShkFGDsBJxwENH3YJHX-mHAv_gbGYDHvGnGnQR3d4/edit?usp=sharing)
* [Sprint 4 Report](https://docs.google.com/document/d/1WVafZ-iTmok0jeZWCQG00yKvNhfIaf9fas2cAfqh8co/edit?usp=sharing)
* [System and Unit Test Report](https://docs.google.com/document/d/19iNWw9GU-WnVfngATwTWzFl-NATeYKGq_V1fM_X9JnU/edit?usp=sharing)
* [Working Prototype Known Problems Report](https://docs.google.com/document/d/1BL6tacdkyNXpswGzXGDWQJXOAEhrJCDLWcVxZQUHUzQ/edit?usp=sharing)
* [Release Plan](https://docs.google.com/document/d/1Gi5N25cxH5tdHwD4RcxDuTLrFQG7naUqsnnJQdIfxS8/edit?usp=sharing)
* [Final Presentation](https://docs.google.com/presentation/d/1G1yPB4Nfr-f2MXg1A7PugTBmdJ0h0zLh2Jf_mnJhxJs/edit?usp=sharing)

## Resources:
* Any resources that are too large for github can be uploaded here:
    * https://drive.google.com/drive/folders/1moXjdrTpaoFEKnBINRneiClz7n2kDPku?usp=sharing
* [NBA Project Shared Folder (gdrive)](https://drive.google.com/drive/folders/0APLV1JIxxMvNUk9PVA)
* [JIRA (Sprint/Story Management)](https://nbadb.atlassian.net/secure/RapidBoard.jspa?projectKey=NBA)
* [Release Plan Doc](https://docs.google.com/document/d/1Gi5N25cxH5tdHwD4RcxDuTLrFQG7naUqsnnJQdIfxS8/edit)


## Getting Frontend Running

### Requirements

Run `npm install` to install all required packages before running.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Running Backend

### Requirements
Make sure you have poetry installed which is what we use for managing dependencies
* Installation guide for poetry can be found here: [poerty](https://python-poetry.org/docs/)

### Running
To run the backend webserver navigate to `backend-api` and run the script `./dev.sh`
This will start a webserver running on port 8080 will all endpoints. If you are running locally make sure to also have the mongo database running locally as well on port 27069

## Getting Mongo working with Data [SERVER]:
1. Download mongo db volume from here:
    1. https://drive.google.com/file/d/1J7lcHTjlDeZyeXdaP5C21VQUcboC3ide/view?usp=sharing
    2. Unzip into nba-project dir
    3. Make sure folder is called nba-mongo
2. Make sure you have docker installed and running
3. Run ./start-mongo.sh
4. Should now be accessible under this uri:
    1. mongodb://localhost:27069
5. To view the data using a GUI I would recommend compass:
    1. https://www.mongodb.com/products/compass

## Getting Mongo shell working [CLIENT]
1. With Homebrew:

`brew tap mongodb/brew`

`brew install mongodb-community-shell`

2. Connect to the server:
`mongo --host 165.227.31.0:27069`

Example Mongo shell query: 

```
db.use(official_complete)
db.advanced_players.find({$text: {$search: "\"curry\" \"playoffs\" \"2017\" \"2018\""}})
```

--- 


Example request (curl): `curl -k https://165.227.31.0:8080/api/player/basic\?player\=lebron\&year\=2017\&stage\=playoffs`




MongoDB Analytics: `https://cloud.mongodb.com/freemonitoring/cluster/JAK4WVTHJE5UVK66DW6GHWUB4RMGXJSE`



## Mongo Databases

#### nba-1
* Source: https://www.kaggle.com/nathanlauga/nba-games
* Collections:
    1. game_details: details of games dataset, all statistics of players for a given game
    2. games: all games from 2004 season to last update with the date, teams and some details like number of points, etc
    3. players: players details (name)
    4. rankings: ranking of NBA given a day (split into west and east on CONFERENCE column)
    5. teams: all teams of NBA
    
#### nba-players
* Source: https://www.kaggle.com/drgilermo/nba-players-stats
* Description: The data-set contains aggregate individual statistics for 67 NBA seasons. from basic box-score attributes such as points, assists, rebounds etc., to more advanced money-ball like features such as Value Over Replacement.
* Collections:
    1. player_data
    2. players
    3. season stats
    
#### nba-betting
* Source: https://www.kaggle.com/ehallmar/nba-historical-stats-and-betting-data
* Description: Match stats and betting odds for a large number of historical NBA games
* Collections:
    1. betting_money_line
    2. betting_spread
    3. betting_totals
    4. games_all
    5. players_all
    6. player_game_stats
    7. teams_all

        
## API Documentation

### Player Data Endpoints
#### 1. `/api/v2/player/basic?player=<player_name>&stage=<stage>&year=<year>`
* Required Parameters:
    1. player (string of player name
    2. year (desired year)
    3. stage ('regular' or 'playoffs')
* Request types: GET
* Returns: json object of player info

#### 2. `/api/player/stats?player=<player_name>`
* Required Parameters:
    1. player (string of player name)
* Request types: GET
* Returns: json object of player info

#### 3. `/api/player/seasons?player=<player_name>`
* Required Parameters:
    1. player (string of player name)
* Request types: GET
* Returns: json object of player info

---

### [DEPRECATED] Team Data Endpoints
#### 1. `/api/teams/basic?team=<team_name>`
* Required Parameters:
    1. team (string of team name)
* Request types: GET
* Returns: json object of team info

#### 2. `/api/teams/players?team=<team_name>`
* Required Parameters:
    1. team (string of team name)
* Request types: GET
* Returns: json object of all players on team give name


