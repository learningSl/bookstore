import pymongo


class Mongo:
    def __init__(self,db_name,table_name):
        self.client = pymongo.MongoClient(host='127.0.0.1',port=27017)
        self.db = self.client[db_name]
        self.table = self.db[table_name]
        self.session = self.client.start_session()
    def find(self,params={}):
        data = self.table.find(params)
        return data
    def insert_one(self,params):
        self.session.start_transaction()
        res = self.table.insert_one(params)
        self.session.commit_transaction()
        return res