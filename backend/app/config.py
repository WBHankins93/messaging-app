import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Messaging App"
    API_V1_STR: str = "/api/v1"
    JWT_SECRET: str = os.getenv("JWT_SECRET")  # Replace with a secure key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Set token expiry time in minutes

settings = Settings()