from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from .database import engine
from .models import Base


#Intialize FastAPI
app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# CORS to allow requests to the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Messaging app backend"}


# WebSocket placeholder
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await websocket.accept()
    await websocket.send_text(f"Hello client {client_id}")
    await websocket.close()