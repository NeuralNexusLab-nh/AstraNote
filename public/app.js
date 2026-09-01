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
      "A free, convenient notebook with powerful encryption when your notes need stronger protection.",
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
    secureTitle: "Powerful encryption when you need it",
    secureBody:
      "Choose server-managed AES or browser-side AstraConfidential protection for sensitive notes.",
    shareTitle: "Share on your terms",
    shareBody:
      "Create a private-looking, unguessable read-only link, then revoke it whenever you choose.",
    limitEyebrow: "CLEAR BY DESIGN",
    limitTitle: "Small footprint. Deliberate limits.",
    limitBody:
      "Each account includes 200 KiB across all account files and up to 20 notes. Encrypted notes commonly use about 1.4× the storage; very short notes may use more than 2×.",
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
    legalUpdated: "Effective and last updated: 1 September 2026",
    termsUpdated: "Effective and last updated: 1 September 2026",
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
    heroLead: "免費、方便的線上筆記本，也為重要內容提供強大的加密保護。",
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
    secureTitle: "需要時，使用強大加密",
    secureBody:
      "敏感筆記可選擇伺服器管理的 AES，或由瀏覽器端加密的 AstraConfidential。",
    shareTitle: "由你掌控分享",
    shareBody: "建立難以猜測的唯讀連結，並隨時撤銷公開存取。",
    limitEyebrow: "清楚而有節制",
    limitTitle: "輕量空間，明確限制。",
    limitBody:
      "每個帳號的所有檔案合計 200 KiB，最多 20 篇筆記。加密筆記通常約需 1.4 倍空間；很短的筆記可能超過 2 倍。",
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
    legalUpdated: "生效及最後更新：2026 年 9 月 1 日",
    termsUpdated: "生效及最後更新：2026 年 9 月 1 日",
    englishOnlyCaptcha: "請完成人類驗證以儲存筆記。",
    editorUnsaved: "尚有未儲存的變更，仍要關閉這個頁面嗎？",
  },
};

