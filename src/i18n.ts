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
      choose_language_title: "请选择语言以继续",
      choose_language_subtitle: "选择你偏好的语言以获得最佳体验。",
      language: "语言",
      accept_terms_prefix: "我已阅读并同意",
      accept_terms_link: "用户条款",
      accept_terms_button: "请先同意条款以继续",
      accept_terms_error: "请选择语言并同意用户条款后才能进入。",
      start_matching: "开始匹配",
      chatbot_welcome: "你好啊！这里是伙伴雷达，有什么我能帮你的么？",
      suggestion_1: "告诉我你都可以做什么？",
      suggestion_2: "我要告诉你我要找什么样的队友！",
      suggestion_3: "Dify是什么？",
      language_zh: "中文",
      language_en: "英文",
      language_ja: "日语",
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
      choose_language_title: "Choose your language to continue",
      choose_language_subtitle:
        "Select your preferred language to continue with the best experience.",
      language: "Language",
      accept_terms_prefix: "I have read and agree to the",
      accept_terms_link: "Terms of Service",
      accept_terms_button: "Please accept terms to continue",
      accept_terms_error:
        "Please select a language and agree to the terms to continue.",
      start_matching: "Start Matching",
      chatbot_welcome: "Hello! This is FellowRadar. How can I help you?",
      suggestion_1: "Tell me what you can do.",
      suggestion_2: "I want to tell you what kind of fellow I'm looking for!",
      suggestion_3: "What is Dify?",
      language_zh: "Chinese",
      language_en: "English",
      language_ja: "Japanese",
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
      choose_language_title: "言語を選択して続行してください",
      choose_language_subtitle:
        "最適な体験のために希望の言語を選択してください。",
      language: "言語",
      accept_terms_prefix: "に同意してください",
      accept_terms_link: "利用規約",
      accept_terms_button: "利用規約に同意してください",
      accept_terms_error: "言語を選択し、利用規約に同意してください。",
      start_matching: "マッチングを開始",
      chatbot_welcome:
        "こんにちは！私はそうだフェローレーダー。何かお手伝いできることはありますか？",
      suggestion_1: "あなたができることを教えてください。",
      suggestion_2: "どんなチームメイトを探しているか伝えたい！",
      suggestion_3: "Difyとは何ですか？",
      language_zh: "中国語",
      language_en: "英語",
      language_ja: "日本語",
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
