import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./chat.css";

const socket = io("http://localhost:5001");

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const bottomRef = useRef();

  const email = localStorage.getItem("email");
  const username = email ? email.split("@")[0] : "guest"; // Extract username from email


  useEffect(() => {
    socket.emit("join", username);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = {
      sender: username,
      message: text,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", msg);
    setText("");
    setTyping(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h2>💬 We Talk</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Online users */}
      <div className="online-users">
        Online: {onlineUsers.join(", ")}
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              m.sender === username ? "my-message" : "other-message"
            }`}
          >
            <strong>{m.sender}</strong>
            <p>{m.message}</p>
            <span>{m.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {typing && <p className="typing">Someone is typing...</p>}

      {/* Input */}
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setTyping(true);
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
  