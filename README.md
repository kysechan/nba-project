# nba-project
CSE115

## Resources:
* Any resources that are too large for github can be uploaded here:
    * https://drive.google.com/drive/folders/1moXjdrTpaoFEKnBINRneiClz7n2kDPku?usp=sharing
* [Trello (Sprint/Story Management)](https://trello.com/invite/b/DTwVTQJb/4f8e8f927f27e82ddff1a968f02fa8da/cse115-nba-project)
* [Release Plan Doc](https://docs.google.com/document/d/1Gi5N25cxH5tdHwD4RcxDuTLrFQG7naUqsnnJQdIfxS8/edit)
* [Initial Presentation Google Slides](https://docs.google.com/document/d/1Gi5N25cxH5tdHwD4RcxDuTLrFQG7naUqsnnJQdIfxS8/edit)

## Getting Mongo working with Data:
1. Download mongo db volume from here:
    1. https://drive.google.com/file/d/1J7lcHTjlDeZyeXdaP5C21VQUcboC3ide/view?usp=sharing
    2. Unzip into nba-project dir
    3. Make sure folder is called nba-mongo
2. Make sure you have docker installed and running
3. Run ./start-mongo.sh
4. Should now be accessible under this uri:
    1. mongodb://localhost:27017
5. To view the data using a GUI I would recommend compass:
    1. https://www.mongodb.com/products/compass
    
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
#### 1. /api/player/basic?player=<player_name>
* Required Parameters:
    1. player (string of player name)
* Request types: GET
* Returns: json object of player info

#### 2. /api/player/stats?player=<player_name>
* Required Parameters:
    1. player (string of player name)
* Request types: GET
* Returns: json object of player info

#### 3. /api/player/seasons?player=<player_name>
* Required Parameters:
    1. player (string of player name)
* Request types: GET
* Returns: json object of player info

### Team Data Endpoints
#### 1. /api/teams/basic?team=<team_name>
* Required Parameters:
    1. team (string of team name)
* Request types: GET
* Returns: json object of team info

#### 2. /api/teams/players?team=<team_name>
* Required Parameters:
    1. team (string of team name)
* Request types: GET
* Returns: json object of all players on team give name


