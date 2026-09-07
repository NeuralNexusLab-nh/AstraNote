"use strict";

(() => {
  const COPY = {
    en: {
      heroKicker: "FREE · BROWSER-FIRST · ANY DEVICE",
      tagline: "I wrote it, it’s mine.",
      heroLead:
        "Open a browser, your notes are there. Sharing takes just one link;\nfor your most private content, there’s AstraZero encryption.",
      begin: "Start free",
      explore: "See plans",
      purposeEyebrow: "YOUR NOTES, WITHIN REACH",
      purposeTitle: "Less setup. More room to think.",
      purposeIntroOne:
        "AstraNote is a free online notebook for ideas, reminders, and the text you reach for every day. No app to install. Just sign in and start writing.",
      purposeIntroTwo:
        "AstraNote uses its own lightweight account, so grabbing one note does not have to begin with opening the main email or cloud account that controls the rest of your digital life.",
      purposeIntroThree:
        "Sharing is just as direct: send a read-only link. The reader does not need an AstraNote account.",
      quickTitle: "Ready on any device",
      quickBody:
        "Write on your phone, find it on your computer. Your notes come with you, without moving files.",
      secureTitle: "Private when it matters",
      secureBody:
        "Choose the protection each note needs, from everyday encryption to AstraZero’s client-generated keys.",
      shareTitle: "One link to share",
      shareBody:
        "Let someone read a shareable note without an account. Close the link whenever you choose.",
      limitEyebrow: "BUILT FOR TEXT",
      limitTitle: "Just text. Less to get in your way.",
      limitBody:
        "A thought, a checklist, a snippet worth keeping. Plain text keeps the focus on your words. Start with 128 KB free, with up to 1024 KB when you need more. Encryption and account data also count toward storage.",
      accountStorageLabel: "FREE TEXT STORAGE",
      accountLimitCaption: "20 NOTES · 128 KB · NO ADS · NO ANALYTICS",
      homePlansLabel: "GROW AT YOUR OWN PACE",
      homeStatsLabel: "AstraNote community",
      homePlansTitle: "From everyday notes to extra peace of mind.",
      homePlansLead: "Start free. Add organization, deeper privacy, or a way back when you need it.",
      homePlusRole: "Organize",
      homeProRole: "Protect",
      homeUltraRole: "Recover",
      homePlusBody: "Keep your everyday notes in order.",
      homeProBody: "Give important words more privacy.",
      homeUltraBody: "Leave room to undo a mistake.",
      homeOrganize: "Pin, archive & batch manage",
      homeConfidential: "AstraConfidential encryption",
      homeZero: "AstraZero client-side encryption",
      homePlusIncluded: "Everything in Plus",
      homeProIncluded: "Everything in Pro",
      homeRecovery: "Previous version & trash recovery",
      homePlusSpec: "256 KB · 50 notes",
      homeProSpec: "512 KB · Infinity notes",
      homeUltraSpec: "1024 KB · Infinity notes",
      homeFreeTitle: "A place to start. Free to keep using.",
      homeFreeBody: "128 KB · 20 notes · AstraSecret encryption",
      homeFreeCta: "Start free",
      homePlansCompare: "Compare all plans",
      homePlansFinePrint: "Monthly prices are for 30 days. Recovery is subject to retention limits; if a subscription expires, notes exceeding your remaining plan allowance are locked.",
      seoTitle: "AstraNote — Fast, free browser notes with strong encryption",
      seoDescription:
        "AstraNote is a free browser-first notebook for fast cross-device access, account-free read-only sharing, and powerful optional encryption with AstraSecret, AstraConfidential, and AstraZero."
    },
    "zh-Hant": {
      heroKicker: "免費 · 瀏覽器即用 · 跨裝置",
      tagline: "寫下了，就是我的。",
      heroLead:
        "打開瀏覽器，筆記就在，想分享也只差一個連結；\n而最私密的內容，有 AstraZero 加密守護。",
      begin: "免費開始",
      explore: "了解方案",
      purposeEyebrow: "你的筆記，隨時在手邊",
      purposeTitle: "少一點準備，多一點隨心。",
      purposeIntroOne:
        "AstraNote 是免費的線上筆記本，記下想法、待辦，以及每天會用到的文字。不必安裝應用程式，登入就能開始。",
      purposeIntroTwo:
        "AstraNote 使用獨立的輕量登入。臨時只想拿一段文字時，不必先打開掌管郵件、雲端與帳號復原的主要帳號。",
      purposeIntroThree:
        "要給別人？丟一個唯讀連結就好。對方不需要 AstraNote 帳號。",
      quickTitle: "換個裝置，筆記還在",
      quickBody:
        "手機記下的靈感，電腦也能查看。不用來回傳檔，文字隨時都在手邊。",
      secureTitle: "重要內容，多一層保護",
      secureBody:
        "依每篇筆記選擇保護方式，從日常加密，到由客戶端獨立產生金鑰的 AstraZero。",
      shareTitle: "一個連結，就能分享",
      shareBody:
        "開啟可分享筆記的唯讀連結，對方不用註冊就能查看；不想分享時，隨時關閉。",
      limitEyebrow: "為純文字而生",
      limitTitle: "只留下文字，把簡單留給你。",
      limitBody:
        "一個想法、一份清單、一段值得留下的文字。純文字輕巧直接，讓記錄回到內容本身。從免費的 128 KB 開始，需要時可升級至 1024 KB；加密與帳號資料也會計入用量。",
      accountStorageLabel: "免費純文字空間",
      accountLimitCaption: "20 篇筆記 · 128 KB · 無廣告 · 無分析追蹤",
      homePlansLabel: "依照需要，慢慢升級",
      homeStatsLabel: "AstraNote 使用統計",
      homePlansTitle: "從日常記錄，到更安心地保存。",
      homePlansLead: "免費開始，再為需要的整理、私密與復原能力升級。",
      homePlusRole: "整理",
      homeProRole: "保護",
      homeUltraRole: "復原",
      homePlusBody: "把每天用的筆記，整理得更順手。",
      homeProBody: "為真正重要的文字，加深私密保護。",
      homeUltraBody: "改錯或誤刪，為自己保留回頭路。",
      homeOrganize: "釘選、封存與批次管理",
      homeConfidential: "AstraConfidential 加密",
      homeZero: "AstraZero 客戶端加密",
      homePlusIncluded: "包含 Plus 的所有功能",
      homeProIncluded: "包含 Pro 的所有功能",
      homeRecovery: "上一版本與垃圾桶還原",
      homePlusSpec: "256 KB · 50 篇筆記",
      homeProSpec: "512 KB · 無限篇筆記",
      homeUltraSpec: "1024 KB · 無限篇筆記",
      homeFreeTitle: "免費開始，日常筆記也能好好保存。",
      homeFreeBody: "128 KB · 20 篇筆記 · AstraSecret 加密",
      homeFreeCta: "免費開始",
      homePlansCompare: "完整比較所有方案",
      homePlansFinePrint: "每月以 30 天計算。復原功能有保留期限；訂閱到期後，超出可用方案額度的筆記將被鎖定。",
      seoTitle: "AstraNote — 免費、快速、跨裝置的加密線上筆記",
      seoDescription:
        "AstraNote 是免費、瀏覽器即用的線上筆記服務，提供快速跨裝置存取、無需帳號的唯讀分享，以及 AstraSecret、AstraConfidential 與 AstraZero 強大加密。"
    },
    ja: {
      heroKicker: "無料 · ブラウザですぐ使える · 端末を選ばない",
      tagline: "書いたものは、私のもの。",
      heroLead:
        "ブラウザを開けばノートがそこに。共有もリンク一つ。\n大切な秘密は、AstraZero の暗号化で守れます。",
      begin: "無料で始める",
      explore: "プランを見る",
      purposeEyebrow: "ノートを、いつも手元に",
      purposeTitle: "準備は少なく、思考は自由に。",
      purposeIntroOne:
        "AstraNote は、アイデアややること、毎日使う文章を残せる無料のオンラインノートです。アプリのインストールは不要。ログインすれば、すぐに書き始められます。",
      purposeIntroTwo:
        "AstraNote は独立した軽量アカウントなので、短いメモ一つのためにメールやクラウド、復旧手段を持つ主要アカウントまで開く必要を減らせます。",
      purposeIntroThree:
        "共有も直接的です。読み取り専用リンクを一つ送るだけで、相手に AstraNote アカウントは必要ありません。",
      quickTitle: "端末が変わっても、手元に",
      quickBody:
        "スマホに書いたひらめきを、パソコンで確認。ファイルを移さず、いつものノートにアクセスできます。",
      secureTitle: "大切な内容には、保護を",
      secureBody:
        "日常の暗号化から、クライアント側だけで鍵を生成する AstraZero まで。ノートごとに保護方式を選べます。",
      shareTitle: "共有は、リンク一つで",
      shareBody:
        "共有できるノートは、読み取り専用リンクで届けられます。相手の登録は不要。リンクはいつでも無効にできます。",
      limitEyebrow: "テキストのための設計",
      limitTitle: "テキストだけ。だから、シンプル。",
      limitBody:
        "ひらめきも、チェックリストも、残したい一文も。軽いプレーンテキストで、内容そのものに集中できます。無料の 128 KB から、必要に応じて 1024 KB まで。暗号化やアカウントのデータも容量に含まれます。",
      accountStorageLabel: "無料テキスト容量",
      accountLimitCaption: "20ノート · 128 KB · 広告なし · 解析トラッカーなし",
      homePlansLabel: "必要に合わせて、少しずつ",
      homeStatsLabel: "AstraNote の利用状況",
      homePlansTitle: "日々の記録から、もっと安心できる保存へ。",
      homePlansLead: "無料で始めて、整理、プライバシー、復元の機能を必要に応じて追加。",
      homePlusRole: "整理",
      homeProRole: "保護",
      homeUltraRole: "復元",
      homePlusBody: "毎日使うノートを、すっきり整理。",
      homeProBody: "大切な文章に、より深いプライバシーを。",
      homeUltraBody: "書き間違いや削除に、戻れる余地を。",
      homeOrganize: "ピン留め・アーカイブ・一括管理",
      homeConfidential: "AstraConfidential 暗号化",
      homeZero: "AstraZero クライアント側暗号化",
      homePlusIncluded: "Plus のすべての機能",
      homeProIncluded: "Pro のすべての機能",
      homeRecovery: "前のバージョン・ごみ箱からの復元",
      homePlusSpec: "256 KB · 50 ノート",
      homeProSpec: "512 KB · ノート数無限",
      homeUltraSpec: "1024 KB · ノート数無限",
      homeFreeTitle: "無料で始めて、そのまま使い続けられます。",
      homeFreeBody: "128 KB · 20 ノート · AstraSecret 暗号化",
      homeFreeCta: "無料で始める",
      homePlansCompare: "すべてのプランを比較",
      homePlansFinePrint: "1 か月は 30 日です。復元には保存期限があります。サブスクリプション終了後、利用可能なプランの上限を超えるノートはロックされます。",
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

  const setCopy = (node, key, value) => {
    if (key !== "heroLead" || !String(value).includes("\n")) {
      node.textContent = value;
      return;
    }
    node.replaceChildren();
    String(value)
      .split("\n")
      .forEach((line, index) => {
        if (index) node.append(document.createElement("br"));
        node.append(document.createTextNode(line));
      });
  };

  const applyMarketingCopy = () => {
    const copy = getCopy();
    document.querySelector(".hero-kicker")?.remove();
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (key && Object.prototype.hasOwnProperty.call(copy, key)) {
        setCopy(node, key, copy[key]);
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
