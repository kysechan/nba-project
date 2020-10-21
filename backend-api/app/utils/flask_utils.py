from flask import Flask, jsonify, request, abort, redirect,send_from_directory
from flask import Response, make_response
import os, json, sys, pickle, time, re
import requests


def required_parameters_check(request, parameters):
    for param in parameters:
        if not request.args.get(param) or request.args.get(param) == '':
            return Response(
                json.dumps({'ok':False, 'message':f'Missing Parameters. Required Parameters: {parameters}'}),
                status=400,
                mimetype='application/json'
            )

    return True

