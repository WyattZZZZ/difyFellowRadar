import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  zh: {
    translation: {
      welcome: "欢迎使用 Chatbot",
      input_placeholder: "请输入您的问题...",
      stop: "停止回复",
      send: "发送",
      hello: "你好",
      working: "工作中",
      my_info: "我的信息",
      history: "历史匹配记录",
    },
  },
  en: {
    translation: {
      welcome: "Welcome to Chatbot",
      input_placeholder: "Type your question...",
      stop: "Stop",
      send: "Send",
      hello: "Hello, ",
      working: "Working",
      my_info: "My Info",
      history: "Match History",
    },
  },
  ja: {
    translation: {
      welcome: "チャットボットへようこそ",
      input_placeholder: "ご質問を入力してください...",
      stop: "返信を停止",
      send: "送信",
      hello: "こんにちは",
      working: "作業中",
      my_info: "私の情報",
      history: "マッチ履歴",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "zh",
  fallbackLng: "zh",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
