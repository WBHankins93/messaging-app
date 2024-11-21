import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Chat from "../components/Chat";

const ChatPage: React.FC = () => {
    return (
        <ProtectedRoute>
            <Chat />
        </ProtectedRoute>
    );
};

export default ChatPage;