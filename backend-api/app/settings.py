import os, sys, logging
#load env

if os.getenv('ENV_TYPE') != 'PROD':
    logging.info("Loading From .env file")
    from dotenv import load_dotenv
    load_dotenv()
else:
    logging.warning("Inside Production Environment! No Env file")

LOGGING_LEVEL=logging.DEBUG #Logging level for entire system

# Flask Vars
FLASK_PORT = 8080 # Flask Port
FLASK_HOST = '0.0.0.0' # Flask host

#Mongo
MONGO_URL = '127.0.0.1:27069' #Main url being used for connecting.
MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_DB = 'nba' # Database used by NBA
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASS = os.getenv('MONGO_PASS')


PLAYER_COLLECTIONS = ['players','player_data','season_stats']

# Colors for printing
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
URL_REGEX = r'(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})'




