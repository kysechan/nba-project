import random
import pymongo
import unittest

from app.database.mongo_interace import MongoInterface
import requests

MONGO_URL = '127.0.0.1:27069'
API_URL = 'https://0.0.0.0:8080'


class MongoTestFunctions(unittest.TestCase):
    def setUp(self):
        """
            Sets up Mongo Test class and connects to a database
            to test.
        """
        self.test_mongo = MongoInterface(MONGO_URL, 'nba-players')

    def test_connection(self):
        """
            Makes sure connection is successful.
            Asserts True
        """
        conn_test = self.test_mongo.test_connection()
        print(f"Connection Test: {conn_test['ok']}")
        self.assertTrue(conn_test['ok'] == 1.0)

    def test_unique_players(self):
        """
            Checks mongo_interface classes function get_unique_players() to
            get a list of all unique players from database.
        """
        unique_players = self.test_mongo.get_unique_players()
        print(f"Unique Player Retrieve Sucess: {unique_players['success']}")
        self.assertTrue(unique_players['success']
                        and unique_players['length'] > 0)

    def test_player_search(self):
        """
            Unit test for searching for player by name.
        """
        player_name = 'Seth Curry'
        player = self.test_mongo.find_player('players', player_name)
        print(player)
        self.assertTrue(player['player'] == player_name)

    def test_all_player_data(self):
        """
            Unit test for whether or not we can get all
            player data for a given player.
        """
        player_name = 'Seth Curry'
        player = self.test_mongo.find_all_player_data(player_name)
        print(f"Got All Season Data for player: {player['basic']['player']}")
        self.assertTrue(player['basic']['player'] == player_name)
    
    def test_search_v2(self):
        advanced_m = MongoInterface(MONGO_URL, 'official_complete')
        player_name = 'Seth Curry'
        player = advanced_m.search_v2('advanced_players', player_name)

class APITestFunctions(unittest.TestCase):
    def setUp(self):
        """
            Sets up player name to be used throughout testing api's
        """
        self.player_name = 'Seth Curry'

    def test_index(self):
        """
            Makes sure webserver is up
        """
        index_test = requests.get(API_URL + '/api', verify=False).json()
        print(index_test)
        self.assertEqual(index_test['system'], 'nba-api')

    def test_basic_player(self):
        """
            API Test for basic player searching.
        """
        resp = requests.get(
            API_URL + f'/api/player/basic?player={self.player_name}', verify=False).json()
        print(resp)
        self.assertEqual(resp['player'], self.player_name)

    def test_stats_player(self):
        """
            API Test for getting player stats
        """
        resp = requests.get(
            API_URL + f'/api/player/stats?player={self.player_name}', verify=False).json()
        print(resp)
        self.assertEqual(resp['player'], self.player_name)

    def test_unique_players(self):
        """
            API unit test for getting all unique players to be used in autocomplete.
        """
        resp = requests.get(API_URL + '/api/player/all', verify=False).json()
        print(resp['success'])
        self.assertTrue(resp['success'])


if __name__ == '__main__':
    unittest.main()
