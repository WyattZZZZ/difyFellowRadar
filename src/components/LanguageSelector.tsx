import React from "react";

const languages = [
  { code: "zh", label: "中文" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
];

interface Props {
  selected: string;
  onChange: (lang: string) => void;
  label?: string;
}

const LanguageSelector: React.FC<Props> = ({ selected, onChange, label }) => {
  return (
    <div className="flex flex-col gap-2 items-center mt-8">
      {label && <div className="text-sm text-gray-700 mb-1">{label}</div>}
      <select
        className="w-40 py-2 rounded border border-primary text-primary font-semibold focus:outline-none text-center"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        style={{ textAlignLast: "center" }}
      >
        <option value="" disabled>
          请选择语言
        </option>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
