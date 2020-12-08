import logging
import sys, time, os
import coloredlogs
from app import settings

if os.getenv('ENV_TYPE') != 'PROD':
    # if locally testing, you can use colors in logging
    coloredlogs.install()

# Set the logging stream to stdout at the level set in settying.py
logging.basicConfig(stream=sys.stdout, level=settings.LOGGING_LEVEL)
logging.Formatter.converter = time.localtime
# Setting up main logger
# Use Logger not logging


# Use globally inside module
nba_logger = logging.getLogger('nba_app')
nba_logger.setLevel(settings.LOGGING_LEVEL)


#  tries to establish connections with each needed database on mongo
# keeps connections open in seperate tunnels for speed and can be used
# throughout the module once it is initialized.
from app.database.mongo_interace import MongoInterface
try:
    playerdb = MongoInterface(settings.MONGO_URL,'nba-players')
    if not playerdb or playerdb.test_connection() == None:
        raise Exception("No playerdb object or could not connect to db")
except Exception as e:
    nba_logger.error(f"Could not connect to PLAYER db. Error: {e}")

try:
    gamedb = MongoInterface(settings.MONGO_URL,'nba-1')
    if not gamedb or gamedb.test_connection() == None:
        raise Exception("No playerdb object or could not connect to db")
except Exception as e:
    nba_logger.error(f"Could not connect to GAME db. Error: {e}")

try:
    official_complete = MongoInterface(settings.MONGO_URL, 'official_complete')
    if not official_complete or official_complete.test_connection() == None:
        raise Exception("No official_complete object or could not connect to db")
except Exception as e:
    nba_logger.error(f"Could not connect to OFFICIAL_COMPLETE db. Error: {e}")

