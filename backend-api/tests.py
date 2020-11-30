import random, pymongo
import unittest

from app.database.mongo_interace import MongoInterface
import requests

MONGO_URL = '127.0.0.1:27069'
API_URL = 'https://0.0.0.0:8080'

class SampleTestClass(unittest.TestCase):
    # To make sure Unit Test Functionality is working
    
    def setUp(self):
        self.seq = list(range(10))

    def test_shuffle(self):
        """ make sure the shuffled sequence does not lose any elements """
        random.shuffle(self.seq)
        self.seq.sort()
        self.assertEqual(self.seq, list(range(10)))

        # should raise an exception for an immutable sequence
        self.assertRaises(TypeError, random.shuffle, (1, 2, 3))

    def test_choice(self):
        """ test a choice """
        element = random.choice(self.seq)
        self.assertTrue(element in self.seq)

    def test_sample(self):
        """ test that an exception is raised """
        with self.assertRaises(ValueError):
            random.sample(self.seq, 20)
        for element in random.sample(self.seq, 5):
            self.assertTrue(element in self.seq)

class MongoTestFunctions(unittest.TestCase):
    def setUp(self):
        self.test_mongo = MongoInterface(MONGO_URL,'nba-players')

    def test_connection(self):
        conn_test = self.test_mongo.test_connection()
        print(f"Connection Test: {conn_test['ok']}")
        self.assertTrue(conn_test['ok'] == 1.0)

    def test_unique_players(self):
        unique_players = self.test_mongo.get_unique_players()
        print(f"Unique Player Retrieve Sucess: {unique_players['success']}")
        self.assertTrue(unique_players['success'] and unique_players['length'] > 0)

    def test_player_search(self):
        player_name = 'Seth Curry'
        player = self.test_mongo.find_player('players', player_name)
        print(player)
        self.assertTrue(player['player'] == player_name)

    def test_all_player_data(self):
        player_name = 'Seth Curry'
        player = self.test_mongo.find_all_player_data(player_name)
        print(f"Got All Season Data for player: {player['basic']['player']}")
        self.assertTrue(player['basic']['player'] == player_name)

class APITestFunctions(unittest.TestCase):
    def setUp(self):
        self.player_name = 'Seth Curry'

    def test_index(self):
        index_test = requests.get(API_URL + '/api', verify=False).json()
        print(index_test)
        self.assertEqual(index_test['system'], 'nba-api')

    def test_basic_player(self):
        resp = requests.get(API_URL + f'/api/player/basic?player={self.player_name}', verify=False).json()
        print(resp)
        self.assertEqual(resp['player'], self.player_name)

    def test_stats_player(self):
        resp = requests.get(API_URL + f'/api/player/stats?player={self.player_name}', verify=False).json()
        print(resp)
        self.assertEqual(resp['player'], self.player_name)

    def test_unique_players(self):
        resp = requests.get(API_URL + '/api/player/all', verify=False).json()
        print(resp['success'])
        self.assertTrue(resp['success'])

if __name__ == '__main__':
    unittest.main()