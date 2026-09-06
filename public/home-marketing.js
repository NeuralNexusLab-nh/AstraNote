"use strict";

(() => {
  const COPY = {
    en: {
      heroKicker: "FREE ONLINE NOTES · NO APP REQUIRED",
      tagline: "Your text, ready on any device.",
      heroLead:
        "Open AstraNote in any modern browser, sign in, and get the text you need without installing an app or signing in to your main email or cloud account. Share a read-only link with anyone—no AstraNote account required. When a note matters more, protect it with AstraSecret, AstraConfidential, or AstraZero.",
      begin: "Create a free account",
      purposeEyebrow: "FAST BY DESIGN",
      purposeTitle: "Getting one piece of text should not become a login project.",
      purposeIntroOne:
        "Sometimes you only need a class code, URL, reminder, code snippet, or a block of text on another device. Installing an app, opening a full cloud suite, or completing another account's verification flow is needless friction.",
      purposeIntroTwo:
        "AstraNote uses its own lightweight account and works directly in the browser. Sign in, open the note, get the text, and move on. On a new or shared device, this also means you do not have to expose the primary account that holds your email, cloud files, and recovery methods. Keep highly sensitive notes for trusted devices.",
      purposeIntroThree:
        "Need to send text to somebody else? Create a read-only link. The reader does not need an AstraNote account or the same social platform, and you can revoke the link later.",
      quickTitle: "Open anywhere, without the setup",
      quickBody:
        "Phone, tablet, school PC, library computer, Linux box—if it has a modern browser, AstraNote is ready. No app installation and no workspace setup.",
      secureTitle: "Strong encryption when the note deserves it",
      secureBody:
        "Keep everyday notes simple, then step up to AstraSecret, AstraConfidential, or AstraZero for more sensitive content. The full encryption comparison is kept below.",
      shareTitle: "Share text, not accounts",
      shareBody:
        "Send a read-only link. The reader does not need AstraNote, a social account, or the same ecosystem. Revoke access whenever you want.",
      limitEyebrow: "TEXT IS SMALL",
      limitTitle: "128 KB goes a long way when you store text.",
      limitBody:
        "Free accounts include up to 20 notes and 128 KB total storage. Plain text is tiny: that is enough for tens of thousands of Chinese characters or well over 100,000 ASCII characters before metadata. Short codes, URLs, reminders, snippets, and everyday notes usually use only a fraction of it. Encrypted notes use more space, and paid plans add more room.",
      accountStorageLabel: "FREE TEXT STORAGE",
      accountLimitCaption: "20 NOTES · 128 KB · NO ADS · NO ANALYTICS",
      seoTitle: "AstraNote — Fast, free browser notes with strong encryption",
      seoDescription:
        "AstraNote is a free online notebook built for fast access from any modern browser, cross-device text, account-free read-only sharing, and optional AstraSecret, AstraConfidential, and AstraZero encryption."
    },
    "zh-Hant": {
      heroKicker: "免費線上筆記 · 不需安裝 APP",
      tagline: "你的文字，在任何裝置都能快速取回。",
      heroLead:
        "只要有現代瀏覽器，就能開啟 AstraNote、登入並拿到需要的文字。不必安裝 App，也不必為了一串代碼或一段筆記，在新裝置登入承載郵件、雲端檔案與復原方式的主要帳號。分享時只要一個唯讀連結，對方不需要 AstraNote 帳號；重要內容則可使用 AstraSecret、AstraConfidential 或 AstraZero。",
      begin: "免費建立帳號",
      purposeEyebrow: "為速度而設計",
      purposeTitle: "拿一段文字，不該變成登入大工程。",
      purposeIntroOne:
        "有時你只想在另一台裝置拿到班級代碼、網址、提醒、程式片段或一段文字。為了這點小事安裝 App、打開一整套雲端服務，甚至被要求完成另一個主要帳號的驗證流程，實在太多餘。",
      purposeIntroTwo:
        "AstraNote 使用獨立、輕量的帳號，直接在瀏覽器工作。登入、開筆記、拿到文字，結束。在新的或共用裝置上，你也不必登入同時掌管郵件、雲端檔案與帳號復原方式的主要帳號；真正敏感的筆記仍建議只在可信裝置解密。",
      purposeIntroThree:
        "要把文字給別人，也不用先互加好友或使用同一平台。建立唯讀分享連結，對方不需要 AstraNote 帳號，之後也能隨時撤銷。",
      quickTitle: "任何裝置，打開就能用",
      quickBody:
        "手機、平板、學校電腦、圖書館電腦或 Linux，只要有現代瀏覽器就能使用。不必安裝 App，也沒有繁瑣的工作區設定。",
      secureTitle: "重要的內容，再升級保護",
      secureBody:
        "一般筆記保持簡單；敏感內容則可依需求使用 AstraSecret、AstraConfidential 或 AstraZero。下方完整保留各加密模式的比較與限制。",
      shareTitle: "分享文字，不必分享帳號生態",
      shareBody:
        "丟一個唯讀連結就好。對方不需要 AstraNote 帳號，也不必跟你使用同一個社群或雲端平台；需要時可隨時撤銷存取。",
      limitEyebrow: "純文字其實很小",
      limitTitle: "128 KB 對純文字，比看起來大得多。",
      limitBody:
        "免費帳號提供最多 20 篇筆記與 128 KB 總空間。純文字非常省空間：在不計額外資料前，128 KB 足以容納數萬個中文字，或超過十萬個純 ASCII 字元。班級代碼、網址、提醒、程式片段與日常短筆記通常只會用掉其中很小一部分；加密筆記會需要更多空間，付費方案也提供更高容量。",
      accountStorageLabel: "免費純文字空間",
      accountLimitCaption: "20 篇筆記 · 128 KB · 無廣告 · 無分析追蹤",
      seoTitle: "AstraNote — 免費、快速、跨裝置的加密線上筆記",
      seoDescription:
        "AstraNote 是免費線上筆記服務，可在任何現代瀏覽器快速取用文字、跨裝置同步、以無需帳號的唯讀連結分享，並提供 AstraSecret、AstraConfidential 與 AstraZero 加密。"
    },
    ja: {
      heroKicker: "無料オンラインノート · アプリ不要",
      tagline: "必要な文字を、どの端末からでもすぐに。",
      heroLead:
        "モダンなブラウザがあれば、AstraNoteを開いてログインし、必要なメモをすぐ取り出せます。アプリのインストールも、短いコードやメモのために普段使いのメール／クラウドアカウントへログインする必要もありません。共有は読み取り専用リンクだけ。相手にAstraNoteアカウントは不要です。重要な内容にはAstraSecret、AstraConfidential、AstraZeroを利用できます。",
      begin: "無料アカウントを作成",
      purposeEyebrow: "速さのための設計",
      purposeTitle: "一つの文字列を取り出すだけで、ログイン作業に時間を使う必要はありません。",
      purposeIntroOne:
        "別の端末で授業コード、URL、リマインダー、コードスニペット、短い文章を確認したいだけのことがあります。そのためにアプリを入れたり、大きなクラウドサービスを開いたり、別アカウントの追加認証を済ませたりするのは過剰です。",
      purposeIntroTwo:
        "AstraNoteは独立した軽量アカウントで、ブラウザから直接使えます。ログインして、ノートを開いて、必要な文字を取得するだけ。新しい端末や共有端末で、メール・クラウドファイル・復旧手段まで持つ主要アカウントへログインする必要も減らせます。機密性の高いノートは信頼できる端末でのみ復号してください。",
      purposeIntroThree:
        "誰かに文章を渡すときも、同じSNSやサービスを使う必要はありません。読み取り専用リンクを作れば、相手にAstraNoteアカウントは不要で、あとから共有を取り消せます。",
      quickTitle: "どの端末でも、すぐ開ける",
      quickBody:
        "スマートフォン、タブレット、学校や図書館のPC、Linuxでも、モダンなブラウザがあれば利用できます。アプリのインストールやワークスペース設定は不要です。",
      secureTitle: "重要なノートだけ、保護を強く",
      secureBody:
        "日常のノートはシンプルに。機密性が必要ならAstraSecret、AstraConfidential、AstraZeroへ段階的に強化できます。下部の暗号化比較表もそのまま確認できます。",
      shareTitle: "アカウントではなく、文章を共有",
      shareBody:
        "読み取り専用リンクを送るだけ。相手にAstraNoteアカウントや同じSNS・クラウド環境は不要で、アクセスはいつでも取り消せます。",
      limitEyebrow: "テキストは小さい",
      limitTitle: "テキスト用途なら、128 KBは見た目以上に使えます。",
      limitBody:
        "無料アカウントは最大20ノート、合計128 KBです。プレーンテキストは非常に小さく、メタデータを除けば数万文字規模のCJK文字、または10万文字を超えるASCIIテキストを保存できる容量です。コード、URL、リマインダー、スニペット、日常の短いメモなら通常はその一部しか使いません。暗号化ノートは追加容量を使い、有料プランではさらに余裕があります。",
      accountStorageLabel: "無料テキスト容量",
      accountLimitCaption: "20ノート · 128 KB · 広告なし · 解析トラッカーなし",
      seoTitle: "AstraNote — 無料で高速、ブラウザだけで使える暗号化ノート",
      seoDescription:
        "AstraNoteは、どのモダンブラウザからでも素早く使え、端末をまたいでテキストを取得し、アカウント不要の読み取り専用リンクで共有できる無料オンラインノートです。AstraSecret、AstraConfidential、AstraZeroにも対応します。"
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