Object.assign(I18N.en, {
  heroKicker: "ONLINE NOTEBOOK · FREE TO USE",
  tagline: "Write it down. Find it whenever you need it.",
  heroLead:
    "AstraNote is a free, convenient online notebook with powerful encryption available for the notes that matter most.",
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
    "AstraNote keeps writing simple and free while giving sensitive notes stronger protection when you choose it. Each account includes up to 20 notes and 200 KiB of storage, with no advertising or analytics tracking.",
  quickTitle: "Capture it right away",
  quickBody:
    "Write down an idea, a reminder, a list, or a useful piece of information before it slips away.",
  secureTitle: "Strong encryption is ready",
  secureBody:
    "Protect sensitive notes with AES or AstraConfidential browser-side encryption whenever you choose.",
  shareTitle: "Free to use",
  shareBody:
    "Create up to 20 notes with 200 KiB of account storage, with no advertising or analytics tracking.",
  limitEyebrow: "SIMPLE, HONEST LIMITS",
  limitTitle: "Enough room for the notes you reach for most.",
  limitBody:
    "Every account includes 200 KiB across all account files and up to 20 notes. If the account is full, existing notes remain readable, but new notes and saves are paused until space is freed.",
  encryptionEyebrow: "CHOOSE YOUR PROTECTION",
  encryptionTitle: "Four protection levels, explained clearly.",
  encryptionIntro:
    "No encryption stores readable content. AES-128-GCM and AES-256-GCM are encrypted automatically by the AstraNote server. AstraConfidential encrypts in your browser before upload and adds a PIN known only to you.",
  encryptionTitleNoticeTitle: "Note titles are never encrypted",
  encryptionTitleNoticeBody:
    "Titles remain readable so AstraNote can show them in your note list. Never put a secret in a title.",
  encryptionTableLabel: "Comparison of AstraNote encryption modes",
  encryptionModeColumn: "Mode",
  encryptionEncryptedColumn: "Content encrypted",
  encryptionClientColumn: "Browser-side encryption",
  encryptionPinColumn: "PIN protection",
  encryptionSharingColumn: "Sharing",
  encryptionExposureColumn: "What must an attacker obtain to recover plaintext?",
  encryptionSecurityColumn: "Security",
  encryptionYes: "Yes",
  encryptionNo: "No",
  encryptionNoPin: "No PIN",
  encryptionUserHeldPin: "User-held PIN",
  encryptionNoneName: "No encryption",
  encryptionNoneExposure: "The note file alone",
  encryptionNoneSecurity: "None",
  encryptionAesExposure:
    "Note file + the server encryption key, or control of the running server",
  encryptionAes128Security: "Strong",
  encryptionAes256Security: "Very strong",
  encryptionSchybridExposure:
    "Even with all server data, plaintext is not directly available. The attacker must still guess or obtain the PIN, or control a device while the PIN is entered or the note is unlocked.",
  encryptionSchybridSecurity: "Highest level",
  encryptionSchybridTitle: "AstraConfidential features",
  encryptionSchybridStepOneTitle: "The PIN stays with you",
  encryptionSchybridStepOneBody:
    "The PIN is used in your browser to unlock the note. AstraNote does not store the PIN itself and cannot recover it.",
  encryptionSchybridStepTwoTitle: "Several protections work together",
  encryptionSchybridStepTwoBody:
    "Your account, note, PIN, and AstraNote's server-side protection create a note-specific key. Stealing only one part is not enough.",
  encryptionSchybridStepThreeTitle: "Browser encrypts before upload",
  encryptionSchybridStepThreeBody:
    "The note content is encrypted on your device first. The server receives and stores only encrypted content.",
  encryptionSchybridCaution:
    "Stolen server data does not directly reveal the plaintext without the PIN or control of a device while the note is unlocked. Short or predictable PINs are easier to guess, so use a unique, randomly generated 12–16 character PIN and only trusted devices.",
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
  accountLimitCaption: "20 NOTES · FREE ACCOUNT · NO ADS",
  maxNotesLabel: "MAX 20",
  legalEyebrow: "LEGAL",
  privacyEyebrow: "DATA PRACTICES",
  notFoundEyebrow: "PAGE NOT FOUND",
  notFoundBody: "The page you requested could not be found.",
  noEncryptionOption: "No encryption",
  vaultPin: "Vault PIN (4–16 ASCII characters)",
  legacyVaultPin: "Vault PIN (4–6 digits)",
  confirmVaultPin: "Confirm Vault PIN",
  vaultTitle: "AstraConfidential",
  vaultExplanation:
    "Your device combines your account details and Vault PIN with a temporary factor protected by AstraNote's independent server secret. The note content is encrypted on this device before upload; the title remains visible so you can identify the note in your list.",
  vaultPinWarning:
    "AstraNote does not store or recover this case-sensitive PIN. Use 12–16 random letters, numbers, and symbols when possible, save it securely, and enter it only on a device you trust.",
  vaultNoSharing:
    "Sharing is unavailable because this encryption is bound to the owner's account, PIN, and AstraNote's server-side protection.",
  vaultPinInvalid:
    "Enter 4–16 case-sensitive ASCII letters, numbers, or symbols with no spaces.",
  legacyVaultPinInvalid: "Enter the original 4–6 digit Vault PIN.",
  noteNameRequired: "Note name is required.",
  vaultPinMismatch: "The Vault PIN entries do not match.",
  vaultCryptoUnavailable:
    "Secure browser encryption is unavailable on this device.",
  vaultUnavailable:
    "AstraConfidential is not configured on this server.",
  unlockVaultTitle: "Unlock AstraConfidential note",
  unlockNamedNote: "Unlock {name}",
  unlockVaultBody:
    "Enter this note's 4–16 character, case-sensitive Vault PIN. AstraNote does not store or recover it.",
  unlockLegacyVaultBody:
    "Enter this legacy note's original 4–6 digit Vault PIN. AstraNote does not store or recover it.",
  unlock: "Unlock",
  trustedDeviceOnly: "Only enter this PIN on a device you trust.",
  vaultUnlockFailed: "The Vault PIN is incorrect or the encrypted note is damaged.",
  confidentialNote: "AstraConfidential encrypted note",
  hiddenCharacters: "Hidden until unlocked",
  vaultSharingUnavailable:
    "Sharing is unavailable for AstraConfidential notes because their encryption is bound to the owner's account and Vault PIN.",
  dangerBody:
    "Permanently delete your account and all of its notes immediately. This cannot be cancelled or undone.",
  requestDeletion: "Permanently delete account",
  deleteAccountTitle: "Permanently delete this account?",
  deleteAccountBody:
    "Enter your exact username and current password, then complete the human verification. The account, notes, sessions, and sharing links will be removed immediately and cannot be restored.",
  confirmCurrentPassword: "Confirm current password",
  donateNav: "DONATE",
  donatePageLabel: "DONATE",
  donateTitle: "Support AstraNote",
  donateDescription:
    "If AstraNote is useful to you, you can support its continued development with Bitcoin.",
  donateBitcoinLabel: "Bitcoin",
  donateAddressLabel: "Bitcoin Address",
  donateCopyLabel: "Copy Bitcoin address",
  donateCopy: "Copy",
  donateCopied: "Copied",
  donateWallet: "Open in Bitcoin wallet",
  donateNetwork: "Bitcoin network only",
  donateQrLabel: "Bitcoin donation QR code for AstraNote",
  donateNetworkAria: "Bitcoin mainnet",
  donateSeoTitle: "Support AstraNote — Bitcoin donation",
  skipContent: "Skip to content",
  primaryNavigation: "Primary navigation",
  menu: "Menu",
  languageSelector: "Language",
});

