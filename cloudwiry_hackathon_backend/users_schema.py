def user_serializer(user) -> dict:
    return {
        "id":str(user["_id"]),
        "username":user["username"],
        "password":user["password"],
        "files_created":user["files_created"],
        "shared_to_me":user["shared_to_me"]
    }
def users_serializer(users) -> list:
    return [user_serializer(user) for user in users]