import React, { useEffect, useState } from "react";
import socket from "../socket/socket";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState("You");

  useEffect(() => {
    socket.connectToSocket((data) => {
      console.log("Socket connected successfully ====>", data);
    });
    socket.listenChatMessage((data) => {
      setChatHistory((prev) => [
        ...prev,
        { user: data.user, text: data.message },
      ]);
    });
    return () => {
      socket.listenDisconnection();
    };
  }, []);

  const handleSendMessage = () => {
    console.log("Sending message ====>", message);
    console.log("Socket ID ====>", socket.socket.id);

    if (message) {
      socket.emitChatMessage({
        socketId: socket.socket.id,
        message: message,
        user: currentUser,
      });
      setChatHistory((prev) => [...prev, { user: currentUser, text: message }]);
    }
    setMessage("");
  };
  console.log("chatHistory ==== >", chatHistory);

  return (
    <div className="chat-container">
      <div className="chat-popup">
        <div className="chat-header">
          <h4>Chat</h4>
          <button className="close-button">×</button>
        </div>
        <div className="chat-body">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.user === currentUser ? "sender" : "receiver"
              }`}
            >
              <strong></strong> {msg.text}
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
