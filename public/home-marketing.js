"use strict";

(() => {
  const COPY = {
    en: {
      heroKicker: "FREE · BROWSER-FIRST · ANY DEVICE",
      tagline: "Write it once. Find it fast.",
      heroLead:
        "Everyday notes, useful images and private information—ready on any device when you need them.",
      begin: "Start free",
      explore: "See plans",
      purposeEyebrow: "SMALL NOTES. EVERYDAY SHORTCUTS.",
      purposeTitle: "Keep the text. Skip the hunt.",
      purposeIntroOne:
        "AstraNote is a free online notebook for text and images. Write in Markdown, annotate a picture, then search its title on another device. Choose encryption for private content, or let Astra Agent help you refine it.",
      purposeIntroTwo:
        "AstraNote uses its own lightweight account, so grabbing one note does not have to begin with opening the main email or cloud account that controls the rest of your digital life.",
      purposeIntroThree:
        "Sharing is just as direct: send a read-only link. The reader does not need an AstraNote account.",
      quickTitle: "Write it down",
      aiTitle: "Do more with one note",
      aiBody: "Refine text and images with Astra Agent. Use AstraPass to edit one note elsewhere with a temporary sign-in, without opening your main account.",
      quickBody:
        "Write in Markdown and add up to three images. Sketch, annotate and keep useful details together.",
      shareTitle: "Retrieve it in seconds",
      shareBody:
        "Keep short text, reference details, and things you need to remember close by. Search, copy, and use them from any device.",
      secureTitle: "Protect sensitive information",
      secureBody:
        "Choose the right encryption for private content. Encrypted note titles are also stored with AES-256-GCM protection, while remaining visible and searchable after sign-in.",
      homePassTitle: "One note. A temporary sign-in.",
      homePassBody: "Need this note on another device without opening your main account? Create an AstraPass just for it. Saved edits go straight back to the original note; access ends at expiry.",
      homePassCreate: "Create a temporary account",
      homePassCreateHint: "From the note's action bar.",
      homePassEdit: "Edit the same note",
      homePassEditHint: "Saved changes update your original.",
      homePassExpire: "Access ends on time",
      homePassExpireHint: "Your original note stays with you.",
      homePassLearn: "How AstraPass works",
      limitEyebrow: "BUILT FOR TEXT",
      limitTitle: "128 KB. More room than it sounds.",
      limitBody:
        "Useful text is light. A link, a command, or a short guide needs very little space. Keep up to 20 focused notes for the things you actually reach for, rather than a lifetime of files.",
      storageExampleLabel: "A SMALL EXAMPLE",
      storageExampleScenario: "20 notes × 500 English characters",
      storageExampleAmount: "About 10 KB of plain text",
      storageExampleContext: "Less than one tenth of verified Free storage.",
      storageExampleCaution: "Based on plain ASCII text. Titles, images, encryption and history also use space.",
      accountStorageLabel: "FREE TEXT STORAGE",
      accountLimitCaption: "20 NOTES · 128 KB · NO ADS · NO ANALYTICS",
      homePlansLabel: "GROW AT YOUR OWN PACE",
      homeStatsLabel: "AstraNote community",
      homePlansTitle: "Start with useful. Upgrade what matters.",
      homePlansLead: "Free covers the everyday essentials. Upgrade for quicker organization, advanced encryption, or a way back after a mistake—not just more space.",
      homePlusRole: "Organize",
      homeProRole: "Protect",
      homeUltraRole: "Recover",
      homePlusBody: "Pin your go-to notes and keep them up front.",
      homeProBody: "Private text, with keys generated on your device.",
      homeUltraBody: "Recover from a wrong edit or an accidental deletion.",
      homeOrganize: "Pin, archive & batch manage",
      homeConfidential: "AstraConfidential encryption",
      homeZero: "AstraZero client-side encryption",
      homePlusIncluded: "Everything in Plus",
      homeProIncluded: "Everything in Pro",
      homeRecovery: "Previous version & trash recovery",
      homePlusSpec: "256 KB · 50 notes · 50 images",
      homeProSpec: "512 KB · Infinity notes · 150 images",
      homeUltraSpec: "1024 KB · Infinity notes · 500 images",
      homeFreeTitle: "Keep your first useful note. Free.",
      homeFreeBody: "128 KB · 20 notes · 15 images · AstraSecret",
      homeFreeCta: "Start free",
      homePlansCompare: "Compare all plans",
      homePlansFinePrint: "Monthly prices are for 30 days. Recovery is subject to retention limits; if a subscription expires, notes exceeding your remaining plan allowance are locked.",
      encryptionTitle: "Small notes. Serious privacy options.",
      encryptionIntro: "AstraSecret, AstraConfidential, and AstraZero encrypt content on your client before upload. New encrypted notes also protect their title with AES-256-GCM while keeping it available in your signed-in lists.",
      seoTitle: "AstraNote - Write it once. Find it fast.",
      seoDescription:
        "Save notes and images in a free online notebook with Markdown, cross-device title search, optional encryption and Astra Agent. Free Education includes Plus features for verified educational emails."
    },
    "zh-Hant": {
      heroKicker: "免費 · 瀏覽器即用 · 跨裝置",
      tagline: "隨手記下，隨時找到。",
      heroLead:
        "日常筆記、隨手保存的圖片，以及需要保護的私密資訊；\n換個裝置，需要時依然就在手邊。",
      begin: "免費開始",
      explore: "了解方案",
      purposeEyebrow: "小筆記，派上大用場",
      purposeTitle: "下次要用，不必再翻一次。",
      purposeIntroOne:
        "AstraNote 是能存文字與圖片的免費線上筆記本。用 Markdown 記錄、為圖片加字與繪圖，換個裝置，搜尋標題就能找回；私密內容可選擇加密，也有 Astra Agent 幫忙整理。",
      purposeIntroTwo:
        "AstraNote 使用獨立的輕量登入。臨時只想拿一段文字時，不必先打開掌管郵件、雲端與帳號復原的主要帳號。",
      purposeIntroThree:
        "要給別人？丟一個唯讀連結就好。對方不需要 AstraNote 帳號。",
      quickTitle: "好好記下來",
      aiTitle: "讓筆記更好用",
      aiBody: "用 Astra Agent 整理文字與圖片；透過 AstraPass 的臨時帳號，在其他裝置編輯同一篇筆記，不必開啟主帳號。",
      quickBody:
        "用 Markdown 整理文字，每篇可加入三張圖片。手繪、加字、寫註解，把需要的資訊放在一起。",
      shareTitle: "需要時立刻拿到",
      shareBody:
        "短句、參考資訊與需要記得的內容，集中放在手邊。跨裝置搜尋、複製後就能使用。",
      secureTitle: "私密內容，好好保護",
      secureBody:
        "選擇適合的加密方式，保護私密內容。加密筆記的標題也會以 AES-256-GCM 加密儲存，登入後仍可查看與搜尋。",
      homePassTitle: "只用這一篇，不必登入整個帳號。",
      homePassBody: "換個裝置，只想編輯這篇筆記？用 AstraPass 為它單獨建立臨時帳號。儲存的修改直接更新原筆記，到期後立即失效。",
      homePassCreate: "建立臨時帳號",
      homePassCreateHint: "在這篇筆記的操作列建立。",
      homePassEdit: "修改同步原筆記",
      homePassEditHint: "不是副本，不用來回搬內容。",
      homePassExpire: "到期立即失效",
      homePassExpireHint: "臨時存取結束，原筆記仍保留。",
      homePassLearn: "了解 AstraPass",
      limitEyebrow: "為純文字而生",
      limitTitle: "128 KB，比你想的還更大。",
      limitBody:
        "文字很輕，真正常用的內容往往只有幾行。一個網址、一段指令、一份操作說明，都不需要大容量。用最多 20 篇小筆記，把常用的那些留好，就很實用。",
      storageExampleLabel: "算給你看",
      storageExampleScenario: "20 篇筆記 × 每篇 500 個英文字元",
      storageExampleAmount: "純文字約 10 KB",
      storageExampleContext: "不到已驗證 Free 空間的十分之一。",
      storageExampleCaution: "以純英文 ASCII 估算；標題、圖片、加密與版本紀錄也會占空間。",
      accountStorageLabel: "免費純文字空間",
      accountLimitCaption: "20 篇筆記 · 128 KB · 無廣告 · 無分析追蹤",
      homePlansLabel: "依照需要，慢慢升級",
      homeStatsLabel: "AstraNote 使用統計",
      homePlansTitle: "日常免費用，重要的再升級。",
      homePlansLead: "先把常用文字放進來。需要更順手的整理、進階加密，或改錯時的一步退路，再選適合的方案；升級不只是多一點空間。",
      homePlusRole: "整理",
      homeProRole: "保護",
      homeUltraRole: "復原",
      homePlusBody: "把最常用的筆記，釘在最前面。",
      homeProBody: "保護私密文字，金鑰由客戶端獨立產生。",
      homeUltraBody: "寫錯、誤刪，還有一步能回頭。",
      homeOrganize: "釘選、封存與批次管理",
      homeConfidential: "AstraConfidential 加密",
      homeZero: "AstraZero 客戶端加密",
      homePlusIncluded: "包含 Plus 的所有功能",
      homeProIncluded: "包含 Pro 的所有功能",
      homeRecovery: "上一版本與垃圾桶還原",
      homePlusSpec: "256 KB · 50 篇筆記 · 50 張圖片",
      homeProSpec: "512 KB · 無限篇筆記 · 150 張圖片",
      homeUltraSpec: "1024 KB · 無限篇筆記 · 500 張圖片",
      homeFreeTitle: "先留下第一篇用得上的筆記，免費。",
      homeFreeBody: "128 KB · 20 篇筆記 · 15 張圖片 · AstraSecret",
      homeFreeCta: "免費開始",
      homePlansCompare: "完整比較所有方案",
      homePlansFinePrint: "每月以 30 天計算。復原功能有保留期限；訂閱到期後，超出可用方案額度的筆記將被鎖定。",
      encryptionTitle: "小筆記，也能認真保護。",
      encryptionIntro: "AstraSecret、AstraConfidential 與 AstraZero 都在客戶端加密內容後才上傳。新版加密筆記也會以 AES-256-GCM 保護標題，登入後仍可在清單中查看與搜尋。",
      seoTitle: "AstraNote - 隨手記下，隨時找到。",
      seoDescription:
        "免費保存文字與圖片，支援 Markdown、跨裝置搜尋標題、加密與 Astra Agent。符合資格的教育信箱驗證後，可免費享 Education 的 Plus 同等功能。"
    },
    ja: {
      heroKicker: "無料 · ブラウザですぐ使える · 端末を選ばない",
      tagline: "書いておけば、すぐ見つかる。",
      heroLead:
        "日々のノート、役立つ画像、大切な個人情報。必要なとき、どの端末でもすぐ手元に。",
      begin: "無料で始める",
      explore: "プランを見る",
      purposeEyebrow: "小さなメモが、毎日の近道に",
      purposeTitle: "次に使うときは、探し回らない。",
      purposeIntroOne:
        "AstraNote は文章と画像を保存できる無料オンラインノートです。Markdown で書き、画像に文字や線を加え、別の端末でもタイトル検索で見つけられます。個人的な内容は暗号化し、推敲には Astra Agent を使えます。",
      purposeIntroTwo:
        "AstraNote は独立した軽量アカウントなので、短いメモ一つのためにメールやクラウド、復旧手段を持つ主要アカウントまで開く必要を減らせます。",
      purposeIntroThree:
        "共有も直接的です。読み取り専用リンクを一つ送るだけで、相手に AstraNote アカウントは必要ありません。",
      quickTitle: "きちんと書き留める",
      aiTitle: "ノートをもっと便利に",
      aiBody: "Astra Agentで文章や画像を整える。AstraPassの一時アカウントなら、メインアカウントを開かず別の端末で同じノートを編集できます。",
      quickBody:
        "アイデア、やること、学習の要点、会議メモ。まず書いて、整理は必要になったときに。",
      shareTitle: "必要なとき、すぐ取り出す",
      shareBody:
        "短い文章、参照情報、覚えておきたいことを手元に。端末をまたいで検索し、コピーしてすぐ使えます。",
      secureTitle: "個人的な情報を、きちんと守る",
      secureBody:
        "大切な内容には、用途に合った暗号化を。暗号化ノートのタイトルも AES-256-GCM で暗号化して保存され、ログイン後は表示・検索できます。",
      homePassTitle: "一つのノートに、一時ログイン。",
      homePassBody: "別の端末でこのノートだけ編集したいときは、AstraPass の専用アカウントを。保存した変更は元ノートに反映され、期限になるとアクセスが終了します。",
      homePassCreate: "一時アカウントを作成",
      homePassCreateHint: "ノートの操作欄から作成。",
      homePassEdit: "同じノートを編集",
      homePassEditHint: "保存した変更は元ノートに反映。",
      homePassExpire: "期限でアクセス終了",
      homePassExpireHint: "元のノートはそのまま残ります。",
      homePassLearn: "AstraPass の使い方",
      limitEyebrow: "テキストのための設計",
      limitTitle: "128 KB。思ったより、たくさん書ける。",
      limitBody:
        "よく使う情報は、たいてい数行。URL、コマンド、短い手順書なら、大きな容量は要りません。最大20件の小さなノートに、必要なものをまとめておけます。",
      storageExampleLabel: "たとえば",
      storageExampleScenario: "20 ノート × 英字 500 文字",
      storageExampleAmount: "本文は約 10 KB",
      storageExampleContext: "認証済み Free 容量の10分の1未満です。",
      storageExampleCaution: "ASCII英字での例です。タイトル・画像・暗号化・履歴も容量を使います。",
      accountStorageLabel: "無料テキスト容量",
      accountLimitCaption: "20ノート · 128 KB · 広告なし · 解析トラッカーなし",
      homePlansLabel: "必要に合わせて、少しずつ",
      homeStatsLabel: "AstraNote の利用状況",
      homePlansTitle: "毎日は無料で。大切なことに、もう一歩。",
      homePlansLead: "まずは、よく使う文章から。整理、高度な暗号化、間違えたときの復元が必要になったら、プランを選べます。増えるのは容量だけではありません。",
      homePlusRole: "整理",
      homeProRole: "保護",
      homeUltraRole: "復元",
      homePlusBody: "よく使うノートを、先頭にピン留め。",
      homeProBody: "暗号鍵は自分の端末だけで生成。大切な文章を守る。",
      homeUltraBody: "書き間違いや削除から、一歩戻れるように。",
      homeOrganize: "ピン留め・アーカイブ・一括管理",
      homeConfidential: "AstraConfidential 暗号化",
      homeZero: "AstraZero クライアント側暗号化",
      homePlusIncluded: "Plus のすべての機能",
      homeProIncluded: "Pro のすべての機能",
      homeRecovery: "前のバージョン・ごみ箱からの復元",
      homePlusSpec: "256 KB · 50 ノート · 50 画像",
      homeProSpec: "512 KB · ノート数無限 · 150 画像",
      homeUltraSpec: "1024 KB · ノート数無限 · 500 画像",
      homeFreeTitle: "まずは、役に立つメモを一つ。無料で。",
      homeFreeBody: "128 KB · 20 ノート · 15 画像 · AstraSecret",
      homeFreeCta: "無料で始める",
      homePlansCompare: "すべてのプランを比較",
      homePlansFinePrint: "1 か月は 30 日です。復元には保存期限があります。サブスクリプション終了後、利用可能なプランの上限を超えるノートはロックされます。",
      encryptionTitle: "小さなメモにも、本格的な保護を。",
      encryptionIntro: "AstraSecret、AstraConfidential、AstraZero はアップロード前にクライアント側で内容を暗号化します。新しい暗号化ノートのタイトルも AES-256-GCM で保護され、サインイン中の一覧では表示と検索を続けられます。",
      seoTitle: "AstraNote - 書いておけば、すぐ見つかる。",
      seoDescription:
        "文章と画像を無料で保存。Markdown、端末をまたぐタイトル検索、暗号化、Astra Agentに対応。対象の教育メールを認証するとPlus相当のEducationを無料で利用できます。"
    }
  };

  Object.assign(COPY.en, { quickBody: "Write in Markdown and add up to three images. Sketch, annotate and keep useful details together.", aiBody: "Refine text and images with Astra Agent. Use AstraPass to edit one note elsewhere with a temporary sign-in, without opening your main account.", aiTitle: "Do more with one note" });
  Object.assign(COPY["zh-Hant"], { quickBody: "用 Markdown 整理文字，每篇可加入三張圖片。手繪、加字、寫註解，把需要的資訊放在一起。", aiBody: "用 Astra Agent 整理文字與圖片；透過 AstraPass 的臨時帳號，在其他裝置編輯同一篇筆記，不必開啟主帳號。", aiTitle: "讓筆記更好用" });
  Object.assign(COPY.ja, { quickBody: "Markdownと3枚までの画像で記録。描画・文字・説明を加え、必要な情報をひとまとめに。", aiBody: "Astra Agentで文章や画像を整える。AstraPassの一時アカウントなら、メインアカウントを開かず別の端末で同じノートを編集できます。", aiTitle: "ノートをもっと便利に" });
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
