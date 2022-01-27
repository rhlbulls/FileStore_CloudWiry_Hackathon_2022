from fastapi import APIRouter,File,UploadFile
from database import collection_name
from users_model import Users
from users_schema import users_serializer
import os
import shutil
from starlette.responses import FileResponse

user_api_router = APIRouter()
#My files
@user_api_router.get('/myfiles/{username}')
async def get_files(username:str):
    user=users_serializer(collection_name.find({"username":username}))
    if len(user)>0:
        return {"status":"cred matching","authenticated":True, "data":user}
    else:
        return {"status": "no user","authenticated":False, "data":user}

#Verify users
@user_api_router.get('/verify/{username},{password}')
async def verify_user(username:str,password:str):
    user=users_serializer(collection_name.find({"username":username,"password":password}))
    if len(user)>0:
        return {"status":"cred matching","authenticated":True, "data":user}
    else:
        return {"status": "cred mismatch","authenticated":False, "data":user}

#Create new user
@user_api_router.post('/')
async def post_user(user:Users):
    data=users_serializer(collection_name.find({"username":user.username}))
    if(len(data)>0):
        return {"status":"username already exists","authenticated":False}
    _id = collection_name.insert_one(dict(user))
    user=users_serializer(collection_name.find({"_id": _id.inserted_id}))
    return {"status":"ok", "data":user,"authenticated":True}

#Upload a file
@user_api_router.post('/file/{username}')
async def post_file(username:str,file:UploadFile = File(...)):
    _id= collection_name.find_one_and_update({"username":username},
    {'$push':{'files_created':username+"/"+file.filename}})
    user=users_serializer(collection_name.find({"username": username}))
    if not os.path.exists(username):
        os.makedirs(username)
    with open(username+"/"+file.filename, "xb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"status":"New file created","data":user}

#Share a file
@user_api_router.patch('/file/share/{username},{to},{filename}')
async def share_file(username:str,to:str,filename:str):
    _id= collection_name.find_one_and_update({"username":to},
    {'$push':{'shared_to_me':username+"/"+filename}})
    return {"status":"file Shared"}

#Download a file
@user_api_router.get('/file/download/{username},{filename}')
async def download_file(username:str,filename:str):
    file=open(username+'/'+filename,'r')
    return FileResponse(username+'/'+filename, media_type='application/octet-stream',filename=username+'/'+filename)

#Rename a file
@user_api_router.patch('/file/rename/{username},{filename},{new_name}')
async def rename_file(username:str,filename:str,new_name:str):
    os.rename(username+'/'+filename, username+'/'+new_name)
    _id= collection_name.update_many({"files_created":username+'/'+filename},
    {'$set':{'files_created.$':username+"/"+new_name}})
    _id= collection_name.update_many({"shared_to_me":username+'/'+filename},
    {'$set':{'shared_to_me.$':username+"/"+new_name}})
    return {"status":"file name has been changed"}

#Delete a file
@user_api_router.delete('/file/delete/{username},{filename}')
async def delete_file(username:str,filename:str):
    os.remove(username+'/'+filename)
    _id= collection_name.update_many({"files_created":username+'/'+filename},
    {'$pull':{'files_created':username+"/"+filename}})
    _id= collection_name.update_many({"shared_to_me":username+'/'+filename},
    {'$pull':{'shared_to_me':username+"/"+filename}})
    return {"status":"file has been deleted"}