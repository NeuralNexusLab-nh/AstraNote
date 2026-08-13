"use strict";

const I18N = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    notes: "My notes",
    settings: "Settings",
    login: "Log in",
    register: "Create account",
    logout: "Log out",
    tagline: "Your thoughts, among the stars.",
    heroLead:
      "Capture ideas, protect what matters, and keep every thought within reach.",
    begin: "Begin writing",
    explore: "Explore AstraNote",
    scroll: "Scroll to explore",
    today: "Signed in today",
    registered: "Registered accounts",
    utc: "Unique accounts · UTC today",
    purposeEyebrow: "A QUIET PLACE FOR IDEAS",
    purposeTitle: "Everything a thought needs. Nothing it does not.",
    quickTitle: "Write without friction",
    quickBody:
      "A focused, lined writing space for plain text—fast, familiar, and free of visual noise.",
    secureTitle: "Encryption by choice",
    secureBody:
      "Keep a note plain or protect it with authenticated AES-128-GCM or AES-256-GCM encryption.",
    shareTitle: "Share on your terms",
    shareBody:
      "Create a private-looking, unguessable read-only link, then revoke it whenever you choose.",
    limitEyebrow: "CLEAR BY DESIGN",
    limitTitle: "Small footprint. Deliberate limits.",
    limitBody:
      "Each account includes 256 KiB across all account files and up to 100 notes. Encrypted notes commonly use about 1.4× the storage; very short notes may use more than 2×.",
    copyright: "© 2026 NeuralNexusLab. All service rights reserved.",
    terms: "Terms",
    privacy: "Privacy",
    source: "Source code",
    welcome: "Welcome back",
    welcomeBody: "Your constellation of notes, at a glance.",
    notebooks: "Notes",
    storage: "Storage used",
    accountAge: "Account age",
    days: "days",
    recent: "Recent notes",
    viewAll: "View all notes",
    createNote: "New note",
    noNotes: "No notes yet. Start your first thought.",
    characters: "characters",
    updated: "Updated",
    encrypted: "Encrypted",
    unencrypted: "Not encrypted",
    allNotes: "My notes",
    allNotesBody: "Every thought you have saved, in one quiet place.",
    delete: "Delete",
    open: "Open",
    newNote: "Create a new note",
    newNoteBody:
      "Choose its name and protection before you begin. Encryption cannot be changed later.",
    noteName: "Note name",
    encryption: "Encryption",
    encryptionHelp:
      "Encryption adds authenticated metadata and Base64 encoding. It commonly uses about 1.4× the space; very short notes can exceed 2×.",
    create: "Create note",
    note: "Note",
    edit: "Edit",
    share: "Share",
    save: "Save",
    discard: "Discard",
    shared: "Sharing on",
    sharingOff: "Sharing off",
    copied: "Link copied",
    copy: "Copy",
    shareTitleModal: "Share this note?",
    shareEnableBody:
      "Anyone with the link can read this note and see your public display name and masked email. The link is unguessable and can be revoked.",
    shareDisableBody: "The existing link will stop working immediately.",
    enableShare: "Enable sharing",
    disableShare: "Disable sharing",
    deleteNoteTitle: "Permanently delete note?",
    deleteNoteBody:
      "This note has no backup and cannot be restored. Complete Gravity to confirm permanent deletion.",
    settingsTitle: "Settings",
    settingsBody: "Make AstraNote feel like your own.",
    appearance: "Appearance",
    language: "Language",
    publicIdentity: "Public identity",
    displayName: "Public display name",
    saveSettings: "Save settings",
    dark: "Dark",
    light: "Light",
    dangerZone: "Account deletion",
    dangerBody:
      "Disable your account and request deletion. You can cancel by signing in within 7 days. After that, access is permanently lost; data is erased within 2 months.",
    requestDeletion: "Disable account and request deletion",
    logoutTitle: "Log out?",
    logoutBody: "Complete Gravity to safely end this session.",
    deleteAccountTitle: "Disable this account?",
    deleteAccountBody:
      "Enter your exact username and complete Gravity. All sessions and shared links will be revoked immediately.",
    confirmUsername: "Confirm username",
    proceed: "Continue",
    cancel: "Cancel",
    close: "Close",
    captchaNeeded: "Complete Gravity first.",
    loading: "Loading…",
    error: "Something went wrong. Please try again.",
    saved: "Saved.",
    sharedNote: "Shared note",
    by: "By",
    readOnly: "Read-only shared page",
    notFound: "This page drifted beyond the known universe.",
    backHome: "Return home",
    cookieTitle: "Necessary cookies",
    cookieBody:
      "AstraNote uses only essential cookies for sign-in, security, language, and appearance. We do not use advertising or analytics trackers.",
    accept: "Accept and continue",
    signInTitle: "Return to your notes",
    signInBody: "Enter your account details and complete Gravity.",
    username: "Username",
    password: "Password",
    noRecovery:
      "AstraNote does not offer password recovery. Keep your password safe.",
    registerTitle: "Create your AstraNote",
    registerBody: "A quiet corner of the universe, ready for your thoughts.",
    email: "Email",
    confirmPassword: "Confirm password",
    agreeTerms: "I have read and accept the Terms of Use and Privacy Policy.",
    agreeCapacity:
      "I am legally able to agree, or my legal guardian has read and approved these terms. For users under 7, a guardian must create and manage the account.",
    cancellationMode: "Cancel account deletion",
    cancellationBody:
      "Enter the same account password and complete a new Gravity challenge to restore access during the 7-day reversal period.",
    deletePending:
      "This account is awaiting deletion. Reloading the login page will let you cancel the request with a new CAPTCHA.",
    legalUpdated: "Effective and last updated: 13 August 2026",
    englishOnlyCaptcha:
      "The third-party Gravity interface may appear in English.",
    editorUnsaved: "You have unsaved changes. Close this page anyway?",
  },
  "zh-Hant": {
    home: "首頁",
    dashboard: "儀表板",
    notes: "我的筆記",
    settings: "設定",
    login: "登入",
    register: "建立帳號",
    logout: "登出",
    tagline: "讓每個想法，在星海中找到位置。",
    heroLead: "隨手記錄、安心保存，讓重要的思緒永遠觸手可及。",
    begin: "開始書寫",
    explore: "探索 AstraNote",
    scroll: "向下探索",
    today: "今日登入",
    registered: "已註冊帳號",
    utc: "不同帳號 · UTC 今日",
    purposeEyebrow: "給想法一處寧靜空間",
    purposeTitle: "思緒所需的一切，沒有多餘干擾。",
    quickTitle: "流暢記錄",
    quickBody: "專注、帶橫線的純文字書寫空間；快速、熟悉，不受視覺雜訊干擾。",
    secureTitle: "自由選擇加密",
    secureBody:
      "保持純文字，或使用具認證保護的 AES-128-GCM、AES-256-GCM 加密。",
    shareTitle: "由你掌控分享",
    shareBody: "建立難以猜測的唯讀連結，並隨時撤銷公開存取。",
    limitEyebrow: "清楚而有節制",
    limitTitle: "輕量空間，明確限制。",
    limitBody:
      "每個帳號的所有檔案合計 256 KiB，最多 100 篇筆記。加密筆記通常約需 1.4 倍空間；很短的筆記可能超過 2 倍。",
    copyright: "© 2026 NeuralNexusLab。保留所有服務相關權利。",
    terms: "使用者協議",
    privacy: "隱私政策",
    source: "原始碼",
    welcome: "歡迎回來",
    welcomeBody: "快速掌握你的筆記星圖。",
    notebooks: "筆記數量",
    storage: "已用空間",
    accountAge: "帳號建立",
    days: "天",
    recent: "最近筆記",
    viewAll: "查看全部筆記",
    createNote: "新增筆記",
    noNotes: "目前沒有筆記，開始記下第一個想法吧。",
    characters: "字",
    updated: "更新於",
    encrypted: "已加密",
    unencrypted: "未加密",
    allNotes: "我的筆記",
    allNotesBody: "你保存的每個想法，都在同一處寧靜空間。",
    delete: "刪除",
    open: "開啟",
    newNote: "建立新筆記",
    newNoteBody: "開始前選擇名稱與保護方式；建立後不能更換加密方式。",
    noteName: "筆記名稱",
    encryption: "加密方式",
    encryptionHelp:
      "加密會加入認證資料與 Base64 編碼，通常約需 1.4 倍空間；非常短的筆記可能超過 2 倍。",
    create: "新增筆記",
    note: "筆記",
    edit: "編輯",
    share: "分享",
    save: "儲存",
    discard: "捨棄",
    shared: "分享已開啟",
    sharingOff: "分享未開啟",
    copied: "連結已複製",
    copy: "複製",
    shareTitleModal: "要分享這篇筆記嗎？",
    shareEnableBody:
      "持有連結者可閱讀筆記，並看到你的公開名稱與遮罩 Email。連結難以猜測且可隨時撤銷。",
    shareDisableBody: "現有連結將立即失效。",
    enableShare: "開啟分享",
    disableShare: "關閉分享",
    deleteNoteTitle: "永久刪除筆記？",
    deleteNoteBody:
      "這篇筆記沒有備份，刪除後無法復原。請完成 Gravity 確認永久刪除。",
    settingsTitle: "設定",
    settingsBody: "讓 AstraNote 更貼近你的使用習慣。",
    appearance: "外觀",
    language: "語言",
    publicIdentity: "公開身分",
    displayName: "公開顯示名稱",
    saveSettings: "儲存設定",
    dark: "深色",
    light: "淺色",
    dangerZone: "帳號刪除",
    dangerBody:
      "停用帳號並提出刪除申請。七天內重新登入可取消；之後將永久失去存取權，資料最長於兩個月內清除。",
    requestDeletion: "停用帳號並申請刪除",
    logoutTitle: "要登出嗎？",
    logoutBody: "完成 Gravity 後安全結束這個登入階段。",
    deleteAccountTitle: "要停用這個帳號嗎？",
    deleteAccountBody:
      "輸入完整 Username 並完成 Gravity。所有登入階段與分享連結將立即失效。",
    confirmUsername: "確認 Username",
    proceed: "繼續",
    cancel: "取消",
    close: "關閉",
    captchaNeeded: "請先完成 Gravity。",
    loading: "載入中…",
    error: "發生錯誤，請再試一次。",
    saved: "已儲存。",
    sharedNote: "分享筆記",
    by: "建立者",
    readOnly: "唯讀分享頁面",
    notFound: "這個頁面已飄離已知宇宙。",
    backHome: "返回首頁",
    cookieTitle: "必要 Cookie",
    cookieBody:
      "AstraNote 只使用登入、安全、語言與外觀所需的必要 Cookie，不使用廣告或分析追蹤。",
    accept: "接受並繼續",
    signInTitle: "回到你的筆記",
    signInBody: "輸入帳號資料並完成 Gravity。",
    username: "Username",
    password: "密碼",
    noRecovery: "AstraNote 不提供密碼復原，請妥善保存密碼。",
    registerTitle: "建立 AstraNote",
    registerBody: "宇宙中的一處寧靜角落，等待你的想法。",
    email: "Email",
    confirmPassword: "確認密碼",
    agreeTerms: "我已閱讀並同意使用者協議與隱私政策。",
    agreeCapacity:
      "我具有同意能力，或法定代理人已閱讀並同意條款；未滿 7 歲者須由法定代理人建立及管理帳號。",
    cancellationMode: "取消帳號刪除",
    cancellationBody:
      "在七天反悔期內輸入原帳號密碼並完成新的 Gravity，即可恢復存取。",
    deletePending:
      "此帳號正在等待刪除。系統將重新載入登入頁，讓你以新的 CAPTCHA 取消申請。",
    legalUpdated: "生效及最後更新：2026 年 8 月 13 日",
    englishOnlyCaptcha: "第三方 Gravity 介面可能顯示英文。",
    editorUnsaved: "尚有未儲存的變更，仍要關閉這個頁面嗎？",
  },
};

