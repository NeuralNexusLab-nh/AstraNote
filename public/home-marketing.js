"use strict";

(() => {
  const COPY = {
    en: {
      heroKicker: "FREE · BROWSER-FIRST · PRIVATE",
      tagline: "Keep it close. Wherever you are.",
      heroLead:
        "AstraNote keeps your text within reach — fast to open, effortless to share, and powerfully encrypted when it matters.",
      begin: "Start free",
      purposeEyebrow: "LESS FRICTION. MORE FLOW.",
      purposeTitle: "Your notes should move as easily as you do.",
      purposeIntroOne:
        "Open a browser, sign in, and your text is there. No app to install, no workspace to set up.",
      purposeIntroTwo:
        "A lightweight AstraNote login keeps quick access separate from the email and cloud accounts that run the rest of your digital life.",
      purposeIntroThree:
        "Need to pass something on? Send a read-only link. No AstraNote account required.",
      quickTitle: "Made to be within reach",
      quickBody:
        "From your phone to a school PC, AstraNote stays one browser away.",
      secureTitle: "Privacy, with depth",
      secureBody:
        "AstraSecret, AstraConfidential, and AstraZero give sensitive notes stronger layers of protection.",
      shareTitle: "One link. That's enough.",
      shareBody:
        "Share read-only text without asking anyone to sign up or join the same platform.",
      limitEyebrow: "BUILT FOR TEXT",
      limitTitle: "128 KB. Small number. Plenty of words.",
      limitBody:
        "Plain text is remarkably compact. The free 128 KB can hold tens of thousands of Chinese characters or over 100,000 ASCII characters before metadata — plenty for notes, links, snippets, and the little things worth keeping.",
      accountStorageLabel: "FREE TEXT STORAGE",
      accountLimitCaption: "20 NOTES · 128 KB · NO ADS · NO ANALYTICS",
      seoTitle: "AstraNote — Fast, free browser notes with strong encryption",
      seoDescription:
        "AstraNote is a free browser-first notebook for fast cross-device access, account-free read-only sharing, and powerful optional encryption with AstraSecret, AstraConfidential, and AstraZero."
    },
    "zh-Hant": {
      heroKicker: "免費 · 瀏覽器即用 · 私密",
      tagline: "讓想法，始終在你身邊。",
      heroLead:
        "AstraNote 讓文字隨手可得。開啟很快、分享很簡單；重要的內容，則有強大的加密守著。",
      begin: "免費開始",
      purposeEyebrow: "少一點阻礙，多一點流暢",
      purposeTitle: "你的筆記，應該跟得上你。",
      purposeIntroOne:
        "打開瀏覽器、登入，文字就在那裡。不用安裝 App，也不用設定工作區。",
      purposeIntroTwo:
        "AstraNote 的獨立輕量登入，讓你不必為了一段文字，動用掌管郵件、雲端與帳號復原的主要帳號。",
      purposeIntroThree:
        "要給別人？一個唯讀連結就夠了。對方不需要 AstraNote 帳號。",
      quickTitle: "隨時，都在伸手可及的地方",
      quickBody:
        "從手機到學校電腦，只要有瀏覽器，AstraNote 就在。",
      secureTitle: "簡單之外，還有深度",
      secureBody:
        "AstraSecret、AstraConfidential 與 AstraZero，為敏感內容提供更深一層的保護。",
      shareTitle: "一個連結，就夠了",
      shareBody:
        "唯讀分享，不要求註冊，也不要求對方和你待在同一個平台。",
      limitEyebrow: "為純文字而生",
      limitTitle: "128 KB。數字很小，能寫的很多。",
      limitBody:
        "純文字遠比想像中省空間。不計額外資料前，免費的 128 KB 足以容納數萬個中文字，或超過十萬個 ASCII 字元；筆記、網址、程式片段與那些值得留下的小東西，綽綽有餘。",
      accountStorageLabel: "免費純文字空間",
      accountLimitCaption: "20 篇筆記 · 128 KB · 無廣告 · 無分析追蹤",
      seoTitle: "AstraNote — 免費、快速、跨裝置的加密線上筆記",
      seoDescription:
        "AstraNote 是免費、瀏覽器即用的線上筆記服務，提供快速跨裝置存取、無需帳號的唯讀分享，以及 AstraSecret、AstraConfidential 與 AstraZero 強大加密。"
    },
    ja: {
      heroKicker: "無料 · ブラウザですぐ使える · プライベート",
      tagline: "思いつきを、いつでもそばに。",
      heroLead:
        "AstraNoteなら、必要な文字がいつでも手の届く場所に。すぐ開けて、簡単に共有でき、大切な内容には強力な暗号化を使えます。",
      begin: "無料で始める",
      purposeEyebrow: "もっと自然に、もっと軽く",
      purposeTitle: "ノートは、あなたと同じ速さで動くべきです。",
      purposeIntroOne:
        "ブラウザを開いてログインすれば、文字はそこにあります。アプリもワークスペース設定も不要です。",
      purposeIntroTwo:
        "独立した軽量ログインだから、短いメモのためにメールやクラウド、復旧手段まで持つ主要アカウントを使う必要を減らせます。",
      purposeIntroThree:
        "誰かに渡すなら、読み取り専用リンクを一つ。相手にAstraNoteアカウントは不要です。",
      quickTitle: "いつでも、手の届く場所に",
      quickBody:
        "スマホから学校のPCまで。ブラウザがあればAstraNoteはすぐそこです。",
      secureTitle: "シンプルさの奥に、強い保護",
      secureBody:
        "AstraSecret、AstraConfidential、AstraZeroが、機密性の高いノートをさらに深く守ります。",
      shareTitle: "リンク一つで、それで十分",
      shareBody:
        "読み取り専用で共有。登録も、同じプラットフォームも必要ありません。",
      limitEyebrow: "テキストのための設計",
      limitTitle: "128 KB。数字は小さくても、言葉はたくさん入る。",
      limitBody:
        "プレーンテキストは驚くほどコンパクトです。メタデータを除けば、無料の128 KBでも数万文字規模のCJK文字、または10万文字を超えるASCIIを保存できます。ノート、URL、スニペット、残しておきたい小さな情報には十分な余裕があります。",
      accountStorageLabel: "無料テキスト容量",
      accountLimitCaption: "20ノート · 128 KB · 広告なし · 解析トラッカーなし",
      seoTitle: "AstraNote — 無料で高速、ブラウザだけで使える暗号化ノート",
      seoDescription:
        "AstraNoteは無料でブラウザからすぐ使えるオンラインノートです。端末をまたいだ高速アクセス、アカウント不要の読み取り専用共有、AstraSecret・AstraConfidential・AstraZeroによる強力な暗号化に対応します。"
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

  const getCopy = () => {
    const locale = normalizeLocale(document.documentElement.lang || navigator.language);
    return COPY[locale] || COPY.en;
  };

  const applyMarketingCopy = () => {
    const copy = getCopy();
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (key && Object.prototype.hasOwnProperty.call(copy, key)) {
        node.textContent = copy[key];
      }
    });
  };

  const applySeo = () => {
    const copy = getCopy();
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

  const applyAll = () => {
    applyMarketingCopy();
    applySeo();
  };

  applyAll();
  document.addEventListener("DOMContentLoaded", applyAll, { once: true });

  const observer = new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === "lang")) applyAll();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
