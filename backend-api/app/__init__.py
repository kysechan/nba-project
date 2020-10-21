import logging
import sys, time, os
import coloredlogs
from app import settings

if os.getenv('ENV_TYPE') != 'PROD':
    # if locally testing, you can use colors in logging
    coloredlogs.install()

logging.basicConfig(stream=sys.stdout, level=settings.LOGGING_LEVEL)
logging.Formatter.converter = time.localtime
# Setting up main logger
# Use Logger not logging


# Use globally inside module
nba_logger = logging.getLogger('nba_app')
nba_logger.setLevel(settings.LOGGING_LEVEL)

from app.database.mongo_interace import MongoInterface
try:
    playerdb = MongoInterface(settings.MONGO_URL,'nba-players')
    if not playerdb or playerdb.test_connection() == None:
        raise Exception("No playerdb object or could not connect to db")
except Exception as e:
    nba_logger.error(f"Could not connect to db. Error: {e}")


