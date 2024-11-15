from fastapi import FastAPI, WebSocket
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


# WebSocket placeholder
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await websocket.accept
    await websocket.send_text(f"Hello client {client_id}")
    await websocket.close()