import React, { useEffect, useState } from "react";
import socket from "../socket/socket";

const ChatComponent = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const storedChatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(storedChatHistory);

    socket?.listenChatMessage((data) => {
      const newMessage = { user: data.user, text: data.message };
      setChatHistory((prev) => {
        const updatedHistory = [...prev, newMessage];
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory)); 
        return updatedHistory;
      });
    });

    return () => {
      socket.listenDisconnection();
    };
  }, []);

  const handleSendMessage = () => {
    if (message) {
      // const newMessage = { user: currentUser, text: message };
      console.log("Sending message ====>", message);
      console.log("Socket ID ====>", socket.socket.id);

      socket.emitChatMessage({
        socketId: socket.socket.id,
        message: message,
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-popup">
        <div className="chat-header">
          <h4>Chat</h4>
        </div>
        <div className="chat-body">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.user === "You" ? "sender" : "receiver"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
