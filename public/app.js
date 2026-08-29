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
      "Each account includes 256 KiB across all account files and up to 48 notes. Encrypted notes commonly use about 1.4× the storage; very short notes may use more than 2×.",
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
      "This note has no backup and cannot be restored. Complete the human verification to confirm permanent deletion.",
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
      "Permanently delete your account and all of its notes immediately. This cannot be cancelled or undone.",
    requestDeletion: "Permanently delete account",
    logoutTitle: "Log out?",
    logoutBody: "This will end your current sign-in session.",
    deleteAccountTitle: "Permanently delete this account?",
    deleteAccountBody:
      "Enter your exact username and current password, then complete the human verification. The account, notes, sessions, and sharing links will be removed immediately and cannot be restored.",
    confirmUsername: "Confirm username",
    proceed: "Continue",
    cancel: "Cancel",
    close: "Close",
    captchaNeeded: "Complete the human verification first.",
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
    signInBody: "Enter your account details and complete the human verification.",
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
      "Enter the same account password and complete a new human verification to restore access during the 7-day reversal period.",
    deletePending:
      "This account is awaiting deletion. Reloading the login page will let you cancel the request with a new CAPTCHA.",
    legalUpdated: "Effective and last updated: 29 August 2026",
    englishOnlyCaptcha:
      "Complete the human verification to save this note.",
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
      "每個帳號的所有檔案合計 256 KiB，最多 48 篇筆記。加密筆記通常約需 1.4 倍空間；很短的筆記可能超過 2 倍。",
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
      "這篇筆記沒有備份，刪除後無法復原。請完成人類驗證以確認永久刪除。",
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
      "立即永久刪除帳號及所有筆記；此操作不能取消或復原。",
    requestDeletion: "永久刪除帳號",
    logoutTitle: "要登出嗎？",
    logoutBody: "這會結束目前的登入階段。",
    deleteAccountTitle: "要永久刪除這個帳號嗎？",
    deleteAccountBody:
      "輸入完整 Username 與目前密碼，再完成人類驗證。帳號、筆記、登入階段與分享連結將立即移除，且無法復原。",
    confirmUsername: "確認 Username",
    proceed: "繼續",
    cancel: "取消",
    close: "關閉",
    captchaNeeded: "請先完成人類驗證。",
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
    signInBody: "輸入帳號資料並完成人類驗證。",
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
      "在七天反悔期內輸入原帳號密碼並重新完成人類驗證，即可恢復存取。",
    deletePending:
      "此帳號正在等待刪除。系統將重新載入登入頁，讓你以新的 CAPTCHA 取消申請。",
    legalUpdated: "生效及最後更新：2026 年 8 月 29 日",
    englishOnlyCaptcha: "請完成人類驗證以儲存筆記。",
    editorUnsaved: "尚有未儲存的變更，仍要關閉這個頁面嗎？",
  },
};