const state = {
  session: null,
  account: null,
  captcha: null,
  actionCaptcha: null,
  language: "en",
  theme: "dark",
};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const page = document.body.dataset.page || "";
const t = (key) => I18N[state.language]?.[key] || I18N.en[key] || key;
const formatBytes = (bytes) => `${(Number(bytes || 0) / 1024).toFixed(2)} KiB`;
const formatUtc = (value) =>
  new Intl.DateTimeFormat(state.language === "zh-Hant" ? "zh-TW" : "en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value)) + " UTC";

window.onCaptchaComplete = (result) => {
  state.captcha = result?.success
    ? {
        verificationId: result.verificationId,
        responseToken: result.responseToken,
      }
    : null;
};
window.onActionCaptchaComplete = (result) => {
  state.actionCaptcha = result?.success
    ? {
        verificationId: result.verificationId,
        responseToken: result.responseToken,
      }
    : null;
};

async function api(url, options = {}) {
  const headers = {
    ...(options.body ? { "content-type": "application/json" } : {}),
    ...(options.headers || {}),
  };
  if (state.session?.csrf && !["GET", "HEAD"].includes(options.method || "GET"))
    headers["x-csrf-token"] = state.session.csrf;
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "same-origin",
    body:
      options.body && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw Object.assign(new Error(data.message || t("error")), {
      status: response.status,
      code: data.error,
      data,
    });
  return data;
}

function applyLocale() {
  document.documentElement.lang = state.language;
  document.documentElement.dataset.theme = state.theme;
  $$("[data-i18n]").forEach((el) => {
    const value = t(el.dataset.i18n);
    if (value) el.textContent = value;
  });
  $$("[data-i18n-placeholder]").forEach(
    (el) => (el.placeholder = t(el.dataset.i18nPlaceholder)),
  );
  const selector = $("#language-select");
  if (selector) selector.value = state.language;
}

function buildNav() {
  const authenticated = Boolean(state.session?.authenticated);
  const protectedLinks = authenticated
    ? `
    <a class="nav-link" href="/dashboard"><i class="fa-solid fa-chart-line"></i> <span data-i18n="dashboard"></span></a>
    <a class="nav-link" href="/notes"><i class="fa-solid fa-book"></i> <span data-i18n="notes"></span></a>
    <a class="nav-link" href="/settings"><i class="fa-solid fa-gear"></i> <span data-i18n="settings"></span></a>`
    : "";
  const nav = document.createElement("nav");
  nav.className = `site-nav ${page === "home" ? "" : "solid"}`;
  nav.setAttribute("aria-label", "Primary navigation");
  nav.innerHTML = `<a class="brand" href="/"><img src="/asset/logo.svg" alt=""><span>AstraNote</span></a>
    <button class="mobile-toggle" type="button" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
    <div class="nav-links"><a class="nav-link" href="/"><i class="fa-solid fa-house"></i> <span data-i18n="home"></span></a>${protectedLinks}</div>
    <div class="nav-actions"><i class="fa-solid fa-language" aria-hidden="true"></i><select class="lang-select" id="language-select" aria-label="Language"><option value="en">EN</option><option value="zh-Hant">繁中</option></select>
    ${authenticated ? '<button class="btn" id="nav-logout"><i class="fa-solid fa-arrow-right-from-bracket"></i><span data-i18n="logout"></span></button>' : '<a class="nav-link" href="/login"><i class="fa-solid fa-arrow-right-to-bracket"></i> <span data-i18n="login"></span></a><a class="btn btn-primary" href="/register"><i class="fa-solid fa-user-plus"></i><span data-i18n="register"></span></a>'}</div>`;
  document.body.prepend(nav);
  $(".mobile-toggle", nav).addEventListener("click", () =>
    nav.classList.toggle("open"),
  );
  $("#language-select", nav).addEventListener("change", async (event) => {
    state.language = event.target.value;
    localStorage.setItem("astranote_language", state.language);
    applyLocale();
    if (authenticated)
      await api("/api/settings", {
        method: "PATCH",
        body: { language: state.language },
      }).catch(() => {});
    if (["dashboard", "notes", "note", "shared"].includes(page))
      location.reload();
  });
  $$(".nav-link", nav).forEach((link) => {
    if (link.getAttribute("href") === location.pathname)
      link.classList.add("active");
  });
  window.addEventListener(
    "scroll",
    () => nav.classList.toggle("scrolled", scrollY > 28),
    { passive: true },
  );
  $("#nav-logout", nav)?.addEventListener("click", () =>
    actionModal({
      title: t("logoutTitle"),
      body: t("logoutBody"),
      confirm: t("logout"),
      danger: false,
      run: () =>
        api("/api/logout", {
          method: "POST",
          body: { captcha: state.actionCaptcha },
        }),
    }),
  );
}

function buildFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `<div class="shell footer-inner"><span data-i18n="copyright"></span><div class="footer-links"><a href="/terms"><i class="fa-solid fa-scale-balanced"></i> <span data-i18n="terms"></span></a><a href="/privacy"><i class="fa-solid fa-shield-halved"></i> <span data-i18n="privacy"></span></a><a href="https://github.com/NeuralNexusLab-nh/AstraNote" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> <span data-i18n="source"></span></a><a href="https://nxlab.zone.id/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> NeuralNexusLab</a></div></div>`;
  document.body.append(footer);
}

