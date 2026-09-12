"use strict";

(() => {
  const page = document.body.dataset.page;
  if (!["drop-new", "drop"].includes(page)) return;
  const text = new TextEncoder();
  const decode = new TextDecoder("utf-8", { fatal: true });
  const copy = {
    en: {
      createTitle: "Create a time-limited share",
      createIntro: "Create an independent snapshot with an expiry. Changes to the original note will not change this AstraDrop.",
      protection: "Protection", expires: "Expires after", views: "View limit",
      unlimited: "Unlimited during its lifetime", back: "Back", create: "Create AstraDrop",
      storage: "AstraDrops are independent snapshots and count toward your account storage until they expire, are used up, or are revoked.",
      basic: "Basic Drop", secret: "DropSecret", confidential: "DropConfidential",
      basicHelp: "Quick timed sharing without encryption. Do not use it for private information.",
      secretHelp: "Client-side encryption with a 4–6 digit PIN. Best for everyday private text.",
      confidentialHelp: "Stronger client-side protection with a 4–16 character ASCII PIN. Use a longer, unique PIN for sensitive text.",
      secretPin: "DropSecret PIN (4–6 digits)", confidentialPin: "DropConfidential PIN (4–16 ASCII characters)",
      pinRequired: "Enter a valid PIN before creating this AstraDrop.",
      noSource: "Return to an unlocked note and choose AstraDrop again.",
      sourceProtectionRequired: "This encrypted note needs a plan that includes an encrypted AstraDrop.",
      created: "AstraDrop is ready", link: "Share link", copy: "Copy", copied: "Copied",
      openTitle: "Time-limited share", open: "Open AstraDrop", openBasic: "This AstraDrop can be viewed until it expires.",
      openSecret: "Enter the DropSecret PIN to open this timed, encrypted share.",
      openConfidential: "Enter the DropConfidential PIN to open this timed, encrypted share.",
      expiresAt: "Expires", viewsLeft: "Views left", unlimitedViews: "Unlimited views", pin: "PIN",
      unavailable: "This AstraDrop is unavailable, has expired, or has already reached its view limit.",
      pinIncorrect: "The PIN is incorrect.",
    },
    "zh-Hant": {
      createTitle: "建立限時分享",
      createIntro: "建立一份有期限的獨立快照；原筆記後續修改不會影響這個 AstraDrop。",
      protection: "保護方式", expires: "有效期限", views: "瀏覽次數限制",
      unlimited: "有效期內可不限次數瀏覽", back: "返回", create: "建立 AstraDrop",
      storage: "AstraDrop 是獨立快照，在到期、用盡次數或被撤銷前，都會計入帳號使用空間。",
      basic: "Basic Drop", secret: "DropSecret", confidential: "DropConfidential",
      basicHelp: "快速限時分享，不使用加密。請勿用於私密資訊。",
      secretHelp: "使用 4–6 位數字 PIN 的客戶端加密，適合日常私密文字。",
      confidentialHelp: "使用 4–16 位 ASCII PIN 的更強客戶端保護。敏感內容請使用更長且獨特的 PIN。",
      secretPin: "DropSecret PIN（4–6 位數字）", confidentialPin: "DropConfidential PIN（4–16 位 ASCII 字元）",
      pinRequired: "請輸入符合規則的 PIN，再建立 AstraDrop。",
      noSource: "請回到已解鎖的筆記，再重新選擇 AstraDrop。",
      sourceProtectionRequired: "這篇加密筆記需要使用包含加密 AstraDrop 的方案。",
      created: "AstraDrop 已建立", link: "分享連結", copy: "複製", copied: "已複製",
      openTitle: "限時分享", open: "開啟 AstraDrop", openBasic: "此 AstraDrop 可在到期前瀏覽。",
      openSecret: "輸入 DropSecret PIN，開啟這份限時加密分享。", openConfidential: "輸入 DropConfidential PIN，開啟這份限時加密分享。",
      expiresAt: "到期時間", viewsLeft: "剩餘瀏覽次數", unlimitedViews: "不限瀏覽次數", pin: "PIN",
      unavailable: "此 AstraDrop 無法使用、已到期，或已達瀏覽次數上限。",
      pinIncorrect: "PIN 不正確。",
    },
    ja: {
      createTitle: "期限付き共有を作成", createIntro: "有効期限付きの独立したスナップショットを作成します。元のノートを変更しても、この AstraDrop は変わりません。",
      protection: "保護方法", expires: "有効期限", views: "閲覧回数の上限", unlimited: "有効期間中は無制限に閲覧可能", back: "戻る", create: "AstraDrop を作成",
      storage: "AstraDrop は独立したスナップショットです。期限切れ、閲覧回数の消費、または取り消しまで、アカウント容量を使用します。",
      basic: "Basic Drop", secret: "DropSecret", confidential: "DropConfidential",
      basicHelp: "暗号化なしの短期共有です。個人的な情報には使用しないでください。",
      secretHelp: "4～6桁の PIN を使うクライアント側暗号化。日常的な個人情報向けです。",
      confidentialHelp: "4～16文字の ASCII PIN を使う、より強いクライアント側保護です。大切な内容には長く固有の PIN を使ってください。",
      secretPin: "DropSecret PIN（4～6桁の数字）", confidentialPin: "DropConfidential PIN（4～16文字の ASCII）",
      pinRequired: "条件に合う PIN を入力してから AstraDrop を作成してください。", noSource: "ロック解除したノートに戻り、もう一度 AstraDrop を選んでください。",
      sourceProtectionRequired: "この暗号化ノートには、暗号化 AstraDrop を含むプランが必要です。",
      created: "AstraDrop を作成しました", link: "共有リンク", copy: "コピー", copied: "コピーしました",
      openTitle: "期限付き共有", open: "AstraDrop を開く", openBasic: "この AstraDrop は有効期限まで閲覧できます。",
      openSecret: "DropSecret PIN を入力して、期限付きの暗号化共有を開きます。", openConfidential: "DropConfidential PIN を入力して、期限付きの暗号化共有を開きます。",
      expiresAt: "有効期限", viewsLeft: "残り閲覧回数", unlimitedViews: "閲覧回数は無制限", pin: "PIN",
      unavailable: "この AstraDrop は利用できないか、有効期限切れ、または閲覧回数の上限に達しています。", pinIncorrect: "PIN が正しくありません。",
    },
  };
  const locale = (() => {
    let saved = null;
    try { saved = localStorage.getItem("astranote_language"); } catch {}
    const value = saved || document.documentElement.lang || navigator.language;
    return value.toLowerCase().startsWith("zh") ? "zh-Hant" : value.toLowerCase().startsWith("ja") ? "ja" : "en";
  })();
  const t = copy[locale];
  const $ = (selector) => document.querySelector(selector);
  const b64 = (bytes) => {
    let binary = "";
    for (let index = 0; index < bytes.length; index += 8192) binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
    return btoa(binary);
  };
  const b64url = (bytes) => b64(bytes).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  const fromB64 = (value) => {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    return Uint8Array.from(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")), (char) => char.charCodeAt(0));
  };
  const randomId = () => b64url(crypto.getRandomValues(new Uint8Array(32)));
  async function hex(value) {
    const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", text.encode(value)));
    return [...bytes].map((item) => item.toString(16).padStart(2, "0")).join("");
  }
  async function request(url, options = {}, csrf = null) {
    const response = await fetch(url, {
      credentials: "same-origin",
      method: options.method || "GET",
      headers: {
        ...(options.body ? { "content-type": "application/json" } : {}),
        ...(csrf ? { "x-csrf-token": csrf } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(data.message || t.unavailable), { code: data.error, status: response.status });
    return data;
  }
  const pinValid = (mode, pin) => mode === "secret" ? /^\d{4,6}$/.test(pin) : /^[\x21-\x7e]{4,16}$/.test(pin);
  const context = (mode, id, createdAt) => text.encode(`AstraDrop ${mode} v1\0${id}\0${createdAt}`);
  async function derive(mode, id, createdAt, salt, pin, factor) {
    const bytes = await window.hashwasm.argon2id({
      password: `${pin}\0${factor}`,
      salt: fromB64(salt), parallelism: 1,
      iterations: mode === "confidential" ? 5 : 3,
      memorySize: mode === "confidential" ? 98304 : 65536,
      hashLength: 32, outputType: "binary",
    });
    try { return await crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]); }
    finally { bytes.fill(0); }
  }
  async function encrypt(mode, id, createdAt, pin, content, csrf) {
    const clientSalt = b64url(crypto.getRandomValues(new Uint8Array(32)));
    const clientHash = await hex(`AstraDrop ${mode} v1\0${pin}\0${id}\0${createdAt}\0${clientSalt}`);
    const { serverFactor } = await request("/api/drops/key-factor", { method: "POST", body: { mode, id, createdAt, clientSalt, clientHash } }, csrf);
    const key = await derive(mode, id, createdAt, clientSalt, pin, serverFactor);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: context(mode, id, createdAt), tagLength: 128 }, key, text.encode(content)));
    return { clientSalt, clientHash, encrypted: { iv: b64(iv), ciphertext: b64(encrypted.slice(0, -16)), tag: b64(encrypted.slice(-16)) } };
  }
  async function decrypt(mode, id, createdAt, pin, clientSalt, factor, encrypted) {
    const key = await derive(mode, id, createdAt, clientSalt, pin, factor);
    const ciphertext = fromB64(encrypted.ciphertext), tag = fromB64(encrypted.tag);
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext); combined.set(tag, ciphertext.length);
    return decode.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(encrypted.iv), additionalData: context(mode, id, createdAt), tagLength: 128 }, key, combined));
  }
  function manual(input) {
    input.addEventListener("focus", () => input.removeAttribute("readonly"), { once: true });
    input.addEventListener("paste", (event) => event.preventDefault());
  }
  function formatUtc(value) { return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value)) + " UTC"; }
  function formatDuration(value) {
    return ({ 300000: "5 minutes", 3600000: "1 hour", 86400000: "24 hours", 604800000: "7 days", 2592000000: "30 days" })[value] || value;
  }

  async function initCreate() {
    const session = await request("/api/session");
    if (!session.authenticated) { location.href = `/login?next=${encodeURIComponent(location.pathname + location.search)}`; return; }
    const source = JSON.parse(sessionStorage.getItem("astranote_drop_source") || "null");
    sessionStorage.removeItem("astranote_drop_source");
    if (!source?.content || !source?.name) { $("#drop-message").textContent = t.noSource; $("#drop-create").disabled = true; return; }
    const account = await request("/api/account");
    $("#drop-create-title").textContent = t.createTitle; $("#drop-create-intro").textContent = t.createIntro;
    $("#drop-mode-label").textContent = t.protection; $("#drop-duration-label").textContent = t.expires; $("#drop-views-label").textContent = t.views;
    $("#drop-views").options[0].textContent = t.unlimited; $("#drop-cancel span").textContent = t.back; $("#drop-create span").textContent = t.create;
    $("#drop-storage-help").textContent = t.storage;
    $("#drop-source-name").textContent = source.name; $("#drop-source").hidden = false; $("#drop-cancel").href = `/notes/${encodeURIComponent(source.id || "")}`;
    const mode = $("#drop-mode"), duration = $("#drop-duration"), pinGroup = $("#drop-pin-group"), pin = $("#drop-pin");
    manual(pin);
    for (const option of mode.options) {
      option.textContent = t[option.value];
      option.disabled = !account.plan.dropModes.includes(option.value) ||
        (option.value === "basic" && source.encryption && source.encryption !== "none");
    }
    if (![...mode.options].some((option) => !option.disabled)) {
      $("#drop-message").textContent = t.sourceProtectionRequired;
      $("#drop-create").disabled = true;
      return;
    }
    const refresh = () => {
      const selected = mode.value;
      if (mode.selectedOptions[0].disabled)
        mode.value = [...mode.options].find((option) => !option.disabled)?.value || "basic";
      pinGroup.hidden = mode.value === "basic";
      if (mode.value !== "basic") {
        pin.value = ""; pin.inputMode = mode.value === "secret" ? "numeric" : "text";
        pin.maxLength = mode.value === "secret" ? 6 : 16; pin.pattern = mode.value === "secret" ? "[0-9]{4,6}" : "[!-~]{4,16}";
        $("#drop-pin-label").textContent = mode.value === "secret" ? t.secretPin : t.confidentialPin;
        $("#drop-pin-help").textContent = mode.value === "secret" ? t.secretHelp : t.confidentialHelp;
      }
      $("#drop-mode-help").textContent = mode.value === "basic" ? t.basicHelp : mode.value === "secret" ? t.secretHelp : t.confidentialHelp;
      for (const option of duration.options) option.disabled = Number(option.value) > account.plan.dropDurationMs;
      if (duration.selectedOptions[0].disabled) duration.value = String(account.plan.dropDurationMs);
    };
    mode.onchange = refresh; refresh();
    $("#drop-form").onsubmit = async (event) => {
      event.preventDefault(); const button = $("#drop-create"), message = $("#drop-message"); message.textContent = ""; button.disabled = true;
      try {
        const selectedMode = mode.value, id = randomId(), createdAt = new Date().toISOString(), durationMs = Number(duration.value);
        const body = { id, sourceName: source.name, mode: selectedMode, createdAt, durationMs, viewLimit: $("#drop-views").value ? Number($("#drop-views").value) : null };
        if (selectedMode === "basic") body.content = source.content;
        else {
          if (!pinValid(selectedMode, pin.value)) throw new Error(t.pinRequired);
          Object.assign(body, await encrypt(selectedMode, id, createdAt, pin.value, source.content, session.csrf)); pin.value = "";
        }
        const result = await request("/api/drops", { method: "POST", body }, session.csrf);
        const url = new URL(result.url, location.origin).href;
        $("#drop-form").replaceWith(Object.assign(document.createElement("section"), { className: "drop-success", innerHTML: `<h2><i class="fa-solid fa-circle-check" aria-hidden="true"></i> ${t.created}</h2><label>${t.link}</label><div><input readonly value="${url}"><button class="btn" type="button"><i class="fa-solid fa-copy" aria-hidden="true"></i><span>${t.copy}</span></button></div>` }));
        const success = $(".drop-success"), copyButton = $("button", success), input = $("input", success);
        copyButton.onclick = async () => { try { await navigator.clipboard.writeText(url); copyButton.querySelector("span").textContent = t.copied; setTimeout(() => copyButton.querySelector("span").textContent = t.copy, 1800); } catch { input.select(); document.execCommand("copy"); } };
      } catch (error) { message.textContent = error.message; button.disabled = false; }
    };
  }

  async function initOpen() {
    const id = location.pathname.split("/").filter(Boolean)[1];
    let meta;
    try { meta = await request(`/api/drops/${encodeURIComponent(id)}`); }
    catch { $("#drop-open-title").textContent = t.unavailable; $("#drop-open").hidden = true; return; }
    $("#drop-open-title").textContent = t.openTitle;
    const protectedDrop = meta.mode !== "basic";
    $("#drop-open-intro").textContent = meta.mode === "basic" ? t.openBasic : meta.mode === "secret" ? t.openSecret : t.openConfidential;
    $("#drop-open-pin-group").hidden = !protectedDrop;
    if (protectedDrop) { $("#drop-open-pin-label").textContent = meta.mode === "secret" ? t.secretPin : t.confidentialPin; manual($("#drop-open-pin")); $("#drop-open-pin").inputMode = meta.mode === "secret" ? "numeric" : "text"; }
    $("#drop-stats").innerHTML = `<span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${t.expiresAt}: ${formatUtc(meta.expiresAt)}</span><span><i class="fa-solid fa-eye" aria-hidden="true"></i> ${meta.viewsRemaining === null ? t.unlimitedViews : `${t.viewsLeft}: ${meta.viewsRemaining}`}</span>`;
    $("#drop-open span").textContent = t.open;
    $("#drop-open").onclick = async () => {
      const button = $("#drop-open"), message = $("#drop-open-message"), pin = $("#drop-open-pin"); button.disabled = true; message.textContent = "";
      try {
        let clientHash = "";
        if (protectedDrop) {
          if (!pinValid(meta.mode, pin.value)) throw new Error(t.pinIncorrect);
          // This proof never contains the PIN itself. It lets the server reject
          // a wrong PIN before a limited-view Drop is consumed.
          clientHash = await hex(`AstraDrop ${meta.mode} v1\0${pin.value}\0${id}\0${meta.createdAt}\0${meta.clientSalt || ""}`);
        }
        const response = await request(`/api/drops/${encodeURIComponent(id)}/open`, { method: "POST", body: { clientHash } });
        let content = response.content;
        if (protectedDrop) {
          content = await decrypt(meta.mode, id, meta.createdAt, pin.value, response.clientSalt, response.serverFactor, response.encrypted);
          pin.value = "";
        }
        $("#drop-content").textContent = content || ""; $("#drop-content").hidden = false; button.hidden = true; $("#drop-open-pin-group").hidden = true;
      } catch (error) { message.textContent = error.code === "drop_pin_invalid" ? t.pinIncorrect : error.message; button.disabled = false; }
    };
  }
  window.addEventListener("load", () => {
    const select = document.querySelector("#language-select");
    select?.addEventListener("change", () => setTimeout(() => location.reload(), 0));
    (page === "drop-new" ? initCreate : initOpen)().catch(() => {
      const target = page === "drop" ? $("#drop-open-title") : $("#drop-message");
      if (target) target.textContent = t.unavailable;
    });
  });
})();
