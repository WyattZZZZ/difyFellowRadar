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
  const [status, setStatus] = useState(false); // true: 显示“工作中...”
  const [dotCount, setDotCount] = useState(1); // 动态点数
  const streamRef = useRef("");

  // 动态点动画
  useEffect(() => {
    if (!status) return;
    const timer = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(timer);
  }, [status]);

  // 按钮回调
  const handleInfoClick = () => {
    console.log(t("my_info"));
  };
  const handleHistoryClick = () => {
    console.log(t("history"));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    console.log("User sent:", input); // 控制台输出用户输入内容
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);
    setStreamContent("");
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

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[80vh] border rounded-lg bg-white shadow-md relative">
      {/* 聊天内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* 头像占位符+状态 */}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex flex-col items-center justify-center text-gray-400 text-xl relative">
                <span role="img" aria-label="avatar">
                  {isUser ? "🧑" : "🤖"}
                </span>
                {/* 仅assistant且loading时显示状态 */}
                {msg.role === "assistant" &&
                  idx === messages.length - 1 &&
                  status && (
                    <span className="text-xs text-primary absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap">
                      {t("working")}
                      {".".repeat(dotCount)}
                    </span>
                  )}
              </div>
              <span
                className={
                  isUser
                    ? "inline-block bg-primary text-white px-3 py-2 rounded-lg"
                    : "inline-block bg-gray-100 text-gray-900 px-3 py-2 rounded-lg"
                }
              >
                {msg.content}
              </span>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex flex-col items-center justify-center text-gray-400 text-xl relative">
              <span role="img" aria-label="avatar">
                🤖
              </span>
              {status && (
                <span className="text-xs text-primary absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap">
                  {t("working")}
                  {".".repeat(dotCount)}
                </span>
              )}
            </div>
            <span className="inline-block bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
              {streamContent}
              <span className="animate-pulse">|</span>
            </span>
          </div>
        )}
      </div>
      {/* 两个按钮放在输入栏上方左侧 */}
      <div className="flex border-t bg-gray-50 px-4 py-2 gap-4 justify-start">
        <button
          className="px-4 py-1 rounded border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition text-sm"
          onClick={handleInfoClick}
        >
          {t("my_info")}
        </button>
        <button
          className="px-4 py-1 rounded border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition text-sm"
          onClick={handleHistoryClick}
        >
          {t("history")}
        </button>
      </div>
      {/* 输入栏 */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:border-primary"
          placeholder={t("input_placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={loading}
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {t("send")}
        </button>
        {loading && (
          <button
            className="bg-gray-200 text-primary px-4 py-2 rounded border border-primary ml-2"
            onClick={handleStop}
          >
            {t("stop")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
