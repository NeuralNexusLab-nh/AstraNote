"use strict";

(() => {
  const COPY = {
    en: {
      heroKicker: "FREE · BROWSER-FIRST · ANY DEVICE",
      tagline: "I wrote it, I own it.",
      heroLead:
        "A small home for useful links, quick instructions, and a few lines you’ll need again.\nFind them across devices, copy and go—or keep private text encrypted.",
      begin: "Start free",
      explore: "See plans",
      purposeEyebrow: "SMALL NOTES. EVERYDAY SHORTCUTS.",
      purposeTitle: "Keep the text. Skip the hunt.",
      purposeIntroOne:
        "AstraNote is your free, pocket-sized online notebook. Save a useful bit of text without organizing your whole life. On another device, sign in, search a title, and put it to use. No app to install.",
      purposeIntroTwo:
        "AstraNote uses its own lightweight account, so grabbing one note does not have to begin with opening the main email or cloud account that controls the rest of your digital life.",
      purposeIntroThree:
        "Sharing is just as direct: send a read-only link. The reader does not need an AstraNote account.",
      quickTitle: "Your useful lines, ready to go",
      quickBody:
        "Links, commands, and replies you use again and again. Write on your phone, copy on your computer—without messaging yourself another file.",
      secureTitle: "A few private lines deserve protection",
      secureBody:
        "AstraSecret for everyday privacy; AstraConfidential or AstraZero for more sensitive text, with a strong PIN you keep yourself.",
      shareTitle: "Write the instructions once",
      shareBody:
        "A setup guide, a checklist, a quick how-to. Keep it handy, or send a shareable note as a read-only link. The reader needs no account.",
      limitEyebrow: "BUILT FOR TEXT",
      limitTitle: "128 KB. More room than it sounds.",
      limitBody:
        "Useful text is light. A link, a command, or a short guide needs very little space. Keep up to 20 focused notes for the things you actually reach for, rather than a lifetime of files.",
      storageExampleLabel: "A SMALL EXAMPLE",
      storageExampleScenario: "20 notes × 500 ordinary Chinese characters",
      storageExampleAmount: "About 30 KB of plain text",
      storageExampleContext: "Less than a quarter of the free 128 KB.",
      storageExampleCaution: "Example calculated with 3-byte UTF-8 characters. Titles, encryption, and account data use additional space; actual capacity depends on your content and protection mode.",
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
      homePlusSpec: "256 KB · 50 notes",
      homeProSpec: "512 KB · Infinity notes",
      homeUltraSpec: "1024 KB · Infinity notes",
      homeFreeTitle: "Keep your first useful note. Free.",
      homeFreeBody: "128 KB · 20 notes · AstraSecret encryption",
      homeFreeCta: "Start free",
      homePlansCompare: "Compare all plans",
      homePlansFinePrint: "Monthly prices are for 30 days. Recovery is subject to retention limits; if a subscription expires, notes exceeding your remaining plan allowance are locked.",
      encryptionTitle: "Small notes. Serious privacy options.",
      encryptionIntro: "AstraSecret, AstraConfidential, and AstraZero encrypt content on your client before upload. Choose protection that fits your note; stronger PINs matter, and titles remain visible.",
      seoTitle: "AstraNote — Fast notes for useful text, links and private details",
      seoDescription:
        "Keep useful text, links, instructions and private details in one fast online notebook. Free 128 KB and 20 notes, title search across devices, read-only sharing, and optional advanced encryption."
    },
    "zh-Hant": {
      heroKicker: "免費 · 瀏覽器即用 · 跨裝置",
      tagline: "我寫下，就歸我。",
      heroLead:
        "專放常用連結、操作說明，和臨時要用的幾行字。\n跨裝置找得到、複製就能用；重要內容，也能加密保存。",
      begin: "免費開始",
      explore: "了解方案",
      purposeEyebrow: "小筆記，派上大用場",
      purposeTitle: "下次要用，不必再翻一次。",
      purposeIntroOne:
        "AstraNote 是免費的隨身線上小筆記。留下一段文字，不必先整理整個世界；換個裝置，登入、搜尋標題，就能拿來用。不必另外安裝應用程式。",
      purposeIntroTwo:
        "AstraNote 使用獨立的輕量登入。臨時只想拿一段文字時，不必先打開掌管郵件、雲端與帳號復原的主要帳號。",
      purposeIntroThree:
        "要給別人？丟一個唯讀連結就好。對方不需要 AstraNote 帳號。",
      quickTitle: "常用的幾行，隨手就拿到",
      quickBody:
        "網址、指令、常用回覆，集中留在這裡。手機記下，電腦複製，不用再傳訊息給自己。",
      secureTitle: "幾行私密，也值得好好保護",
      secureBody:
        "日常私密用 AstraSecret；更敏感的內容可選 AstraConfidential 或 AstraZero，搭配你自行保管的強 PIN。",
      shareTitle: "一份說明，少解釋好幾次",
      shareBody:
        "設備設定、操作步驟、行前提醒，寫一次就能反覆看。可分享筆記傳成唯讀連結，對方不用註冊。",
      limitEyebrow: "為純文字而生",
      limitTitle: "128 KB，比你想的更能裝。",
      limitBody:
        "文字很輕，真正常用的內容往往只有幾行。一個網址、一段指令、一份操作說明，都不需要大容量。用最多 20 篇小筆記，把常用的那些留好，就很實用。",
      storageExampleLabel: "算給你看",
      storageExampleScenario: "20 篇筆記 × 每篇 500 個一般中文字",
      storageExampleAmount: "純文字約 30 KB",
      storageExampleContext: "不到免費 128 KB 的四分之一。",
      storageExampleCaution: "以 UTF-8 每字 3 位元組估算。標題、加密與帳號資料另占空間；實際可存量依內容與加密方式而異。",
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
      homePlusSpec: "256 KB · 50 篇筆記",
      homeProSpec: "512 KB · 無限篇筆記",
      homeUltraSpec: "1024 KB · 無限篇筆記",
      homeFreeTitle: "先留下第一篇用得上的筆記，免費。",
      homeFreeBody: "128 KB · 20 篇筆記 · AstraSecret 加密",
      homeFreeCta: "免費開始",
      homePlansCompare: "完整比較所有方案",
      homePlansFinePrint: "每月以 30 天計算。復原功能有保留期限；訂閱到期後，超出可用方案額度的筆記將被鎖定。",
      encryptionTitle: "小筆記，也能認真保護。",
      encryptionIntro: "AstraSecret、AstraConfidential 與 AstraZero 都在客戶端加密內容後才上傳。依私密程度選擇保護方式，搭配足夠強的 PIN；筆記標題仍保持可讀。",
      seoTitle: "AstraNote — 常用內容、連結與私密文字的快速筆記",
      seoDescription:
        "常用內容、連結、操作說明與私密文字，集中放在 AstraNote。免費 128 KB、20 篇筆記，跨裝置搜尋標題、唯讀連結分享，也能選擇進階加密保護重要文字。"
    },
    ja: {
      heroKicker: "無料 · ブラウザですぐ使える · 端末を選ばない",
      tagline: "書いたら、私のもの。",
      heroLead:
        "よく使うリンク、手順メモ、また必要になる数行のために。\n端末を変えても、見つけてコピー。大切な内容は暗号化して保存。",
      begin: "無料で始める",
      explore: "プランを見る",
      purposeEyebrow: "小さなメモが、毎日の近道に",
      purposeTitle: "次に使うときは、探し回らない。",
      purposeIntroOne:
        "AstraNote は、無料で使える持ち歩き感覚のオンラインメモです。短い文章を残すのに、生活すべてを整理する必要はありません。別の端末でもログインしてタイトルを検索すれば、すぐに使えます。アプリのインストールは不要です。",
      purposeIntroTwo:
        "AstraNote は独立した軽量アカウントなので、短いメモ一つのためにメールやクラウド、復旧手段を持つ主要アカウントまで開く必要を減らせます。",
      purposeIntroThree:
        "共有も直接的です。読み取り専用リンクを一つ送るだけで、相手に AstraNote アカウントは必要ありません。",
      quickTitle: "よく使う数行を、すぐ手元に",
      quickBody:
        "URL、コマンド、定型文を一か所に。スマホで書いて、パソコンでコピー。自分宛てに何度もメッセージを送らずに済みます。",
      secureTitle: "短い秘密にも、確かな配慮を",
      secureBody:
        "日常のプライバシーには AstraSecret。より機密性の高い文章には AstraConfidential や AstraZero を、自分で保管する強い PIN とともに。",
      shareTitle: "手順は、一度書いて何度でも",
      shareBody:
        "機器の設定、操作手順、出発前の確認事項。何度でも読み返せて、共有できるノートならリンク一つで相手に届けられます。相手の登録は不要です。",
      limitEyebrow: "テキストのための設計",
      limitTitle: "128 KB。思ったより、たくさん書ける。",
      limitBody:
        "よく使う情報は、たいてい数行。URL、コマンド、短い手順書なら、大きな容量は要りません。最大20件の小さなノートに、必要なものをまとめておけます。",
      storageExampleLabel: "たとえば",
      storageExampleScenario: "20 ノート × 500 文字",
      storageExampleAmount: "本文は約 30 KB",
      storageExampleContext: "無料の 128 KB の4分の1未満です。",
      storageExampleCaution: "UTF-8 で1文字3バイトとして計算。タイトル、暗号化、アカウント情報にも容量が必要です。実際に保存できる量は内容と暗号化方式によって異なります。",
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
      homePlusSpec: "256 KB · 50 ノート",
      homeProSpec: "512 KB · ノート数無限",
      homeUltraSpec: "1024 KB · ノート数無限",
      homeFreeTitle: "まずは、役に立つメモを一つ。無料で。",
      homeFreeBody: "128 KB · 20 ノート · AstraSecret 暗号化",
      homeFreeCta: "無料で始める",
      homePlansCompare: "すべてのプランを比較",
      homePlansFinePrint: "1 か月は 30 日です。復元には保存期限があります。サブスクリプション終了後、利用可能なプランの上限を超えるノートはロックされます。",
      encryptionTitle: "小さなメモにも、本格的な保護を。",
      encryptionIntro: "AstraSecret、AstraConfidential、AstraZero はアップロード前にクライアント側で内容を暗号化します。機密性に合う方式と十分に強い PIN を選んでください。タイトルは暗号化されません。",
      seoTitle: "AstraNote — よく使う文章・リンク・秘密をすぐ残せるメモ",
      seoDescription:
        "よく使う文章、リンク、手順や個人的な情報を AstraNote に。無料の 128 KB・20 ノート、端末をまたいだタイトル検索、読み取り専用の共有、高度な暗号化に対応します。"
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
