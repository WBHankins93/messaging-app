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
    Paper
} from "@mui/material";
import { getToken } from "../utils/sessionStorage";

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const wsClient = useRef<WebSocketClient | null>(null);
  const token = getToken("accessToken");
  const roomId = "global"

  useEffect(() => {
    if (!token) {
      console.error("No access token found. Cannot connect to WebSocket.");
      return;
  }

    wsClient.current = new WebSocketClient(`ws://localhost:8000/ws/${roomId}`, token);

    wsClient.current.connect((message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
        wsClient.current?.disconnect();
    };
  }, [token, roomId]);

  // Send message to WebSocket serve
  const handleSendMessage = () => {
    if (input.trim() && wsClient.current) {
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
    </Box>
  );
};

export default Chat;