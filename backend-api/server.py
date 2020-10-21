from flask import Flask, jsonify, request, abort, redirect,send_from_directory
from flask import Response, make_response
import os, json, sys, pickle, time, re, requests
import logging, coloredlogs
import sys, pprint, traceback

from app import settings
from app.views.main import nba_blueprint

# Set up Logger
logging.basicConfig(stream=sys.stdout, level=settings.LOGGING_LEVEL)
logging.Formatter.converter = time.localtime
# Setting up main logger
# Use Logger not logging
logger = logging.getLogger('nba_backend')
logger.setLevel(settings.LOGGING_LEVEL)

app = Flask(__name__)

if os.getenv('ENV_TYPE') != 'PROD':
    # if locally testing, you can use colors in logging
    coloredlogs.install()

# register main slack routes
app.register_blueprint(nba_blueprint)

def start_server(f_host=settings.FLASK_HOST, f_port=settings.FLASK_PORT):
    """
        Main method to start slack bot, loads resources and starts a flask web server to start
        receiving incoming requets
    """
    global app


    if os.getenv('ENV_TYPE') != 'PROD':
        # Enable debug and reloader for development
        logger.info("Starting Development Server")
        app.run(debug=True, host=f_host, port=f_port, threaded=True, use_reloader=True)
    else:
        logger.info("Starting Production Type Flask Server, However it is recommended to use gunicorn inside of running python script directly")
        app.run(debug=False, host=settings.FLASK_HOST, port=settings.FLASK_PORT, threaded=True, use_reloader=False)

if __name__ == "__main__":
    if len(sys.argv) == 3:
        # You can specify host and port with the first and second command line arguments
        logger.info(f"Starting Flask on host: {sys.argv[1]} and port: {sys.argv[2]}")
        start_server(f_host=sys.argv[1], f_port=sys.argv[2] )
    else:
        start_server()








