# Messaging App
A real-time messaging application with user authentication, secure WebSocket connections, and database-backed message persistence. Built with a Python FastAPI backend and a TypeScript React/Next.js frontend.

## Project Overview
This application enables authenticated users to exchange messages in real-time using WebSockets. It supports token-based authentication, role-based access controls, and persistent chat history.

### Features
1. User Authentication & Authorization
JWT Authentication: Secure token-based authentication for user login.
Refresh Tokens: Long-lived refresh tokens for session management.
Role-Based Access Control:
Admin-specific endpoints for managing the application.
Regular users restricted to their accessible resources.
2. Real-Time Messaging
WebSocket Integration: Enables real-time, bidirectional communication between the client and server.
Message Persistence:
Messages are stored in the database with timestamps and sender details.
Chat history can be retrieved via a REST API.
Room-Based Messaging: Users can join specific chat rooms and exchange messages.
3. Backend
Framework: FastAPI
Endpoints:
/signup: User registration.
/token: User login and token generation.
/token/refresh: Refresh expired access tokens.
/chat: Retrieve chat history (protected).
WebSocket: /ws/{room_id} for real-time communication.
Database: SQLAlchemy ORM with Alembic for migrations.
4. Frontend
Framework: Next.js or React
Pages:
Signup: User registration form.
Login: Login with username and password.
Chat: Real-time messaging interface with chat history display.
5. Security
Passwords are hashed using bcrypt before being stored.
JWT tokens include expiration times and secure claims.
WebSocket connections are validated via bearer tokens.


### Project Structure

backend/
├── app/
│   ├── api/
│   │   ├── routes.py          # API route definitions
│   │   ├── auth.py            # Authentication utilities
│   ├── models.py              # SQLAlchemy models
│   ├── database.py            # Database connection and session utilities
│   ├── main.py                # Application entry point
│   ├── config.py              # Application settings
├── alembic/                   # Database migration scripts
frontend/
├── pages/
│   ├── signup.tsx             # Signup page
│   ├── login.tsx              # Login page
│   ├── chat.tsx               # Real-time chat page
├── components/                # Reusable UI components
README.md                      # Project documentation

### Setup Instructions
####1. Backend Setup
Clone the repository:
```
git clone <repo-url>
cd backend
```

Create a virtual environment:
```
python3 -m venv env
source env/bin/activate
```

Install dependencies:
```
pip install -r requirements.txt
```

Run database migrations:
```
alembic upgrade head
```

Start the backend server:
```
uvicorn app.main:app --reload
```


####2. Frontend Setup
Navigate to the frontend directory:
```
cd frontend
```

Install dependencies:
```
npm install
```

Start the frontend development server:
```
npm run dev
```

API Endpoints
Authentication
POST /api/v1/signup: Register a new user.
POST /api/v1/token: Login and retrieve access/refresh tokens.
POST /api/v1/token/refresh: Refresh access token.
Messaging
GET /api/v1/chat: Retrieve chat messages (protected).
GET /api/v1/chat/history: Retrieve chat history for a room (protected).
WebSocket /ws/{room_id}: Connect to a chat room for real-time communication.

Technologies Used
Backend: FastAPI, SQLAlchemy, Alembic
Frontend: React/Next.js
Database: SQLite (replaceable with PostgreSQL or MySQL)
Authentication: OAuth2 with JWT
WebSockets: FastAPI WebSocket API
