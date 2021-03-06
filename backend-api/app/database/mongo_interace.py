from pymongo import MongoClient
from bson.objectid import ObjectId
from app import settings
import logging
import sys
from pprint import pprint
import json

nba_logger = logging.getLogger('nba_app')
nba_logger.setLevel(settings.LOGGING_LEVEL)

class MongoInterface:
    def __init__(self, connection_url, database, port=27069):
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
            serverStatusResult = self.db.command("serverStatus")
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

    def get_unique_players(self):
        # print(list(self.db.distinct("Players"))
        player_list = self.db['advanced_players'].distinct('Player', {'League': 'NBA'})
        # print(player_list[0])
        master  = [{"player": player} for player in player_list]

        # with open('players.txt', 'w') as fp:
        #     fp.write(str(master))
        
        # pprint(master)
        #result = set(list(self.db['players'].find({}, {'_id': False}).distinct('player')))
        # print(result)
        nba_logger.info(f"Getting Unique Players, length: {len(master)}")
        success_var = True if len(master) > 0 else False
        return {"success":success_var, "length":len(master), "players":[{"player":x} for x in list(master)]}

    def find_player(self, collection, player_name):
        """
            Uses full text search to search for a player name
        """
        print(player_name)
        return self.db[collection].find_one({"$text": {"$search": "'\"" + player_name + "\"'"}})

    def find_player_advanced(self, collection, player_name, year, stage):
        """
            Uses full text search to search for a player name
        """
        print(player_name)
        print(year)
        nba_logger.info(f"REQUEST INFO:\n\t{player_name}\n\t{year}\n\t{stage}")
        result = self.db[collection].find_one({"$text": {"$search": "\""+ str(player_name) + "\"" + "\""+ str(year) + "\"" + "\""+ str(stage) + "\"" + "\""+ str(int(year)+1) + "\""}}, {'_id': False})
        nba_logger.info(f"result: {result}")
        return result

    # def find_player_advanced(self, collection, player_name, year, stage):
    #     """
    #         Uses full text search to search for a player name
    #     """
    #     # print(player_name)
    #     print(year)
    #     # print(stage)
    #     #year = int(year)
    #     #player_name = player_name.replace(' ', '%20')
    #     if not player_name:
    #         return {}
        
    #     query_string = f'"{player_name}" '
    #     query_obj = {"Player":{'$regex':f".*{player_name}.*"}}
    #     if year and year != "" and year != "undefined":
    #         query_string += f'"{year}" '
    #         query_obj["Season"] = {'$regex':f".*{year}.*"}
    #     if stage and stage != "" and stage != "undefined":
    #         query_string += f'"{stage}"'
    #         query_obj["Stage"] = {'$regex':f".*{stage}.*"}
        
    #     nba_logger.info(f"Query (find_player_advanced): {query_obj}")
        
    #     #return self.db[collection].find_one({"$text": {"$search": query_string}}) #Full Text
    #     result = self.db[collection].find_one(query_obj, {'_id': False})
    #     nba_logger.info(f"Result: {result}")
    #     return result
    
    def search_v2(self, collection, player_name, year=None, stage=None):
        nba_logger.info(f"Calling search v2 with params: {player_name}, {year}, {stage}")
        if not player_name:
            nba_logger.info("No player specified")
            return {}
        
        #Similar Name
        query_obj = {"Player":{'$regex': f".*{player_name}.*", "$options": "-i"}} 
        # Exact Name
        #query_obj = {"Player":{"$regex":player_name, "$options": "-i"}} 

        all_stats = list(self.db[collection].find(query_obj, {'_id': False}))
        nba_logger.info(len(all_stats))
        #nba_logger.info(all_stats)
        bool_year = True if year and year != '' and year != 'undefined' else False
        bool_stage = True if stage and stage != '' and stage != 'undefined' else False
        
        if len(all_stats) > 0:
            filtered_obj = []
            for unfiltered in all_stats:
                processed_year = unfiltered['Season'].split(' - ')
                if len(processed_year) > 0:
                    try:
                        processed_year = [int(year) for year in processed_year]
                    except:
                        bool_year = False
                    if len(processed_year) == 2:
                        unfiltered["lower_year_bound"] = processed_year[0]
                        unfiltered["upper_year_bound"] = processed_year[1]
                else:
                    bool_year = False
                
                if not unfiltered.get("lower_year_bound") or not unfiltered.get("upper_year_bound"):
                    unfiltered["lower_year_bound"] = None
                    unfiltered["upper_year_bound"] = None

                nba_logger.info(f"!! bool_year: {bool_year} bool_stage: {bool_stage}")
                clean = True
                if bool_year:
                    nba_logger.info(f"Given: {int(year)} -- comparing: {processed_year}")
                    for raw_year in processed_year:
                        if raw_year < int(year):
                            clean = False
                            nba_logger.info(f"Failed year comparison -> Given: {int(year)} -- comparing: {processed_year}")
                            break
                    if clean:
                        nba_logger.info(f"Successful year comparison -> Given: {int(year)} -- comparing: {processed_year}")
                if bool_stage and stage.lower() not in unfiltered['Stage'].lower():
                    nba_logger.info(f"Failed stage comparison -> Given: {stage.lower()} -- comparing: {unfiltered['Stage'].lower()}")
                    clean = False
                
                if clean:
                    filtered_obj.append(unfiltered)
                else:
                    nba_logger.info(f"Not Clean: {unfiltered}")
            nba_logger.info(f"filtered_obj len: {len(filtered_obj)}")
            
            filtered_obj.sort(key=lambda x: x.get('lower_year_bound'))
            return filtered_obj    

        else:
            return []


    def find_all_player_data(self, player_name):
        """
            Uses full text search to search for a player name
        """
        basic_player = self.db['players'].find_one(
            {"$text": {"$search": player_name}}, {'_id': False})
        player_stats = self.db['player_data'].find_one(
            {"$text": {"$search": player_name}}, {'_id': False})
        season_stats = self.db['season_stats'].find(
            {"$text": {"$search": player_name}}, {'_id': False})

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
            nba_logger.info("Length of season stats: {}".format(
                len(result['seasons'])))
        else:
            result['seasons'] = []
            missing.append('seasons')

        result['ok'] = True

        if len(missing) != 0:
            result['ok'] = False
            result['missing'] = missing

        return result

    def find_one_fulltext(self, collection, query):
        return self.db[collection].find_one({"$text": {"$search": query}}, {'_id': False})

    def find_by_year(self, collection, query, year=2019, player=None, team=None):
        """
            Test funciton used for degbugging
        """
        player = "James Harden"
        a = self.db[collection].find_one(
            {"Player": {"$eq": "\"James Harden\""}})
        return a

    def mfind_one(self, obj, collection):
        """
            Returns top search result specified by the obj in the given collection

            :param obj: Json mongo search object
            :param collection: collection being searching in
            :raises Exception: Catch for if pymongo.find_one raises an error
            :return: Json object of result or None
        """
        try:
            result = self.db[collection].find_one(obj)
            return result
        except Exception as e:
            nba_logger.error(
                "Could not find item in mongo db. Error: {}".format(e))
            return None

    def insert_json(self, obj, collection):
        """
            Inserts json object into mongo collection.

            :param obj: json obj to be inserted
            :param collection: name of collection where the json is to be inserted
            :returns: boolean of whether or not the insert was successful
        """
        try:
            result = self.db[collection].insert_one(obj)
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
                result = self.db[collection].insert_one(add_obj)
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
                result = self.db[collection].update(
                    {'_id': doc['_id']}, {'$set': update_obj}, upsert=True)
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
            result = self.db[collection].find_one(
                obj, sort=[('issueed_at', -1)])
            return result
        except Exception as e:
            nba_logger.error(
                "Could not find item in mongo db. Error: {}".format(e))
            return None

    def find_latest_creation(self, obj, collection):
        """
            Finds one document based on obj specs, includes
            error handling
        """
        try:
            result = self.db[collection].find_one(
                obj, sort=[('creation_ts', -1)])
            return result
        except Exception as e:
            nba_logger.error(
                "Could not find item in mongo db. Error: {}".format(e))
            return None

    def search(self, obj, collection):
        try:
            result = self.db[collection].find_one(obj)
            return result
        except Exception as e:
            nba_logger.info(
                "Could not find item in mongo db. Error: {}".format(e))
            return None

    def mfind(self, collection, obj):
        try:
            result = list(self.db[collection].find(obj, {'_id': False}))
            return result
        except Exception as e:
            nba_logger.error(
                "Could not find item in mongo db. Error: {}".format(e))
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
        latest_date = self.db[collection].find_one(
            {}, sort=[(field_name, -1)])[field_name]
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
