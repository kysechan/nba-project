#!/bin/bash

#Flask variables
export FLASK_DEBUG=0
export FLASK_ENV=production
export FLASK_APP=server.py
export ENV_TYPE=PROD


# For Prod:
# (No auto updating but 4 threaded workers)
gunicorn -w 4 -b 0.0.0.0:8080 server:server

