from pymongo import MongoClient
from bson.objectid import ObjectId
from . import settings
import logging, sys

logging.basicConfig(stream=sys.stdout, format='%(asctime)s : %(levelname)s : %(message)s', level=settings.LOGGING_LEVEL)

class MongoInterface:
    def __init__(self, connection_url, database ,port=27017):
        """
            MongoInterface is the interface for mongo databases using pymongo. Used for
            logging, storage of feedback, and storage of all other resources needed such
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
            logging.info(f"Server Status: {serverStatusResult['ok']}")
        except Exception as e:
            logging.info(f"Error when testing connection: {e}")
            raise Exception("Could not connect to mongo db")

    def test_connection(self):
        """
            Pings mongo db to test connection of database.

            :returns: integer of whether or not status is up
        """
        return self.db.command("serverStatus")

    def mfind_one(self, obj, collection):
        try:
            result=self.db[collection].find_one(obj)
            return result
        except Exception as e:
            logging.error("Could not find item in mongo db. Error: {}".format(e))
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
            logging.info(f"Inserted object successfully: {result}")
        except Exception as e:
            logging.error(f"Could not insert object. Error: {e}")
            return False
        return True

    def insert_user(self, user_obj):
        """
            User object should have the keys:
                user_object = {
                    'user_id':{user_id},
                    'user_name':{user_name},
                    'channel_id':{channel_id},
                    'team_id':{team_id},
                    'timestamp':{datetime.utcnow()},
                    'muted':{bool},
                    'subscribed':{bool}
            }
        """
        collection = 'users'
        try:
            user_check = self.db[collection].find_one({'user_id':user_obj['user_id']}, sort=[('timestamp', -1 )])
            if user_check:
                result = self.db[collection].update({'_id':user_check['_id']},{'$set':user_obj},upsert=True)
                if result:
                    logging.info(f"Sucessfully updated user: {result}")
            else:
                result=self.db[collection].insert_one(user_obj)
                logging.info(f"Sucessfully added new user: {result}")
        except Exception as e:
            logging.error(f"Could not add user. Error: {e}")
            return False
        return True

    def check_then_insert(self, check_obj, add_obj, collection):
        try:
            check = self.db[collection].find_one(check_obj)
            if check:
                return 0
                logging.info("Matching document already in db.")
            else:
                result=self.db[collection].insert_one(add_obj)
                logging.info(f"Sucessfully added new doc: {result}")
                return 1
        except Exception as e:
            logging.error(f"Could not add user. Error: {e}")
            return -1

    def unsubscribe_user(self, user_obj):
        collection = 'users'
        try:
            users = self.db[collection].find({'user_id':user_obj['user_id']})
            for user in list(users):
                result = self.db[collection].remove({'_id': user['_id']})
                if result:
                    logging.info(f"Removed user document: {user}")
                else:
                    logging.warning(f"Could no remove user document: {user}")
        except Exception as e:
            logging.error(f"Could not remove user. Error: {e}")
            return False
        return True

    def remove_all(self, obj, collection):
        try:
            documents = self.db[collection].find(obj)
            for doc in list(documents):
                result = self.db[collection].remove({'_id': doc['_id']})
                if result:
                    logging.info(f"Remove document: {doc}")
                else:
                    logging.warning(f"Could no remove document: {doc}")
        except Exception as e:
            logging.error(f"Could not remove user. Error: {e}")
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
                    logging.info(f"Sucessfully updated document: {result}")
                else:
                    logging.warning(f"Could no update document: {result}")
        except Exception as e:
            logging.error(f"Could not update document. Error: {e}")
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
            logging.error("Could not find item in mongo db. Error: {}".format(e))
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
            logging.error("Could not find item in mongo db. Error: {}".format(e))
            return None

    def search(self, obj, collection):
        try:
            result=self.db[collection].find_one(obj)
            return result
        except Exception as e:
            logging.info("Could not find item in mongo db. Error: {}".format(e))
            return None

    def get_user(self, user_name):
        try:
            result = self.db['users'].find_one({'user_name': user_name}, sort=[('timestamp', -1 )])
            return result
        except Exception as e:
            logging.error("Could not find user in mongo db. Error: {}".format(e))
            return None

    def get_user_by_id(self, user_id):
        try:
            result = self.db['users'].find_one({'user_id': user_id}, sort=[('timestamp', -1 )])
            return result
        except Exception as e:
            logging.error("Could not find user in mongo db. Error: {}".format(e))
            return None

    def get_collection(self, collection):
        """
            dump contents of collection into a list.

            :param collection: name of collection in mongodb under current database
            :returns: list of collection content
        """
        try:
            return list(self.db[collection].find({}))
        except Exception as e:
            logging.error(f"Could not get collection. Error: {e}")
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

