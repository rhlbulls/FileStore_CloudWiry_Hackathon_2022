from lib2to3.pytree import Base
from pydantic import BaseModel

class Users(BaseModel):
    username:str
    password:str
    files_created:list
    shared_to_me:list