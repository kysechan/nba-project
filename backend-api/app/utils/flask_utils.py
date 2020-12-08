from flask import Flask, jsonify, request, abort, redirect,send_from_directory
from flask import Response, make_response
import os, json, sys, pickle, time, re
import requests


def required_parameters_check(request, parameters):
    """
        Checks request for all required parameters specified by an array of key names. Returns
        A 400 (bad request) if all parameters are not present

        :param request: Flask request object
        :param parameters: array of strings that refer to keys in request object that are required.
        :returns: True if conditions met, a 400 request if not.
    """
    for param in parameters:
        if not request.args.get(param) or request.args.get(param) == '':
            return Response(
                json.dumps({'ok':False, 'message':f'Missing Parameters. Required Parameters: {parameters}'}),
                status=400,
                mimetype='application/json'
            )

    return True

