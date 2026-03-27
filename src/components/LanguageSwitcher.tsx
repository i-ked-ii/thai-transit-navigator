"use client";

import { useTranslation, locales } from "@/i18n";
import type { Locale } from "@/i18n";

const labels: Record<Locale, string> = {
  th: "TH",
  en: "EN",
  zh: "中",
  ja: "JA",
};

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-0.5 text-xs">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-1.5 py-0.5 rounded transition-colors ${
            locale === l
              ? "bg-blue-600 text-white font-semibold"
              : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
