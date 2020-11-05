#!/bin/bash

# docker run --name mongo -d \
#    -e MONGO_INITDB_DATABASE=nba \
#    -v $PWD/nba-mongo:/data/db \
#    -p 27017:27017 \
#    mongo:latest


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
