import logging
import sys
import time
from app import settings

logging.basicConfig(stream=sys.stdout, level=settings.LOGGING_LEVEL)
logging.Formatter.converter = time.localtime
# Setting up main logger
# Use Logger not logging
logger = logging.getLogger('nba_routes')
logger.setLevel(settings.LOGGING_LEVEL)
