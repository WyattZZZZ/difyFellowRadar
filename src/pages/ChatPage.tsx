import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Chatbot from "../components/Chatbot";

const ChatPage: React.FC<{ username: string }> = ({ username }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const params = new URLSearchParams(location.search);
  const authcode = params.get("authcode") || "";

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f6f8fa]">
      {/* 顶部bar */}
      <div className="fixed top-0 left-0 w-full h-16 flex items-center justify-center px-6 shadow-md bg-white z-20">
        <div className="text-lg">
          {t("HELLO👋, ")}
          {username}
        </div>
        <div className="fixed left-4 h-15">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>
      </div>
      {/* 主聊天区全宽 */}
      <div className="flex-1 flex flex-col relative">
        <Chatbot authcode={authcode} username={username} />
        {/* Logo 左下角 */}
      </div>
    </div>
  );
};

export default ChatPage;
