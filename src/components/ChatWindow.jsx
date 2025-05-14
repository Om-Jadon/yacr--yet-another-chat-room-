import React, { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";

function ChatWindow({ messages, username, sendMessage }) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const send = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-2 md:p-4 bg-black bg-opacity-30 backdrop-blur-lg shadow-lg rounded-xl text-white">
      <div className="flex-1 overflow-y-auto space-y-2 md:space-y-3 mb-2 md:mb-4 pr-1 md:pr-2">
        {messages.map((msg) => {
          const isOwn = msg.user === username;
          return (
            <div
              key={msg.id}
              className={`flex items-end mb-2 ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {!isOwn && (
                <div className="mr-2">
                  <Avatar username={msg.user} size={28} />
                </div>
              )}

              <div
                className={`max-w-xs md:max-w-md px-3 py-2 rounded-lg shadow-md break-words ${
                  isOwn
                    ? "bg-blue-700 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
              >
                <div className="flex items-center text-sm font-medium mb-1 text-blue-100 gap-1">
                  {!isOwn && <span>{msg.user}</span>}
                  <span className="text-[10px]">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-base leading-snug">{msg.text}</div>
              </div>

              {isOwn && (
                <div className="ml-2">
                  <Avatar username={msg.user} size={28} />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2 mt-auto">
        <input
          className="flex-1 p-1 md:p-2 text-sm md:text-base bg-black bg-opacity-40 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          className="px-2 py-1 md:px-4 md:py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-200"
          onClick={send}
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
