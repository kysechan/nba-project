from flask import Flask, jsonify, request, abort, redirect, send_from_directory
from flask import Response, make_response
import os
import json
import sys
import pickle
import time
import re
import requests

from app import nba_logger, playerdb, gamedb, official_complete
from app.utils.flask_utils import required_parameters_check

from flask import Blueprint
# save all routes under a blueprint to be used by other modules
nba_blueprint = Blueprint('nba_blueprint', __name__)


@nba_blueprint.route('/api/', methods=['GET'])
def index():
    """
        Index route of nba, just returns json object containing
        system name and version.

        :returns: Flask Response Object
    """
    return Response(
        json.dumps({'system': 'nba-api', 'version': '1.0.0'}),
        status=200,
        mimetype='application/json'
    )

#############################################################
# Player searching api endpoints
# All routes support full text search meaning you can pass
# in half names or misspelled names (e.g just last name)
#############################################################


@nba_blueprint.route('/api/player/basic', methods=['GET'])
def get_player():
    """
        Main api route used for searching through databases. 
        Parameters specified include: player, year, and stage.
        Returns a 404 if player could not be found and if it can, it
        send the json object back.
    """
    param_check = required_parameters_check(request, ['player'])
    if param_check != True:
        return param_check

    player = request.args.get('player')
    year = request.args.get('year')
    stage = request.args.get('stage')

    # Find all information for given player with specified fields.
    result = official_complete.find_player_advanced(
        'advanced_players', player, year, stage)

    if not result:
        return Response(
            f"Could not find player '{player}'",
            status=404,
            mimetype='application/json'
        )

    # Remove _id because it should not be sent back to the user
    #del result['_id']

    return Response(
        json.dumps(result),
        status=200,
        mimetype='application/json'
    )

@nba_blueprint.route('/api/v2/player/basic', methods=['GET'])
def get_player_v2():
    """
        Main api route used for searching through databases. 
        Parameters specified include: player, year, and stage.
        Returns a 404 if player could not be found and if it can, it
        send the json object back.
    """
    param_check = required_parameters_check(request, ['player'])
    if param_check != True:
        return param_check

    player = request.args.get('player')
    year = request.args.get('year') if request.args.get('year') != None and request.args.get('year') != "undefined" else None
    stage = request.args.get('stage') if request.args.get('stage') != None and request.args.get('stage') != "undefined" else None

    # Find all information for given player with specified fields.
    result = official_complete.search_v2(
        'advanced_players', player, year=year, stage=stage)

    if not result:
        return Response(
            json.dumps({
                "success":False,
                "reason":f"No player: {player}"
            }),
            status=404,
            mimetype='application/json'
        )

    # Remove _id because it should not be sent back to the user
    #del result['_id']

    return Response(
        json.dumps({
            "success":True,
            "length":len(result),
            "player": player,
            "year":year,
            "stage":stage,
            "data":result
        }),
        status=200,
        mimetype='application/json'
    )


@nba_blueprint.route('/api/player/stats', methods=['GET'])
def get_player_stats():
    """
        Returns the players game stats for a given player.
    """
    param_check = required_parameters_check(request, ['player'])
    if param_check != True:
        return param_check

    player = request.args.get('player')

    result = playerdb.find_player('player_data', player)

    # Remove _id because it should not be sent back to the user
    del result['_id']

    return Response(
        json.dumps(result),
        status=200,
        mimetype='application/json'
    )


@nba_blueprint.route('/api/player/seasons', methods=['GET'])
def player_season_data():
    param_check = required_parameters_check(request, ['player'])
    if param_check != True:
        return param_check

    player = request.args.get('player')

    result = playerdb.find_all_player_data(player)

    return Response(
        json.dumps(result),
        status=200,
        mimetype='application/json'
    )


@nba_blueprint.route('/api/player/all', methods=['GET'])
def retrieve_unique_players():

    print('getting unique players')

    result = official_complete.get_unique_players()

    print('done getting unique players')

    return Response(
        json.dumps(result),
        status=200,
        mimetype='application/json'
    )

#############################################################
# Team searching api endpoints
# DEPRECIATED: No longer searching teams. Main focus is
#       on player data.
#############################################################


@nba_blueprint.route('/api/teams/basic', methods=['GET'])
def find_basic_team_data():
    param_check = required_parameters_check(request, ['team'])
    if param_check != True:
        return param_check

    team_name = request.args.get('team')

    result = gamedb.find_one_fulltext('teams', team_name)

    if not result:
        return Response(
            f"Could not find team '{team_name}'",
            status=404,
            mimetype='application/json'
        )
    return Response(
        json.dumps(result),
        status=200,
        mimetype='application/json'
    )


@nba_blueprint.route('/api/teams/players', methods=['GET'])
def find_players_by_team():
    param_check = required_parameters_check(request, ['team'])
    if param_check != True:
        return param_check

    team_name = request.args.get('team')

    result = gamedb.find_one_fulltext('teams', team_name)
    players = gamedb.mfind('players', {"team_id": result['team_id']})

    return Response(
        json.dumps(players),
        status=200,
        mimetype='application/json'
    )


@nba_blueprint.route('/api/players/test', methods=['GET'])
def filter_by_year():
    param_check = required_parameters_check(request, ['player'])
    if param_check != True:
        return param_check

    # team_name = request.args.get('year')

    result = games_all.find_by_year('general', 'stephen curry', year=2012)

    print(result)

    return Response(
        json.dumps(result),
        status=200,
        mimetype='application/json'
    )
