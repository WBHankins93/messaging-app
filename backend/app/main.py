from fastapi import FastAPI
from .api.routes import router

#Intialize FastAPI
app = FastAPI()

# Include routes
app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Messaging app backend"}