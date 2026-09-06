"use strict";

(() => {
  const COPY = {
    en: {
      heroKicker: "FREE · FAST · PRIVATE",
      tagline: "Fast notes. Anywhere.",
      heroLead:
        "Browser-first notes with instant access, account-free sharing, and strong encryption when you need it.",
      begin: "Create a free account",
      purposeEyebrow: "BUILT FOR SPEED",
      purposeTitle: "Get the text. Skip the detour.",
      purposeIntroOne:
        "Open AstraNote in any modern browser—no app, no setup.",
      purposeIntroTwo:
        "A lightweight login keeps quick access separate from your main email or cloud account.",
      purposeIntroThree:
        "Share with a read-only link; the reader needs no AstraNote account.",
      quickTitle: "Open anywhere",
      quickBody:
        "Phone, tablet, school PC, library computer, or Linux—just open a browser and sign in.",
      secureTitle: "Serious encryption",
      secureBody:
        "Use AstraSecret, AstraConfidential, or AstraZero when a note needs stronger protection.",
      shareTitle: "Share without signup",
      shareBody:
        "Send a read-only link. No account, no matching platform, and access can be revoked anytime.",
      limitEyebrow: "TEXT IS TINY",
      limitTitle: "128 KB is a lot of text.",
      limitBody:
        "Free accounts include 20 notes and 128 KB—enough for tens of thousands of Chinese characters or over 100,000 ASCII characters before metadata. Encrypted notes use more space; paid plans add more.",
      accountStorageLabel: "FREE TEXT STORAGE",
      accountLimitCaption: "20 NOTES · 128 KB · NO ADS · NO ANALYTICS",
      seoTitle: "AstraNote — Fast, free browser notes with strong encryption",
      seoDescription:
        "AstraNote is a free online notebook for fast browser access, cross-device text, account-free read-only sharing, and optional AstraSecret, AstraConfidential, and AstraZero encryption."
    },
    "zh-Hant": {
      heroKicker: "免費 · 極速 · 私密",
      tagline: "快速筆記，隨處可用。",
      heroLead:
        "瀏覽器即用、快速取回、免帳號分享；需要時，再用更強的加密保護。",
      begin: "免費建立帳號",
      purposeEyebrow: "為速度而設計",
      purposeTitle: "需要文字時，直接取得。",
      purposeIntroOne:
        "任何現代瀏覽器都能開啟，不需安裝 App，也不用先設定工作區。",
      purposeIntroTwo:
        "獨立的輕量登入，讓你不用為一小段文字登入主要郵件或雲端帳號。",
      purposeIntroThree:
        "分享只需唯讀連結；對方不需要 AstraNote 帳號。",
      quickTitle: "任何裝置都能開",
      quickBody:
        "手機、平板、學校電腦、圖書館電腦或 Linux，有瀏覽器就能登入。",
      secureTitle: "真正需要時，再用強加密",
      secureBody:
        "敏感筆記可使用 AstraSecret、AstraConfidential 或 AstraZero 提升保護。",
      shareTitle: "分享不要求註冊",
      shareBody:
        "丟一個唯讀連結即可；不用同平台、不用帳號，之後也能撤銷。",
      limitEyebrow: "純文字真的很小",
      limitTitle: "128 KB，其實能放很多文字。",
      limitBody:
        "免費帳號有 20 篇筆記與 128 KB；不計額外資料前，可放數萬個中文字或超過十萬個 ASCII 字元。加密會占更多空間，付費方案則提供更高容量。",
      accountStorageLabel: "免費純文字空間",
      accountLimitCaption: "20 篇筆記 · 128 KB · 無廣告 · 無分析追蹤",
      seoTitle: "AstraNote — 免費、快速、跨裝置的加密線上筆記",
      seoDescription:
        "AstraNote 是免費線上筆記服務，可在瀏覽器快速取用文字、跨裝置使用、以無需帳號的唯讀連結分享，並提供 AstraSecret、AstraConfidential 與 AstraZero 加密。"
    },
    ja: {
      heroKicker: "無料 · 高速 · プライベート",
      tagline: "すばやいノートを、どこからでも。",
      heroLead:
        "ブラウザですぐ使えて、すぐ取り出せる。共有はアカウント不要。必要なときは強力な暗号化も使えます。",
      begin: "無料アカウントを作成",
      purposeEyebrow: "速さのための設計",
      purposeTitle: "必要な文字へ、まっすぐ。",
      purposeIntroOne:
        "モダンなブラウザがあれば使えます。アプリもワークスペース設定も不要です。",
      purposeIntroTwo:
        "軽量な独立ログインで、短いメモのために主要メールやクラウドへ入る必要を減らせます。",
      purposeIntroThree:
        "共有は読み取り専用リンクだけ。相手にAstraNoteアカウントは不要です。",
      quickTitle: "どの端末でも開ける",
      quickBody:
        "スマホ、タブレット、学校や図書館のPC、Linuxでも、ブラウザからすぐ使えます。",
      secureTitle: "必要なときだけ強力に保護",
      secureBody:
        "機密性が必要ならAstraSecret、AstraConfidential、AstraZeroを利用できます。",
      shareTitle: "登録なしで共有",
      shareBody:
        "読み取り専用リンクを送るだけ。同じサービスもアカウントも不要で、あとから無効化できます。",
      limitEyebrow: "テキストは小さい",
      limitTitle: "128 KBでも、文字ならかなり入ります。",
      limitBody:
        "無料は20ノート・128 KB。メタデータを除けば数万文字規模のCJK文字、または10万文字超のASCIIを保存できます。暗号化は追加容量を使い、有料プランではさらに増えます。",
      accountStorageLabel: "無料テキスト容量",
      accountLimitCaption: "20ノート · 128 KB · 広告なし · 解析トラッカーなし",
      seoTitle: "AstraNote — 無料で高速、ブラウザだけで使える暗号化ノート",
      seoDescription:
        "AstraNoteは、ブラウザですばやく使え、端末をまたいでテキストを取得し、アカウント不要の読み取り専用リンクで共有できる無料オンラインノートです。"
    }
  };

  for (const [locale, values] of Object.entries(COPY)) {
    if (typeof I18N !== "undefined" && I18N[locale]) {
      Object.assign(I18N[locale], values);
    }
  }

  const normalizeLocale = (value) => {
    const lang = String(value || "").toLowerCase();
    if (lang.startsWith("zh")) return "zh-Hant";
    if (lang.startsWith("ja")) return "ja";
    return "en";
  };

  const applySeo = () => {
    const locale = normalizeLocale(document.documentElement.lang || navigator.language);
    const copy = COPY[locale] || COPY.en;
    document.title = copy.seoTitle;

    const setMeta = (selector, value) => {
      const node = document.querySelector(selector);
      if (node) node.setAttribute("content", value);
    };

    setMeta('meta[name="description"]', copy.seoDescription);
    setMeta('meta[property="og:title"]', copy.seoTitle);
    setMeta('meta[property="og:description"]', copy.seoDescription);
    setMeta('meta[name="twitter:title"]', copy.seoTitle);
    setMeta('meta[name="twitter:description"]', copy.seoDescription);
  };

  applySeo();
  document.addEventListener("DOMContentLoaded", applySeo, { once: true });

  const observer = new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === "lang")) applySeo();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