Object.assign(I18N.en, {
  heroKicker: "ONLINE NOTEBOOK · FREE TO USE",
  tagline: "Write it down. Find it whenever you need it.",
  heroLead:
    "AstraNote is a free online notebook for ideas, reminders, lists, work, study, and useful information—ready on every device you sign in to.",
  begin: "Create a free account",
  explore: "See what it does",
  scroll: "Learn more",
  utc: "Unique accounts · today in UTC",
  purposeEyebrow: "MADE FOR EVERYDAY NOTES",
  purposeTitle: "A clear, dependable place to keep what matters.",
  purposeIntroOne:
    "AstraNote is a free online notebook that helps you record ideas, tasks, lists, study notes, work notes, frequently used information, and anything else you want to find quickly later.",
  purposeIntroTwo:
    "Whether it is a passing idea, something you must remember, or information you reach for often, it can stay together in your AstraNote account. Sign in on a phone, tablet, or computer to read and edit the same notes without repeatedly sending files between devices.",
  purposeIntroThree:
    "AstraNote focuses on a simple, clear plain-text experience. Every account currently includes up to 48 notes and 256 KiB of storage for free, without advertising or analytics tracking. Notes may also be encrypted or shared through a read-only link that you can revoke at any time.",
  quickTitle: "Capture it right away",
  quickBody:
    "Write down an idea, a reminder, a list, or a useful piece of information before it slips away.",
  secureTitle: "Open it on another device",
  secureBody:
    "Sign in from your phone, tablet, or computer and your notes are ready when you need them.",
  shareTitle: "Free to use",
  shareBody:
    "Create up to 48 notes with 256 KiB of account storage, with no advertising or analytics tracking.",
  limitEyebrow: "SIMPLE, HONEST LIMITS",
  limitTitle: "Enough room for the notes you reach for most.",
  limitBody:
    "Every account includes 256 KiB across all account files and up to 48 notes. If the account is full, existing notes remain readable, but new notes and saves are paused until space is freed.",
  welcomeBody: "Your notes and account usage, clearly presented.",
  noNotes: "No notes yet. Create one whenever you have something worth keeping.",
  newNoteBody:
    "Name the note and choose whether to encrypt it. The encryption option cannot be changed later.",
  encryptionHelp:
    "Encrypted notes usually use about 1.4× as much storage. Very short encrypted notes may use more than 2×.",
  deleteNoteBody:
    "This note has no backup and cannot be restored. Complete the human verification to delete it permanently.",
  logoutBody: "This will end your current sign-in session.",
  deleteAccountBody:
    "Enter your exact username and current password, then complete the human verification. The account, notes, sessions, and sharing links will be removed immediately and cannot be restored.",
  captchaNeeded: "Complete the human verification first.",
  signInBody: "Enter your account details and complete the human verification.",
  registerBody: "Create a free account and keep useful notes within easy reach.",
  cancellationBody:
    "Enter the same account password and complete a new human verification to restore access during the 7-day reversal period.",
  saveBody: "Save the latest name and content of this note?",
  shareReadyTitle: "Your sharing link is ready",
  shareReadyBody:
    "Anyone with this link can read the note and see your public display name and masked email.",
  shareStoppedTitle: "Sharing is off",
  shareStoppedBody: "The previous sharing link no longer works.",
  humanVerification: "Human verification",
  dashboardEyebrow: "YOUR NOTES",
  notesEyebrow: "NOTEBOOK",
  newNoteEyebrow: "NEW NOTE",
  editorEyebrow: "NOTE EDITOR",
  settingsEyebrow: "PREFERENCES",
  loginEyebrow: "ASTRANOTE ACCESS",
  registerEyebrow: "JOIN ASTRANOTE",
  accountLimitsEyebrow: "ACCOUNT LIMITS",
  accountStorageLabel: "ACCOUNT STORAGE",
  accountLimitCaption: "48 NOTES · FREE ACCOUNT · NO ADS",
  maxNotesLabel: "MAX 48",
  legalEyebrow: "LEGAL",
  privacyEyebrow: "DATA PRACTICES",
  notFoundEyebrow: "PAGE NOT FOUND",
  notFoundBody: "The page you requested could not be found.",
  noEncryptionOption: "No encryption",
  vaultPin: "Vault PIN (4–6 digits)",
  confirmVaultPin: "Confirm Vault PIN",
  vaultTitle: "AstraConfidential SCHybrid",
  vaultExplanation:
    "Your device combines your account details and Vault PIN with a temporary factor protected by AstraNote's independent server secret. The note title and content are encrypted on this device before upload; AstraNote stores those two fields only as ciphertext.",
  vaultPinWarning:
    "AstraNote does not store or recover this PIN. Losing it makes the note permanently inaccessible. A 6-digit PIN is recommended, and you should enter it only on a device you trust.",
  vaultNoSharing:
    "Sharing is unavailable because this encryption is bound to the owner's account, PIN, and AstraNote server secret.",
  vaultPinInvalid: "Enter a 4–6 digit Vault PIN.",
  noteNameRequired: "Note name is required.",
  vaultPinMismatch: "The Vault PIN entries do not match.",
  vaultCryptoUnavailable:
    "Secure browser encryption is unavailable on this device.",
  vaultUnavailable:
    "AstraConfidential SCHybrid is not configured on this server.",
  unlockVaultTitle: "Unlock AstraConfidential note",
  unlockVaultBody:
    "Enter this note's 4–6 digit Vault PIN. AstraNote does not store or recover it.",
  unlock: "Unlock",
  trustedDeviceOnly: "Only enter this PIN on a device you trust.",
  vaultUnlockFailed: "The Vault PIN is incorrect or the encrypted note is damaged.",
  confidentialNote: "AstraConfidential encrypted note",
  hiddenCharacters: "Hidden until unlocked",
  vaultSharingUnavailable:
    "Sharing is unavailable for AstraConfidential SCHybrid notes because their encryption is bound to the owner's account and Vault PIN.",
  dangerBody:
    "Permanently delete your account and all of its notes immediately. This cannot be cancelled or undone.",
  requestDeletion: "Permanently delete account",
  deleteAccountTitle: "Permanently delete this account?",
  deleteAccountBody:
    "Enter your exact username and current password, then complete the human verification. The account, notes, sessions, and sharing links will be removed immediately and cannot be restored.",
  confirmCurrentPassword: "Confirm current password",
});

