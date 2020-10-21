from flask import Flask, jsonify, request, abort, redirect,send_from_directory
from flask import Response, make_response
import os, json, sys, pickle, time, re
import requests

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