Object.assign(I18N["zh-Hant"], {
  heroKicker: "線上筆記本 · 免費使用",
  tagline: "隨手記下，需要時隨時找得到。",
  heroLead:
    "AstraNote 是一個免費、方便的線上筆記本，也為最重要的筆記提供強大的加密保護。",
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
    "AstraNote 保持簡單、清楚且免費，同時讓敏感筆記在需要時獲得更強的保護。每個帳號提供最多 20 篇筆記與 200 KiB 儲存空間，沒有廣告，也不使用分析追蹤。",
  quickTitle: "想到就能立刻記下",
  quickBody: "不論是靈感、提醒、清單或常用資料，都能在忘記以前迅速保存。",
  secureTitle: "強大加密，隨時可選",
  secureBody:
    "敏感筆記可使用 AES，或選擇由瀏覽器端先加密的 AstraConfidential。",
  shareTitle: "免費使用",
  shareBody: "每個帳號可建立 20 篇筆記，享有 200 KiB 空間，沒有廣告與分析追蹤。",
  limitEyebrow: "簡單而透明的限制",
  limitTitle: "為最常用的筆記保留剛好的空間。",
  limitBody:
    "每個帳號的所有檔案合計 200 KiB，最多 20 篇筆記。空間用滿後仍可閱讀既有內容，但必須先釋放空間才能新增或儲存。",
  encryptionEyebrow: "選擇適合的保護方式",
  encryptionTitle: "四種保護層級，一眼看懂差異。",
  encryptionIntro:
    "不加密會直接儲存可讀內容；AES-128-GCM 與 AES-256-GCM 由 AstraNote 伺服器自動加密；AstraConfidential 則在上傳前由瀏覽器端加密，並加入只有使用者掌握的 Vault PIN。",
  encryptionTitleNoticeTitle: "所有模式的筆記標題都不會加密",
  encryptionTitleNoticeBody:
    "標題會保持可讀，才能顯示在筆記清單中。請勿把機密資訊寫進標題。",
  encryptionTableLabel: "AstraNote 加密方式比較",
  encryptionModeColumn: "方式",
  encryptionEncryptedColumn: "內容加密",
  encryptionClientColumn: "瀏覽器端加密",
  encryptionPinColumn: "PIN 保護",
  encryptionSharingColumn: "分享",
  encryptionExposureColumn: "駭客還需取得什麼才能還原明文？",
  encryptionSecurityColumn: "安全性",
  encryptionYes: "是",
  encryptionNo: "否",
  encryptionNoPin: "沒有 PIN",
  encryptionUserHeldPin: "使用者掌握",
  encryptionNoneName: "不加密",
  encryptionNoneExposure: "只需筆記檔案",
  encryptionNoneSecurity: "無",
  encryptionAesExposure:
    "筆記檔案 + 伺服器端加密金鑰，或控制運作中的伺服器",
  encryptionAes128Security: "強",
  encryptionAes256Security: "很強",
  encryptionSchybridExposure:
    "即使取得所有伺服器資料，也不能直接看到明文；仍須猜中或取得 PIN，或控制正在輸入 PIN／已解鎖筆記的裝置。",
  encryptionSchybridSecurity: "最高層級",
  encryptionSchybridTitle: "AstraConfidential 的特點",
  encryptionSchybridStepOneTitle: "PIN 由你掌握",
  encryptionSchybridStepOneBody:
    "PIN 只在瀏覽器中用來解鎖筆記；AstraNote 不會保存 PIN 本身，也無法協助找回。",
  encryptionSchybridStepTwoTitle: "多道保護共同作用",
  encryptionSchybridStepTwoBody:
    "帳號、筆記、PIN 與 AstraNote 的伺服器端保護共同產生每篇筆記的專屬密鑰；只竊取其中一部分並不足夠。",
  encryptionSchybridStepThreeTitle: "上傳前由瀏覽器加密",
  encryptionSchybridStepThreeBody:
    "筆記內容會先在你的裝置完成加密，伺服器只接收並保存加密後的內容。",
  encryptionSchybridCaution:
    "伺服器資料遭竊時，攻擊者仍無法在沒有 PIN 或未控制解鎖中裝置的情況下直接看到明文。簡短或可預測的 PIN 較容易被猜中，請使用不重複、隨機產生的 12–16 字元 PIN，並只在信任的裝置輸入。",
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
  accountLimitCaption: "20 篇筆記 · 免費帳號 · 無廣告",
  maxNotesLabel: "上限 20",
  legalEyebrow: "法律文件",
  privacyEyebrow: "資料處理方式",
  notFoundEyebrow: "找不到頁面",
  notFoundBody: "找不到你所要求的頁面。",
  noEncryptionOption: "不加密",
  vaultPin: "Vault PIN（4–16 個 ASCII 字元）",
  legacyVaultPin: "Vault PIN（原有 4–6 位數）",
  confirmVaultPin: "再次輸入 Vault PIN",
  vaultTitle: "AstraConfidential",
  vaultExplanation:
    "你的裝置會將帳號資料與 Vault PIN，結合由 AstraNote 獨立伺服器祕密保護的臨時因子。筆記內容會先在此裝置完成加密，再上傳至 AstraNote；標題保持可見，方便你在清單中辨認筆記。",
  vaultPinWarning:
    "AstraNote 不會儲存或協助找回這組區分大小寫的 PIN。建議使用隨機產生的 12–16 個英文字母、數字與符號，妥善保存，並只在信任的裝置輸入。",
  vaultNoSharing:
    "此加密方式與擁有者帳號、PIN 及 AstraNote 的伺服器端保護綁定，因此不提供分享功能。",
  vaultPinInvalid:
    "請輸入 4–16 個區分大小寫的 ASCII 英文字母、數字或符號，不可包含空格。",
  legacyVaultPinInvalid: "請輸入這篇舊版筆記原有的 4–6 位數 Vault PIN。",
  noteNameRequired: "請輸入筆記名稱。",
  vaultPinMismatch: "兩次輸入的 Vault PIN 不相同。",
  vaultCryptoUnavailable: "此裝置無法使用安全的瀏覽器加密功能。",
  vaultUnavailable: "伺服器尚未設定 AstraConfidential。",
  unlockVaultTitle: "解鎖 AstraConfidential 筆記",
  unlockNamedNote: "解鎖{name}",
  unlockVaultBody:
    "請輸入這篇筆記區分大小寫的 4–16 字元 Vault PIN。AstraNote 不會儲存或協助找回這組 PIN。",
  unlockLegacyVaultBody:
    "請輸入這篇舊版筆記原有的 4–6 位數 Vault PIN。AstraNote 不會儲存或協助找回這組 PIN。",
  unlock: "解鎖",
  trustedDeviceOnly: "請只在你信任的裝置上輸入這組 PIN。",
  vaultUnlockFailed: "Vault PIN 不正確，或加密筆記已損壞。",
  confidentialNote: "AstraConfidential 加密筆記",
  hiddenCharacters: "解鎖後顯示",
  vaultSharingUnavailable:
    "此筆記的加密與擁有者帳號及 Vault PIN 綁定，\n因此 AstraConfidential 不提供分享功能。",
  dangerBody: "立即永久刪除帳號及所有筆記；此操作不能取消或復原。",
  requestDeletion: "永久刪除帳號",
  deleteAccountTitle: "要永久刪除這個帳號嗎？",
  deleteAccountBody:
    "輸入完整 Username 與目前密碼，再完成人類驗證。帳號、筆記、登入階段與分享連結將立即移除，且無法復原。",
  confirmCurrentPassword: "確認目前密碼",
  donateNav: "贊助",
  donatePageLabel: "贊助",
  donateTitle: "贊助 AstraNote",
  donateDescription:
    "如果 AstraNote 對你有幫助，你可以透過 Bitcoin 贊助我們持續開發。",
  donateBitcoinLabel: "Bitcoin",
  donateAddressLabel: "Bitcoin 地址",
  donateCopyLabel: "複製 Bitcoin 地址",
  donateCopy: "複製",
  donateCopied: "已複製",
  donateWallet: "在 Bitcoin 錢包中開啟",
  donateNetwork: "僅限 Bitcoin 網路",
  donateQrLabel: "AstraNote Bitcoin 贊助 QR Code",
  donateNetworkAria: "Bitcoin 主網",
  donateSeoTitle: "贊助 AstraNote — Bitcoin 贊助",
  skipContent: "跳至主要內容",
  primaryNavigation: "主要導覽",
  menu: "選單",
  languageSelector: "語言",
});

