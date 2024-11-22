import React, { useEffect, useRef, useState } from "react";
import { WebSocketClient } from "../utils/websocket";
import {
    Box,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Alert
} from "@mui/material";
import { clearToken, getToken } from "../utils/sessionStorage";
import { useRouter } from "next/router";

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const wsClient = useRef<WebSocketClient | null>(null);
  const token = getToken("accessToken");
  const roomId = "global"
  const router = useRouter();

  useEffect(() => {
    console.log("useEffect triggered with token:", token, "and roomId:", roomId);

    if (!token) {
      setError("No access token found. Cannot connect to WebSocket.");
      return;
    }

    wsClient.current = new WebSocketClient(`ws://localhost:8000/ws/${roomId}`, token);

    const handleIncomingMessage = (message: string) => {
      console.log("New message received:", message);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        console.log("Updated messages state:", updatedMessages); // Debug log
        return updatedMessages;
    });
    };

    const handleReconnecting = () => {
      console.warn("WebSocket reconnecting...");
      setIsReconnecting(true);
      setError(null);
    };

    const handleReconnected = () => {
      console.log("WebSocket reconnected.");
      setIsReconnecting(false);
    };

    const handleError = (err: string) => {
      console.error("WebSocket error:", err);
      setError(`WebSocket error: ${err}`);
    };

    console.log("Connecting to WebSocket...");
    wsClient.current.connect(handleIncomingMessage, handleReconnecting, handleReconnected, handleError);

    return () => {
        console.log("Cleaning up WebSocket connection...");
        if (wsClient.current) {
            wsClient.current.disconnect();
        }
    };
}, [token, roomId]);

useEffect(() => {
  console.log("messages state updated:", messages);
}, [messages]);

const handleLogout = () => {
  clearToken("accessToken");
  clearToken("refreshToken");
  
  if (wsClient.current)
    wsClient.current.disconnect();
    router.push("/login");
}

  // Send message to WebSocket serve
  const handleSendMessage = () => {
    if (input.trim() && wsClient.current) {
      console.log("Sending input:", input);
        wsClient.current.sendMessage(input);
        setInput("");
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ maxWidth: 600, mx: "auto", mt: 4 }}
    >
      <Typography variant="h4" gutterBottom>
        WebSocket Chat
      </Typography>
      
      <Paper
        ref={chatBoxRef}
        elevation={3}
        sx={{
          width: "100%",
          height: 300,
          overflowY: "auto",
          p: 2,
          bgcolor: "#fafafa",
          border: "1px solid red",
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ mb: 1 }}>
              <ListItemText
                primary={msg}
                primaryTypographyProps={{
                  style: {
                    wordWrap: "break-word",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box display="flex" alignItems="center" mt={2} width="100%">
        <TextField
          fullWidth
          variant="outlined"
          label="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ flexShrink: 0 }}
        >
          Send
        </Button>
      </Box>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Chat;