import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { sendChatMessage, stopChatMessage } from "../api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotProps {
  authcode: string;
  username?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ authcode, username }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [streamContent, setStreamContent] = useState("");
  const [status, setStatus] = useState(false); // true: 显示“工作中..."
  const [dotCount, setDotCount] = useState(1); // 动态点数
  const [tab, setTab] = useState("chat"); // chat, info, history
  const streamRef = useRef("");
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!status) return;
    const timer = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleInfoClick = () => {
    console.log(t("my_info"));
  };
  const handleHistoryClick = () => {
    console.log(t("history"));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setHasStarted(true);
    console.log("User sent:", input);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);
    streamRef.current = "";
    setStatus(true); // 显示“工作中...”
    let newTaskId = "";
    await sendChatMessage({
      message: input,
      user: { authcode },
      onTaskId: (id) => {
        setTaskId(id);
      },
      onMessage: (text) => {
        streamRef.current = text;
        setStreamContent(text);
      },
    });
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: streamRef.current },
    ]);
    setLoading(false);
    setTaskId(null);
    setStreamContent("");
    setStatus(false); // 输出时状态消失
  };

  const handleStop = async () => {
    if (taskId) {
      await stopChatMessage(taskId);
      setLoading(false);
      setTaskId(null);
      setStatus(false);
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full pb-32">
      {/* 欢迎语和建议问题，居中于屏幕中央 */}
      {!hasStarted && (
        <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4">
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="flex items-center mb-4 gap-6">
              <img
                src="/chatbot.png"
                alt="Chatbot"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-base font-semibold">
                {t("chatbot_welcome")}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="bg-gray-100 hover:bg-blue-50 text-blue-600 rounded px-4 py-2 text-sm font-medium transition pointer-events-auto"
                  onClick={() => setInput(t(`suggestion_${i}`))}
                >
                  {t(`suggestion_${i}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* 聊天卡片 */}
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto mt-12 px-4">
        {/* 聊天内容 */}
        <div className="w-full mt-4 mb-8">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex items-start gap-2 mb-4 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {isUser ? (
                  <div className="w-12 h-12 rounded-full object-cover">
                    <span role="img" aria-label="avatar">
                      🧑
                    </span>
                  </div>
                ) : (
                  <img
                    src="/chatbot.png"
                    alt="Chatbot"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <span
                  className={
                    isUser
                      ? "inline-block bg-blue-600 text-white px-4 py-2 rounded-2xl"
                      : "inline-block bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl"
                  }
                >
                  {msg.content}
                </span>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-start gap-2 mb-2">
              <img
                src="/chatbot.png"
                alt="Chatbot"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="mb-1 ml-2 text-[#0033FF] font-medium flex items-center">
                  {t("working")}
                  <span className="inline-block animate-pulse ml-1">
                    {".".repeat(dotCount)}
                  </span>
                </span>
                <span className="inline-block bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                  {streamContent}
                  <span className="animate-pulse">|</span>
                </span>
              </div>
            </div>
          )}
          {/* 滚动锚点 */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* 输入栏卡片固定底部中央 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl z-40 px-4">
        <div className="bg-white rounded-2xl shadow p-4">
          {/* 两个按钮嵌入卡片顶部，圆角长方形 */}
          <div className="flex gap-2 mb-2">
            <button
              className="px-3 py-1 rounded-lg border border-[#0033FF] text-[#0033FF] text-sm font-medium hover:bg-blue-50 transition"
              onClick={handleInfoClick}
            >
              {t("my_info")}
            </button>
            <button
              className="px-3 py-1 rounded-lg border border-[#0033FF] text-[#0033FF] text-sm font-medium hover:bg-blue-50 transition"
              onClick={handleHistoryClick}
            >
              {t("history")}
            </button>
          </div>
          {/* 输入栏 */}
          <div className="flex items-center bg-white rounded-full shadow px-6 py-4">
            <input
              className="flex-1 border-none outline-none bg-transparent text-base"
              placeholder={t("input_placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={loading}
            />
            <button
              className="ml-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
            {loading && (
              <button className="ml-2 text-gray-400" onClick={handleStop}>
                {t("stop")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