I18N.ja = {
  home: "ホーム",
  dashboard: "ダッシュボード",
  notes: "マイノート",
  settings: "設定",
  login: "ログイン",
  register: "アカウント作成",
  logout: "ログアウト",
  copyright: "© 2026 NeuralNexusLab. サービスに関するすべての権利を留保します。",
  terms: "利用規約",
  privacy: "プライバシー",
  legalUpdated: "発効・最終更新：2026年9月1日",
  termsUpdated: "発効・最終更新：2026年9月1日",
  source: "ソースコード",
  cookieTitle: "必須 Cookie",
  cookieBody:
    "AstraNote は、ログイン、セキュリティ、言語、表示設定に必要な Cookie のみを使用します。広告やアクセス解析のトラッカーは使用しません。",
  accept: "同意して続行",
  logoutTitle: "ログアウトしますか？",
  logoutBody: "現在のログインセッションを終了します。",
  error: "問題が発生しました。もう一度お試しください。",
  donateNav: "寄付",
  donatePageLabel: "寄付",
  donateTitle: "AstraNote に寄付",
  donateDescription:
    "AstraNote が役に立った場合、Bitcoin で継続的な開発を支援できます。",
  donateBitcoinLabel: "Bitcoin",
  donateAddressLabel: "Bitcoin アドレス",
  donateCopyLabel: "Bitcoin アドレスをコピー",
  donateCopy: "コピー",
  donateCopied: "コピーしました",
  donateWallet: "Bitcoin ウォレットで開く",
  donateNetwork: "Bitcoin ネットワークのみ",
  donateQrLabel: "AstraNote Bitcoin 寄付用 QR コード",
  donateNetworkAria: "Bitcoin メインネット",
  donateSeoTitle: "AstraNote に寄付 — Bitcoin 寄付",
  encryptionEyebrow: "保護方法を選択",
  encryptionTitle: "4 つの保護レベルを明確に比較。",
  encryptionIntro:
    "暗号化なしは読める状態で保存されます。AES-128-GCM と AES-256-GCM は AstraNote サーバーが自動暗号化します。AstraConfidential はアップロード前にブラウザで暗号化し、利用者だけが知る Vault PIN を追加します。",
  encryptionTitleNoticeTitle: "どの方式でもノートのタイトルは暗号化されません",
  encryptionTitleNoticeBody:
    "一覧に表示するため、タイトルは読み取り可能な状態です。機密情報をタイトルに書かないでください。",
  encryptionTableLabel: "AstraNote の暗号化方式の比較",
  encryptionModeColumn: "方式",
  encryptionEncryptedColumn: "内容を暗号化",
  encryptionClientColumn: "ブラウザ側で暗号化",
  encryptionPinColumn: "PIN 保護",
  encryptionSharingColumn: "共有",
  encryptionExposureColumn: "平文の復元に攻撃者がさらに必要なものは？",
  encryptionSecurityColumn: "安全性",
  encryptionYes: "はい",
  encryptionNo: "いいえ",
  encryptionNoPin: "PIN なし",
  encryptionUserHeldPin: "利用者が保持",
  encryptionNoneName: "暗号化なし",
  encryptionNoneExposure: "ノートファイルのみ",
  encryptionNoneSecurity: "なし",
  encryptionAesExposure:
    "ノートファイル + サーバー側の暗号鍵、または稼働サーバーの制御",
  encryptionAes128Security: "強い",
  encryptionAes256Security: "非常に強い",
  encryptionSchybridExposure:
    "すべてのサーバーデータを取得しても平文は直接読めません。PIN を推測・入手するか、PIN 入力中または解錠済みの端末を制御する必要があります。",
  encryptionSchybridSecurity: "最高レベル",
  encryptionSchybridTitle: "AstraConfidential の特長",
  encryptionSchybridStepOneTitle: "PIN は利用者が保持",
  encryptionSchybridStepOneBody:
    "PIN はブラウザでノートを解錠するためだけに使われます。AstraNote は PIN 自体を保存せず、復元もできません。",
  encryptionSchybridStepTwoTitle: "複数の保護を組み合わせる",
  encryptionSchybridStepTwoBody:
    "アカウント、ノート、PIN、AstraNote のサーバー側保護からノート専用鍵を作ります。一部分だけ盗んでも十分ではありません。",
  encryptionSchybridStepThreeTitle: "アップロード前に暗号化",
  encryptionSchybridStepThreeBody:
    "ノート内容は端末上で先に暗号化され、サーバーは暗号化済みの内容だけを受信・保存します。",
  encryptionSchybridCaution:
    "サーバーデータが盗まれても、PIN または解錠中の端末を制御しない限り、平文は直接表示されません。短く予測しやすい PIN は推測されやすいため、固有でランダムな 12～16 文字の PIN を信頼できる端末でのみ使用してください。",
  vaultPin: "Vault PIN（4～16 文字の ASCII）",
  legacyVaultPin: "Vault PIN（従来の4～6桁）",
  confirmVaultPin: "Vault PIN を再入力",
  vaultTitle: "AstraConfidential",
  vaultExplanation:
    "端末はアカウント情報と Vault PIN を AstraNote のサーバー側保護と組み合わせます。ノート内容はアップロード前にこの端末で暗号化され、タイトルは一覧表示のため読み取り可能なままです。",
  vaultPinWarning:
    "AstraNote は大文字と小文字を区別する PIN を保存・復元しません。可能であればランダムな12～16文字の英字、数字、記号を使い、安全に保管してください。",
  vaultNoSharing:
    "この暗号化は所有者のアカウント、PIN、AstraNote のサーバー側保護に結び付くため、共有できません。",
  vaultPinInvalid:
    "空白を含まない4～16文字の ASCII 英字、数字、記号を入力してください。",
  legacyVaultPinInvalid: "従来の4～6桁の Vault PIN を入力してください。",
  vaultPinMismatch: "Vault PIN が一致しません。",
  vaultCryptoUnavailable: "この端末では安全なブラウザ暗号化を使用できません。",
  vaultUnavailable: "サーバーに AstraConfidential が設定されていません。",
  unlockNamedNote: "{name} を解錠",
  unlockVaultBody:
    "このノートの大文字と小文字を区別する4～16文字の Vault PIN を入力してください。AstraNote は PIN を保存・復元しません。",
  unlockLegacyVaultBody:
    "この従来ノートで使用していた4～6桁の Vault PIN を入力してください。AstraNote は PIN を保存・復元しません。",
  unlock: "解錠",
  trustedDeviceOnly: "この PIN は信頼できる端末でのみ入力してください。",
  vaultUnlockFailed: "Vault PIN が違うか、暗号化ノートが破損しています。",
  confidentialNote: "AstraConfidential 暗号化ノート",
  hiddenCharacters: "解錠後に表示",
  vaultSharingUnavailable:
    "このノートの暗号化は所有者のアカウントと Vault PIN に結び付いているため、\nAstraConfidential では共有できません。",
  skipContent: "メインコンテンツへ移動",
  primaryNavigation: "メインナビゲーション",
  menu: "メニュー",
  languageSelector: "言語",
};

