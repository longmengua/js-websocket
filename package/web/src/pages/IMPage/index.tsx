// IMPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { Message } from "./types"; // Define your Message type in a separate file
import { ReduxStore } from "../../redux";
import { Util } from "../../utils/util";
import { mockWebsoketDataFromServer } from "../../api/mock";

export const IMPage: React.FC = () => {
  const { login } = ReduxStore.getState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const socket = Util.useSocket({
    url: `ws://localhost:8888?authToken=${login.authToken}`,
  });

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMessageObj: Message = {
        id: messages.length + 1,
        name: login?.managerInfo?.name,
        content: newMessage,
        timestamp: new Date(),
      };

      setMessages([...messages, newMessageObj]);
      setNewMessage("");
    }
  };

  const cleanMessage = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // If only "Enter" is pressed, send the message
      e.preventDefault(); // Prevents the default behavior (submitting a form)
      sendMessage();
    }
  };

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const payload: {
        name: string;
        message: string;
      } = JSON.parse(event.data);
      const newMessageObj: Message = {
        id: messages.length + 1,
        name: payload?.name,
        content: payload?.message,
        timestamp: new Date(),
      };

      setMessages([...messages, newMessageObj]);
    };
  }, [socket, messages]);

  return (
    <div>
      <div>Instant Messaging</div>
      <div
        ref={messageContainerRef}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "250px",
          overflowY: "scroll",
        }}
      >
        {messages.map((message) => (
          <div key={message.id}>
            <span className="text-[10px] mr-[5px]">
              ({message.timestamp.toLocaleString()})
            </span>
            <strong>{message.name} : </strong>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={cleanMessage}>Clean Message Histroy</button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="Type your message..."
        />
        <button className="ml-[10px]" onClick={sendMessage}>
          Send
        </button>
        <button className="ml-[10px]" onClick={mockWebsoketDataFromServer}>
          Mock
        </button>
      </div>
    </div>
  );
};