function toast(message) {
  let stack = $(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.append(stack);
  }
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  stack.append(item);
  setTimeout(() => item.remove(), 3500);
}

function modal({
  title,
  body,
  content,
  confirm = t("proceed"),
  cancel = t("cancel"),
  danger = false,
  onConfirm,
}) {
  document.body.classList.add("modal-open");
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  const dialog = document.createElement("section");
  dialog.className = "modal";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  const heading = document.createElement("h2");
  heading.textContent = title;
  dialog.append(heading);
  if (body) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = body;
    dialog.append(p);
  }
  if (content) dialog.append(content);
  const actions = document.createElement("div");
  actions.className = "modal-actions";
  const cancelButton = document.createElement("button");
  cancelButton.className = "btn";
  cancelButton.innerHTML = `<i class="fa-solid fa-xmark"></i><span></span>`;
  cancelButton.querySelector("span").textContent = cancel;
  const confirmButton = document.createElement("button");
  confirmButton.className = `btn ${danger ? "btn-danger-filled" : "btn-primary"}`;
  confirmButton.innerHTML = `<i class="fa-solid ${danger ? "fa-trash-can" : "fa-check"}"></i><span></span>`;
  confirmButton.querySelector("span").textContent = confirm;
  actions.append(cancelButton, confirmButton);
  dialog.append(actions);
  backdrop.append(dialog);
  document.body.append(backdrop);
  const close = () => {
    const captcha = $("#global-captcha", backdrop);
    if (captcha) {
      captcha.classList.add("captcha-parking");
      document.body.append(captcha);
    }
    backdrop.remove();
    document.body.classList.remove("modal-open");
  };
  cancelButton.onclick = close;
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  confirmButton.onclick = async () => {
    confirmButton.disabled = true;
    try {
      await onConfirm?.(close, confirmButton);
    } catch (error) {
      toast(error.message);
      confirmButton.disabled = false;
    }
  };
  return { close, dialog, confirmButton };
}