const state = {
  session: null,
  account: null,
  captcha: null,
  actionCaptcha: null,
  language: "en",
  theme: "dark",
};
const LEGACY_SCHYBRID_MODE = "astra-confidential-schybrid-v1";
const CONFIDENTIAL_MODE = "astra-confidential-v2";
const CURRENT_AES_MODES = new Map([
  ["aes-128-gcm-new", "AES-128-GCM"],
  ["aes-256-gcm-new", "AES-256-GCM"],
]);
const BITCOIN_ADDRESS = "bc1qazdfwsgju2e9c6nje63nwkx6n9mnfgzu37tlu6";
const BITCOIN_URI = `bitcoin:${BITCOIN_ADDRESS}`;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const page = document.body.dataset.page || "";
const t = (key) => I18N[state.language]?.[key] || I18N.en[key] || key;
const formatBytes = (bytes) => `${(Number(bytes || 0) / 1024).toFixed(2)} KiB`;
const formatUtc = (value) =>
  new Intl.DateTimeFormat(
    state.language === "zh-Hant"
      ? "zh-TW"
      : state.language === "ja"
        ? "ja-JP"
        : "en",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    },
  ).format(new Date(value)) + " UTC";

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
  if (mode === LEGACY_SCHYBRID_MODE) return "AstraConfidential SCHybrid";
  if (mode === CONFIDENTIAL_MODE) return "AstraConfidential";
  if (CURRENT_AES_MODES.has(mode)) return CURRENT_AES_MODES.get(mode);
  return mode.toUpperCase();
}
function isClientEncryptedMode(mode) {
  return mode === LEGACY_SCHYBRID_MODE || mode === CONFIDENTIAL_MODE;
}
function validVaultPin(pin, mode) {
  return mode === LEGACY_SCHYBRID_MODE
    ? /^\d{4,6}$/u.test(pin)
    : /^[\x21-\x7e]{4,16}$/u.test(pin);
}
function vaultPinError(mode) {
  return mode === LEGACY_SCHYBRID_MODE
    ? t("legacyVaultPinInvalid")
    : t("vaultPinInvalid");
}
async function deriveConfidentialKey(noteId, clientSalt, pin, mode) {
  if (!validVaultPin(pin, mode)) throw new Error(vaultPinError(mode));
  if (!state.account) throw new Error(t("error"));
  if (!window.hashwasm?.argon2id) throw new Error(t("vaultCryptoUnavailable"));
  const clientParts = [
    state.account.username.toLowerCase(),
    state.account.email.toLowerCase(),
    pin,
    noteId,
    clientSalt,
  ];
  if (mode === CONFIDENTIAL_MODE) clientParts.unshift("AstraConfidential v2");
  const clientHash = await sha256Hex(clientParts.join("\0"));
  const { serverFactor } = await api("/api/vault/key-factor", {
    method: "POST",
    body: { noteId, clientSalt, clientHash, encryption: mode },
  });
  const keyBytes = await window.hashwasm.argon2id({
    password: `${pin}\0${serverFactor}`,
    salt: base64ToBytes(clientSalt),
    parallelism: 1,
    iterations: mode === CONFIDENTIAL_MODE ? 4 : 3,
    memorySize: 65536,
    hashLength: 32,
    outputType: "binary",
  });
  return crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}
