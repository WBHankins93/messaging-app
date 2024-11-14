from fastapi import FastAPI
from .api.routes import router

#Intialize FastAPI
app = FastAPI()

# Include routes
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Messaging app backend"}