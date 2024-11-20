from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import logging
from sqlalchemy.orm import Session

from .database import engine, SessionLocal, get_db
from .models import Base, Message
from .api.routes import router, decode_jwt

#Intialize FastAPI
app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Basic logging config set up
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

logger = logging.getLogger("websocket")
logger.setLevel(logging.INFO)

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


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    db = SessionLocal()
    
    try:
        await websocket.accept()
        logger.info(f"Client connected to room {room_id}")

        while True:
            data = await websocket.receive_text()
            
            # Extract user from token
            token = websocket.headers.get("Authorization").split("Bearer")[-1]
            user = decode_jwt(token, db)

            # Save message to database
            new_message = Message(content=data, sender_id=user.id, room_id=room_id)
            db.add(new_message)
            db.commit()

            await websocket.send_text(f"{user.username}: {data}")

    except WebSocketDisconnect:
        logger.info(f"Client disconnected from room {room_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        db.close()
