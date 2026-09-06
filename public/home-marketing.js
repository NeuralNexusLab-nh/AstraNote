"use strict";

(() => {
  const COPY = {
    en: {
      heroKicker: "TEXT, WITHOUT THE FRICTION.",
      tagline: "Write it. Move on. It's there when you need it.",
      heroLead: "One browser is enough. Open fast, share with a link, and lock sensitive notes behind AstraNote's strongest privacy modes.",
      begin: "Start free",
      explore: "Compare plans",
      purposeEyebrow: "BUILT TO DISAPPEAR",
      purposeTitle: "Less interface. More instant access.",
      quickTitle: "Open. It's there.",
      quickBody: "Phone, tablet, school PC, library computer — if it has a browser, your text is within reach.",
      shareTitle: "One link. Done.",
      shareBody: "Share read-only text without asking anyone to register or join the same platform.",
      secureTitle: "Simple outside. Serious underneath.",
      secureBody: "AstraSecret, AstraConfidential, and AstraZero add stronger protection when the words matter more.",
      seoTitle: "AstraNote — Fast, free browser notes with strong encryption",
      seoDescription: "AstraNote is a free browser-first notebook for fast cross-device access, account-free read-only sharing, and powerful optional encryption with AstraSecret, AstraConfidential, and AstraZero."
    },
    "zh-Hant": {
      heroKicker: "讓文字，不再被工具拖慢。",
      tagline: "寫下就走。需要時，它已經在那裡。",
      heroLead: "一個瀏覽器就夠。快速開啟、一個連結分享；真正重要的文字，再交給 AstraNote 最強的隱私保護。",
      begin: "免費開始",
      explore: "比較方案",
      purposeEyebrow: "讓工具退到後面",
      purposeTitle: "少一點介面，多一點立即可用。",
      quickTitle: "打開，就在那裡",
      quickBody: "手機、平板、學校電腦、圖書館電腦，只要有瀏覽器，文字就伸手可及。",
      shareTitle: "一個連結，就結束",
      shareBody: "唯讀分享，不用註冊、不用同平台，也不用先互加任何東西。",
      secureTitle: "外表簡單，底下很認真",
      secureBody: "AstraSecret、AstraConfidential、AstraZero，讓真正重要的文字有更深的保護。",
      seoTitle: "AstraNote — 免費、快速、跨裝置的加密線上筆記",
      seoDescription: "AstraNote 是免費、瀏覽器即用的線上筆記服務，提供快速跨裝置存取、無需帳號的唯讀分享，以及 AstraSecret、AstraConfidential 與 AstraZero 強大加密。"
    },
    ja: {
      heroKicker: "文字を、道具に邪魔させない。",
      tagline: "書いたら進む。必要なとき、もうそこにある。",
      heroLead: "ブラウザ一つで十分。すぐ開けて、リンク一つで共有。大切な文字にはAstraNoteの強力なプライバシー保護を。",
      begin: "無料で始める",
      explore: "プランを比較",
      purposeEyebrow: "道具は、前に出すぎない",
      purposeTitle: "操作は少なく。アクセスはすぐに。",
      quickTitle: "開けば、そこにある",
      quickBody: "スマホ、タブレット、学校や図書館のPC。ブラウザがあれば、文字はすぐ手元に。",
      shareTitle: "リンク一つで完了",
      shareBody: "読み取り専用共有。登録も、同じサービスも、事前のつながりも不要です。",
      secureTitle: "見た目はシンプル。中身は本気。",
      secureBody: "AstraSecret、AstraConfidential、AstraZeroが、大切な文字をさらに深く守ります。",
      seoTitle: "AstraNote — 無料で高速、ブラウザだけで使える暗号化ノート",
      seoDescription: "AstraNoteは無料でブラウザからすぐ使えるオンラインノートです。端末をまたいだ高速アクセス、アカウント不要の読み取り専用共有、AstraSecret・AstraConfidential・AstraZeroによる強力な暗号化に対応します。"
    }
  };

  const PLAN_COPY = {
    en: {
      eyebrow: "GO FURTHER",
      title: "Free is already good. Paid is where AstraNote gets powerful.",
      lead: "Every plan keeps the same fast, browser-first experience. Upgrade for more control, deeper privacy, and a way back when mistakes happen.",
      plusTag: "ORGANIZE",
      plusTitle: "Make it yours.",
      plusBody: "Pins, archive, batch management, more notes, and AstraConfidential — for when AstraNote becomes part of your day.",
      proTag: "PROTECT",
      proTitle: "Keep more. Reveal less.",
      proBody: "Unlimited notes, more room, and AstraZero — AstraNote's strongest privacy tier for sensitive text.",
      ultraTag: "RECOVER",
      ultraTitle: "Undo the irreversible.",
      ultraBody: "Recovery, Trash, a previous version, AstraZero, and the most room. Because important text deserves a second chance.",
      seeAll: "See full plan comparison",
      freeTitle: "Start with more than enough.",
      freeBody: "Free still includes fast cross-device access, read-only sharing, AstraSecret, 20 notes, 128 KB, no ads, and no analytics.",
      freeCta: "Start free"
    },
    "zh-Hant": {
      eyebrow: "再往前一步",
      title: "免費已經很好用。付費，才開始把 AstraNote 的上限拉開。",
      lead: "每個方案都保留同樣的快速與簡單。升級買到的是整理、隱私，以及出錯之後還能回頭的餘地。",
      plusTag: "整理",
      plusTitle: "讓它真正變成你的空間。",
      plusBody: "Pin、封存、批次管理、更多筆記，加上 AstraConfidential。當 AstraNote 開始融入日常，Plus 讓一切保持有序。",
      proTag: "保護",
      proTitle: "留下更多，暴露更少。",
      proBody: "無限筆記、更高容量，加上 AstraZero。當文字真的敏感，Pro 才是 AstraNote 開始發揮實力的地方。",
      ultraTag: "復原",
      ultraTitle: "把『不可逆』變得沒那麼可怕。",
      ultraBody: "Recovery、Trash、前一版本、AstraZero 與最高容量。重要的文字，值得多一次機會。",
      seeAll: "查看完整方案比較",
      freeTitle: "免費，其實已經很夠。",
      freeBody: "跨裝置快速存取、唯讀分享、AstraSecret、20 篇筆記、128 KB、無廣告、無分析追蹤，全部都在 Free。",
      freeCta: "免費開始"
    },
    ja: {
      eyebrow: "もう一歩先へ",
      title: "無料でも十分。アップグレードすると、AstraNoteはもっと強くなる。",
      lead: "どのプランでも速さとシンプルさは同じ。上位プランでは整理、プライバシー、そして失敗から戻る余裕が増えます。",
      plusTag: "整理",
      plusTitle: "自分の空間にする。",
      plusBody: "ピン、アーカイブ、一括管理、より多くのノート、AstraConfidential。日常で使うほどPlusが効いてきます。",
      proTag: "保護",
      proTitle: "もっと残して、もっと隠す。",
      proBody: "無制限ノート、より多い容量、そしてAstraZero。機密性の高い文字のための強力なプライバシー。",
      ultraTag: "復元",
      ultraTitle: "取り返せない、を減らす。",
      ultraBody: "Recovery、Trash、前バージョン、AstraZero、最大容量。大切な文字にもう一度チャンスを。",
      seeAll: "完全なプラン比較を見る",
      freeTitle: "無料でも、かなり使える。",
      freeBody: "高速な端末間アクセス、読み取り専用共有、AstraSecret、20ノート、128 KB、広告なし、解析なし。Freeに含まれます。",
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
      .home-plan-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:28px}
      .home-plan-card{position:relative;overflow:hidden;padding:26px;border:1px solid rgba(132,153,255,.22);background:linear-gradient(180deg,rgba(20,27,48,.94),rgba(10,14,26,.94));min-height:360px;display:flex;flex-direction:column}
      .home-plan-card::before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,transparent,currentColor,transparent);opacity:.8}
      .home-plan-card.pro{transform:translateY(-8px);box-shadow:0 24px 80px rgba(86,111,255,.18);border-color:rgba(120,143,255,.5)}
      .home-plan-card.ultra{box-shadow:0 24px 80px rgba(180,122,255,.12)}
      .home-plan-tag{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;font-weight:800;opacity:.72}
      .home-plan-name{font-size:1rem;font-weight:800;margin-top:18px;opacity:.75}
      .home-plan-card h3{font-size:1.45rem;margin:8px 0 12px}
      .home-plan-card p{line-height:1.65}
      .home-plan-spec{margin-top:auto;padding-top:22px;font-family:var(--font-mono,monospace);font-size:.83rem;opacity:.72}
      .home-plan-card .btn{margin-top:16px}
      .home-free-strip{margin-top:18px;padding:18px 20px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:20px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);border-radius:16px}
      .home-free-strip h3{margin:0 0 5px;font-size:1rem}.home-free-strip p{margin:0}
      .home-plans-head{max-width:760px}
      .home-plans-head .muted{font-size:1rem;line-height:1.65}
      .home-plan-actions{display:flex;justify-content:center;margin-top:24px}
      #purpose .section-head{max-width:680px;margin-bottom:26px}
      #purpose .feature-grid{margin-top:0}
      #purpose .feature-card{min-height:210px;padding:28px}
      #purpose .feature-heading{font-size:1.15rem}
      .hero-description{max-width:720px}
      @media(max-width:900px){.home-plan-grid{grid-template-columns:1fr}.home-plan-card.pro{transform:none}.home-free-strip{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
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
          <article class="card home-plan-card plus reveal">
            <span class="home-plan-tag" data-home-plan="plusTag"></span><div class="home-plan-name">PLUS</div>
            <h3 data-home-plan="plusTitle"></h3><p data-home-plan="plusBody"></p>
            <div class="home-plan-spec">256 KB · 50 NOTES · CONFIDENTIAL</div>
            <a class="btn btn-outline" href="/plans"><i class="fa-solid fa-arrow-right"></i><span data-home-plan="seeAll"></span></a>
          </article>
          <article class="card home-plan-card pro reveal">
            <span class="home-plan-tag" data-home-plan="proTag"></span><div class="home-plan-name">PRO</div>
            <h3 data-home-plan="proTitle"></h3><p data-home-plan="proBody"></p>
            <div class="home-plan-spec">512 KB · UNLIMITED NOTES · ASTRAZERO</div>
            <a class="btn btn-primary" href="/plans"><i class="fa-solid fa-gem"></i><span data-home-plan="seeAll"></span></a>
          </article>
          <article class="card home-plan-card ultra reveal">
            <span class="home-plan-tag" data-home-plan="ultraTag"></span><div class="home-plan-name">ULTRA</div>
            <h3 data-home-plan="ultraTitle"></h3><p data-home-plan="ultraBody"></p>
            <div class="home-plan-spec">1024 KB · RECOVERY · TRASH · ASTRAZERO</div>
            <a class="btn btn-outline" href="/plans"><i class="fa-solid fa-crown"></i><span data-home-plan="seeAll"></span></a>
          </article>
        </div>
        <div class="card home-free-strip reveal">
          <div><h3 data-home-plan="freeTitle"></h3><p class="muted" data-home-plan="freeBody"></p></div>
          <a class="btn btn-outline" href="/register"><span data-home-plan="freeCta"></span></a>
        </div>
        <div class="home-plan-actions reveal"><a class="btn btn-outline btn-lg" href="/plans"><i class="fa-solid fa-table-columns"></i><span data-home-plan="seeAll"></span></a></div>
      </div>`;
    encryption.parentNode.insertBefore(section, encryption);
  };

  const rearrange = () => {
    const purpose = document.getElementById("purpose");
    const stats = document.getElementById("stats");
    const encryption = document.getElementById("encryption");
    if (purpose && stats && purpose.parentNode === stats.parentNode) stats.parentNode.insertBefore(purpose, stats);
    purpose?.querySelector(".product-intro")?.remove();
    const secondHero = document.querySelector('.hero-actions a.btn-outline');
    if (secondHero) secondHero.setAttribute("href", "#plans-preview");
    const scrollCue = document.querySelector(".scroll-cue");
    if (scrollCue) scrollCue.setAttribute("href", "#purpose");
    buildPlanPreview();

    const plans = document.getElementById("plans-preview");
    const limitSection = document.querySelector(".limit-panel")?.closest("section");
    if (purpose && plans && purpose.nextElementSibling !== plans) purpose.insertAdjacentElement("afterend", plans);
    if (plans && stats) plans.insertAdjacentElement("afterend", stats);
    if (stats && limitSection) stats.insertAdjacentElement("afterend", limitSection);
    if (limitSection && encryption) limitSection.insertAdjacentElement("afterend", encryption);
  };

  const applyMarketingCopy = () => {
    const copy = getCopy();
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (key && Object.prototype.hasOwnProperty.call(copy, key)) node.textContent = copy[key];
    });
    const plans = getPlanCopy();
    document.querySelectorAll("[data-home-plan]").forEach((node) => {
      const key = node.getAttribute("data-home-plan");
      if (key && Object.prototype.hasOwnProperty.call(plans, key)) node.textContent = plans[key];
    });
  };

  const applySeo = () => {
    const copy = getCopy();
    document.title = copy.seoTitle;
    const setMeta = (selector, value) => { const node = document.querySelector(selector); if (node) node.setAttribute("content", value); };
    setMeta('meta[name="description"]', copy.seoDescription);
    setMeta('meta[property="og:title"]', copy.seoTitle);
    setMeta('meta[property="og:description"]', copy.seoDescription);
    setMeta('meta[name="twitter:title"]', copy.seoTitle);
    setMeta('meta[name="twitter:description"]', copy.seoDescription);
  };

  const applyAll = () => { injectStyles(); rearrange(); applyMarketingCopy(); applySeo(); };
  applyAll();
  document.addEventListener("DOMContentLoaded", applyAll, { once: true });
  new MutationObserver((records) => { if (records.some((r) => r.attributeName === "lang")) applyAll(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