Object.assign(I18N["zh-Hant"], {
  heroKicker: "線上筆記本 · 免費使用",
  tagline: "隨手記下，需要時隨時找得到。",
  heroLead:
    "AstraNote 是一個免費的線上筆記本，適合記錄想法、提醒、清單、工作、學習與常用資料；登入後，每台裝置都能繼續使用。",
  begin: "免費建立帳號",
  explore: "了解功能",
  scroll: "繼續了解",
  today: "今日登入",
  registered: "已註冊帳號",
  utc: "不同帳號 · 以 UTC 計算今日",
  purposeEyebrow: "為日常筆記而做",
  purposeTitle: "清楚、可靠，讓重要內容一直在手邊。",
  purposeIntroOne:
    "AstraNote 是一個免費的線上筆記本，讓使用者隨時記錄想法、待辦事項、清單、學習內容、工作紀錄、常用資料，以及任何希望日後快速找到的文字。",
  purposeIntroTwo:
    "無論是突然想到的靈感、需要記住的事情，還是經常需要拿出來查看的資訊，都能集中保存在自己的 AstraNote 帳號中。登入後，即可在手機、平板或電腦上查看與編輯同一批筆記，不必把重要內容留在單一裝置，也不需要反覆傳送檔案。",
  purposeIntroThree:
    "AstraNote 專注於簡單、清楚且容易使用的純文字筆記體驗。目前每個帳號免費提供最多 48 篇筆記與 256 KiB 儲存空間，沒有廣告，也不使用分析追蹤；使用者亦可選擇加密筆記，或建立能隨時關閉的唯讀分享連結。",
  quickTitle: "想到就能立刻記下",
  quickBody: "不論是靈感、提醒、清單或常用資料，都能在忘記以前迅速保存。",
  secureTitle: "換一台裝置也能查看",
  secureBody: "使用手機、平板或電腦登入，同一批筆記就會在需要時出現。",
  shareTitle: "免費使用",
  shareBody: "每個帳號可建立 48 篇筆記，享有 256 KiB 空間，沒有廣告與分析追蹤。",
  limitEyebrow: "簡單而透明的限制",
  limitTitle: "為最常用的筆記保留剛好的空間。",
  limitBody:
    "每個帳號的所有檔案合計 256 KiB，最多 48 篇筆記。空間用滿後仍可閱讀既有內容，但必須先釋放空間才能新增或儲存。",
  welcomeBody: "清楚查看筆記和帳號用量。",
  accountAge: "帳號已建立",
  days: "天",
  noNotes: "目前沒有筆記。有值得留下的內容時，就建立一篇吧。",
  allNotesBody: "所有已保存的內容，都整齊放在這裡。",
  newNoteBody: "輸入名稱並選擇是否加密；建立後無法更換加密方式。",
  encryptionHelp: "加密筆記通常約需 1.4 倍空間；非常短的內容可能超過 2 倍。",
  deleteNoteBody: "這篇筆記沒有備份，刪除後無法復原。請完成人類驗證以永久刪除。",
  logoutBody: "這會結束目前的登入階段。",
  deleteAccountBody:
    "輸入完整 Username 與目前密碼，再完成人類驗證。帳號、筆記、登入階段與分享連結將立即移除，且無法復原。",
  captchaNeeded: "請先完成人類驗證。",
  signInTitle: "登入並查看筆記",
  signInBody: "輸入帳號資料並完成人類驗證。",
  registerTitle: "建立 AstraNote 帳號",
  registerBody: "免費建立帳號，讓常用的筆記隨時在手邊。",
  cancellationBody: "在七天反悔期內輸入原密碼並重新完成人類驗證，即可恢復存取。",
  saveBody: "要儲存這篇筆記目前的名稱與內容嗎？",
  shareReadyTitle: "分享連結已建立",
  shareReadyBody: "持有連結者可閱讀筆記，並看到你的公開顯示名稱與遮罩 Email。",
  shareStoppedTitle: "分享已關閉",
  shareStoppedBody: "先前的分享連結已經失效。",
  humanVerification: "人類驗證",
  dashboardEyebrow: "你的筆記",
  notesEyebrow: "筆記本",
  newNoteEyebrow: "新增筆記",
  editorEyebrow: "筆記編輯",
  settingsEyebrow: "偏好設定",
  loginEyebrow: "ASTRANOTE 登入",
  registerEyebrow: "加入 ASTRANOTE",
  accountLimitsEyebrow: "帳號限制",
  accountStorageLabel: "帳號儲存空間",
  accountLimitCaption: "48 篇筆記 · 免費帳號 · 無廣告",
  maxNotesLabel: "上限 48",
  legalEyebrow: "法律文件",
  privacyEyebrow: "資料處理方式",
  notFoundEyebrow: "找不到頁面",
  notFoundBody: "找不到你所要求的頁面。",
  noEncryptionOption: "不加密",
  vaultPin: "Vault PIN（4–6 位數）",
  confirmVaultPin: "再次輸入 Vault PIN",
  vaultTitle: "AstraConfidential SCHybrid",
  vaultExplanation:
    "你的裝置會將帳號資料與 Vault PIN，結合由 AstraNote 獨立伺服器祕密保護的臨時因子。筆記名稱與內容會先在此裝置完成加密，再上傳至 AstraNote；這兩個欄位只會以密文保存。",
  vaultPinWarning:
    "AstraNote 不會儲存或協助找回這組 PIN。遺失後，筆記將永久無法開啟。建議使用 6 位 PIN，並且只在你信任的裝置上輸入。",
  vaultNoSharing:
    "此加密方式與擁有者帳號、PIN 及 AstraNote 伺服器祕密綁定，因此不提供分享功能。",
  vaultPinInvalid: "請輸入 4–6 位數的 Vault PIN。",
  noteNameRequired: "請輸入筆記名稱。",
  vaultPinMismatch: "兩次輸入的 Vault PIN 不相同。",
  vaultCryptoUnavailable: "此裝置無法使用安全的瀏覽器加密功能。",
  vaultUnavailable: "伺服器尚未設定 AstraConfidential SCHybrid。",
  unlockVaultTitle: "解鎖 AstraConfidential 筆記",
  unlockVaultBody:
    "請輸入這篇筆記的 4–6 位 Vault PIN。AstraNote 不會儲存或協助找回這組 PIN。",
  unlock: "解鎖",
  trustedDeviceOnly: "請只在你信任的裝置上輸入這組 PIN。",
  vaultUnlockFailed: "Vault PIN 不正確，或加密筆記已損壞。",
  confidentialNote: "AstraConfidential 加密筆記",
  hiddenCharacters: "解鎖後顯示",
  vaultSharingUnavailable:
    "此筆記的加密與擁有者帳號及 Vault PIN 綁定，因此 AstraConfidential SCHybrid 不提供分享功能。",
  dangerBody: "立即永久刪除帳號及所有筆記；此操作不能取消或復原。",
  requestDeletion: "永久刪除帳號",
  deleteAccountTitle: "要永久刪除這個帳號嗎？",
  deleteAccountBody:
    "輸入完整 Username 與目前密碼，再完成人類驗證。帳號、筆記、登入階段與分享連結將立即移除，且無法復原。",
  confirmCurrentPassword: "確認目前密碼",
});

