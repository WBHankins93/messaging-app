import React, { useEffect,useRef, useState } from "react";
import { WebSocketClient } from "../utils/websocket";

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const wsClient = useRef<WebSocketClient | null>(null);

  useEffect(() => {

    wsClient.current = new WebSocketClient("ws://localhost:8000/ws/1");

    wsClient.current.connect((message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
        wsClient.current?.disconnect();
    };
  }, []);

  // Send message to WebSocket serve
  const handleSendMessage = () => {
    if (input.trim() && wsClient.current) {
        wsClient.current.sendMessage(input);
        setInput("");
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div style={{ border: "1px solid #ddd", padding: "10px", height: "200px", overflowY: "scroll" }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;