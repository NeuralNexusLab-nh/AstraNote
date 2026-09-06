"use strict";

(() => {
  const COPY = {
    en: {
      heroKicker: "ASTRANOTE · TEXT-FIRST",
      heroTitle: "Don't let a device trap your text.",
      heroOpen: "Open a browser. It's there.",
      heroShare: "Want to share? One link is enough;",
      heroPrivate: "Want privacy? Hand it to AstraZero.",
      heroClose: "Let text move across devices.",
      begin: "Start free",
      explore: "Compare plans",
      purposeEyebrow: "THREE MOVES. THAT'S IT.",
      purposeTitle: "From writing it down to getting it back, nothing should get in the way.",
      quickLabel: "ANY DEVICE",
      quickTitle: "Open it. It's there.",
      quickBody: "No app install and no workspace setup. If there is a browser, your text is within reach.",
      shareLabel: "READ-ONLY SHARING",
      shareTitle: "One link is enough.",
      shareBody: "Pass the text directly to someone else. No AstraNote account, no matching platform, no extra setup.",
      secureLabel: "DEEPER WHEN NEEDED",
      secureTitle: "Simple on the surface. Serious underneath.",
      secureBody: "Keep everyday notes light, then use AstraSecret, AstraConfidential, or AstraZero when the words matter more.",
      limitEyebrow: "BUILT FOR TEXT",
      limitTitle: "Text stays light, so the experience can stay fast.",
      limitBody: "AstraNote focuses on plain text because it is direct, easy to read, easy to organize, and easy to move across devices. Free starts at 128 KB, while paid plans scale up to 1024 KB of text storage. Capacity is a specification; speed, control, privacy, and recovery are the point.",
      accountStorageLabel: "TEXT STORAGE",
      accountLimitCaption: "128 KB FREE · UP TO 1024 KB · TEXT-FIRST",
      seoTitle: "AstraNote — Fast browser notes with strong encryption",
      seoDescription: "AstraNote is a browser-first text notebook for fast cross-device access, account-free read-only sharing, and optional AstraSecret, AstraConfidential, and AstraZero protection."
    },
    "zh-Hant": {
      heroKicker: "ASTRANOTE · 純文字優先",
      heroTitle: "別讓裝置困住你的文字。",
      heroOpen: "打開瀏覽器，內容就在。",
      heroShare: "要分享，一個連結就夠；",
      heroPrivate: "要私密，就交給 AstraZero。",
      heroClose: "讓文字，跨過裝置。",
      begin: "免費開始",
      explore: "比較方案",
      purposeEyebrow: "三件事，就夠了",
      purposeTitle: "從寫下，到拿到手，中間不該有阻力。",
      quickLabel: "任何裝置",
      quickTitle: "打開，就在那裡",
      quickBody: "不用安裝 App，也不用先設定一整套工作區。只要有瀏覽器，就能把文字拿回來。",
      shareLabel: "唯讀分享",
      shareTitle: "一個連結，就夠了",
      shareBody: "把文字直接交給對方。對方不用註冊、不用同平台，也不用先完成任何設定。",
      secureLabel: "需要時再加深",
      secureTitle: "簡單在表面，安全在底下",
      secureBody: "日常保持輕量；真正重要的內容，再交給 AstraSecret、AstraConfidential 或 AstraZero。",
      limitEyebrow: "為純文字而生",
      limitTitle: "文字很輕，所以速度不必向容量讓步。",
      limitBody: "AstraNote 專注純文字，因為它最直接、最好讀、最好整理，也最容易跨裝置帶走。Free 從 128 KB 開始，付費方案一路提升，最高可獲得 1024 KB 純文字空間；容量是規格，速度、控制、隱私與復原才是重點。",
      accountStorageLabel: "純文字空間",
      accountLimitCaption: "FREE 128 KB · 最高 1024 KB · TEXT-FIRST",
      seoTitle: "AstraNote — 快速、跨裝置的加密純文字筆記",
      seoDescription: "AstraNote 是瀏覽器即用的純文字筆記服務，提供快速跨裝置存取、無需帳號的唯讀分享，以及 AstraSecret、AstraConfidential 與 AstraZero 保護。"
    },
    ja: {
      heroKicker: "ASTRANOTE · TEXT-FIRST",
      heroTitle: "文字を、デバイスに閉じ込めない。",
      heroOpen: "ブラウザを開けば、もうそこに。",
      heroShare: "共有するなら、リンク一つで十分；",
      heroPrivate: "秘密にしたいなら、AstraZeroに任せる。",
      heroClose: "文字を、デバイスの向こうへ。",
      begin: "無料で始める",
      explore: "プランを比較",
      purposeEyebrow: "3つだけ。それで十分。",
      purposeTitle: "書いてから取り出すまで、余計な手間はいらない。",
      quickLabel: "どの端末でも",
      quickTitle: "開けば、そこにある",
      quickBody: "アプリのインストールも、ワークスペース設定も不要。ブラウザがあれば文字はすぐ手元に。",
      shareLabel: "読み取り専用共有",
      shareTitle: "リンク一つで十分",
      shareBody: "文字をそのまま相手へ。AstraNoteアカウントも、同じサービスも、事前設定も必要ありません。",
      secureLabel: "必要なときだけ深く",
      secureTitle: "見た目はシンプル。中身は本気。",
      secureBody: "普段は軽く。大切な内容にはAstraSecret、AstraConfidential、AstraZeroを使えます。",
      limitEyebrow: "テキストのための設計",
      limitTitle: "文字は軽い。だから体験も速いまま。",
      limitBody: "AstraNoteはプレーンテキストに集中します。読みやすく、整理しやすく、端末をまたいで扱いやすいからです。Freeは128 KBから、上位プランでは最大1024 KBまで。容量は仕様であり、速さ・管理・プライバシー・復元こそが中心です。",
      accountStorageLabel: "テキスト容量",
      accountLimitCaption: "FREE 128 KB · 最大 1024 KB · TEXT-FIRST",
      seoTitle: "AstraNote — 高速で端末をまたげる暗号化テキストノート",
      seoDescription: "AstraNoteはブラウザですぐ使えるテキストノートです。高速な端末間アクセス、アカウント不要の読み取り専用共有、AstraSecret・AstraConfidential・AstraZeroに対応します。"
    }
  };

  const PLAN_COPY = {
    en: {
      eyebrow: "CHOOSE YOUR DEPTH",
      title: "Three upgrades. Three different reasons to want them.",
      lead: "Plus organizes the everyday. Pro protects what matters. Ultra gives mistakes a way back. Storage grows with the plan, up to 1024 KB, but the real upgrade is control, privacy, and recovery.",
      plusTag: "ORGANIZE",
      plusTitle: "Keep the everyday in order.",
      plusPrice: "2,500 sats / 30 days",
      plusFeature1: "Pins + Archive",
      plusFeature2: "Batch management",
      plusFeature3: "AstraConfidential",
      plusSpec: "50 NOTES · 256 KB",
      proTag: "PROTECT",
      proBadge: "PRIVACY PICK",
      proTitle: "Keep more. Reveal less.",
      proPrice: "6,000 sats / 30 days",
      proFeature1: "AstraZero",
      proFeature2: "Unlimited notes",
      proFeature3: "Everything in Plus",
      proSpec: "UNLIMITED · 512 KB",
      ultraTag: "RECOVER",
      ultraTitle: "Give important text a second chance.",
      ultraPrice: "12,500 sats / 30 days",
      ultraFeature1: "Recovery + Trash",
      ultraFeature2: "Previous version",
      ultraFeature3: "Everything in Pro",
      ultraSpec: "UNLIMITED · 1024 KB",
      seePlan: "View full plan",
      seeAll: "See full features, pricing, and differences",
      freeTitle: "Free is already plenty.",
      freeBody: "Fast cross-device access, account-free read-only sharing, AstraSecret, 20 notes, and 128 KB of text storage. Upgrade only when you actually need more.",
      freeMeta: "20 NOTES · 128 KB · ASTRASECRET · NO ADS",
      freeCta: "Start free"
    },
    "zh-Hant": {
      eyebrow: "選擇你要的深度",
      title: "三種升級，三個完全不同的理由。",
      lead: "Plus 把日常整理好，Pro 把重要內容保護好，Ultra 讓誤刪也有回頭路。儲存空間隨方案提升，最高 1024 KB，但真正的升級是控制、隱私與復原。",
      plusTag: "整理",
      plusTitle: "把日常，整理得剛剛好。",
      plusPrice: "2,500 sats / 30 天",
      plusFeature1: "Pin + 封存",
      plusFeature2: "批次管理",
      plusFeature3: "AstraConfidential",
      plusSpec: "50 篇筆記 · 256 KB",
      proTag: "保護",
      proBadge: "隱私首選",
      proTitle: "留下更多，暴露更少。",
      proPrice: "6,000 sats / 30 天",
      proFeature1: "AstraZero",
      proFeature2: "無限筆記",
      proFeature3: "包含 Plus 全部功能",
      proSpec: "無限筆記 · 512 KB",
      ultraTag: "復原",
      ultraTitle: "重要的文字，值得多一次機會。",
      ultraPrice: "12,500 sats / 30 天",
      ultraFeature1: "Recovery + Trash",
      ultraFeature2: "前一版本",
      ultraFeature3: "包含 Pro 全部功能",
      ultraSpec: "無限筆記 · 1024 KB",
      seePlan: "查看完整方案",
      seeAll: "查看完整功能、價格與差異",
      freeTitle: "免費，其實已經很夠。",
      freeBody: "快速跨裝置、無帳號唯讀分享、AstraSecret、20 篇筆記與 128 KB 純文字空間。真的需要更多時，再升級就好。",
      freeMeta: "20 篇 · 128 KB · ASTRASECRET · 無廣告",
      freeCta: "免費開始"
    },
    ja: {
      eyebrow: "必要な深さを選ぶ",
      title: "3つのアップグレード。欲しくなる理由も3つ。",
      lead: "Plusは日常を整理し、Proは大切な内容を守り、Ultraはミスから戻る余地をつくります。容量は最大1024 KBまで増えますが、本当の違いは管理・プライバシー・復元です。",
      plusTag: "整理",
      plusTitle: "日常を、ちょうどよく整える。",
      plusPrice: "2,500 sats / 30日",
      plusFeature1: "ピン + アーカイブ",
      plusFeature2: "一括管理",
      plusFeature3: "AstraConfidential",
      plusSpec: "50ノート · 256 KB",
      proTag: "保護",
      proBadge: "PRIVACY PICK",
      proTitle: "もっと残して、もっと隠す。",
      proPrice: "6,000 sats / 30日",
      proFeature1: "AstraZero",
      proFeature2: "ノート無制限",
      proFeature3: "Plusの全機能",
      proSpec: "無制限 · 512 KB",
      ultraTag: "復元",
      ultraTitle: "大切な文字に、もう一度チャンスを。",
      ultraPrice: "12,500 sats / 30日",
      ultraFeature1: "Recovery + Trash",
      ultraFeature2: "前のバージョン",
      ultraFeature3: "Proの全機能",
      ultraSpec: "無制限 · 1024 KB",
      seePlan: "完全なプランを見る",
      seeAll: "機能・価格・違いをすべて見る",
      freeTitle: "無料でも、かなり使える。",
      freeBody: "高速な端末間アクセス、アカウント不要の読み取り専用共有、AstraSecret、20ノート、128 KB。必要になってからアップグレードできます。",
      freeMeta: "20ノート · 128 KB · ASTRASECRET · 広告なし",
      freeCta: "無料で始める"
    }
  };

  const normalizeLocale = (value) => {
    const lang = String(value || "").toLowerCase();
    if (lang.startsWith("zh")) return "zh-Hant";
    if (lang.startsWith("ja")) return "ja";
    return "en";
  };

  const locale = () => normalizeLocale(document.documentElement.lang || navigator.language);
  const getCopy = () => COPY[locale()] || COPY.en;
  const getPlanCopy = () => PLAN_COPY[locale()] || PLAN_COPY.en;

  for (const [key, values] of Object.entries(COPY)) {
    if (typeof I18N !== "undefined" && I18N[key]) Object.assign(I18N[key], values);
  }

  const injectStyles = () => {
    if (document.getElementById("home-premium-style")) return;
    const style = document.createElement("style");
    style.id = "home-premium-style";
    style.textContent = `
      .product-intro{display:none!important}
      .hero-content{max-width:1040px}
      .hero-content h1{max-width:900px;margin-left:auto;margin-right:auto;font-size:clamp(2.9rem,6.6vw,6.7rem);line-height:.96;letter-spacing:-.045em;text-wrap:balance}
      .hero-kicker{letter-spacing:.14em}
      .hero-tagline.home-hero-open{max-width:760px;margin:26px auto 0;font-size:clamp(1.2rem,2vw,1.65rem);font-weight:700;line-height:1.35;text-wrap:balance}
      .hero-description.home-hero-lines{max-width:760px;margin:18px auto 0;display:grid;gap:7px;font-size:clamp(1rem,1.45vw,1.18rem);line-height:1.55}
      .hero-description.home-hero-lines span{display:block;text-wrap:balance}
      .home-hero-close{margin:18px auto 0;font-size:clamp(.85rem,1.1vw,1rem);font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--primary-hover);text-wrap:balance}
      .hero-actions{margin-top:32px}

      #purpose .section-head{max-width:760px;margin:0 auto 34px;text-align:center}
      #purpose .section-head h2,.home-plans-head h2,.limit-panel h2{line-height:1.06;letter-spacing:-.025em;text-wrap:balance}
      .home-feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:0}
      .home-feature-card{position:relative;aspect-ratio:1.08/1;padding:30px!important;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(124,139,255,.2);background:linear-gradient(155deg,rgba(23,30,54,.94),rgba(9,13,25,.94))}
      .home-feature-card::after{content:"";position:absolute;width:180px;height:180px;border-radius:50%;right:-80px;bottom:-90px;background:radial-gradient(circle,rgba(92,114,255,.14),transparent 68%);pointer-events:none}
      .home-feature-top{display:flex;align-items:center;justify-content:space-between;gap:16px}
      .home-feature-icon{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:rgba(95,116,255,.12);border:1px solid rgba(124,139,255,.24);font-size:1.05rem;color:var(--primary-hover)}
      .home-feature-label{font-size:.72rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
      .home-feature-card h3{margin:34px 0 13px;font-size:clamp(1.35rem,2vw,1.72rem);line-height:1.05;letter-spacing:-.025em;text-wrap:balance}
      .home-feature-card p{margin:0;max-width:31ch;color:var(--muted);line-height:1.72;text-wrap:pretty}
      .home-feature-rule{width:42px;height:2px;margin-top:auto;background:var(--primary);border-radius:99px;opacity:.72}

      #plans-preview{position:relative}
      .home-plans-head{max-width:820px;margin:0 auto;text-align:center}
      .home-plans-head .muted{max-width:720px;margin:16px auto 0;font-size:1rem;line-height:1.72;text-wrap:balance}
      .home-plan-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:38px;align-items:stretch}
      #plans-preview .home-plan-card{position:relative;aspect-ratio:1/1;min-height:0;padding:28px;display:flex;flex-direction:column;overflow:hidden;border-width:1px;isolation:isolate}
      #plans-preview .home-plan-card::after{content:"";position:absolute;inset:auto -25% -34% 25%;height:56%;border-radius:50%;background:radial-gradient(circle,rgba(91,113,255,.14),transparent 69%);z-index:-1;pointer-events:none}
      #plans-preview .home-plan-card.plan-card-featured{border-width:2px;box-shadow:0 24px 70px rgba(70,91,220,.18)}
      #plans-preview .home-plan-card.plan-card-featured::after{background:radial-gradient(circle,rgba(105,127,255,.22),transparent 68%)}
      #plans-preview .home-plan-card.plan-card-ultra::after{background:radial-gradient(circle,rgba(168,119,255,.16),transparent 68%)}
      .home-plan-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
      .home-plan-identity{display:flex;align-items:center;gap:13px}
      .home-plan-tier-wrap{display:grid;gap:3px}
      .home-plan-tier{font-weight:900;letter-spacing:.04em;font-size:1.06rem}
      .home-plan-tag{font-size:.69rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
      .home-plan-badge{font-size:.66rem;line-height:1;padding:7px 9px;border-radius:999px;border:1px solid rgba(124,139,255,.36);background:rgba(91,111,255,.12);font-weight:900;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
      .home-plan-card h3{margin:24px 0 10px;font-size:clamp(1.3rem,1.8vw,1.62rem);line-height:1.06;letter-spacing:-.02em;text-wrap:balance}
      .home-plan-price{margin:0 0 18px;color:var(--muted);font-family:var(--font-mono,monospace);font-size:.82rem}
      .home-plan-features{margin:0;display:grid;gap:10px}
      .home-plan-features li{min-height:30px;padding:0;gap:10px;font-size:.92rem;line-height:1.35}
      .home-plan-features li i{width:20px;color:var(--primary-hover);text-align:center}
      .home-plan-footer{margin-top:auto;padding-top:16px}
      .home-plan-spec{padding-top:12px;border-top:1px solid rgba(255,255,255,.08);font-family:var(--font-mono,monospace);font-size:.72rem;letter-spacing:.06em;color:var(--muted);text-transform:uppercase}
      .home-plan-card .btn{width:100%;justify-content:center;margin-top:13px;min-height:42px}

      .home-free-strip{margin-top:24px;padding:20px 22px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:18px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);border-radius:18px}
      .home-free-icon{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.035);color:var(--muted)}
      .home-free-copy{min-width:0}
      .home-free-strip h3{margin:0 0 5px;font-size:1.04rem;line-height:1.2;text-wrap:balance}
      .home-free-strip p{margin:0;line-height:1.55;text-wrap:pretty}
      .home-free-meta{display:block;margin-top:7px;font-family:var(--font-mono,monospace);font-size:.68rem;letter-spacing:.06em;color:var(--muted);text-transform:uppercase}
      .home-plan-actions{display:flex;justify-content:center;margin-top:24px}
      .home-plan-actions .btn{min-width:min(100%,360px);justify-content:center}

      .limit-panel>div:first-child{max-width:680px}
      .limit-panel .muted{line-height:1.75;text-wrap:pretty}
      .limit-visual strong{font-size:clamp(2rem,4vw,3.4rem);letter-spacing:-.04em;text-wrap:balance}

      @media(max-width:980px){
        .home-feature-grid{grid-template-columns:1fr;max-width:560px;margin-left:auto;margin-right:auto}
        .home-feature-card{aspect-ratio:auto;min-height:280px}
        .home-plan-grid{grid-template-columns:1fr;max-width:520px;margin-left:auto;margin-right:auto}
        #plans-preview .home-plan-card{aspect-ratio:1/1}
        .home-free-strip{grid-template-columns:auto 1fr}
        .home-free-strip .btn{grid-column:1/-1;width:100%;justify-content:center}
      }
      @media(max-width:560px){
        .hero-content h1{font-size:clamp(2.55rem,13vw,4.2rem);line-height:1}
        .hero-description.home-hero-lines{gap:10px}
        .home-feature-card{padding:24px!important;min-height:260px}
        #plans-preview .home-plan-card{aspect-ratio:auto;min-height:360px;padding:24px}
        .home-free-strip{grid-template-columns:1fr;padding:18px}
        .home-free-icon{display:none}
      }
    `;
    document.head.appendChild(style);
  };

  const buildFeatureCards = () => {
    const grid = document.querySelector("#purpose .feature-grid");
    if (!grid || grid.dataset.marketingBuilt === "1") return;
    grid.dataset.marketingBuilt = "1";
    grid.classList.add("home-feature-grid");
    grid.innerHTML = `
      <article class="card feature-card home-feature-card reveal">
        <div class="home-feature-top">
          <span class="home-feature-icon"><i class="fa-solid fa-globe"></i></span>
          <span class="home-feature-label" data-home-copy="quickLabel"></span>
        </div>
        <h3 data-home-copy="quickTitle"></h3>
        <p data-home-copy="quickBody"></p>
        <span class="home-feature-rule" aria-hidden="true"></span>
      </article>
      <article class="card feature-card home-feature-card reveal">
        <div class="home-feature-top">
          <span class="home-feature-icon"><i class="fa-solid fa-link"></i></span>
          <span class="home-feature-label" data-home-copy="shareLabel"></span>
        </div>
        <h3 data-home-copy="shareTitle"></h3>
        <p data-home-copy="shareBody"></p>
        <span class="home-feature-rule" aria-hidden="true"></span>
      </article>
      <article class="card feature-card home-feature-card reveal">
        <div class="home-feature-top">
          <span class="home-feature-icon"><i class="fa-solid fa-shield-halved"></i></span>
          <span class="home-feature-label" data-home-copy="secureLabel"></span>
        </div>
        <h3 data-home-copy="secureTitle"></h3>
        <p data-home-copy="secureBody"></p>
        <span class="home-feature-rule" aria-hidden="true"></span>
      </article>`;
  };

  const buildPlanPreview = () => {
    if (document.getElementById("plans-preview")) return;
    const encryption = document.getElementById("encryption");
    if (!encryption) return;

    const section = document.createElement("section");
    section.className = "home-section";
    section.id = "plans-preview";
    section.innerHTML = `
      <div class="shell">
        <header class="section-head home-plans-head reveal">
          <p class="eyebrow"><i class="fa-solid fa-layer-group"></i><span data-home-plan="eyebrow"></span></p>
          <h2 data-home-plan="title"></h2>
          <p class="muted" data-home-plan="lead"></p>
        </header>

        <div class="home-plan-grid">
          <article class="card plan-card home-plan-card reveal" data-plan="plus">
            <div class="home-plan-top">
              <div class="home-plan-identity">
                <span class="plan-icon"><i class="fa-solid fa-star"></i></span>
                <div class="home-plan-tier-wrap">
                  <span class="home-plan-tier">PLUS</span>
                  <span class="home-plan-tag" data-home-plan="plusTag"></span>
                </div>
              </div>
            </div>
            <h3 data-home-plan="plusTitle"></h3>
            <p class="home-plan-price" data-home-plan="plusPrice"></p>
            <ul class="plan-features home-plan-features">
              <li><i class="fa-solid fa-thumbtack"></i><span data-home-plan="plusFeature1"></span></li>
              <li><i class="fa-solid fa-list-check"></i><span data-home-plan="plusFeature2"></span></li>
              <li><i class="fa-solid fa-user-shield"></i><span data-home-plan="plusFeature3"></span></li>
            </ul>
            <div class="home-plan-footer">
              <div class="home-plan-spec" data-home-plan="plusSpec"></div>
              <a class="btn btn-outline" href="/plans"><span data-home-plan="seePlan"></span><i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </article>

          <article class="card plan-card plan-card-featured home-plan-card reveal" data-plan="pro">
            <div class="home-plan-top">
              <div class="home-plan-identity">
                <span class="plan-icon"><i class="fa-solid fa-gem"></i></span>
                <div class="home-plan-tier-wrap">
                  <span class="home-plan-tier">PRO</span>
                  <span class="home-plan-tag" data-home-plan="proTag"></span>
                </div>
              </div>
              <span class="home-plan-badge" data-home-plan="proBadge"></span>
            </div>
            <h3 data-home-plan="proTitle"></h3>
            <p class="home-plan-price" data-home-plan="proPrice"></p>
            <ul class="plan-features home-plan-features">
              <li><i class="fa-solid fa-fingerprint"></i><span data-home-plan="proFeature1"></span></li>
              <li><i class="fa-solid fa-infinity"></i><span data-home-plan="proFeature2"></span></li>
              <li><i class="fa-solid fa-layer-group"></i><span data-home-plan="proFeature3"></span></li>
            </ul>
            <div class="home-plan-footer">
              <div class="home-plan-spec" data-home-plan="proSpec"></div>
              <a class="btn btn-primary" href="/plans"><span data-home-plan="seePlan"></span><i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </article>

          <article class="card plan-card plan-card-ultra home-plan-card reveal" data-plan="ultra">
            <div class="home-plan-top">
              <div class="home-plan-identity">
                <span class="plan-icon"><i class="fa-solid fa-crown"></i></span>
                <div class="home-plan-tier-wrap">
                  <span class="home-plan-tier">ULTRA</span>
                  <span class="home-plan-tag" data-home-plan="ultraTag"></span>
                </div>
              </div>
            </div>
            <h3 data-home-plan="ultraTitle"></h3>
            <p class="home-plan-price" data-home-plan="ultraPrice"></p>
            <ul class="plan-features home-plan-features">
              <li><i class="fa-solid fa-clock-rotate-left"></i><span data-home-plan="ultraFeature1"></span></li>
              <li><i class="fa-solid fa-file-arrow-rotate-left"></i><span data-home-plan="ultraFeature2"></span></li>
              <li><i class="fa-solid fa-layer-group"></i><span data-home-plan="ultraFeature3"></span></li>
            </ul>
            <div class="home-plan-footer">
              <div class="home-plan-spec" data-home-plan="ultraSpec"></div>
              <a class="btn btn-outline" href="/plans"><span data-home-plan="seePlan"></span><i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </article>
        </div>

        <div class="card plan-free-included home-free-strip reveal" data-plan="free">
          <span class="home-free-icon"><i class="fa-solid fa-feather"></i></span>
          <div class="home-free-copy">
            <h3 data-home-plan="freeTitle"></h3>
            <p class="muted" data-home-plan="freeBody"></p>
            <span class="home-free-meta" data-home-plan="freeMeta"></span>
          </div>
          <a class="btn btn-outline" href="/register"><span data-home-plan="freeCta"></span></a>
        </div>

        <div class="home-plan-actions reveal">
          <a class="btn btn-outline btn-lg" href="/plans"><i class="fa-solid fa-table-columns"></i><span data-home-plan="seeAll"></span></a>
        </div>
      </div>`;

    encryption.parentNode.insertBefore(section, encryption);
  };

  const applyHero = (copy) => {
    const title = document.querySelector(".hero-content h1");
    const open = document.querySelector(".hero-tagline");
    const description = document.querySelector(".hero-description");
    const actions = document.querySelector(".hero-actions");

    if (title) title.textContent = copy.heroTitle;
    if (open) {
      open.classList.add("home-hero-open");
      open.textContent = copy.heroOpen;
    }
    if (description) {
      description.classList.add("home-hero-lines");
      description.removeAttribute("data-i18n");
      description.innerHTML = `<span>${copy.heroShare}</span><span>${copy.heroPrivate}</span>`;
    }

    let close = document.querySelector(".home-hero-close");
    if (!close && actions) {
      close = document.createElement("p");
      close.className = "home-hero-close";
      actions.parentNode.insertBefore(close, actions);
    }
    if (close) close.textContent = copy.heroClose;
  };

  const rearrange = () => {
    const purpose = document.getElementById("purpose");
    const stats = document.getElementById("stats");
    const encryption = document.getElementById("encryption");

    purpose?.querySelector(".product-intro")?.remove();
    buildFeatureCards();
    buildPlanPreview();

    const secondHero = document.querySelector(".hero-actions a.btn-outline");
    if (secondHero) secondHero.setAttribute("href", "#plans-preview");
    const scrollCue = document.querySelector(".scroll-cue");
    if (scrollCue) scrollCue.setAttribute("href", "#purpose");

    const plans = document.getElementById("plans-preview");
    const limitSection = document.querySelector(".limit-panel")?.closest("section");
    if (purpose && plans && purpose.nextElementSibling !== plans) purpose.insertAdjacentElement("afterend", plans);
    if (plans && stats) plans.insertAdjacentElement("afterend", stats);
    if (stats && limitSection) stats.insertAdjacentElement("afterend", limitSection);
    if (limitSection && encryption) limitSection.insertAdjacentElement("afterend", encryption);

    const storageValue = document.querySelector(".limit-visual strong");
    if (storageValue) storageValue.textContent = "128 → 1024 KB";
  };

  const applyMarketingCopy = () => {
    const copy = getCopy();

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (key && Object.prototype.hasOwnProperty.call(copy, key)) node.textContent = copy[key];
    });

    document.querySelectorAll("[data-home-copy]").forEach((node) => {
      const key = node.getAttribute("data-home-copy");
      if (key && Object.prototype.hasOwnProperty.call(copy, key)) node.textContent = copy[key];
    });

    const plans = getPlanCopy();
    document.querySelectorAll("[data-home-plan]").forEach((node) => {
      const key = node.getAttribute("data-home-plan");
      if (key && Object.prototype.hasOwnProperty.call(plans, key)) node.textContent = plans[key];
    });

    applyHero(copy);
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
    injectStyles();
    rearrange();
    applyMarketingCopy();
    applySeo();
  };

  applyAll();
  document.addEventListener("DOMContentLoaded", applyAll, { once: true });
  new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === "lang")) applyAll();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
