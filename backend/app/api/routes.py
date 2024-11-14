from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from ..auth import (
    users_db,
    get_password_hash,
    create_access_token,
    authenticate_user
)
from ..config import settings

router = APIRouter()

# Route for User Signup
@router.post("/signup", status_code=201)
async def signup(username: str, password: str):
    """
    Signup endpoint for user registration.
    """
    if username in users_db:
        # Checking to see if username already exists
        raise HTTPException(status_code=400, details="Username already registered.")
    
    # Hash the password then store user data
    hashed_password = get_password_hash(password)
    users_db[username] = {"username": username, "password": hashed_password}
    return {"message": "User created successfully"}

@router.get("/ping")
async def ping():
    return {"message": "pong"}