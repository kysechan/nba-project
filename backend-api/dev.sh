#!/bin/bash



#Flask variables
export FLASK_DEBUG=1
export FLASK_ENV=development
export FLASK_APP=server.py
export ENV_TYPE=dev


# For Dev:
# (Auto-updates website when change occurs on source.)
poetry run python server.py

# For Prod:
# (No auto updating but 4 threaded workers)
# gunicorn -w 4 -b 0.0.0.0:8080 app:app
