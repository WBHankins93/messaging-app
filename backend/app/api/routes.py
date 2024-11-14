from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import  OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from typing import List
from jose import JWTError, jwt

from ..auth import (
    users_db,
    get_password_hash,
    create_access_token,
    authenticate_user
)
from ..config import settings
from ..auth import oauth2_scheme

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

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm =Depends()):
    """
    Login endpoint for user authentication
    """
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        # If authentication fails, raise 401 error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate JWT token if auth is successful
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users", response_model=List[str])
async def get_users():
    """
    Retrieve list of users
    """
    return list(users_db.keys())

@router.get("/secure-data")
async def read_secure_data(token: str = Depends(oauth2_scheme)):
    """
    Secure endpoint only accessible through authentication.
    """
    # Verify the token
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"message": "This is secure data accessible only with a valid token"}

#Intial test of backend
@router.get("/ping")
async def ping():
    return {"message": "pong"}