function confidentialAdditionalData(noteId, mode) {
  return textEncoder.encode(
    `${
      mode === CONFIDENTIAL_MODE
        ? "AstraConfidential v2"
        : "AstraConfidential SCHybrid v1"
    }\0${state.account.username.toLowerCase()}\0${noteId}`,
  );
}
async function encryptConfidentialPayload(
  noteId,
  clientSalt,
  pin,
  payload,
  mode,
  existingKey = null,
) {
  const key =
    existingKey ||
    (await deriveConfidentialKey(noteId, clientSalt, pin, mode));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        additionalData: confidentialAdditionalData(noteId, mode),
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
async function decryptConfidentialPayload(note, pin) {
  try {
    const key = await deriveConfidentialKey(
      note.id,
      note.clientSalt,
      pin,
      note.encryption,
    );
    const ciphertext = base64ToBytes(note.encrypted.ciphertext);
    const tag = base64ToBytes(note.encrypted.tag);
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext);
    combined.set(tag, ciphertext.length);
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64ToBytes(note.encrypted.iv),
        additionalData: confidentialAdditionalData(note.id, note.encryption),
        tagLength: 128,
      },
      key,
      combined,
    );
    const payload = JSON.parse(textDecoder.decode(decrypted));
    const legacy = note.payloadVersion !== 2;
    const name = legacy ? payload.name : note.name;
    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.length > 80 ||
      typeof payload.content !== "string"
    )
      throw new Error("Invalid payload");
    return {
      key,
      payload: {
        name: name.normalize("NFC").trim(),
        content: payload.content.normalize("NFC"),
      },
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
  if (language === "ja" || language.startsWith("ja-")) return "ja";
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

function requireManualPinEntry(input) {
  input.value = "";
  input.type = "text";
  input.classList.add("vault-pin-input");
  input.autocomplete = "off";
  input.readOnly = true;
  input.spellcheck = false;
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("aria-autocomplete", "none");
  input.setAttribute("data-1p-ignore", "true");
  input.setAttribute("data-lpignore", "true");
  input.setAttribute("data-bwignore", "true");
  input.setAttribute("data-form-type", "other");
  const enable = () => {
    input.readOnly = false;
  };
  input.addEventListener("pointerdown", enable, { once: true });
  input.addEventListener("keydown", enable, { once: true });
  input.addEventListener("focus", enable, { once: true });
  input.addEventListener("input", () => {
    if (document.activeElement !== input) input.value = "";
  });
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

function applyPageSeo() {
  if (page !== "donate") return;
  const title = t("donateSeoTitle");
  const description = t("donateDescription");
  document.title = title;
  const setMeta = (selector, value) => {
    const element = $(selector);
    if (element) element.setAttribute("content", value);
  };
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
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
  $$("[data-i18n-aria-label]").forEach((el) =>
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel)),
  );
  $$("[data-label-key]").forEach((el) =>
    el.setAttribute("data-label", t(el.dataset.labelKey)),
  );
  const selector = $("#language-select");
  if (selector) selector.value = state.language;
  applyPageSeo();
}

