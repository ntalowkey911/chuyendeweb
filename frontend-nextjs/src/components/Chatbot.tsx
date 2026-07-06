"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export default function Chatbot() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Xin chào! Tôi là trợ lý AI của nhà hàng. Tôi có thể tư vấn món ăn gì cho bạn hôm nay?",
      isBot: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Load lịch sử chat khi người dùng đăng nhập và mở cửa sổ
  useEffect(() => {
    if (user && user.id && isOpen) {
      const fetchHistory = async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
          const response = await axios.get(`${baseUrl}/chatbot/history/${user.id}`);
          if (response.data && Array.isArray(response.data)) {
            const historyMessages: Message[] = [
              {
                id: "welcome",
                text: "Xin chào! Tôi là trợ lý AI của nhà hàng. Tôi có thể tư vấn món ăn gì cho bạn hôm nay?",
                isBot: true,
              },
            ];
            response.data.forEach((item: any) => {
              historyMessages.push({
                id: `user-${item.id}`,
                text: item.userMessage,
                isBot: false,
              });
              historyMessages.push({
                id: `bot-${item.id}`,
                text: item.botReply,
                isBot: true,
              });
            });
            setMessages(historyMessages);
          }
        } catch (error: any) {
          if (error.response?.status !== 404) {
            console.warn("Lỗi lấy lịch sử chat:", error.message);
          }
        }
      };
      fetchHistory();
    }
  }, [user, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
      const response = await axios.post(`${baseUrl}/chatbot/chat`, {
        userId: user?.id || "",
        message: userMessage.text,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.reply || "Xin lỗi, tôi không thể xử lý yêu cầu lúc này.",
        isBot: true,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Hệ thống AI đang bận hoặc có lỗi xảy ra. Vui lòng thử lại sau.",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-orange-500 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-bold text-lg leading-tight">AI Trợ Lý</h3>
                <p className="text-xs text-orange-100">Luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.isBot
                      ? "bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm"
                      : "bg-orange-500 text-white rounded-tr-sm shadow-md"
                  }`}
                >
                  {/* Hàm hỗ trợ render link và xuống dòng */}
                  {msg.text.split('\n').map((line, lineIndex) => {
                    const parts = line.split(/(\[.*?\]\(.*?\))/g);
                    return (
                      <div key={lineIndex} className="min-h-[1.25rem]">
                        {parts.map((part, partIndex) => {
                          const match = part.match(/\[(.*?)\]\((.*?)\)/);
                          if (match) {
                            return (
                              <a
                                key={partIndex}
                                href={match[2]}
                                className="text-orange-600 font-bold hover:underline"
                              >
                                {match[1]}
                              </a>
                            );
                          }
                          // Thay thế ký tự * thành dấu bullet html nếu nó ở đầu dòng
                          let textContent = part;
                          if (textContent.trim().startsWith('*')) {
                            textContent = textContent.replace('*', '•');
                          }
                          return <span key={partIndex}>{textContent}</span>;
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Vùng nhập văn bản */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Nút bấm nổi */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-transform transform hover:scale-110 flex items-center justify-center animate-bounce"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
