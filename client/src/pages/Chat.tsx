import React, { useState } from "react";
import { SendHorizonal, User, Bot } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hi there! I'm interested in your profile." },
    { id: 2, sender: "user", text: "Thanks! I'm open to collaboration." },
    { id: 3, sender: "bot", text: "Great. Let's schedule a quick call?" },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text: input.trim() },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Chat Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b shadow-sm bg-white sticky top-[64px] z-20">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
          <Bot size={18} />
        </div>
        <div className="flex flex-col leading-tight">
          <h1 className="text-base font-semibold text-gray-800 tracking-wide">
            TalentConnect Bot
          </h1>
          <p className="text-xs text-green-500 font-medium uppercase tracking-wider">
            Online
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-8 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="mr-3 flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white shadow-sm">
                  <Bot size={14} />
                </div>
              </div>
            )}
            <div
              className={`max-w-[65%] px-5 py-3 text-base rounded-3xl shadow-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-3xl"
                  : "bg-white text-gray-900 rounded-bl-3xl"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <div className="ml-3 flex-shrink-0">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 shadow-sm">
                  <User size={14} />
                </div>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Input Bar */}
      <footer className="border-t bg-white px-6 py-3 sticky bottom-0 z-30">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 max-w-4xl mx-auto"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
          <button
            type="submit"
            className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-shadow shadow-md hover:shadow-lg"
            aria-label="Send message"
          >
            <SendHorizonal size={18} />
          </button>
        </form>
      </footer>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Chat;