function buildNav() {
  const authenticated = Boolean(state.session?.authenticated);
  const protectedLinks = authenticated
    ? `
    <a class="nav-link" href="/dashboard"><i class="fa-solid fa-chart-line"></i> <span data-i18n="dashboard"></span></a>
    <a class="nav-link" href="/notes"><i class="fa-solid fa-book"></i> <span data-i18n="notes"></span></a>
    <a class="nav-link donate-nav-link" href="/donate"><i class="fa-brands fa-bitcoin" aria-hidden="true"></i> <span data-i18n="donateNav"></span></a>
    <a class="nav-link" href="/settings"><i class="fa-solid fa-gear"></i> <span data-i18n="settings"></span></a>`
    : "";
  const publicDonateLink = authenticated
    ? ""
    : '<a class="nav-link donate-nav-link" href="/donate"><i class="fa-brands fa-bitcoin" aria-hidden="true"></i> <span data-i18n="donateNav"></span></a>';
  const nav = document.createElement("nav");
  nav.className = `site-nav ${page === "home" ? "" : "solid"}`;
  nav.dataset.i18nAriaLabel = "primaryNavigation";
  nav.innerHTML = `<a class="brand" href="/"><img src="/asset/logo.svg" alt=""><span>AstraNote</span></a>
    <button class="mobile-toggle" type="button" data-i18n-aria-label="menu" aria-expanded="false"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
    <div class="nav-links"><a class="nav-link" href="/"><i class="fa-solid fa-house" aria-hidden="true"></i> <span data-i18n="home"></span></a>${protectedLinks}${publicDonateLink}</div>
    <div class="nav-actions"><i class="fa-solid fa-language" aria-hidden="true"></i><select class="lang-select" id="language-select" data-i18n-aria-label="languageSelector"><option value="en">EN</option><option value="zh-Hant">繁中</option><option value="ja">日本語</option></select>
    ${authenticated ? '<button class="btn" id="nav-logout"><i class="fa-solid fa-arrow-right-from-bracket"></i><span data-i18n="logout"></span></button>' : '<a class="nav-link" href="/login"><i class="fa-solid fa-arrow-right-to-bracket"></i> <span data-i18n="login"></span></a><a class="btn btn-primary" href="/register"><i class="fa-solid fa-user-plus"></i><span data-i18n="register"></span></a>'}</div>`;
  document.body.prepend(nav);
  const mobileToggle = $(".mobile-toggle", nav);
  mobileToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", String(open));
  });
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
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
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

