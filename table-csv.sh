#! /bin/bash

mongoimport --type csv -d advanced_players -c $1 --headerline --drop $1_2020_advanced_player_stats.csv --port 27069

