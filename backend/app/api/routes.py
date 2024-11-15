from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import  OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from typing import List
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from ..models import User
from ..database import get_db

from ..auth import (
    get_password_hash,
    create_access_token,
    authenticate_user,
    oauth2_scheme
)
from ..config import settings
from ..auth import oauth2_scheme

router = APIRouter()

# Route for User Signup
@router.post("/signup", status_code=201)
async def signup(username: str, password: str, db: Session = Depends(get_db)):
    """
    Signup endpoint for user registration.
    """
    # Check if the username already exists in the database
    user = db.query(User).filter(User.username == username).first()
    if user:
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    # Hash the password and store user data in the database
    hashed_password = get_password_hash(password)
    new_user = User(username=username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(),  db: Session = Depends(get_db)):
    """
    Login endpoint for user authentication
    """
    user = await authenticate_user(form_data.username, form_data.password, db)
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
async def get_users(db: Session = Depends(get_db)):
    """
    Retrieve list of users
    """
    users = db.query(User.username).all()
    return [user[0] for user in users]

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