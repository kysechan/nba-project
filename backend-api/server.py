from flask import Flask, jsonify, request, abort, redirect,send_from_directory
from flask import Response, make_response
from flask_cors import CORS
import os, json, sys, pickle, time, re, requests
import logging
import sys, pprint, traceback
import threading, ssl

from app import settings, nba_logger
from app.views.main import nba_blueprint

app = Flask(__name__)
CORS(app)

context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
# context.verify_mode = ssl.CERT_REQUIRED
# context.load_verify_locations("ca.crt")
context.load_cert_chain("root_ca.pem", "root_ca.key")

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
        nba_logger.info("Starting Development Server")
        app.run(debug=True, host=f_host, port=f_port, threaded=True, use_reloader=True, ssl_context=context)
    else:
        nba_logger.info("Starting Production Type Flask Server, However it is recommended to use gunicorn inside of running python script directly")
        app.run(debug=False, host=settings.FLASK_HOST, port=settings.FLASK_PORT, threaded=True, use_reloader=False)

if __name__ == "__main__":
    if len(sys.argv) == 3:
        # You can specify host and port with the first and second command line arguments
        nba_logger.info(f"Starting Flask on host: {sys.argv[1]} and port: {sys.argv[2]}")
        start_server(f_host=sys.argv[1], f_port=sys.argv[2] )
    else:
        start_server()








