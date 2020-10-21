from flask import Flask, jsonify, request, abort, redirect,send_from_directory
from flask import Response, make_response
import os, json, sys, pickle, time, re
import requests

from app import nba_logger, playerdb, gamedb

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
    if not request.args.get('player') or request.args.get('player') == '':
        return Response(
            json.dumps({'ok':False, 'message':'Player name either not specified or not empty'}),
            status=400,
            mimetype='application/json'
        )
    player = request.args.get('player')

    result = playerdb.find_player('players', player)

    del result['_id'] # Remove _id because it should not be sent back to the user

    return Response(
        json.dumps(result),
        status=200,
        mimetype='application/json'
    )

@nba_blueprint.route('/api/player/stats', methods=['GET'])
def get_player_stats():
    if not request.args.get('player') or request.args.get('player') == '':
        return Response(
            json.dumps({'ok':False, 'message':'Player name either not specified or not empty'}),
            status=400,
            mimetype='application/json'
        )
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
    if not request.args.get('player') or request.args.get('player') == '':
        return Response(
            json.dumps({'ok':False, 'message':'Player name either not specified or not empty'}),
            status=400,
            mimetype='application/json'
        )
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
    if not request.args.get('team') or request.args.get('team') == '':
        return Response(
            json.dumps({'ok':False, 'message':'Team name missing or empty'}),
            status=400,
            mimetype='application/json'
        )
    team_name = request.args.get('team')

    result = gamedb.find_one_fulltext('teams', team_name)
    return Response(
        json.dumps(result),
        status=200,
        mimetype='application/json'
    )

@nba_blueprint.route('/api/teams/players', methods=['GET'])
def find_players_by_team():
    if not request.args.get('team') or request.args.get('team') == '':
        return Response(
            json.dumps({'ok':False, 'message':'Team name missing or empty'}),
            status=400,
            mimetype='application/json'
        )
    team_name = request.args.get('team')

    result = gamedb.find_one_fulltext('teams', team_name)
    players = gamedb.mfind('players', {"team_id":result['team_id']})

    return Response(
        json.dumps(players),
        status=200,
        mimetype='application/json'
    )





