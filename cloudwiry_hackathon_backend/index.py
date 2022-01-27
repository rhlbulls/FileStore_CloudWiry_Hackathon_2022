from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from users_routes import user_api_router
import uvicorn
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_api_router)

if __name__ == '__main__':
    uvicorn.run(app, port= 808, host='0.0.0.0')