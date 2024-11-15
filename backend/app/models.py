from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Relationship to access messages sent by this user
    messages = relationship("Message", back_populates="sender")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    # Relationship to link back to the user who sent this message
    sender = relationship("User", back_populates="messages")