function unlockConfidential(note) {
  return new Promise((resolve, reject) => {
    const content = document.createElement("div");
    content.className = "vault-unlock";
    const label = document.createElement("label");
    label.textContent =
      note.encryption === LEGACY_SCHYBRID_MODE
        ? t("legacyVaultPin")
        : t("vaultPin");
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode =
      note.encryption === LEGACY_SCHYBRID_MODE ? "numeric" : "text";
    input.autocomplete = "off";
    input.minLength = 4;
    input.maxLength = note.encryption === LEGACY_SCHYBRID_MODE ? 6 : 16;
    input.pattern =
      note.encryption === LEGACY_SCHYBRID_MODE
        ? "[0-9]{4,6}"
        : "[!-~]{4,16}";
    requireManualPinEntry(input);
    const warning = document.createElement("p");
    warning.className = "field-help";
    warning.textContent = t("trustedDeviceOnly");
    content.append(label, input, warning);
    const dialog = modal({
      title: t("unlockNamedNote").replace(
        "{name}",
        note.name || t("confidentialNote"),
      ),
      body:
        note.encryption === LEGACY_SCHYBRID_MODE
          ? t("unlockLegacyVaultBody")
          : t("unlockVaultBody"),
      content,
      confirm: t("unlock"),
      danger: false,
      onCancel: () => reject(Object.assign(new Error("cancelled"), { cancelled: true })),
      onConfirm: async (close) => {
        if (!validVaultPin(input.value, note.encryption))
          throw new Error(vaultPinError(note.encryption));
        const decrypted = await decryptConfidentialPayload(note, input.value);
        if (note.payloadVersion !== 2) {
          try {
            const encrypted = await encryptConfidentialPayload(
              note.id,
              note.clientSalt,
              input.value,
              { content: decrypted.payload.content },
              note.encryption,
              decrypted.key,
            );
            await api(`/api/notes/${note.id}`, {
              method: "PUT",
              body: {
                name: decrypted.payload.name,
                encrypted,
                migrationOnly: true,
              },
            });
            note.name = decrypted.payload.name;
            note.encrypted = encrypted;
            note.payloadVersion = 2;
          } catch (error) {
            console.warn("Could not migrate the legacy encrypted title.", error);
          }
        }
        const result = { payload: decrypted.payload, pin: input.value };
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
    `${formatBytes(account.usedBytes)} / 200 KiB`;
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
  const protectedOptions = [
    ...encryption.querySelectorAll('[value$="-new"], [value="astra-confidential-v2"]'),
  ];
  requireManualPinEntry(form.vaultPin);
  requireManualPinEntry(form.vaultPinConfirmation);
  if (!account.vaultAvailable)
    protectedOptions.forEach((option) => {
      option.disabled = true;
    });
  const updateEncryptionFields = () => {
    const enabled = encryption.value === CONFIDENTIAL_MODE;
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
      if (mode === CONFIDENTIAL_MODE) {
        if (!account.vaultAvailable) throw new Error(t("vaultUnavailable"));
        const normalizedName = form.name.value.normalize("NFC").trim();
        if (!normalizedName) throw new Error(t("noteNameRequired"));
        const pin = form.vaultPin.value;
        if (!validVaultPin(pin, mode)) throw new Error(vaultPinError(mode));
        if (pin !== form.vaultPinConfirmation.value)
          throw new Error(t("vaultPinMismatch"));
        const id = randomHex(12);
        const clientSalt = randomBase64Url(32);
        body.id = id;
        body.clientSalt = clientSalt;
        body.encrypted = await encryptConfidentialPayload(
          id,
          clientSalt,
          pin,
          { content: "" },
          mode,
        );
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
  if (isClientEncryptedMode(note.encryption)) {
    try {
      const unlocked = await unlockConfidential(note);
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
  if (isClientEncryptedMode(note.encryption)) {
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
  if (isClientEncryptedMode(note.encryption)) {
    try {
      const unlocked = await unlockConfidential(note);
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
      if (isClientEncryptedMode(note.encryption)) {
        const normalizedName = name.value.normalize("NFC").trim();
        if (!normalizedName) throw new Error(t("noteNameRequired"));
        body.encrypted = await encryptConfidentialPayload(
          note.id,
          note.clientSalt,
          vaultPin,
          {
            content: content.value.normalize("NFC"),
          },
          note.encryption,
        );
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

function drawDonationQr() {
  if (typeof window.qrcode !== "function") throw new Error("QR unavailable");
  const qr = window.qrcode(0, "H");
  qr.addData(BITCOIN_URI);
  qr.make();

  const canvas = $("#donate-qr-canvas");
  const context = canvas.getContext("2d", { alpha: false });
  const quietZone = 4;
  const modules = qr.getModuleCount();
  const totalModules = modules + quietZone * 2;
  const cssSize = 176;
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const modulePixels = Math.max(
    8,
    Math.ceil((cssSize * pixelRatio) / totalModules),
  );
  const outputSize = totalModules * modulePixels;

  canvas.width = outputSize;
  canvas.height = outputSize;
  canvas.style.width = `${cssSize}px`;
  canvas.style.height = `${cssSize}px`;
  context.imageSmoothingEnabled = false;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, outputSize, outputSize);
  context.fillStyle = "#000";
  for (let row = 0; row < modules; row += 1) {
    for (let column = 0; column < modules; column += 1) {
      if (!qr.isDark(row, column)) continue;
      context.fillRect(
        (column + quietZone) * modulePixels,
        (row + quietZone) * modulePixels,
        modulePixels,
        modulePixels,
      );
    }
  }
}

async function copyBitcoinAddress() {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(BITCOIN_ADDRESS);
    return;
  }
  const fallback = document.createElement("textarea");
  fallback.value = BITCOIN_ADDRESS;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "fixed";
  fallback.style.inset = "-9999px auto auto -9999px";
  document.body.append(fallback);
  fallback.select();
  const copied = document.execCommand("copy");
  fallback.remove();
  if (!copied) throw new Error("Copy unavailable");
}

function initDonate() {
  drawDonationQr();
  const feedback = $("#donate-copy-feedback");
  const copyButton = $("#copy-bitcoin-address");
  let feedbackTimer = 0;
  copyButton.addEventListener("click", async () => {
    try {
      await copyBitcoinAddress();
      window.clearTimeout(feedbackTimer);
      feedback.textContent = t("donateCopied");
      feedbackTimer = window.setTimeout(() => {
        feedback.textContent = "";
      }, 1800);
    } catch {
      feedback.textContent = t("error");
    }
  });
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
    donate: initDonate,
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
