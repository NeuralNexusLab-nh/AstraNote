"use strict";

(() => {
  const COPY = {
    en: {
      heroKicker: "FREE · BROWSER-FIRST · ANY DEVICE",
      tagline: "I wrote it. It's mine.",
      heroLead:
        "Open a browser and your text is there. Sharing takes just one link; for the most private content, AstraZero guards the final layer.",
      begin: "Start free",
      explore: "See plans",
      purposeEyebrow: "LESS SETUP. MORE DIRECT.",
      purposeTitle: "Getting one piece of text should take seconds, not a setup process.",
      purposeIntroOne:
        "Open a browser, sign in, and the text is there. No app installation, no workspace setup, and no moving files between devices.",
      purposeIntroTwo:
        "AstraNote uses its own lightweight account, so grabbing one note does not have to begin with opening the main email or cloud account that controls the rest of your digital life.",
      purposeIntroThree:
        "Sharing is just as direct: send a read-only link. The reader does not need an AstraNote account.",
      quickTitle: "One browser away",
      quickBody:
        "Phone, tablet, school PC, or a temporary device — if it can open a browser, your text is within reach.",
      secureTitle: "Simple by default. Deeper when needed.",
      secureBody:
        "Keep everyday notes light, then use AstraSecret, AstraConfidential, or AstraZero for content that deserves stronger protection.",
      shareTitle: "Share the text, not the setup",
      shareBody:
        "One read-only link is enough. The other person does not need to register or join the same platform first.",
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
      heroKicker: "免費 · 瀏覽器即用 · 跨裝置",
      tagline: "寫下了，就是我的。",
      heroLead:
        "打開瀏覽器就能拿到，想分享也只差一個連結；而最私密的內容，有 AstraZero 守在最後一層。",
      begin: "免費開始",
      explore: "了解方案",
      purposeEyebrow: "少一點步驟，多一點直接",
      purposeTitle: "拿一段文字，不該先處理一堆工具。",
      purposeIntroOne:
        "打開瀏覽器、登入、拿到文字。不用安裝 App，不用建立工作區，也不用在裝置之間搬檔案。",
      purposeIntroTwo:
        "AstraNote 使用獨立的輕量登入。臨時只想拿一段文字時，不必先打開掌管郵件、雲端與帳號復原的主要帳號。",
      purposeIntroThree:
        "要給別人？丟一個唯讀連結就好。對方不需要 AstraNote 帳號。",
      quickTitle: "只差一個瀏覽器",
      quickBody:
        "手機、平板、學校電腦或臨時裝置，只要能開瀏覽器，文字就能拿到。",
      secureTitle: "平常保持簡單，重要時再加深",
      secureBody:
        "日常筆記不必變複雜；真正重要的內容，再使用 AstraSecret、AstraConfidential 或 AstraZero。",
      shareTitle: "分享文字，不用先處理一堆設定",
      shareBody:
        "一個唯讀連結就夠。對方不用註冊，也不用先加入和你相同的平台。",
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
      heroKicker: "無料 · ブラウザですぐ使える · 端末を選ばない",
      tagline: "書いたものは、私のもの。",
      heroLead:
        "ブラウザを開けばすぐ取り出せ、共有もリンク一つ。いちばん秘密にしておきたい内容は、最後の一層を AstraZero が守ります。",
      begin: "無料で始める",
      explore: "プランを見る",
      purposeEyebrow: "手順を減らして、もっと直接",
      purposeTitle: "文字一つを取り出すために、準備作業はいりません。",
      purposeIntroOne:
        "ブラウザを開いてログインすれば、文字はそこにあります。アプリもワークスペース設定も、端末間のファイル移動も不要です。",
      purposeIntroTwo:
        "AstraNote は独立した軽量アカウントなので、短いメモ一つのためにメールやクラウド、復旧手段を持つ主要アカウントまで開く必要を減らせます。",
      purposeIntroThree:
        "共有も直接的です。読み取り専用リンクを一つ送るだけで、相手に AstraNote アカウントは必要ありません。",
      quickTitle: "ブラウザ一つ先にある",
      quickBody:
        "スマホ、タブレット、学校のPC、臨時の端末。ブラウザが開ければ、文字に届きます。",
      secureTitle: "普段はシンプル。必要なときだけ深く。",
      secureBody:
        "日常のメモは軽く保ち、大切な内容には AstraSecret、AstraConfidential、AstraZero を使えます。",
      shareTitle: "共有するのは文字だけ",
      shareBody:
        "読み取り専用リンク一つで十分。相手の登録も、同じサービスへの参加も不要です。",
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

  const applyHomepageLinks = () => {
    const plansLink = document.querySelector(".hero-actions .btn-outline");
    if (plansLink) plansLink.setAttribute("href", "/plans");
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
    applyHomepageLinks();
    applySeo();
  };

  applyAll();
  document.addEventListener("DOMContentLoaded", applyAll, { once: true });

  const observer = new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === "lang")) applyAll();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();