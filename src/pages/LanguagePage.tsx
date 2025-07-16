import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import LanguageSelector from "../components/LanguageSelector";

const langText: Record<
  string,
  {
    selectLabel: string;
    terms: string;
    button: string;
    error: string;
    link: string;
  }
> = {
  zh: {
    selectLabel: "请选择语言（默认为英文）",
    terms: "我已阅读并同意",
    link: "用户条款",
    button: "开始匹配",
    error: "请选择语言并同意用户条款后才能进入。",
  },
  en: {
    selectLabel: "Please select a language (default is English)",
    terms: "I have read and agree to the",
    link: "Terms of Service",
    button: "Start Matching",
    error: "Please select a language and agree to the terms to continue.",
  },
  ja: {
    selectLabel: "言語を選択してください（デフォルトは英語）",
    terms: "私は読んで同意しました",
    link: "利用規約",
    button: "マッチングを開始",
    error: "言語を選択し、利用規約に同意してください。",
  },
};

const LanguagePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLang, setSelectedLang] = useState("en");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!selectedLang || !agreed) {
      setError(langText[selectedLang]?.error || langText.en.error);
      return;
    }
    console.log("Selected language:", selectedLang); // 控制台输出所选语言
    localStorage.setItem("lang", selectedLang);
    const params = new URLSearchParams(location.search);
    const authcode = params.get("authcode") || "";
    navigate(`/chat?authcode=${encodeURIComponent(authcode)}`);
  };

  const t = langText[selectedLang] || langText.en;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative">
      <Logo />
      <div className="flex flex-col items-center w-full gap-6">
        <LanguageSelector
          selected={selectedLang}
          onChange={(lang) => {
            setSelectedLang(lang);
            setError("");
          }}
          label={t.selectLabel}
        />
        <label className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setError("");
            }}
          />
          <span>
            {t.terms}
            <a
              href="public/userrule.html"
              target="_blank"
              className="text-blue-500 ml-1"
            >
              {t.link}
            </a>
          </span>
        </label>
        <button
          className={`w-40 py-2 rounded border border-primary font-semibold transition ${
            selectedLang && agreed
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          onClick={handleStart}
          disabled={!selectedLang || !agreed}
        >
          {t.button}
        </button>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>
    </div>
  );
};

export default LanguagePage;