const state = {
  session: null,
  account: null,
  captcha: null,
  actionCaptcha: null,
  language: "en",
  theme: "dark",
};
const SCHYBRID_MODE = "astra-confidential-schybrid-v1";
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

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder("utf-8", { fatal: true });

function bytesToBase64(bytes, urlSafe = false) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 8192)
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  const encoded = btoa(binary);
  return urlSafe
    ? encoded.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "")
    : encoded;
}
function base64ToBytes(value) {
  const normalized = String(value || "").replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function randomHex(bytes) {
  return [...crypto.getRandomValues(new Uint8Array(bytes))]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}
function randomBase64Url(bytes) {
  return bytesToBase64(crypto.getRandomValues(new Uint8Array(bytes)), true);
}
async function sha256Hex(value) {
  const digest = new Uint8Array(
    await crypto.subtle.digest("SHA-256", textEncoder.encode(value)),
  );
  return [...digest]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
function encryptionLabel(mode) {
  if (mode === "none") return t("unencrypted");
  if (mode === SCHYBRID_MODE) return "AstraConfidential SCHybrid";
  return mode.toUpperCase();
}
async function deriveSchybridKey(noteId, clientSalt, pin) {
  if (!/^\d{4,6}$/u.test(pin)) throw new Error(t("vaultPinInvalid"));
  if (!state.account) throw new Error(t("error"));
  if (!window.hashwasm?.argon2id) throw new Error(t("vaultCryptoUnavailable"));
  const clientHash = await sha256Hex(
    [
      state.account.username.toLowerCase(),
      state.account.email.toLowerCase(),
      pin,
      noteId,
      clientSalt,
    ].join("\0"),
  );
  const { serverFactor } = await api("/api/vault/key-factor", {
    method: "POST",
    body: { noteId, clientSalt, clientHash },
  });
  const keyBytes = await window.hashwasm.argon2id({
    password: `${pin}\0${serverFactor}`,
    salt: base64ToBytes(clientSalt),
    parallelism: 1,
    iterations: 3,
    memorySize: 65536,
    hashLength: 32,
    outputType: "binary",
  });
  return crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}
function schybridAdditionalData(noteId) {
  return textEncoder.encode(
    `AstraConfidential SCHybrid v1\0${state.account.username.toLowerCase()}\0${noteId}`,
  );
}
async function encryptSchybridPayload(noteId, clientSalt, pin, payload) {
  const key = await deriveSchybridKey(noteId, clientSalt, pin);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        additionalData: schybridAdditionalData(noteId),
        tagLength: 128,
      },
      key,
      textEncoder.encode(JSON.stringify(payload)),
    ),
  );
  const tag = encrypted.slice(-16);
  const ciphertext = encrypted.slice(0, -16);
  return {
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(ciphertext),
    tag: bytesToBase64(tag),
  };
}
async function decryptSchybridPayload(note, pin) {
  try {
    const key = await deriveSchybridKey(note.id, note.clientSalt, pin);
    const ciphertext = base64ToBytes(note.encrypted.ciphertext);
    const tag = base64ToBytes(note.encrypted.tag);
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext);
    combined.set(tag, ciphertext.length);
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64ToBytes(note.encrypted.iv),
        additionalData: schybridAdditionalData(note.id),
        tagLength: 128,
      },
      key,
      combined,
    );
    const payload = JSON.parse(textDecoder.decode(decrypted));
    if (
      typeof payload.name !== "string" ||
      !payload.name.trim() ||
      payload.name.length > 80 ||
      typeof payload.content !== "string"
    )
      throw new Error("Invalid payload");
    return {
      name: payload.name.normalize("NFC").trim(),
      content: payload.content.normalize("NFC"),
    };
  } catch (error) {
    if (error.status === 429 || error.code === "vault_unavailable") throw error;
    throw new Error(t("vaultUnlockFailed"));
  }
}

