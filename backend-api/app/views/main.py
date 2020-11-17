from flask import Flask, jsonify, request, abort, redirect,send_from_directory
from flask import Response, make_response
import os, json, sys, pickle, time, re
import requests

from app import nba_logger, playerdb, gamedb, games_all
from app.utils.flask_utils import required_parameters_check

from flask import Blueprint
nba_blueprint = Blueprint('nba_blueprint', __name__) #save all routes under a blueprint to be used by other modules


@nba_blueprint.route('/api/', methods=['GET'])
def index():
    """
        Index route of nba, just returns json object containing
        system name and version.

        :returns: Flask Response Object
    """
    return Response(
        json.dumps({'system':'nba-api', 'version':'1.0.0'}),
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
    param_check = required_parameters_check(request, ['player'])
    if param_check != True:
        return param_check

    player = request.args.get('player')

    result = playerdb.find_player('players', player)

    if not result:
        return Response(
            f"Could not find player '{player}'",
            status=404,
            mimetype='application/json'
        )

    del result['_id'] # Remove _id because it should not be sent back to the user

    return Response(
        json.dumps(result),
        status=200,
        mimetype='application/json'
    )

@nba_blueprint.route('/api/player/stats', methods=['GET'])
def get_player_stats():
    param_check = required_parameters_check(request, ['player'])
    if param_check != True:
        return param_check

    player = request.args.get('player')

    result = playerdb.find_player('player_data', player)

    del result['_id'] # Remove _id because it should not be sent back to the user

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

#############################################################
# Team searching api endpoints
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
    players = gamedb.mfind('players', {"team_id":result['team_id']})

    return Response(
        json.dumps(players),
        status=200,
        mimetype='application/json'
    )




@nba_blueprint.route('/api/teams/test', methods=['GET'])
def filter_by_year():
    param_check = required_parameters_check(request, ['year'])
    if param_check != True:
        return param_check

    team_name = request.args.get('year')

    result = games_all.find_one_fulltext('games_all', year=2012)

    return Response(
        json.dumps(),
        status=200,
        mimetype='application/json'
    )





