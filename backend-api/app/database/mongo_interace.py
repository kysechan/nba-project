from pymongo import MongoClient
from bson.objectid import ObjectId
from app import settings
import logging, sys
from pprint import pprint
import json

from app import nba_logger


class MongoInterface:
    def __init__(self, connection_url, database ,port=27069):
        """
            MongoInterface is the interface for mongo databases using pymongo. Used for
            nba_logger, storage of feedback, and storage of all other resources needed such
            as Page Id maps to Page Titles.

            :param host: host ip of mongo db
            :param database: default database to use for all storage
            :param username: username of mongodb
            :param password: mongodb password
            :param port: port of mongodb. default is 27017
            :raises Exception: if connection to db fails an exception is raised.
        """

        self.connection_url = connection_url

        self.client = MongoClient(self.connection_url)
        self.database = database
        self.db = self.client[database]

        try:
            serverStatusResult=self.db.command("serverStatus")
            nba_logger.info(f"Server Status: {serverStatusResult['ok']}")
        except Exception as e:
            nba_logger.info(f"Error when testing connection: {e}")
            raise Exception("Could not connect to mongo db")

    def test_connection(self):
        """
            Pings mongo db to test connection of database.

            :returns: integer of whether or not status is up
        """
        return self.db.command("serverStatus")

    def find_player(self, collection, player_name):
        """
            Uses full text search to search for a player name
        """
        print(player_name)
        return self.db[collection].find_one({"$text": {"$search": "'\"" + player_name + "\"'"}})

    def find_all_player_data(self, player_name):
        """
            Uses full text search to search for a player name
        """
        basic_player = self.db['players'].find_one({"$text": {"$search":player_name}}, {'_id': False})
        player_stats = self.db['player_data'].find_one({"$text": {"$search":player_name}}, {'_id': False})
        season_stats = self.db['season_stats'].find({"$text": {"$search":player_name}}, {'_id': False})

        result = {}
        missing = []
        correct_player = ""
        if basic_player and basic_player != {}:
            result['basic'] = basic_player
            correct_player = basic_player['player']
        else:
            result['basic'] = {}
            missing.append('basic')

        if player_stats and player_stats != {}:
            result['stats'] = player_stats
        else:
            result['stats'] = {}
            missing.append('stats')

        if season_stats and season_stats != []:
            result['seasons'] = []
            for doc in season_stats:
                if doc['player'] == correct_player:
                    result['seasons'].append(doc)
            nba_logger.info("Length of season stats: {}".format(len(result['seasons'])))
        else:
            result['seasons'] = []
            missing.append('seasons')

        result['ok'] = True

        if len(missing) != 0:
            result['ok'] = False
            result['missing'] = missing

        return result

    def find_one_fulltext(self, collection, query):
        return self.db[collection].find_one({"$text": {"$search":query}}, {'_id': False})

    def find_by_year(self, collection, query, year=2019, player=None, team=None):
        player = "stephen curry"
        a = self.db[collection].find_one({"Player": player})
        return a



    def mfind_one(self, obj, collection):
        try:
            result=self.db[collection].find_one(obj)
            return result
        except Exception as e:
            nba_logger.error("Could not find item in mongo db. Error: {}".format(e))
            return None

    def insert_json(self, obj, collection):
        """
            Inserts json object into mongo collection.

            :param obj: json obj to be inserted
            :param collection: name of collection where the json is to be inserted
            :returns: boolean of whether or not the insert was successful
        """
        try:
            result=self.db[collection].insert_one(obj)
            nba_logger.info(f"Inserted object successfully: {result}")
        except Exception as e:
            nba_logger.error(f"Could not insert object. Error: {e}")
            return False
        return True

    def check_then_insert(self, check_obj, add_obj, collection):
        try:
            check = self.db[collection].find_one(check_obj)
            if check:
                return 0
                nba_logger.info("Matching document already in db.")
            else:
                result=self.db[collection].insert_one(add_obj)
                nba_logger.info(f"Sucessfully added new doc: {result}")
                return 1
        except Exception as e:
            nba_logger.error(f"Could not add user. Error: {e}")
            return -1

    def remove_all(self, obj, collection):
        try:
            documents = self.db[collection].find(obj)
            for doc in list(documents):
                result = self.db[collection].remove({'_id': doc['_id']})
                if result:
                    nba_logger.info(f"Remove document: {doc}")
                else:
                    nba_logger.warning(f"Could no remove document: {doc}")
        except Exception as e:
            nba_logger.error(f"Could not remove user. Error: {e}")
            return False
        return True


    def ping(self):
        return self.db.command('ping')

    def update_all_matching(self, match_obj, update_obj, collection):
        try:
            documents = self.db[collection].find(match_obj)
            for doc in list(documents):
                result = self.db[collection].update({'_id':doc['_id']},{'$set':update_obj},upsert=True)
                if result:
                    nba_logger.info(f"Sucessfully updated document: {result}")
                else:
                    nba_logger.warning(f"Could no update document: {result}")
        except Exception as e:
            nba_logger.error(f"Could not update document. Error: {e}")
            return False
        return True

    def find_latest_date(self, obj, collection):
        """
            Finds one document based on obj specs, includes
            error handling
        """
        try:
            result=self.db[collection].find_one(obj, sort=[('issueed_at', -1 )])
            return result
        except Exception as e:
            nba_logger.error("Could not find item in mongo db. Error: {}".format(e))
            return None

    def find_latest_creation(self, obj, collection):
        """
            Finds one document based on obj specs, includes
            error handling
        """
        try:
            result=self.db[collection].find_one(obj, sort=[('creation_ts', -1 )])
            return result
        except Exception as e:
            nba_logger.error("Could not find item in mongo db. Error: {}".format(e))
            return None

    def search(self, obj, collection):
        try:
            result=self.db[collection].find_one(obj)
            return result
        except Exception as e:
            nba_logger.info("Could not find item in mongo db. Error: {}".format(e))
            return None

    def mfind(self, collection, obj):
        try:
            result=list(self.db[collection].find(obj, {'_id': False}))
            return result
        except Exception as e:
            nba_logger.error("Could not find item in mongo db. Error: {}".format(e))
            return []


    def get_collection(self, collection):
        """
            dump contents of collection into a list.

            :param collection: name of collection in mongodb under current database
            :returns: list of collection content
        """
        try:
            return list(self.db[collection].find({}))
        except Exception as e:
            nba_logger.error(f"Could not get collection. Error: {e}")
            return []

    def get_latest_grouping(self, collection, field_name='creation_ts'):
        latest_date = self.db[collection].find_one({}, sort=[(field_name, -1)])[field_name]
        results = list(self.db[collection].find({field_name: latest_date}))
        return results

    def batch_upload(self, arr, collection):
        """
            Uploads an array of json objects. Takes in a list of json objects
            then iterated over list and uploads it.

            :param arr: array of json objects to be injested
            :param collection: mongodb collection name
            :returns: list of boolean variables that to show if that index was uploaded sucessfully
        """
        statuses = []
        for obj in arr:
            if self.insert_json(obj, collection):
                statuses.append(True)
            else:
                statuses.append(False)
        return statuses