function actionModal({ title, body, confirm, danger = true, extra, run }) {
  state.actionCaptcha = null;
  const content = document.createElement("div");
  if (extra) content.append(extra);
  const captcha = $("#global-captcha");
  if (captcha) {
    captcha.classList.remove("captcha-parking");
    content.append(captcha);
  }
  return modal({
    title,
    body,
    content,
    confirm,
    danger,
    onConfirm: async (close) => {
      if (!state.actionCaptcha) throw new Error(t("captchaNeeded"));
      const result = await run();
      close();
      if (result.redirect) location.href = result.redirect;
      else location.reload();
    },
  });
}

function cookieBanner() {
  if (localStorage.getItem("astranote_cookie_notice")) return;
  const banner = document.createElement("aside");
  banner.className = "cookie-banner";
  banner.innerHTML = `<h3><i class="fa-solid fa-cookie-bite"></i> <span data-i18n="cookieTitle"></span></h3><p class="muted" data-i18n="cookieBody"></p><button class="btn btn-primary"><i class="fa-solid fa-check"></i><span data-i18n="accept"></span></button>`;
  document.body.append(banner);
  applyLocale();
  $("button", banner).onclick = () => {
    localStorage.setItem("astranote_cookie_notice", "accepted");
    banner.remove();
  };
}

