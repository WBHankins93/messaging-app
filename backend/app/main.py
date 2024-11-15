from fastapi import FastAPI
from .api.routes import router
from .database import engine
from .models import Base

#Intialize FastAPI
app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Messaging app backend"}