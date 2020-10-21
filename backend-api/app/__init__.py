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