function noteRow(note, deletable = false) {
  const row = document.createElement("article");
  row.className = "note-row";
  const main = document.createElement("a");
  main.className = "note-main";
  main.href = `/notes/${note.id}`;
  const name = document.createElement("strong");
  name.textContent = note.name;
  const tag = document.createElement("small");
  tag.textContent =
    note.encryption === "none"
      ? t("unencrypted")
      : note.encryption.toUpperCase();
  main.append(name, tag);
  const chars = document.createElement("span");
  chars.className = "note-meta";
  chars.textContent = `${note.characters.toLocaleString()} ${t("characters")}`;
  const size = document.createElement("span");
  size.className = "note-meta";
  size.textContent = formatBytes(note.bytes);
  row.append(main, chars, size);
  if (deletable) {
    const del = document.createElement("button");
    del.className = "btn btn-danger icon-btn";
    del.type = "button";
    del.setAttribute("aria-label", t("delete"));
    del.innerHTML = '<i class="fa-solid fa-trash"></i>';
    del.onclick = () => deleteNote(note);
    row.append(del);
  } else {
    const open = document.createElement("a");
    open.className = "btn";
    open.href = `/notes/${note.id}`;
    open.innerHTML = `<i class="fa-solid fa-arrow-right"></i><span>${t("open")}</span>`;
    row.append(open);
  }
  const updated = document.createElement("small");
  updated.className = "note-meta note-updated";
  updated.textContent = `${t("updated")} ${formatUtc(note.updatedAt)}`;
  row.append(updated);
  return row;
}

