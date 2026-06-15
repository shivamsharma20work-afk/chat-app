import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../style.css";

const socket = io("/", { path: "/socket.io" });

function getInitials(email) {
  return email ? email.substring(0, 2).toUpperCase() : "?";
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typer, setTyper] = useState("");
  const bottomRef = useRef();

  const email = localStorage.getItem("email");
  const username = email ? email.split("@")[0] : "guest";

  useEffect(() => {
    socket.emit("join", username);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", (name) => {
      if (name !== username) {
        setTyper(name);
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg = {
      sender: username,
      message: text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("sendMessage", msg);
    setText("");
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", username);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="chat-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="app-name">We Talk</div>
          <div className="app-tagline">Chat freely. Connect instantly.</div>
        </div>

        <div className="online-section">
          <div className="section-label">Online — {onlineUsers.length}</div>
          {onlineUsers.map((user, i) => (
            <div className="user-item" key={i}>
              <div className="avatar">{getInitials(user)}</div>
              <span className="user-name">{user}</span>
              <div className="online-dot"></div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="avatar">{getInitials(username)}</div>
          <span style={{ fontSize: "13px", color: "#ccc" }}>{username}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Chat area */}
      <div className="chat-area">
        <div className="chat-header">
          <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>GC</div>
          <div>
            <div className="chat-title">Global Chat</div>
            <div className="chat-sub">{onlineUsers.length} people online</div>
          </div>
        </div>

        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.sender === username ? "mine" : "other"}`}>
              {m.sender !== username && (
                <div className="msg-sender">{m.sender}</div>
              )}
              <div className="msg-bubble">{m.message}</div>
              <div className="msg-time">{m.time}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">{typer} is typing...</span>
          </div>
        )}

        <div className="input-area">
          <input
            className="msg-input"
            value={text}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button className="send-btn" onClick={sendMessage}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#eeedfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}