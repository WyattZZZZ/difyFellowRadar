import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Logo from "../components/Logo";
import Chatbot from "../components/Chatbot";

const ChatPage: React.FC<{ username: string }> = ({ username }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const params = new URLSearchParams(location.search);
  const authcode = params.get("authcode") || "";
  // 假设用户名通过authcode或其它方式获取，这里用占位符

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "zh";
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  return (
    <div className="min-h-screen bg-white flex flex-col w-full h-full">
      {/* 顶部bar 居中 */}
      <div className="w-full h-16 flex items-center justify-center px-6 shadow-md bg-white z-10">
        <div className="text-lg font-bold">
          {t("hello")}
          {username}
        </div>
      </div>
      {/* 聊天内容全屏 */}
      <div className="flex-1 flex flex-col justify-center items-center w-full relative">
        <Chatbot authcode={authcode} username={username} />
        {/* Logo置左下角 */}
        <div className="fixed left-4 bottom-4 z-50">
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