function deleteNote(note) {
  actionModal({
    title: t("deleteNoteTitle"),
    body: t("deleteNoteBody"),
    confirm: t("delete"),
    run: () =>
      api(`/api/notes/${note.id}`, {
        method: "DELETE",
        body: { captcha: state.actionCaptcha },
      }),
  });
}

async function initHome() {
  const canvas = $("#space-canvas");
  if (canvas) startStars(canvas);
  const stats = await api("/api/stats").catch(() => ({
    onlineToday: "—",
    totalUsers: "—",
  }));
  $("#online-stat").textContent =
    stats.onlineToday.toLocaleString?.() || stats.onlineToday;
  $("#users-stat").textContent =
    stats.totalUsers.toLocaleString?.() || stats.totalUsers;
  window.addEventListener(
    "scroll",
    () => document.documentElement.style.setProperty("--scroll", scrollY),
    { passive: true },
  );
  window.addEventListener(
    "pointermove",
    (event) => {
      document.documentElement.style.setProperty(
        "--mx",
        `${(event.clientX / innerWidth - 0.5) * 45}px`,
      );
      document.documentElement.style.setProperty(
        "--my",
        `${(event.clientY / innerHeight - 0.5) * 35}px`,
      );
    },
    { passive: true },
  );
}

function startStars(canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  let width = 0,
    height = 0;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = Array.from(
      { length: Math.min(320, Math.floor((width * height) / 4500)) },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.35 + 0.2,
        a: Math.random() * 0.7 + 0.2,
        s: Math.random() * 0.025 + 0.006,
      }),
    );
  };
  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      const alpha = star.a * (0.65 + 0.35 * Math.sin(time * star.s));
      ctx.fillStyle = `rgba(237,237,243,${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  requestAnimationFrame(draw);
}

async function initAuthForm(kind) {
  const form = $("#auth-form");
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const cancellation = kind === "login" && params.get("cancel") === "1";
  if (cancellation) {
    $("[data-auth-title]").textContent = t("cancellationMode");
    $("[data-auth-body]").textContent = t("cancellationBody");
    form.username.value = params.get("username") || "";
    form.querySelector("[type=submit]").textContent = t("cancellationMode");
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("[type=submit]");
    const message = $(".form-message", form);
    message.textContent = "";
    if (!state.captcha) {
      message.textContent = t("captchaNeeded");
      return;
    }
    button.disabled = true;
    const data = Object.fromEntries(new FormData(form));
    data.captcha = state.captcha;
    if (kind === "register") {
      data.acceptTerms = form.acceptTerms.checked;
      data.legalCapacity = form.legalCapacity.checked;
    }
    try {
      const endpoint = cancellation ? "/api/deletion/cancel" : `/api/${kind}`;
      const result = await api(endpoint, { method: "POST", body: data });
      location.href = result.redirect;
    } catch (error) {
      if (error.code === "deletion_pending") {
        location.href = `/login?cancel=1&username=${encodeURIComponent(form.username.value)}`;
        return;
      }
      message.textContent = error.message;
      button.disabled = false;
    }
  });
}

async function requireAccount() {
  if (!state.session?.authenticated) {
    location.replace(`/login?next=${encodeURIComponent(location.pathname)}`);
    return null;
  }
  state.account = await api("/api/account");
  return state.account;
}

async function initDashboard() {
  const account = await requireAccount();
  if (!account) return;
  $("#note-count").textContent = `${account.noteCount} / ${account.maxNotes}`;
  $("#storage-count").textContent =
    `${formatBytes(account.usedBytes)} / 256 KiB`;
  $("#age-count").textContent = Math.max(
    0,
    Math.floor((Date.now() - Date.parse(account.createdAt)) / 864e5),
  );
  $(".meter span").style.setProperty(
    "--progress",
    `${Math.min(100, (account.usedBytes / account.maxBytes) * 100)}%`,
  );
  const list = $("#note-list");
  list.replaceChildren(
    ...account.notes.slice(0, 6).map((note) => noteRow(note)),
  );
  if (!account.notes.length)
    list.innerHTML = `<div class="empty-state"><div class="empty-orbit"></div><p>${t("noNotes")}</p></div>`;
}

async function initNotes() {
  const account = await requireAccount();
  if (!account) return;
  const list = $("#note-list");
  list.replaceChildren(...account.notes.map((note) => noteRow(note, true)));
  if (!account.notes.length)
    list.innerHTML = `<div class="empty-state"><div class="empty-orbit"></div><p>${t("noNotes")}</p></div>`;
}

async function initNewNote() {
  if (!(await requireAccount())) return;
  const form = $("#note-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = $(".form-message", form);
    if (!state.captcha) {
      message.textContent = t("captchaNeeded");
      return;
    }
    const button = form.querySelector("[type=submit]");
    button.disabled = true;
    try {
      const result = await api("/api/notes", {
        method: "POST",
        body: {
          name: form.name.value,
          encryption: form.encryption.value,
          captcha: state.captcha,
        },
      });
      location.href = result.redirect;
    } catch (error) {
      message.textContent = error.message;
      button.disabled = false;
    }
  });
}

function currentNoteId() {
  return location.pathname.split("/").filter(Boolean)[1];
}
async function initNote() {
  if (!(await requireAccount())) return;
  const note = await api(`/api/notes/${currentNoteId()}`);
  $("#note-name").textContent = note.name;
  $("#note-content").textContent = note.content;
  $("#note-encryption").textContent =
    note.encryption === "none"
      ? t("unencrypted")
      : note.encryption.toUpperCase();
  $("#note-characters").textContent =
    `${note.characters.toLocaleString()} ${t("characters")}`;
  $("#note-size").textContent = formatBytes(note.bytes);
  $("#note-updated").textContent = formatUtc(note.updatedAt);
  $("#edit-note").href = `/notes/${note.id}/edit`;
  $("#share-state").textContent = note.shared ? t("shared") : t("sharingOff");
  $("#delete-note").onclick = () => deleteNote(note);
  $("#share-note").onclick = () =>
    actionModal({
      title: t("shareTitleModal"),
      body: note.shared ? t("shareDisableBody") : t("shareEnableBody"),
      confirm: note.shared ? t("disableShare") : t("enableShare"),
      danger: false,
      run: () =>
        api(`/api/notes/${note.id}/share`, {
          method: "POST",
          body: { enabled: !note.shared, captcha: state.actionCaptcha },
        }),
    });
}

async function initEditor() {
  if (!(await requireAccount())) return;
  const note = await api(`/api/notes/${currentNoteId()}`);
  const name = $("#editor-name");
  const content = $("#editor-content");
  name.value = note.name;
  content.value = note.content;
  $("#editor-encryption").textContent =
    note.encryption === "none"
      ? t("unencrypted")
      : note.encryption.toUpperCase();
  let dirty = false,
    saved = false;
  const update = () => {
    $("#editor-count").textContent = `${Array.from(content.value)
      .filter((x) => !/\s/u.test(x))
      .length.toLocaleString()} ${t("characters")}`;
    dirty = true;
  };
  name.oninput = update;
  content.oninput = update;
  update();
  dirty = false;
  $("#save-note").onclick = () =>
    actionModal({
      title: t("save"),
      body: t("englishOnlyCaptcha"),
      confirm: t("save"),
      danger: false,
      run: async () => {
        const result = await api(`/api/notes/${note.id}`, {
          method: "PUT",
          body: {
            name: name.value,
            content: content.value,
            captcha: state.actionCaptcha,
          },
        });
        saved = true;
        dirty = false;
        return result;
      },
    });
  $("#discard-note").onclick = () =>
    modal({
      title: t("discard"),
      body: t("editorUnsaved"),
      confirm: t("discard"),
      danger: true,
      onConfirm: () => {
        dirty = false;
        location.href = `/notes/${note.id}`;
      },
    });
  window.addEventListener("beforeunload", (event) => {
    if (dirty && !saved) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
}

async function initSettings() {
  const account = await requireAccount();
  if (!account) return;
  const form = $("#settings-form");
  form.displayName.value = account.displayName;
  form.theme.value = account.settings.theme;
  form.language.value = account.settings.language;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await api("/api/settings", {
      method: "PATCH",
      body: {
        displayName: form.displayName.value,
        theme: form.theme.value,
        language: form.language.value,
      },
    });
    state.theme = form.theme.value;
    state.language = form.language.value;
    localStorage.setItem("astranote_theme", state.theme);
    localStorage.setItem("astranote_language", state.language);
    applyLocale();
    toast(t("saved"));
  });
  $("#logout-wide").onclick = () =>
    actionModal({
      title: t("logoutTitle"),
      body: t("logoutBody"),
      confirm: t("logout"),
      danger: false,
      run: () =>
        api("/api/logout", {
          method: "POST",
          body: { captcha: state.actionCaptcha },
        }),
    });
  $("#delete-account").onclick = () => {
    const extra = document.createElement("div");
    extra.className = "form-group";
    const label = document.createElement("label");
    label.textContent = t("confirmUsername");
    const input = document.createElement("input");
    input.autocomplete = "off";
    input.placeholder = account.username;
    extra.append(label, input);
    actionModal({
      title: t("deleteAccountTitle"),
      body: t("deleteAccountBody"),
      confirm: t("requestDeletion"),
      extra,
      run: () =>
        api("/api/account/delete", {
          method: "POST",
          body: { username: input.value, captcha: state.actionCaptcha },
        }),
    });
  };
}

async function initShared() {
  const token = location.pathname.split("/").filter(Boolean)[1];
  try {
    const note = await api(`/api/shared/${encodeURIComponent(token)}`);
    $("#shared-name").textContent = note.name;
    $("#shared-content").textContent = note.content;
    $("#shared-author").textContent =
      `${t("by")} ${note.author} · ${note.email}`;
    $("#shared-encryption").textContent =
      note.encryption === "none"
        ? t("unencrypted")
        : note.encryption.toUpperCase();
    $("#shared-updated").textContent = formatUtc(note.updatedAt);
    $("#shared-characters").textContent =
      `${note.characters.toLocaleString()} ${t("characters")}`;
  } catch {
    location.replace("/404");
  }
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  $$(".reveal").forEach((el) => observer.observe(el));
}

async function boot() {
  state.language = localStorage.getItem("astranote_language") || "en";
  state.theme = localStorage.getItem("astranote_theme") || "dark";
  state.session = await api("/api/session").catch(() => ({
    authenticated: false,
  }));
  if (state.session.authenticated) {
    state.account = await api("/api/account").catch(() => null);
    if (state.account) {
      state.language = state.account.settings.language || state.language;
      state.theme = state.account.settings.theme || state.theme;
    }
  }
  buildNav();
  buildFooter();
  applyLocale();
  cookieBanner();
  initReveal();
  const initializers = {
    home: initHome,
    login: () => initAuthForm("login"),
    register: () => initAuthForm("register"),
    dashboard: initDashboard,
    notes: initNotes,
    "new-note": initNewNote,
    note: initNote,
    editor: initEditor,
    settings: initSettings,
    shared: initShared,
  };
  await initializers[page]?.();
  applyLocale();
}

boot().catch((error) => {
  console.error(error);
  toast(t("error"));
});
