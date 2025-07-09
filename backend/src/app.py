from sys import prefix
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import challenge, web_hooks


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(challenge.router, prefix='/api')
app.include_router(web_hooks.router, prefix="/webhooks")

