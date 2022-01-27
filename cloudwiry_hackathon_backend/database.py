from pymongo import MongoClient

client = MongoClient("mongodb+srv://rahuls:cloud123@cluster0.rfwrv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

db = client.simple_blob

collection_name = db["users"]