function getStoredPreference(key) {
  try {
    return window.localStorage?.getItem(key) || null;
  } catch {
    return null;
  }
}
function setStoredPreference(key, value) {
  try {
    window.localStorage?.setItem(key, value);
  } catch {
    // The selected preference still applies for this page when storage is unavailable.
  }
}
function normalizeBrowserLanguage(value) {
  const language = String(value || "").toLowerCase().replaceAll("_", "-");
  if (language === "zh" || language.startsWith("zh-")) return "zh-Hant";
  if (language === "en" || language.startsWith("en-")) return "en";
  return null;
}
function preferredBrowserLanguage() {
  const candidates = [
    ...(Array.isArray(navigator.languages) ? navigator.languages : []),
    navigator.language,
  ];
  for (const candidate of candidates) {
    const language = normalizeBrowserLanguage(candidate);
    if (language) return language;
  }
  return null;
}

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
    setStoredPreference("astranote_language", state.language);
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
    modal({
      title: t("logoutTitle"),
      body: t("logoutBody"),
      confirm: t("logout"),
      danger: false,
      onConfirm: async (close) => {
        const result = await api("/api/logout", {
          method: "POST",
          body: {},
        });
        close();
        location.href = result.redirect;
      },
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
  showCancel = true,
  onConfirm,
  onCancel,
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
  if (showCancel) actions.append(cancelButton);
  actions.append(confirmButton);
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
  const cancelDialog = () => {
    close();
    onCancel?.();
  };
  cancelButton.onclick = cancelDialog;
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) cancelDialog();
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

function unlockSchybrid(note) {
  return new Promise((resolve, reject) => {
    const content = document.createElement("div");
    content.className = "vault-unlock";
    const label = document.createElement("label");
    label.textContent = t("vaultPin");
    const input = document.createElement("input");
    input.type = "password";
    input.inputMode = "numeric";
    input.autocomplete = "off";
    input.minLength = 4;
    input.maxLength = 6;
    input.pattern = "[0-9]{4,6}";
    const warning = document.createElement("p");
    warning.className = "field-help";
    warning.textContent = t("trustedDeviceOnly");
    content.append(label, input, warning);
    const dialog = modal({
      title: t("unlockVaultTitle"),
      body: t("unlockVaultBody"),
      content,
      confirm: t("unlock"),
      danger: false,
      onCancel: () => reject(Object.assign(new Error("cancelled"), { cancelled: true })),
      onConfirm: async (close) => {
        if (!/^\d{4,6}$/u.test(input.value))
          throw new Error(t("vaultPinInvalid"));
        const payload = await decryptSchybridPayload(note, input.value);
        const result = { payload, pin: input.value };
        input.value = "";
        close();
        resolve(result);
      },
    });
    requestAnimationFrame(() => input.focus());
    return dialog;
  });
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
  const result = modal({
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
  const focusTarget = extra?.querySelector("input, select, textarea");
  const restoreStart = () => {
    if (focusTarget) focusTarget.focus({ preventScroll: true });
    else result.dialog.focus({ preventScroll: true });
    result.dialog.scrollTop = 0;
  };
  result.dialog.tabIndex = -1;
  requestAnimationFrame(restoreStart);
  setTimeout(restoreStart, 250);
  return result;
}

function cookieBanner() {
  if (getStoredPreference("astranote_cookie_notice")) return;
  const banner = document.createElement("aside");
  banner.className = "cookie-banner";
  banner.innerHTML = `<h3><i class="fa-solid fa-cookie-bite"></i> <span data-i18n="cookieTitle"></span></h3><p class="muted" data-i18n="cookieBody"></p><button class="btn btn-primary"><i class="fa-solid fa-check"></i><span data-i18n="accept"></span></button>`;
  document.body.append(banner);
  applyLocale();
  $("button", banner).onclick = () => {
    setStoredPreference("astranote_cookie_notice", "accepted");
    banner.remove();
  };
}

function noteRow(note, deletable = false) {
  const row = document.createElement("article");
  row.className = "note-row";
  row.tabIndex = 0;
  row.setAttribute("role", "link");
  const visibleName = note.name || t("confidentialNote");
  row.setAttribute("aria-label", `${t("open")}: ${visibleName}`);
  const destination = `/notes/${note.id}`;
  const openNote = (event) => {
    if (event.type === "click" && event.target.closest("button, a")) return;
    if (event.type === "keydown" && !["Enter", " "].includes(event.key)) return;
    if (event.type === "keydown") event.preventDefault();
    location.href = destination;
  };
  row.addEventListener("click", openNote);
  row.addEventListener("keydown", openNote);
  const main = document.createElement("div");
  main.className = "note-main";
  const name = document.createElement("strong");
  name.textContent = visibleName;
  const tag = document.createElement("small");
  tag.textContent = encryptionLabel(note.encryption);
  main.append(name, tag);
  const chars = document.createElement("span");
  chars.className = "note-meta note-characters";
  chars.textContent =
    note.characters === null
      ? t("hiddenCharacters")
      : `${note.characters.toLocaleString()} ${t("characters")}`;
  const size = document.createElement("span");
  size.className = "note-meta note-size";
  size.textContent = formatBytes(note.bytes);
  row.append(main, chars, size);
  if (deletable) {
    const del = document.createElement("button");
    del.className = "btn btn-danger icon-btn";
    del.type = "button";
    del.setAttribute("aria-label", t("delete"));
    del.innerHTML = '<i class="fa-solid fa-trash"></i>';
    del.onclick = (event) => {
      event.stopPropagation();
      deleteNote(note);
    };
    row.append(del);
  } else {
    const open = document.createElement("span");
    open.className = "note-open";
    open.setAttribute("aria-hidden", "true");
    open.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
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
  if (state.session?.authenticated) {
    const primary = $("#hero-primary");
    if (primary) {
      primary.href = "/dashboard";
      $("i", primary).className = "fa-solid fa-chart-line";
      $("span", primary).dataset.i18n = "dashboard";
    }
  }
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
    const storedLanguage = getStoredPreference("astranote_language");
    if (storedLanguage || kind === "register")
      data.language = storedLanguage || state.language;
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
  const account = await requireAccount();
  if (!account) return;
  const form = $("#note-form");
  const encryption = form.encryption;
  const vaultFields = $("#vault-fields");
  const vaultOption = encryption.querySelector(`[value="${SCHYBRID_MODE}"]`);
  if (!account.vaultAvailable) vaultOption.disabled = true;
  const updateEncryptionFields = () => {
    const enabled = encryption.value === SCHYBRID_MODE;
    vaultFields.hidden = !enabled;
    form.vaultPin.required = enabled;
    form.vaultPinConfirmation.required = enabled;
  };
  encryption.addEventListener("change", updateEncryptionFields);
  updateEncryptionFields();
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
      const mode = encryption.value;
      const body = {
        name: form.name.value,
        encryption: mode,
        captcha: state.captcha,
      };
      if (mode === SCHYBRID_MODE) {
        if (!account.vaultAvailable) throw new Error(t("vaultUnavailable"));
        const normalizedName = form.name.value.normalize("NFC").trim();
        if (!normalizedName) throw new Error(t("noteNameRequired"));
        const pin = form.vaultPin.value;
        if (!/^\d{4,6}$/u.test(pin)) throw new Error(t("vaultPinInvalid"));
        if (pin !== form.vaultPinConfirmation.value)
          throw new Error(t("vaultPinMismatch"));
        const id = randomHex(12);
        const clientSalt = randomBase64Url(32);
        body.id = id;
        body.clientSalt = clientSalt;
        body.encrypted = await encryptSchybridPayload(id, clientSalt, pin, {
          name: normalizedName,
          content: "",
        });
        delete body.name;
      }
      const result = await api("/api/notes", {
        method: "POST",
        body,
      });
      form.vaultPin.value = "";
      form.vaultPinConfirmation.value = "";
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
  if (note.encryption === SCHYBRID_MODE) {
    try {
      const unlocked = await unlockSchybrid(note);
      note.name = unlocked.payload.name;
      note.content = unlocked.payload.content;
      note.characters = Array.from(note.content).filter(
        (character) => !/\s/u.test(character),
      ).length;
    } catch (error) {
      if (error.cancelled) location.href = "/notes";
      return;
    }
  }
  const noteName = $("#note-name");
  noteName.removeAttribute("data-i18n");
  noteName.textContent = note.name;
  $("#note-content").textContent = note.content;
  $("#note-encryption").textContent = encryptionLabel(note.encryption);
  $("#note-characters").textContent =
    `${note.characters.toLocaleString()} ${t("characters")}`;
  $("#note-size").textContent = formatBytes(note.bytes);
  $("#note-updated").textContent = formatUtc(note.updatedAt);
  $("#edit-note").href = `/notes/${note.id}/edit`;
  $("#delete-note").onclick = () => deleteNote(note);
  const shareToggle = $("#share-note");
  const shareRow = $("#share-url-row");
  const shareInput = $("#share-url");
  const showShareUrl = (url) => {
    shareInput.value = url ? new URL(url, location.origin).href : "";
    shareRow.hidden = !url;
  };
  if (note.encryption === SCHYBRID_MODE) {
    shareToggle.closest(".share-toggle").hidden = true;
    $("#share-unavailable").hidden = false;
  }
  shareToggle.checked = note.shared;
  shareToggle.setAttribute("aria-label", t("share"));
  showShareUrl(note.shareUrl);
  $("#copy-share-url").onclick = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(shareInput.value);
    } catch {
      shareInput.focus();
      shareInput.select();
      if (!document.execCommand("copy")) {
        toast(t("error"));
        return;
      }
      shareInput.setSelectionRange(0, 0);
    }
    toast(t("copied"));
  };
  shareToggle.onchange = async () => {
    const enabled = shareToggle.checked;
    shareToggle.disabled = true;
    try {
      const result = await api(`/api/notes/${note.id}/share`, {
        method: "POST",
        body: { enabled },
      });
      note.shared = result.shared;
      note.shareUrl = result.url;
      shareToggle.checked = result.shared;
      showShareUrl(result.url);
    } catch (error) {
      shareToggle.checked = !enabled;
      toast(error.message);
    } finally {
      shareToggle.disabled = false;
    }
  };
}

async function initEditor() {
  if (!(await requireAccount())) return;
  const note = await api(`/api/notes/${currentNoteId()}`);
  let vaultPin = null;
  if (note.encryption === SCHYBRID_MODE) {
    try {
      const unlocked = await unlockSchybrid(note);
      note.name = unlocked.payload.name;
      note.content = unlocked.payload.content;
      vaultPin = unlocked.pin;
    } catch (error) {
      if (error.cancelled) location.href = `/notes/${note.id}`;
      return;
    }
  }
  const name = $("#editor-name");
  const content = $("#editor-content");
  name.value = note.name;
  content.value = note.content;
  $("#editor-encryption").textContent = encryptionLabel(note.encryption);
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
  $("#save-note").onclick = async () => {
    const button = $("#save-note");
    button.disabled = true;
    try {
      const body = { name: name.value, content: content.value };
      if (note.encryption === SCHYBRID_MODE) {
        const normalizedName = name.value.normalize("NFC").trim();
        if (!normalizedName) throw new Error(t("noteNameRequired"));
        body.encrypted = await encryptSchybridPayload(
          note.id,
          note.clientSalt,
          vaultPin,
          {
            name: normalizedName,
            content: content.value.normalize("NFC"),
          },
        );
        delete body.name;
        delete body.content;
      }
      const result = await api(`/api/notes/${note.id}`, {
        method: "PUT",
        body,
      });
      saved = true;
      dirty = false;
      location.href = result.redirect;
    } catch (error) {
      toast(error.message);
      button.disabled = false;
    }
  };
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
  form.theme.value = account.settings.theme || state.theme;
  form.language.value = account.settings.language || state.language;
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
    setStoredPreference("astranote_theme", state.theme);
    setStoredPreference("astranote_language", state.language);
    applyLocale();
    toast(t("saved"));
  });
  $("#logout-wide").onclick = () =>
    modal({
      title: t("logoutTitle"),
      body: t("logoutBody"),
      confirm: t("logout"),
      danger: false,
      onConfirm: async (close) => {
        const result = await api("/api/logout", {
          method: "POST",
          body: {},
        });
        close();
        location.href = result.redirect;
      },
    });
  $("#delete-account").onclick = () => {
    const extra = document.createElement("div");
    extra.className = "modal-form-stack";
    const usernameGroup = document.createElement("div");
    usernameGroup.className = "form-group";
    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = t("confirmUsername");
    const usernameInput = document.createElement("input");
    usernameInput.autocomplete = "off";
    usernameInput.placeholder = account.username;
    usernameGroup.append(usernameLabel, usernameInput);
    const passwordGroup = document.createElement("div");
    passwordGroup.className = "form-group";
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = t("confirmCurrentPassword");
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.autocomplete = "current-password";
    passwordGroup.append(passwordLabel, passwordInput);
    extra.append(usernameGroup, passwordGroup);
    actionModal({
      title: t("deleteAccountTitle"),
      body: t("deleteAccountBody"),
      confirm: t("requestDeletion"),
      extra,
      run: () =>
        api("/api/account/delete", {
          method: "POST",
          body: {
            username: usernameInput.value,
            password: passwordInput.value,
            captcha: state.actionCaptcha,
          },
        }),
    });
  };
}

