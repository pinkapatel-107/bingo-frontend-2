import React, { useEffect, useState, useContext } from "react";
import { DataContext } from "../DataContext";

const ChatComponent = ({ socket }) => {
  const [message, setMessage] = useState("");
  const context = useContext(DataContext);

  useEffect(() => {
    const handleIncomingMessage = (data) => {
      console.log("receive chat message ==== >", data);
      
      const newMessage = { user: data.user, text: data.message, messageId: data.msgId };
      context.setChatHistory((prev) => {
        const isDuplicate = prev.some((message) => message. msgId === newMessage. msgId);
        if (!isDuplicate) {
          return [...prev, newMessage]; 
        }
        return prev;
      });
    };
    
    socket.listenChatMessage(handleIncomingMessage);
    
  }, []);

  const handleSendMessage = () => {
    if (message) {
      socket.emitChatMessage({
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
          {context.chatHistory.map((msg, index) => (
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
