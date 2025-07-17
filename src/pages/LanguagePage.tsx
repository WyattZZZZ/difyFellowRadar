import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";

const LanguagePage: React.FC<{
  setVerified: (v: boolean) => void;
  setUsername: (u: string) => void;
}> = ({ setVerified, setUsername }) => {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(
    () => localStorage.getItem("lang") || "en"
  );
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (i18n.language !== selectedLang) {
      i18n.changeLanguage(selectedLang);
    }
  }, [selectedLang, i18n]);

  const handleStart = () => {
    if (!selectedLang || !agreed) {
      setError(t("accept_terms_error"));
      return;
    }
    console.log("Selected language:", selectedLang);
    localStorage.setItem("lang", selectedLang);
    if (i18n.language !== selectedLang) {
      i18n.changeLanguage(selectedLang);
    }
    setUsername("ziye"); // 这里可以根据实际逻辑设置用户名
    setVerified(true);
    navigate("/chat", { replace: true });
  };

  return (
    <div className="flex min-h-screen">
      {/* 左侧表单区 */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-8">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="mb-10 flex items-center">
            <img src="/logo.png" alt="Logo" className="h-12 mr-2" />
          </div>
          {/* 标题/副标题 */}
          <h2 className="text-2xl font-bold mb-2">
            {t("choose_language_title")}
          </h2>
          <p className="text-gray-500 mb-6">{t("choose_language_subtitle")}</p>
          {/* 语言下拉 */}
          <div className="mb-6">
            <LanguageSelector
              selected={selectedLang}
              onChange={(lang) => {
                setSelectedLang(lang);
                setError("");
                i18n.changeLanguage(lang);
              }}
              label={undefined}
            />
          </div>
          {/* 条款勾选 */}
          <label className="flex items-center gap-2 text-sm text-gray-700 mb-6">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setError("");
              }}
              style={{
                accentColor: "#0033FF",
              }}
            />
            <span>
              {t("accept_terms_prefix")}
              <a
                href="/userrule.html"
                target="_blank"
                className="ml-1 underline"
                style={{ color: "#0033FF" }}
              >
                {t("accept_terms_link")}
              </a>
            </span>
          </label>
          {/* 按钮和错误提示 */}
          <button
            className={`w-full py-3 rounded font-semibold transition mb-2 ${
              selectedLang && agreed
                ? "bg-[#0033FF] text-white hover:bg-[#0022AA]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleStart}
            disabled={!selectedLang || !agreed}
          >
            {selectedLang && agreed
              ? t("start_matching")
              : t("accept_terms_button")}
          </button>
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
      </div>
      {/* 右侧品牌区 */}
      <div className="hidden md:flex w-1/2 min-h-screen relative">
        <img
          src="/right.svg"
          alt="right visual"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LanguagePage;
