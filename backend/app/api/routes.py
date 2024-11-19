from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import  OAuth2PasswordRequestForm
from datetime import timedelta
from typing import List
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..models import User
from ..database import get_db
from ..config import settings
from ..auth import (
    get_password_hash,
    create_access_token,
    authenticate_user,
    oauth2_scheme
)


class SignupRequest(BaseModel):
    username: str
    password: str

router = APIRouter()

def is_admin_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        user = db.query(User).filter(User.username == username).first()
        if not user or not user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can perform this action.",
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials.",
        )

# Route for User Signup
@router.post("/signup", status_code=201)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """
    Signup endpoint for user registration.
    """
    # Check if the username already exists in the database
    user = db.query(User).filter(User.username == request.username).first()
    if user:
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    # Hash the password and store user data in the database
    hashed_password = get_password_hash(request.password)
    new_user = User(username=request.username, hashed_password=hashed_password)
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
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/token/refresh")
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """
    Refreshes the access token using a valid refresh token.
    """
    try:
        # Decode the refresh token
        payload = jwt.decode(refresh_token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token.",
            )
        
        # Verify the user exists
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid refresh token.",
            )
        
        # Generate a new access token
        access_token = create_access_token(data={"sub": username})
        return {"access_token": access_token, "token_type": "bearer"}
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid refresh token.")

@router.get("/users", response_model=List[str])
async def get_users(user: User = Depends(is_admin_user), db: Session = Depends(get_db)):
    """
    Retrieve list of users (Admin-only)
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