async function initShared() {
  const token = location.pathname.split("/").filter(Boolean)[1];
  try {
    const note = await api(`/api/shared/${encodeURIComponent(token)}`);
    const sharedName = $("#shared-name");
    sharedName.removeAttribute("data-i18n");
    sharedName.textContent = note.name;
    $("#shared-content").textContent = note.content;
    $("#shared-author").textContent =
      `${t("by")} ${note.author} · ${note.email}`;
    $("#shared-encryption").textContent = encryptionLabel(note.encryption);
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
  const storedLanguage = getStoredPreference("astranote_language");
  const browserLanguage = preferredBrowserLanguage();
  state.language = storedLanguage || browserLanguage || "en";
  state.theme = getStoredPreference("astranote_theme") || "dark";
  state.session = await api("/api/session").catch(() => ({
    authenticated: false,
  }));
  if (state.session.authenticated) {
    state.account = await api("/api/account").catch(() => null);
    if (state.account) {
      state.language =
        storedLanguage ||
        state.account.settings.language ||
        browserLanguage ||
        state.session.preferredLanguage ||
        "en";
      if (!storedLanguage)
        setStoredPreference("astranote_language", state.language);
      state.theme = state.account.settings.theme || state.theme;
    }
  } else {
    state.language =
      storedLanguage ||
      browserLanguage ||
      state.session.preferredLanguage ||
      "en";
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
  if (["login", "register", "new-note"].includes(page)) {
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 800);
  }
}

boot().catch((error) => {
  console.error(error);
  toast(t("error"));
});
