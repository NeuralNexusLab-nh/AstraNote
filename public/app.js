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
    today: "Active accounts today",
    registered: "Registered accounts",
    utc: "Unique signed-in accounts that visited · today in UTC",
    purposeEyebrow: "A QUIET PLACE FOR IDEAS",
    purposeTitle: "Everything a thought needs. Nothing it does not.",
    quickTitle: "Write without friction",
    quickBody:
      "A focused, lined writing space for plain text—fast, familiar, and free of visual noise.",
    secureTitle: "Powerful encryption when you need it",
    secureBody:
      "Choose server-managed AES or client-side AstraConfidential protection for sensitive notes.",
    shareTitle: "Share on your terms",
    shareBody:
      "Create a private-looking, unguessable read-only link, then revoke it whenever you choose.",
    limitEyebrow: "CLEAR BY DESIGN",
    limitTitle: "Small footprint. Deliberate limits.",
    limitBody:
      "Each account includes 128 KB across all account files and up to 20 notes. Encrypted notes commonly use about 1.4× the storage; very short notes may use more than 2×.",
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
    signInBody:
      "Enter your account details and complete the human verification.",
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
    termsUpdated: "Effective and last updated: 2 September 2026",
    englishOnlyCaptcha: "Complete the human verification to save this note.",
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
    today: "今日活躍帳號",
    registered: "已註冊帳號",
    utc: "曾造訪的不同登入帳號 · 以 UTC 計算今日",
    purposeEyebrow: "給想法一處寧靜空間",
    purposeTitle: "思緒所需的一切，沒有多餘干擾。",
    quickTitle: "流暢記錄",
    quickBody: "專注、帶橫線的純文字書寫空間；快速、熟悉，不受視覺雜訊干擾。",
    secureTitle: "需要時，使用強大加密",
    secureBody:
      "敏感筆記可選擇伺服器管理的 AES，或由客戶端加密的 AstraConfidential。",
    shareTitle: "由你掌控分享",
    shareBody: "建立難以猜測的唯讀連結，並隨時撤銷公開存取。",
    limitEyebrow: "清楚而有節制",
    limitTitle: "輕量空間，明確限制。",
    limitBody:
      "每個帳號的所有檔案合計 128 KB，最多 20 篇筆記。加密筆記通常約需 1.4 倍空間；很短的筆記可能超過 2 倍。",
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
      "持有連結者可閱讀筆記，並看到你的公開名稱與遮罩電子郵件。連結難以猜測且可隨時撤銷。",
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
    dangerBody: "立即永久刪除帳號及所有筆記；此操作不能取消或復原。",
    requestDeletion: "永久刪除帳號",
    logoutTitle: "要登出嗎？",
    logoutBody: "這會結束目前的登入階段。",
    deleteAccountTitle: "要永久刪除這個帳號嗎？",
    deleteAccountBody:
      "輸入完整使用者名稱與目前密碼，再完成人類驗證。帳號、筆記、登入階段與分享連結將立即移除，且無法復原。",
    confirmUsername: "確認使用者名稱",
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
    username: "使用者名稱",
    password: "密碼",
    noRecovery: "AstraNote 不提供密碼復原，請妥善保存密碼。",
    registerTitle: "建立 AstraNote",
    registerBody: "宇宙中的一處寧靜角落，等待你的想法。",
    email: "電子郵件",
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
    termsUpdated: "生效及最後更新：2026 年 9 月 2 日",
    englishOnlyCaptcha: "請完成人類驗證以儲存筆記。",
    editorUnsaved: "尚有未儲存的變更，仍要關閉這個頁面嗎？",
  },
};

Object.assign(I18N.en, {
  vaultPinWarning:
    "AstraNote cannot store or recover this case-sensitive PIN. Use a random 12–16 character value when possible and keep it safe.",
  encryptionTitle: "Five protection levels, explained clearly.",
  encryptionSecretExposure:
    "The account, server-side protection, and the user's 4–6 digit PIN",
  encryptionSecretSecurity: "Everyday",
  secureBody:
    "Choose server-managed AES, simple AstraSecret protection, or advanced AstraConfidential with Plus and Pro.",
  limitBody:
    "Free includes 128 KB and 20 notes. Plus and Pro add more room when your notebook grows.",
  termsUpdated: "Effective and last updated: 4 September 2026",
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
    "AstraNote keeps writing simple and free while giving sensitive notes stronger protection when you choose it. Each account includes up to 20 notes and 128 KB of storage, with no advertising or analytics tracking.",
  quickTitle: "Capture it right away",
  quickBody:
    "Write down an idea, a reminder, a list, or a useful piece of information before it slips away.",
  secureTitle: "Strong encryption is ready",
  secureBody:
    "Choose server-managed AES, simple AstraSecret protection, or advanced AstraConfidential with Plus and Pro.",
  shareTitle: "Free to use",
  shareBody:
    "Create up to 20 notes with 128 KB of account storage, with no advertising or analytics tracking.",
  limitEyebrow: "SIMPLE, HONEST LIMITS",
  limitTitle: "Enough room for the notes you reach for most.",
  limitBody:
    "Free includes 128 KB and 20 notes. Plus and Pro add more room when your notebook grows.",
  encryptionEyebrow: "CHOOSE YOUR PROTECTION",
  encryptionTitle: "Five protection levels, explained clearly.",
  encryptionIntro:
    "Choose readable storage, server-managed AES, convenient AstraSecret client encryption, or the stronger AstraConfidential protection available with Plus and Pro.",
  encryptionTitleNoticeTitle: "Note titles are never encrypted",
  encryptionTitleNoticeBody:
    "Titles remain readable so AstraNote can show them in your note list. Never put a secret in a title.",
  encryptionTableLabel: "Comparison of AstraNote encryption modes",
  encryptionModeColumn: "Mode",
  encryptionEncryptedColumn: "Content encrypted",
  encryptionClientColumn: "Client-side encryption",
  encryptionPinColumn: "PIN protection",
  encryptionSharingColumn: "Sharing",
  encryptionExposureColumn:
    "What must an attacker obtain to recover plaintext?",
  encryptionSecurityColumn: "Security",
  encryptionYes: "Yes",
  encryptionNo: "No",
  encryptionNoPin: "No PIN",
  encryptionSecretPin: "4–6 digits · user-held",
  encryptionUserHeldPin: "4–16 ASCII · user-held",
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
  encryptionSchybridTitle: "AstraSecret and AstraConfidential features",
  encryptionSchybridStepOneTitle: "Two PIN formats, both kept by you",
  encryptionSchybridStepOneBody:
    "AstraSecret uses 4–6 digits. AstraConfidential uses 4–16 case-sensitive ASCII characters. You must save the PIN; AstraNote never stores or recovers it.",
  encryptionSchybridStepTwoTitle: "Protection matched to the note",
  encryptionSchybridStepTwoBody:
    "AstraSecret is simpler for everyday privacy. AstraConfidential applies stronger key derivation for highly sensitive content and is available with Plus or Pro.",
  encryptionSchybridStepThreeTitle: "Client encrypts before upload",
  encryptionSchybridStepThreeBody:
    "Both modes encrypt the note content on your device before upload. The server receives and stores only encrypted content.",
  encryptionSchybridCaution:
    "Neither mode makes a weak PIN strong. AstraSecret's short numeric PIN is easier to guess; for sensitive data, choose AstraConfidential with a unique random 12–16 character PIN and enter it only on trusted devices.",
  welcomeBody: "Your notes and account usage, clearly presented.",
  noNotes:
    "No notes yet. Create one whenever you have something worth keeping.",
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
  registerBody:
    "Create a free account and keep useful notes within easy reach.",
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
  maxNotesDynamic: "LIMIT {count}",
  legalEyebrow: "LEGAL",
  privacyEyebrow: "DATA PRACTICES",
  notFoundEyebrow: "PAGE NOT FOUND",
  notFoundBody: "The page you requested could not be found.",
  noEncryptionOption: "No encryption",
  vaultPin: "PIN (4–16 ASCII characters)",
  legacyVaultPin: "PIN (4–6 digits)",
  confirmVaultPin: "Confirm PIN",
  vaultTitle: "AstraConfidential",
  vaultExplanation:
    "Your device combines your account details and PIN with a temporary factor protected by AstraNote's independent server secret. The note content is encrypted on this device before upload; the title remains visible so you can identify the note in your list.",
  vaultPinWarning:
    "AstraNote does not store or recover this case-sensitive PIN. Use 12–16 random ASCII letters, numbers, and symbols when possible, save it securely, and enter it only on a device you trust.",
  vaultNoSharing:
    "Sharing is unavailable because this encryption is bound to the owner's account, PIN, and AstraNote's server-side protection.",
  vaultPinInvalid:
    "Enter 4–16 case-sensitive ASCII letters, numbers, or symbols with no spaces.",
  legacyVaultPinInvalid: "Enter the original 4–6 digit PIN.",
  noteNameRequired: "Note name is required.",
  vaultPinMismatch: "The PIN entries do not match.",
  vaultCryptoUnavailable:
    "Secure client encryption is unavailable on this device.",
  vaultUnavailable: "AstraConfidential is not configured on this server.",
  unlockVaultTitle: "Unlock AstraConfidential note",
  unlockNamedNote: "Unlock {name}",
  unlockVaultBody:
    "Enter this note's 4–16 character, case-sensitive PIN. AstraNote does not store or recover it.",
  unlockLegacyVaultBody:
    "Enter this legacy note's original 4–6 digit PIN. AstraNote does not store or recover it.",
  unlock: "Unlock",
  trustedDeviceOnly: "Only enter this PIN on a device you trust.",
  vaultUnlockFailed: "The PIN is incorrect or the encrypted note is damaged.",
  confidentialNote: "AstraConfidential encrypted note",
  hiddenCharacters: "Hidden until unlocked",
  vaultSharingUnavailable:
    "Sharing is unavailable for AstraConfidential notes because their encryption is bound to the owner's account and PIN.",
  dangerBody:
    "Permanently delete your account and all of its notes immediately. This cannot be cancelled or undone.",
  requestDeletion: "Permanently delete account",
  deleteAccountTitle: "Permanently delete this account?",
  deleteAccountBody:
    "Enter your exact username and current password, then complete the human verification. The account, notes, sessions, and sharing links will be removed immediately and cannot be restored.",
  confirmCurrentPassword: "Confirm current password",
  skipContent: "Skip to content",
  primaryNavigation: "Primary navigation",
  menu: "Menu",
  languageSelector: "Language",
});

Object.assign(I18N["zh-Hant"], {
  vaultPinWarning:
    "AstraNote 不會儲存或協助找回這組區分大小寫的 PIN。建議使用隨機的12～16字元並妥善保存。",
  encryptionTitle: "五種保護層級，一眼看懂差異。",
  encryptionSecretExposure:
    "帳號、伺服器端保護，以及使用者保存的4～6位數字 PIN",
  encryptionSecretSecurity: "日常防護",
  secureBody:
    "可選擇伺服器管理的 AES、容易使用的 AstraSecret，或 Plus 與 Pro 提供的進階 AstraConfidential。",
  limitBody: "Free 提供128 KB與20篇筆記；需要更多空間時，可選擇 Plus 或 Pro。",
  termsUpdated: "生效及最後更新：2026年9月4日",
  heroKicker: "線上筆記本 · 免費使用",
  tagline: "隨手記下，需要時隨時找得到。",
  heroLead:
    "AstraNote 是一個免費、方便的線上筆記本，也為最重要的筆記提供強大的加密保護。",
  begin: "免費建立帳號",
  explore: "了解功能",
  scroll: "繼續了解",
  today: "今日活躍帳號",
  registered: "已註冊帳號",
  utc: "曾造訪的不同登入帳號 · 以 UTC 計算今日",
  purposeEyebrow: "為日常筆記而做",
  purposeTitle: "清楚、可靠，讓重要內容一直在手邊。",
  purposeIntroOne:
    "AstraNote 是一個免費的線上筆記本，讓使用者隨時記錄想法、待辦事項、清單、學習內容、工作紀錄、常用資料，以及任何希望日後快速找到的文字。",
  purposeIntroTwo:
    "無論是突然想到的靈感、需要記住的事情，還是經常需要拿出來查看的資訊，都能集中保存在自己的 AstraNote 帳號中。登入後，即可在手機、平板或電腦上查看與編輯同一批筆記，不必把重要內容留在單一裝置，也不需要反覆傳送檔案。",
  purposeIntroThree:
    "AstraNote 保持簡單、清楚且免費，同時讓敏感筆記在需要時獲得更強的保護。每個帳號提供最多 20 篇筆記與 128 KB 儲存空間，沒有廣告，也不使用分析追蹤。",
  quickTitle: "想到就能立刻記下",
  quickBody: "不論是靈感、提醒、清單或常用資料，都能在忘記以前迅速保存。",
  secureTitle: "強大加密，隨時可選",
  secureBody:
    "可選擇伺服器管理的 AES、容易使用的 AstraSecret，或 Plus 與 Pro 提供的進階 AstraConfidential。",
  shareTitle: "免費使用",
  shareBody: "每個帳號可建立 20 篇筆記，享有 128 KB 空間，沒有廣告與分析追蹤。",
  limitEyebrow: "簡單而透明的限制",
  limitTitle: "為最常用的筆記保留剛好的空間。",
  limitBody: "Free 提供128 KB與20篇筆記；需要更多空間時，可選擇 Plus 或 Pro。",
  encryptionEyebrow: "選擇適合的保護方式",
  encryptionTitle: "五種保護層級，一眼看懂差異。",
  encryptionIntro:
    "可選擇直接儲存、伺服器管理的 AES、方便的 AstraSecret 客戶端加密，或 Plus 與 Pro 提供的更強 AstraConfidential 保護。",
  encryptionTitleNoticeTitle: "所有模式的筆記標題都不會加密",
  encryptionTitleNoticeBody:
    "標題會保持可讀，才能顯示在筆記清單中。請勿把機密資訊寫進標題。",
  encryptionTableLabel: "AstraNote 加密方式比較",
  encryptionModeColumn: "方式",
  encryptionEncryptedColumn: "內容加密",
  encryptionClientColumn: "客戶端加密",
  encryptionPinColumn: "PIN 保護",
  encryptionSharingColumn: "分享",
  encryptionExposureColumn: "駭客還需取得什麼才能還原明文？",
  encryptionSecurityColumn: "安全性",
  encryptionYes: "是",
  encryptionNo: "否",
  encryptionNoPin: "沒有 PIN",
  encryptionSecretPin: "4～6位數字 · 使用者保存",
  encryptionUserHeldPin: "4～16位 ASCII · 使用者保存",
  encryptionNoneName: "不加密",
  encryptionNoneExposure: "只需筆記檔案",
  encryptionNoneSecurity: "無",
  encryptionAesExposure: "筆記檔案 + 伺服器端加密金鑰，或控制運作中的伺服器",
  encryptionAes128Security: "強",
  encryptionAes256Security: "很強",
  encryptionSchybridExposure:
    "即使取得所有伺服器資料，也不能直接看到明文；仍須猜中或取得 PIN，或控制正在輸入 PIN／已解鎖筆記的裝置。",
  encryptionSchybridSecurity: "最高層級",
  encryptionSchybridTitle: "AstraSecret 與 AstraConfidential 的特點",
  encryptionSchybridStepOneTitle: "兩種 PIN 都由你保存",
  encryptionSchybridStepOneBody:
    "AstraSecret 使用4～6位數字；AstraConfidential 使用4～16位、區分大小寫的 ASCII 字元。AstraNote 不會儲存或協助找回 PIN。",
  encryptionSchybridStepTwoTitle: "依內容選擇保護強度",
  encryptionSchybridStepTwoBody:
    "AstraSecret 適合日常隱私；AstraConfidential 使用更強的金鑰推導保護高度敏感內容，並開放給 Plus 與 Pro。",
  encryptionSchybridStepThreeTitle: "上傳前由客戶端加密",
  encryptionSchybridStepThreeBody:
    "兩種模式都會先在你的裝置加密筆記內容，伺服器只接收並保存加密後的內容。",
  encryptionSchybridCaution:
    "兩種模式都無法讓弱 PIN 自動變強。AstraSecret 的短數字 PIN 較容易被猜中；敏感資料請選 AstraConfidential，使用不重複、隨機的12～16字元 PIN，並只在信任的裝置輸入。",
  welcomeBody: "清楚查看筆記和帳號用量。",
  accountAge: "帳號已建立",
  days: "天",
  noNotes: "目前沒有筆記。有值得留下的內容時，就建立一篇吧。",
  allNotesBody: "所有已保存的內容，都整齊放在這裡。",
  newNoteBody: "輸入名稱並選擇是否加密；建立後無法更換加密方式。",
  encryptionHelp: "加密筆記通常約需 1.4 倍空間；非常短的內容可能超過 2 倍。",
  deleteNoteBody:
    "這篇筆記沒有備份，刪除後無法復原。請完成人類驗證以永久刪除。",
  logoutBody: "這會結束目前的登入階段。",
  deleteAccountBody:
    "輸入完整使用者名稱與目前密碼，再完成人類驗證。帳號、筆記、登入階段與分享連結將立即移除，且無法復原。",
  captchaNeeded: "請先完成人類驗證。",
  signInTitle: "登入並查看筆記",
  signInBody: "輸入帳號資料並完成人類驗證。",
  registerTitle: "建立 AstraNote 帳號",
  registerBody: "免費建立帳號，讓常用的筆記隨時在手邊。",
  cancellationBody:
    "在七天反悔期內輸入原密碼並重新完成人類驗證，即可恢復存取。",
  saveBody: "要儲存這篇筆記目前的名稱與內容嗎？",
  shareReadyTitle: "分享連結已建立",
  shareReadyBody:
    "持有連結者可閱讀筆記，並看到你的公開顯示名稱與遮罩電子郵件。",
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
  maxNotesDynamic: "上限 {count}",
  legalEyebrow: "法律文件",
  privacyEyebrow: "資料處理方式",
  notFoundEyebrow: "找不到頁面",
  notFoundBody: "找不到你所要求的頁面。",
  noEncryptionOption: "不加密",
  vaultPin: "PIN（4–16 個 ASCII 字元）",
  legacyVaultPin: "PIN（原有 4–6 位數）",
  confirmVaultPin: "再次輸入 PIN",
  vaultTitle: "AstraConfidential",
  vaultExplanation:
    "你的裝置會將帳號資料與 PIN，結合由 AstraNote 獨立伺服器祕密保護的臨時因子。筆記內容會先在此裝置完成加密，再上傳至 AstraNote；標題保持可見，方便你在清單中辨認筆記。",
  vaultPinWarning:
    "AstraNote 不會儲存或協助找回這組區分大小寫的 PIN。建議使用隨機產生的12～16個 ASCII 英文字母、數字與符號，妥善保存，並只在信任的裝置輸入。",
  vaultNoSharing:
    "此加密方式與擁有者帳號、PIN 及 AstraNote 的伺服器端保護綁定，因此不提供分享功能。",
  vaultPinInvalid:
    "請輸入 4–16 個區分大小寫的 ASCII 英文字母、數字或符號，不可包含空格。",
  legacyVaultPinInvalid: "請輸入這篇舊版筆記原有的 4–6 位數 PIN。",
  noteNameRequired: "請輸入筆記名稱。",
  vaultPinMismatch: "兩次輸入的 PIN 不相同。",
  vaultCryptoUnavailable: "此裝置無法使用安全的客戶端加密功能。",
  vaultUnavailable: "伺服器尚未設定 AstraConfidential。",
  unlockVaultTitle: "解鎖 AstraConfidential 筆記",
  unlockNamedNote: "解鎖{name}",
  unlockVaultBody:
    "請輸入這篇筆記區分大小寫的 4–16 字元 PIN。AstraNote 不會儲存或協助找回這組 PIN。",
  unlockLegacyVaultBody:
    "請輸入這篇舊版筆記原有的 4–6 位數 PIN。AstraNote 不會儲存或協助找回這組 PIN。",
  unlock: "解鎖",
  trustedDeviceOnly: "請只在你信任的裝置上輸入這組 PIN。",
  vaultUnlockFailed: "PIN 不正確，或加密筆記已損壞。",
  confidentialNote: "AstraConfidential 加密筆記",
  hiddenCharacters: "解鎖後顯示",
  vaultSharingUnavailable:
    "此筆記的加密與擁有者帳號及 PIN 綁定，\n因此 AstraConfidential 不提供分享功能。",
  dangerBody: "立即永久刪除帳號及所有筆記；此操作不能取消或復原。",
  requestDeletion: "永久刪除帳號",
  deleteAccountTitle: "要永久刪除這個帳號嗎？",
  deleteAccountBody:
    "輸入完整使用者名稱與目前密碼，再完成人類驗證。帳號、筆記、登入階段與分享連結將立即移除，且無法復原。",
  confirmCurrentPassword: "確認目前密碼",
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
  copyright:
    "© 2026 NeuralNexusLab. サービスに関するすべての権利を留保します。",
  terms: "利用規約",
  privacy: "プライバシー",
  legalUpdated: "発効・最終更新：2026年9月1日",
  termsUpdated: "発効・最終更新：2026年9月2日",
  source: "ソースコード",
  cookieTitle: "必須 Cookie",
  cookieBody:
    "AstraNote は、ログイン、セキュリティ、言語、表示設定に必要な Cookie のみを使用します。広告やアクセス解析のトラッカーは使用しません。",
  accept: "同意して続行",
  logoutTitle: "ログアウトしますか？",
  logoutBody: "現在のログインセッションを終了します。",
  error: "問題が発生しました。もう一度お試しください。",
  encryptionEyebrow: "保護方法を選択",
  encryptionTitle: "4 つの保護レベルを明確に比較。",
  encryptionIntro:
    "暗号化なしは読める状態で保存されます。AES-128-GCM と AES-256-GCM は AstraNote サーバーが自動暗号化します。AstraConfidential はアップロード前にクライアントで暗号化し、利用者だけが知る PIN を追加します。",
  encryptionTitleNoticeTitle: "どの方式でもノートのタイトルは暗号化されません",
  encryptionTitleNoticeBody:
    "一覧に表示するため、タイトルは読み取り可能な状態です。機密情報をタイトルに書かないでください。",
  encryptionTableLabel: "AstraNote の暗号化方式の比較",
  encryptionModeColumn: "方式",
  encryptionEncryptedColumn: "内容を暗号化",
  encryptionClientColumn: "クライアント側で暗号化",
  encryptionPinColumn: "PIN 保護",
  encryptionSharingColumn: "共有",
  encryptionExposureColumn: "平文の復元に攻撃者がさらに必要なものは？",
  encryptionSecurityColumn: "安全性",
  encryptionYes: "はい",
  encryptionNo: "いいえ",
  encryptionNoPin: "PIN なし",
  encryptionSecretPin: "4～6桁 · 利用者が保管",
  encryptionUserHeldPin: "4～16文字 ASCII · 利用者が保管",
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
  encryptionSchybridTitle: "AstraSecret と AstraConfidential の特長",
  encryptionSchybridStepOneTitle: "2種類の PIN は利用者が保管",
  encryptionSchybridStepOneBody:
    "AstraSecret は4～6桁の数字、AstraConfidential は大文字と小文字を区別する4～16文字の ASCII を使います。AstraNote は PIN を保存・復元しません。",
  encryptionSchybridStepTwoTitle: "ノートに合う保護強度",
  encryptionSchybridStepTwoBody:
    "AstraSecret は日常のプライバシー向けです。AstraConfidential は機密性の高い内容向けにより強い鍵導出を行い、Plus／Pro で利用できます。",
  encryptionSchybridStepThreeTitle: "アップロード前に暗号化",
  encryptionSchybridStepThreeBody:
    "どちらもアップロード前に端末でノート内容を暗号化し、サーバーは暗号化済みの内容だけを受信・保存します。",
  encryptionSchybridCaution:
    "どちらも弱い PIN 自体を強くするものではありません。AstraSecret の短い数字 PIN は推測されやすいため、機密データには固有でランダムな12～16文字の AstraConfidential PIN を使い、信頼できる端末でのみ入力してください。",
  vaultPin: "PIN（4～16 文字の ASCII）",
  legacyVaultPin: "PIN（従来の4～6桁）",
  confirmVaultPin: "PIN を再入力",
  vaultTitle: "AstraConfidential",
  vaultExplanation:
    "端末はアカウント情報と PIN を AstraNote のサーバー側保護と組み合わせます。ノート内容はアップロード前にこの端末で暗号化され、タイトルは一覧表示のため読み取り可能なままです。",
  vaultPinWarning:
    "AstraNote は大文字と小文字を区別する PIN を保存・復元しません。可能であればランダムな12～16文字の英字、数字、記号を使い、安全に保管してください。",
  vaultNoSharing:
    "この暗号化は所有者のアカウント、PIN、AstraNote のサーバー側保護に結び付くため、共有できません。",
  vaultPinInvalid:
    "空白を含まない4～16文字の ASCII 英字、数字、記号を入力してください。",
  legacyVaultPinInvalid: "従来の4～6桁の PIN を入力してください。",
  vaultPinMismatch: "PIN が一致しません。",
  vaultCryptoUnavailable:
    "この端末では安全なクライアント暗号化を使用できません。",
  vaultUnavailable: "サーバーに AstraConfidential が設定されていません。",
  unlockNamedNote: "{name} を解錠",
  unlockVaultBody:
    "このノートの大文字と小文字を区別する4～16文字の PIN を入力してください。AstraNote は PIN を保存・復元しません。",
  unlockLegacyVaultBody:
    "この従来ノートで使用していた4～6桁の PIN を入力してください。AstraNote は PIN を保存・復元しません。",
  unlock: "解錠",
  trustedDeviceOnly: "この PIN は信頼できる端末でのみ入力してください。",
  vaultUnlockFailed: "PIN が違うか、暗号化ノートが破損しています。",
  confidentialNote: "AstraConfidential 暗号化ノート",
  hiddenCharacters: "解錠後に表示",
  vaultSharingUnavailable:
    "このノートの暗号化は所有者のアカウントと PIN に結び付いているため、\nAstraConfidential では共有できません。",
  skipContent: "メインコンテンツへ移動",
  primaryNavigation: "メインナビゲーション",
  menu: "メニュー",
  languageSelector: "言語",
};

Object.assign(I18N.en, {
  plans: "Plans",
  plansAria: "AstraNote plans",
  plansEyebrow: "MORE ROOM, SAME QUIET FOCUS",
  plansTitle: "Choose the space that fits your notes.",
  plansBody:
    "Free stays useful. Plus adds comfortable room, while Pro is built for people who keep many notes.",
  monthRule:
    "One subscription month always means 30 days. Choose 1, 3, 6, 9, 12, 24, or 36 months with no long-term discount.",
  freePrice: "Free forever",
  perMonth: "/ 30 days",
  freeNotes: "20 notes",
  plusNotes: "50 notes",
  unlimitedNotes: "No separate note-count limit",
  astraSecretIncluded: "AstraSecret everyday protection",
  confidentialIncluded: "AstraConfidential advanced protection",
  included: "Included",
  choosePlus: "Choose Plus",
  choosePro: "Choose Pro",
  completePurchase: "Complete your purchase",
  satoraExplanation:
    "You will continue to Satora, NeuralNexusLab's Bitcoin payment service. Returning to AstraNote does not prove payment; your plan activates only after server verification.",
  numberOfMonths: "Subscription duration (months)",
  couponAbuseWarning:
    "Coupon abuse—including repeatedly using coupons to push an account's resources beyond reasonable use—will result in permanent deletion of the account and its data. AstraNote provides no internal appeal or recovery process.",
  total: "Total",
  continueToSatora: "Continue to payment on Satora",
  paymentHistory: "Payment history",
  noPayments: "No payments yet.",
  billingSupport:
    "Payment problem? Do not pay again. Contact us within 7 days:",
  signInToPurchase: "Log in to purchase or renew a plan.",
  currentPlan: "Current plan",
  renewPlan: "Purchase or renew",
  managePlan: "Manage plan",
  subscription: "Plan and remaining time",
  daysRemaining: "{days} days remaining",
  permanent: "Permanent",
  unlimited: "Infinity",
  noteLocked: "Locked",
  noteLockedTitle: "This note is locked",
  noteLockedBody:
    "This note exceeds your current plan allowance. Upgrade to Plus or Pro to unlock it. Only its title, size, and deletion date remain available.",
  scheduledDeletion: "Permanent deletion scheduled for {date}",
  viewPlans: "View plans",
  lockedAccountWarning:
    "{count} notes are locked. Notes that stay locked for 30 days are permanently deleted, and AstraNote is not responsible for their recovery.",
  planEndingTitle: "Your {plan} time is almost over",
  planEndingFallback:
    "{plan} has {days} days remaining. After that, AstraNote will switch to {fallback}.",
  planEndingFree:
    "{plan} has {days} days remaining. After that, notes beyond Free limits will be locked and permanently deleted after 30 continuously locked days.",
  renewNow: "Renew now",
  later: "Later",
  astraSecretPin: "AstraSecret PIN (4–6 digits)",
  astraSecretExplanation:
    "AstraSecret offers simple client-side protection for everyday private notes. You choose and keep its 4–6 digit PIN; AstraNote does not store or recover it.",
  confidentialPin: "AstraConfidential PIN (4–16 ASCII characters)",
  confidentialPlanRequired:
    "Plus or Pro is required to create a new AstraConfidential note.",
  confidentialOption: "AstraConfidential · Plus / Pro",
  confidentialPinInvalid:
    "Enter 4–16 ASCII letters, numbers, or symbols with no spaces.",
  astraSecretPinInvalid: "Enter a 4–6 digit PIN.",
  astraSecretPinWarning:
    "You must save this 4–6 digit PIN yourself. AstraNote cannot store or recover it. Its smaller key space makes AstraSecret unsuitable for recovery phrases or backup codes.",
  unlockConfidentialBody:
    "Enter this note's case-sensitive ASCII PIN. New AstraConfidential PINs use 4–16 characters; notes created earlier still accept their original PIN. AstraNote does not store or recover it.",
  orderConfirming: "Waiting to start payment",
  orderPending: "Waiting for Bitcoin payment",
  orderPaid: "Paid and activated",
  orderFailed: "Payment needs assistance",
  orderExpired: "Payment expired",
  orderCreated: "Creating payment",
  orderVerificationError: "Could not safely verify payment",
  continuePayment: "Continue payment",
  refreshStatus: "Refresh status",
  paymentChecking: "Checking payment status…",
  paymentActivated: "Payment verified. Your plan is active.",
});

Object.assign(I18N["zh-Hant"], {
  plans: "方案",
  plansAria: "AstraNote 方案",
  plansEyebrow: "為筆記留出更多空間",
  plansTitle: "選擇適合你的筆記空間。",
  plansBody:
    "Free 保留完整的基本體驗；Plus 提供舒適容量，Pro 則為需要保存大量筆記的人而設計。",
  monthRule:
    "訂閱一個月固定指30天，可選擇1、3、6、9、12、24或36個月，不提供長期折扣。",
  freePrice: "永久免費",
  perMonth: "／30天",
  freeNotes: "20篇筆記",
  plusNotes: "50篇筆記",
  unlimitedNotes: "不另外限制筆記篇數",
  astraSecretIncluded: "AstraSecret 日常保護",
  confidentialIncluded: "AstraConfidential 進階保護",
  included: "已包含",
  choosePlus: "選擇 Plus",
  choosePro: "選擇 Pro",
  completePurchase: "完成購買",
  satoraExplanation:
    "接下來會前往 NeuralNexusLab 的 Bitcoin 付款服務 Satora。返回 AstraNote 不代表付款成功，方案只會在後端驗證後啟用。",
  numberOfMonths: "訂閱月數",
  couponAbuseWarning:
    "濫用優惠碼，包括大量或重複使用優惠碼使帳號資源超出合理使用範圍，將導致帳號及其資料被永久刪除；AstraNote 不提供內部申訴或復原程序。",
  total: "本次合計",
  continueToSatora: "前往 Satora 付款",
  paymentHistory: "付款紀錄",
  noPayments: "目前沒有付款紀錄。",
  billingSupport: "付款有問題時請勿再次付款，並在7天內聯絡：",
  signInToPurchase: "登入後即可購買或續訂方案。",
  currentPlan: "目前方案",
  renewPlan: "購買或續訂",
  managePlan: "管理方案",
  subscription: "方案與剩餘時間",
  daysRemaining: "剩餘 {days} 天",
  permanent: "永久有效",
  unlimited: "Infinity",
  noteLocked: "已鎖定",
  noteLockedTitle: "這篇筆記已被鎖定",
  noteLockedBody:
    "此筆記超出目前方案額度。請升級至 Plus 或 Pro 以解鎖；目前只能查看標題、大小與預定刪除時間。",
  scheduledDeletion: "預計於 {date} 永久刪除",
  viewPlans: "查看方案",
  lockedAccountWarning:
    "目前有 {count} 篇筆記被鎖定。持續鎖定滿30天後會永久刪除，AstraNote 不負資料恢復責任。",
  planEndingTitle: "你的 {plan} 時間即將用完",
  planEndingFallback: "{plan} 剩餘 {days} 天，之後會自動切換至 {fallback}。",
  planEndingFree:
    "{plan} 剩餘 {days} 天，之後超出 Free 額度的筆記將被鎖定；持續鎖定30天後會永久刪除。",
  renewNow: "立即續訂",
  later: "稍後處理",
  astraSecretPin: "AstraSecret PIN（4～6位數字）",
  astraSecretExplanation:
    "AstraSecret 為一般私人筆記提供容易使用的客戶端保護。4～6位數字 PIN 由你設定及保存；AstraNote 不會儲存或協助找回。",
  confidentialPin: "AstraConfidential PIN（4～16個 ASCII 字元）",
  confidentialPlanRequired: "建立新的 AstraConfidential 筆記需要 Plus 或 Pro。",
  confidentialOption: "AstraConfidential · Plus / Pro",
  confidentialPinInvalid:
    "請輸入4～16個不含空白的 ASCII 大小寫英文、數字或符號。",
  astraSecretPinInvalid: "請輸入4～6位數字 PIN。",
  astraSecretPinWarning:
    "這組4～6位數字 PIN 必須由你自行保存；AstraNote 不會儲存或協助找回。因組合較少，請勿用 AstraSecret 保存助記詞或備援代碼。",
  unlockConfidentialBody:
    "請輸入這篇筆記區分大小寫的 ASCII PIN。新建立的 AstraConfidential PIN 為4～16字元；較早建立的筆記仍可使用原本的 PIN。AstraNote 不會儲存或協助找回。",
  orderConfirming: "等待開始付款",
  orderPending: "等待 Bitcoin 付款",
  orderPaid: "已付款並啟用",
  orderFailed: "付款需要協助",
  orderExpired: "付款已過期",
  orderCreated: "正在建立付款",
  orderVerificationError: "無法安全驗證付款",
  continuePayment: "繼續付款",
  refreshStatus: "重新檢查",
  paymentChecking: "正在確認付款狀態…",
  paymentActivated: "付款已驗證，方案已啟用。",
});

Object.assign(I18N.ja, {
  maxNotesDynamic: "上限 {count}件",
  today: "本日のアクティブアカウント",
  utc: "アクセスしたログイン済みアカウント（重複なし）· UTC基準",
  vaultPinWarning:
    "AstraNote はこの大文字と小文字を区別する PIN を保存・復元しません。可能であればランダムな12～16文字を安全に保管してください。",
  encryptionTitle: "5つの保護レベルを明確に比較。",
  encryptionIntro:
    "読み取り可能な保存、サーバー管理の AES、手軽な AstraSecret のクライアント暗号化、Plus／Pro 向けのより強い AstraConfidential から選択できます。",
  encryptionSecretExposure:
    "アカウント、サーバー側の保護、利用者が保管する4～6桁の数字 PIN",
  encryptionSecretSecurity: "日常保護",
  secureBody:
    "サーバー管理の AES、手軽な AstraSecret、Plus／Pro 向けの高度な AstraConfidential から選べます。",
  limitBody:
    "Free は128 KBと20件のノートを含み、Plus と Pro で容量を増やせます。",
  termsUpdated: "施行・最終更新：2026年9月4日",
  plans: "プラン",
  plansAria: "AstraNote プラン",
  plansEyebrow: "ノートにもっと余裕を",
  plansTitle: "ノートに合う容量を選択。",
  plansBody:
    "Free は基本機能を維持し、Plus は余裕ある容量、Pro は多くのノートを保存する方向けです。",
  monthRule:
    "1か月は常に30日です。長期割引なしで1、3、6、9、12、24、36か月から選択できます。",
  freePrice: "永久無料",
  perMonth: "／30日",
  freeNotes: "20件のノート",
  plusNotes: "50件のノート",
  unlimitedNotes: "ノート数の個別上限なし",
  astraSecretIncluded: "AstraSecret の日常保護",
  confidentialIncluded: "AstraConfidential の高度な保護",
  included: "含まれています",
  choosePlus: "Plus を選択",
  choosePro: "Pro を選択",
  completePurchase: "購入を完了",
  satoraExplanation:
    "NeuralNexusLab の Bitcoin 決済サービス Satora に移動します。AstraNote に戻っただけでは支払い済みとはみなされず、サーバー検証後に有効化されます。",
  numberOfMonths: "契約月数",
  couponAbuseWarning:
    "クーポンを大量または繰り返し使用してアカウントのリソースを合理的な利用範囲以上に増やすなど、クーポンを不正利用した場合、アカウントとそのデータは完全に削除されます。AstraNote による異議申立てまたは復元手続きはありません。",
  total: "合計",
  continueToSatora: "Satora で支払う",
  paymentHistory: "支払い履歴",
  noPayments: "支払い履歴はまだありません。",
  billingSupport: "問題がある場合は再度支払わず、7日以内にご連絡ください：",
  signInToPurchase: "購入または更新するにはログインしてください。",
  currentPlan: "現在のプラン",
  renewPlan: "購入・更新",
  managePlan: "プランを管理",
  subscription: "プランと残り期間",
  daysRemaining: "残り {days}日",
  permanent: "無期限",
  unlimited: "Infinity",
  noteLocked: "ロック中",
  noteLockedTitle: "このノートはロックされています",
  noteLockedBody:
    "現在のプラン上限を超えています。Plus または Pro にアップグレードすると解除できます。表示できるのはタイトル、サイズ、削除予定日のみです。",
  scheduledDeletion: "{date} に完全削除予定",
  viewPlans: "プランを見る",
  lockedAccountWarning:
    "{count}件のノートがロック中です。30日間継続してロックされると完全に削除され、AstraNote は復元の責任を負いません。",
  planEndingTitle: "{plan} の残り期間が少なくなっています",
  planEndingFallback:
    "{plan} は残り{days}日です。その後 {fallback} に切り替わります。",
  planEndingFree:
    "{plan} は残り{days}日です。その後 Free の上限を超えるノートはロックされ、30日後に完全削除されます。",
  renewNow: "今すぐ更新",
  later: "後で",
  astraSecretPin: "AstraSecret PIN（4～6桁）",
  astraSecretExplanation:
    "AstraSecret は日常の個人ノート向けです。4～6桁の数字 PIN は利用者自身が保管し、AstraNote は保存・復元しません。",
  confidentialPin: "AstraConfidential PIN（4～16文字の ASCII）",
  confidentialPlanRequired:
    "新しい AstraConfidential ノートの作成には Plus または Pro が必要です。",
  confidentialOption: "AstraConfidential · Plus / Pro",
  confidentialPinInvalid:
    "空白を含まない4～16文字の ASCII 英字、数字、記号を入力してください。",
  astraSecretPinInvalid: "4～6桁の PIN を入力してください。",
  astraSecretPinWarning:
    "この4～6桁の数字 PIN は利用者自身で保管してください。AstraNote は保存・復元できません。組み合わせが少ないため、シードフレーズやバックアップコードには使用しないでください。",
  unlockConfidentialBody:
    "このノートで使用した大文字と小文字を区別する ASCII PIN を入力してください。新しい AstraConfidential PIN は4～16文字です。以前に作成したノートでは元の PIN を引き続き使用できます。AstraNote は保存・復元しません。",
  orderConfirming: "支払い開始待ち",
  orderPending: "Bitcoin 支払い待ち",
  orderPaid: "支払い・有効化済み",
  orderFailed: "支払いにサポートが必要です",
  orderExpired: "支払い期限切れ",
  orderCreated: "支払いを作成中",
  orderVerificationError: "支払いを安全に検証できません",
  continuePayment: "支払いを続ける",
  refreshStatus: "状態を更新",
  paymentChecking: "支払い状態を確認中…",
  paymentActivated: "支払いを確認し、プランを有効化しました。",
});

Object.assign(I18N["en"], {
  zeroSummary:
    "Encryption keys are generated 100% independently on your client—not requested from the server.",
  zeroPinFeature:
    "Your PIN stays with you; the note key is protected before upload",
  zeroShortCaution:
    "Keep a strong PIN and use a trusted device. Weak PINs can still be guessed. Titles are not encrypted.",
  unlimited: "Infinity",
  unlimitedNotes: "Infinity notes",
  purposeIntroThree:
    "AstraNote keeps writing simple and free, with optional encryption for sensitive notes. Free includes 20 notes and 128 KB; paid plans add space and tools. There is no advertising or analytics tracking.",
  secureBody:
    "Choose server-managed AES, AstraSecret, AstraConfidential, or AstraZero with keys generated in your client.",
  shareBody:
    "Free includes 20 notes and 128 KB of account storage, with no advertising or analytics tracking.",
  limitBody:
    "Free includes 128 KB and 20 notes. Plus, Pro and Ultra add space and features as your notebook grows.",
  encryptionSchybridStepTwoBody:
    "AstraSecret is simpler for everyday privacy. AstraConfidential uses stronger key derivation and is available with Plus, Pro and Ultra.",
  plansBody:
    "Start free. Choose Plus for more room and note organization, Pro for AstraZero, or Ultra for 1024 KB and recovery tools.",
  chooseUltra: "Choose Ultra",
  comparePlans: "Compare plans",
  compareFeature: "Feature",
  comparisonHint:
    "All paid periods use 30-day months. Ultra time is used first, then Pro, then Plus; lower tiers pause.",
  organizeFeature: "Note organization",
  organizeDetail: "Pins, archive, and batch management.",
  recoveryFeature: "Versions & recovery",
  recoveryDetail:
    "One previous version and a trash bin. Both count toward storage.",
  prioritySupport: "Priority manual support",
  prioritySupportDetail:
    "Contact astranote@nxlabtw.com. No guaranteed response time.",
  zeroIncluded: "AstraZero · client-generated keys",
  zeroOption: "AstraZero · Pro / Ultra",
  zeroPin: "AstraZero PIN (4–16 ASCII characters)",
  zeroExplanation:
    "Your client generates a random key for each note, encrypts the content, and protects that key with your PIN. AstraNote stores only encrypted content and the protected key; it does not receive your PIN or the unprotected key.",
  zeroWarning:
    "Keep your PIN yourself; it cannot be recovered. Use a random 12–16 character PIN. Someone with the encrypted files can guess a short PIN offline. Only unlock on a trusted device. Note titles are not encrypted.",
  encryptionTitle: "Choose how your notes are protected.",
  encryptionIntro:
    "From simple notes to client-encrypted content: choose the protection that fits. A strong PIN matters for every PIN-based mode.",
  zeroExposure:
    "Encrypted files + a correct or guessed PIN, or control of the client when you unlock",
  zeroSecurity: "Client-held keys",
  vaultSharingUnavailable:
    "Sharing is unavailable for PIN-protected notes because recipients do not have your decryption credentials.",
  vaultNoSharing: "PIN-protected notes do not support sharing.",
  confidentialOption: "AstraConfidential · Plus / Pro / Ultra",
  confidentialPlanRequired:
    "Plus, Pro or Ultra is required for new AstraConfidential notes.",
  noteLockedBody:
    "This note exceeds your current allowance. Upgrade to unlock it; only its title, size and deletion date are available.",
  pinned: "Pinned",
  pin: "Pin",
  unpin: "Unpin",
  organize: "Organize",
  searchNotes: "Search note titles",
  searchNotesPlaceholder: "Search note titles…",
  noMatchingNotes: "No notes match this search or filter.",
  moveToTrash: "Move to trash",
  unlockByUpgrade: "Upgrade to unlock",
  trashLocked: "Locked by your plan limit. Upgrade to restore this note.",
  freeIncluded: "Included with every account",
  freeIncludedBody: "Your free starting space. No purchase required.",
  archive: "Archive",
  unarchive: "Unarchive",
  activeNotes: "Active notes",
  archivedNotes: "Archived notes",
  selectAll: "Select visible notes",
  selectNote: "Select note",
  selectedNotes: "{count} selected",
  batchAction: "Batch action",
  apply: "Apply",
  selectionLimit: "Select at most 100 notes at a time.",
  organizeUpgrade:
    "Plus, Pro and Ultra include pins, archive and batch organization.",
  trash: "Trash",
  trashBody:
    "Deleted notes stay here until their expiry date. They and their previous versions still use account storage.",
  trashEmpty: "Trash is empty.",
  trashNoteTitle: "Move note to trash?",
  trashNoteBody:
    "The note can be restored until its trash expiry date. Its share link stops working immediately. Trash still uses storage.",
  trashUntil: "Permanently deleted after {date}",
  restore: "Restore",
  permanentlyDelete: "Permanently delete",
  restoreNoteBody:
    "Restore this note to your notebook? Your current plan's storage and note limits still apply; sharing stays off.",
  trashDays: "Trash retention",
  trashSettingsHelp:
    "Default: 7 days. Changes apply only to notes deleted afterward.",
  previousVersion: "Previous version",
  restoreVersion: "Restore this version",
  restoreVersionBody:
    "Replace the current title and content with this version? The previous-version slot will be cleared; you cannot switch back.",
  previousHelp:
    "Only the previous saved version is kept. Restoring it clears version history. Versions and trash count toward storage.",
  previousQuota:
    "After Ultra expires, no new versions are created. Existing versions and unexpired trash can still be restored within your current allowance.",
  featureIncluded: "Included",
  featureNotIncluded: "Not included",
  totalStorage: "Storage",
  noteAllowance: "Notes",
  monthlyPrice: "Price / 30 days",
  basicEncryption: "No encryption · AES-128 / AES-256",
  securityCaution:
    "AstraZero does not require a server encryption secret. It cannot protect against a compromised device or malicious page code, and short PINs remain guessable.",
  restoreQuota: "Free space or upgrade your plan before restoring.",
  noteConflict: "This note changed in another tab. Reload before saving.",
  organizationRequired: "Plus, Pro or Ultra is required to organize notes.",
  storageLimit: "Your account would exceed its storage allowance.",
  versionDiscardNotice:
    "Saving with Ultra keeps one previous version, which also uses storage.",
  recoveryTermsTitle: "Organization, versions and trash",
  recoveryTerms:
    "Plus, Pro and Ultra include note organization; Pro and Ultra also include AstraZero. Ultra includes 1024 KB, one previous version per note, configurable trash retention (default 7 days), and priority manual support without a response-time guarantee. Previous versions and trash count toward your total storage. Restoring a version replaces the current content and clears that previous-version slot. Trash expires at the time shown when deleted. After Ultra expires, new versions and trash entries are unavailable, but existing versions and unexpired trash may be restored within your current allowance. Over-limit notes deleted by the system after 30 days do not enter trash. These features are not an independent backup; keep your own copies. The existing liability provisions and mandatory consumer rights continue to apply.",
});

Object.assign(I18N["zh-Hant"], {
  zeroSummary: "加密金鑰 100% 由客戶端獨立產生，不向伺服器索取。",
  zeroPinFeature: "PIN 由你保管，金鑰經保護後才上傳",
  zeroShortCaution:
    "請妥善保存高強度 PIN，並使用可信任裝置；弱 PIN 仍可能被猜中。標題不加密。",
  unlimited: "無限",
  unlimitedNotes: "無限篇筆記",
  purposeIntroThree:
    "AstraNote 保持簡單、清楚且免費，也能為敏感筆記選用加密保護。Free 提供20篇筆記與128 KB空間；付費方案則增加空間與工具。沒有廣告，也不使用分析追蹤。",
  secureBody:
    "可選擇伺服器管理的 AES、AstraSecret、AstraConfidential，或由客戶端產生金鑰的 AstraZero。",
  shareBody: "Free 提供20篇筆記與128 KB空間，沒有廣告與分析追蹤。",
  limitBody:
    "Free 提供128 KB與20篇筆記；Plus、Pro 與 Ultra 則提供更多空間與功能。",
  encryptionSchybridStepTwoBody:
    "AstraSecret 適合日常隱私；AstraConfidential 使用更強的金鑰推導，並開放給 Plus、Pro 與 Ultra。",
  plansBody:
    "從免費開始。Plus 提供更多空間與筆記整理；Pro 加入 AstraZero；Ultra 則提供 1024 KB 與版本復原。",
  chooseUltra: "選擇 Ultra",
  comparePlans: "方案比較",
  compareFeature: "功能",
  comparisonHint:
    "一個月為30天。優先使用 Ultra，再使用 Pro、Plus；較低階方案的時間會暫停消耗。",
  organizeFeature: "筆記整理",
  organizeDetail: "釘選、封存與批次管理。",
  recoveryFeature: "版本與復原",
  recoveryDetail: "保留上一個版本，以及垃圾桶還原；兩者均計入空間。",
  prioritySupport: "優先人工協助",
  prioritySupportDetail: "聯絡 astranote@nxlabtw.com；不保證固定回覆時間。",
  zeroIncluded: "AstraZero · 客戶端產生金鑰",
  zeroOption: "AstraZero · Pro / Ultra",
  zeroPin: "AstraZero PIN（4～16個 ASCII 字元）",
  zeroExplanation:
    "客戶端為每篇筆記產生隨機金鑰、加密內容，再用你的 PIN 保護金鑰。AstraNote 只儲存加密內容與受保護的金鑰，不會收到 PIN 或未加密的金鑰。",
  zeroWarning:
    "PIN 由你自行保管，遺失無法找回。建議使用隨機12～16個字元；取得加密檔案者仍可離線猜測短 PIN。請只在信任的裝置解鎖。筆記標題不加密。",
  encryptionTitle: "選擇適合筆記的保護方式。",
  encryptionIntro:
    "從一般記錄，到客戶端加密的重要內容，依需求選擇；使用 PIN 的加密方式都需要足夠強的 PIN。",
  zeroExposure: "加密檔案＋正確或猜中的 PIN，或控制解鎖時的客戶端",
  zeroSecurity: "客戶端持有金鑰",
  vaultSharingUnavailable:
    "使用 PIN 保護的筆記不提供分享，因為收件者沒有你的解密憑證。",
  vaultNoSharing: "使用 PIN 保護的筆記不提供分享。",
  confidentialOption: "AstraConfidential · Plus / Pro / Ultra",
  confidentialPlanRequired:
    "建立新的 AstraConfidential 筆記需要 Plus、Pro 或 Ultra。",
  noteLockedBody:
    "此筆記超出目前方案額度，請升級以解鎖；目前只能查看標題、大小與預定刪除時間。",
  pinned: "已釘選",
  pin: "釘選",
  unpin: "取消釘選",
  organize: "整理",
  searchNotes: "搜尋筆記標題",
  searchNotesPlaceholder: "搜尋筆記標題…",
  noMatchingNotes: "沒有符合搜尋或篩選條件的筆記。",
  moveToTrash: "移至垃圾桶",
  unlockByUpgrade: "升級解鎖",
  trashLocked: "此筆記因超額而鎖定，請升級後再還原。",
  freeIncluded: "每個帳號皆已包含",
  freeIncludedBody: "免費開始記錄，不必購買。",
  archive: "封存",
  unarchive: "取消封存",
  activeNotes: "一般筆記",
  archivedNotes: "已封存筆記",
  selectAll: "選取目前顯示的筆記",
  selectNote: "選取筆記",
  selectedNotes: "已選取 {count} 篇",
  batchAction: "批次操作",
  apply: "套用",
  selectionLimit: "每次最多選取100篇筆記。",
  organizeUpgrade: "Plus、Pro 與 Ultra 提供釘選、封存及批次整理。",
  trash: "垃圾桶",
  trashBody: "手動刪除的筆記會保留至指定時間；筆記與其上一版本仍計入帳號空間。",
  trashEmpty: "垃圾桶目前是空的。",
  trashNoteTitle: "移至垃圾桶？",
  trashNoteBody:
    "在垃圾桶到期前可以還原，分享連結會立即失效。垃圾桶中的筆記仍占用空間。",
  trashUntil: "將於 {date} 永久刪除",
  restore: "還原",
  permanentlyDelete: "永久刪除",
  restoreNoteBody:
    "將此筆記還原至筆記本？仍須符合目前方案的空間與篇數限制，分享不會自動恢復。",
  trashDays: "垃圾桶保留時間",
  trashSettingsHelp: "預設7天；變更只套用於之後刪除的筆記。",
  previousVersion: "上一個版本",
  restoreVersion: "還原此版本",
  restoreVersionBody:
    "以這個版本取代目前的標題與內容？還原後會清除上一版本，無法再切回。",
  previousHelp:
    "只保留上一次儲存的版本；還原後清除版本紀錄。上一版本與垃圾桶都會計入使用空間。",
  previousQuota:
    "Ultra 到期後不再建立新版本；既有版本與尚未到期的垃圾桶筆記，仍可在目前額度內還原。",
  featureIncluded: "包含",
  featureNotIncluded: "不包含",
  totalStorage: "儲存空間",
  noteAllowance: "筆記篇數",
  monthlyPrice: "每30天價格",
  basicEncryption: "不加密 · AES-128 / AES-256",
  securityCaution:
    "AstraZero 不依賴伺服器的加密密鑰，但無法防止受控制的裝置或惡意網頁程式竊取解鎖內容，短 PIN 也仍可能被猜中。",
  restoreQuota: "請先釋放空間或升級方案，再還原筆記。",
  noteConflict: "這篇筆記已在其他分頁變更，請重新載入後再儲存。",
  organizationRequired: "筆記整理功能需要 Plus、Pro 或 Ultra。",
  storageLimit: "此操作會超出帳號的空間額度。",
  versionDiscardNotice: "使用 Ultra 儲存時會保留上一個版本，也會占用空間。",
  recoveryTermsTitle: "筆記整理、版本與垃圾桶",
  recoveryTerms:
    "Plus、Pro 與 Ultra 提供筆記整理；Pro 與 Ultra 另提供 AstraZero。Ultra 包含1024 KB空間、每篇筆記的上一個版本、可設定保留期間的垃圾桶（預設7天），以及不保證固定回覆時間的優先人工協助。上一版本與垃圾桶均計入總使用量；還原版本會取代目前內容並清除上一版本。垃圾桶依刪除時顯示的期限清除。Ultra 到期後不再建立新版本或垃圾桶項目，但既有版本及未到期項目仍可在目前額度內還原。超額鎖定滿30天而由系統刪除的筆記不進入垃圾桶。這些功能不等同獨立備份，請自行保存重要資料。原有責任限制及法律強制保障的消費者權利仍適用。",
});

Object.assign(I18N["ja"], {
  zeroSummary:
    "暗号鍵はクライアントが100%独立して生成。サーバーから受け取りません。",
  zeroPinFeature: "PIN はご自身で保管し、鍵は保護してから送信",
  zeroShortCaution:
    "強い PIN を保管し、信頼できる端末を使ってください。弱い PIN は推測される可能性があります。タイトルは暗号化しません。",
  unlimited: "無限",
  unlimitedNotes: "ノート数は無限",
  plansBody:
    "無料で開始。Plus は容量とノート整理、Pro は AstraZero、Ultra は1024 KBと復元機能を提供します。",
  chooseUltra: "Ultra を選ぶ",
  comparePlans: "プラン比較",
  compareFeature: "機能",
  comparisonHint:
    "1か月は30日。Ultra、Pro、Plus の順に利用し、下位プランの残り期間は停止します。",
  organizeFeature: "ノート整理",
  organizeDetail: "ピン留め、アーカイブ、一括管理。",
  recoveryFeature: "履歴と復元",
  recoveryDetail: "直前の1バージョンとゴミ箱。両方とも容量に含まれます。",
  prioritySupport: "優先の有人サポート",
  prioritySupportDetail:
    "astranote@nxlabtw.com にご連絡ください。返信時間の保証はありません。",
  zeroIncluded: "AstraZero · クライアントで鍵を生成",
  zeroOption: "AstraZero · Pro / Ultra",
  zeroPin: "AstraZero PIN（4～16文字の ASCII）",
  zeroExplanation:
    "クライアントがノートごとにランダムな鍵を生成して内容を暗号化し、PIN で鍵を保護します。サーバーに保存するのは暗号文と保護された鍵だけで、PIN や平文の鍵は送信しません。",
  zeroWarning:
    "PIN は自分で保管してください。復元できません。ランダムな12～16文字を推奨します。暗号化ファイルから短い PIN をオフラインで推測できる場合があります。信頼できる端末のみで解除してください。ノートのタイトルは暗号化されません。",
  encryptionTitle: "ノートに合った保護を選ぶ。",
  encryptionIntro:
    "通常の記録からクライアント暗号化まで。PIN を使う方式では、十分に強い PIN が重要です。",
  zeroExposure:
    "暗号化ファイル＋正しい（または推測された）PIN、または解除時のクライアントの制御",
  zeroSecurity: "クライアントで鍵を保持",
  vaultSharingUnavailable:
    "PIN で保護されたノートは、受信者に復号資格情報がないため共有できません。",
  vaultNoSharing: "PIN で保護されたノートは共有できません。",
  confidentialOption: "AstraConfidential · Plus / Pro / Ultra",
  confidentialPlanRequired:
    "新しい AstraConfidential ノートには Plus、Pro または Ultra が必要です。",
  noteLockedBody:
    "現在のプラン上限を超えています。アップグレードすると解除できます。タイトル、サイズ、削除予定日のみ表示できます。",
  pinned: "ピン留め済み",
  pin: "ピン留め",
  unpin: "ピンを外す",
  organize: "整理",
  searchNotes: "ノートのタイトルを検索",
  searchNotesPlaceholder: "ノートのタイトルを検索…",
  noMatchingNotes: "検索や絞り込みに一致するノートはありません。",
  moveToTrash: "ゴミ箱に移動",
  unlockByUpgrade: "アップグレードで解除",
  trashLocked:
    "プラン上限によりロック中です。復元するにはアップグレードしてください。",
  freeIncluded: "すべてのアカウントに含まれます",
  freeIncludedBody: "購入不要で、無料で始められます。",
  archive: "アーカイブ",
  unarchive: "アーカイブ解除",
  activeNotes: "通常のノート",
  archivedNotes: "アーカイブ済み",
  selectAll: "表示中のノートを選択",
  selectNote: "ノートを選択",
  selectedNotes: "{count}件選択",
  batchAction: "一括操作",
  apply: "適用",
  selectionLimit: "一度に選択できるのは100件までです。",
  organizeUpgrade:
    "Plus、Pro、Ultra はピン留め、アーカイブ、一括整理に対応します。",
  trash: "ゴミ箱",
  trashBody:
    "削除したノートは期限まで保管されます。直前のバージョンを含め、容量を使用します。",
  trashEmpty: "ゴミ箱は空です。",
  trashNoteTitle: "ゴミ箱に移動しますか？",
  trashNoteBody:
    "期限内は復元できます。共有リンクはすぐ無効になります。ゴミ箱も容量を使用します。",
  trashUntil: "{date} に完全削除",
  restore: "復元",
  permanentlyDelete: "完全に削除",
  restoreNoteBody:
    "ノートを復元しますか？現在の容量と件数の制限が適用され、共有は無効のままです。",
  trashDays: "ゴミ箱の保存期間",
  trashSettingsHelp: "既定は7日。変更後に削除したノートだけに適用されます。",
  previousVersion: "直前のバージョン",
  restoreVersion: "このバージョンを復元",
  restoreVersionBody:
    "現在のタイトルと内容を置き換えますか？復元後に履歴は消去され、元に戻せません。",
  previousHelp:
    "直前の保存版のみ保持します。復元すると履歴は消去されます。履歴とゴミ箱は容量に含まれます。",
  previousQuota:
    "Ultra 終了後は新しい履歴を保存しません。既存の履歴と期限内のゴミ箱は現在の上限内で復元できます。",
  featureIncluded: "利用可能",
  featureNotIncluded: "対象外",
  totalStorage: "容量",
  noteAllowance: "ノート数",
  monthlyPrice: "30日あたり",
  basicEncryption: "暗号化なし · AES-128 / AES-256",
  securityCaution:
    "AstraZero はサーバーの暗号鍵に依存しませんが、侵害された端末や悪意のあるページコードからは保護できません。短い PIN は推測される可能性があります。",
  restoreQuota: "容量を空けるかアップグレードしてから復元してください。",
  noteConflict:
    "別のタブで変更されました。再読み込みしてから保存してください。",
  organizationRequired: "整理機能には Plus、Pro または Ultra が必要です。",
  storageLimit: "アカウントの容量制限を超えます。",
  versionDiscardNotice:
    "Ultra で保存すると直前のバージョンを保持し、容量を使用します。",
  recoveryTermsTitle: "整理、履歴、ゴミ箱",
  recoveryTerms:
    "Plus、Pro、Ultra はノート整理に対応し、Pro と Ultra は AstraZero も利用できます。Ultra は1024 KB、各ノートの直前の1バージョン、保存期間を設定できるゴミ箱（既定7日）、返信時間を保証しない優先有人サポートを提供します。履歴とゴミ箱は容量に含まれます。履歴を復元すると現在の内容を置き換え、その履歴を消去します。ゴミ箱の期限は削除時に確定します。Ultra 終了後は新たな履歴やゴミ箱項目を作成できませんが、既存の履歴と期限内の項目は現在の上限内で復元できます。上限超過で30日間ロックされた後にシステムが削除するノートはゴミ箱に入りません。独立したバックアップではないため、重要なデータはご自身で保管してください。既存の責任制限および法令で保障される消費者の権利が適用されます。",
});

Object.assign(I18N.en, {
  termsUpdated: "Effective and last updated: 5 September 2026",
});
Object.assign(I18N["zh-Hant"], {
  termsUpdated: "生效及最後更新：2026 年 9 月 5 日",
});
Object.assign(I18N.ja, { termsUpdated: "施行・最終更新：2026年9月5日" });
Object.assign(I18N.ja, {
  tagline: "書き留めて、必要なときに見つける。",
  heroKicker: "オンラインノート · 無料で使える",
  heroLead:
    "AstraNote は無料で便利なオンラインノート。大切な内容には強力な暗号化も選べます。",
  begin: "無料アカウントを作成",
  explore: "機能を見る",
  scroll: "詳しく見る",
  today: "今日利用したアカウント",
  registered: "登録アカウント",
  utc: "UTC の当日に利用した異なるアカウント",
  purposeEyebrow: "毎日の記録に",
  purposeTitle: "大切なことを、わかりやすく手元に。",
  purposeIntroOne:
    "AstraNote は無料のオンラインノートです。アイデア、タスク、学習や仕事のメモ、よく使う情報を記録し、必要なときに見つけられます。",
  purposeIntroTwo:
    "スマートフォン、タブレット、パソコンからログインして同じノートを読み書きできます。端末ごとにファイルを送り直す必要はありません。",
  purposeIntroThree:
    "シンプルな書き心地と、必要に応じた暗号化。Free は20件、128 KBを利用でき、広告やアクセス解析の追跡はありません。",
  quickTitle: "思いついたときに記録",
  quickBody:
    "アイデア、リマインダー、リストや役立つ情報を、忘れないうちに書き留められます。",
  secureTitle: "必要なときに強い暗号化",
  secureBody:
    "サーバー管理の AES、AstraSecret、AstraConfidential、クライアントで鍵を生成する AstraZero から選べます。",
  shareTitle: "無料で使える",
  shareBody:
    "Free は20件のノートと128 KB。広告やアクセス解析の追跡はありません。",
  limitEyebrow: "わかりやすい上限",
  limitTitle: "よく使うノートに、ちょうどよい空間。",
  limitBody:
    "Free は128 KBと20件。Plus、Pro、Ultra で容量や機能を追加できます。",
  welcome: "おかえりなさい",
  welcomeBody: "ノートと利用状況をひと目で確認。",
  notebooks: "ノート数",
  storage: "使用容量",
  accountAge: "アカウント作成から",
  days: "日",
  recent: "最近のノート",
  viewAll: "すべてのノート",
  createNote: "新しいノート",
  noNotes: "ノートはまだありません。最初のメモを作成しましょう。",
  characters: "文字",
  updated: "更新日時",
  encrypted: "暗号化済み",
  unencrypted: "暗号化なし",
  allNotes: "マイノート",
  allNotesBody: "保存した記録をひとつの場所に。",
  delete: "削除",
  open: "開く",
  newNote: "ノートを作成",
  newNoteBody:
    "名前と保護方式を選んでください。暗号化方式は作成後に変更できません。",
  noteName: "ノート名",
  encryption: "暗号化",
  encryptionHelp:
    "暗号化は追加情報を保存するため容量を増やします。通常は約1.4倍ですが、短いノートでは2倍を超える場合があります。",
  create: "ノートを作成",
  note: "ノート",
  edit: "編集",
  share: "共有",
  save: "保存",
  discard: "変更を破棄",
  shared: "共有中",
  sharingOff: "共有は無効",
  copied: "リンクをコピーしました",
  copy: "コピー",
  shareTitleModal: "このノートを共有しますか？",
  shareEnableBody:
    "リンクを知っている人は内容、公開表示名、マスクされたメールアドレスを閲覧できます。いつでも無効にできます。",
  shareDisableBody: "既存のリンクはすぐ無効になります。",
  enableShare: "共有を有効にする",
  disableShare: "共有を無効にする",
  deleteNoteTitle: "ノートを完全に削除しますか？",
  deleteNoteBody:
    "この削除は復元できません。人間による操作の確認を完了してください。",
  settingsTitle: "設定",
  settingsBody: "使いやすい表示に調整できます。",
  appearance: "表示",
  language: "言語",
  publicIdentity: "公開プロフィール",
  displayName: "公開表示名",
  saveSettings: "設定を保存",
  dark: "ダーク",
  light: "ライト",
  dangerZone: "アカウント削除",
  dangerBody:
    "アカウントとすべてのノートをすぐ完全に削除します。取り消しや復元はできません。",
  requestDeletion: "アカウントを完全に削除",
  deleteAccountTitle: "アカウントを完全に削除しますか？",
  deleteAccountBody:
    "正確なユーザー名と現在のパスワードを入力し、人間による操作の確認を完了してください。すべてのノート、セッション、共有リンクを削除します。",
  confirmUsername: "ユーザー名を確認",
  proceed: "続ける",
  cancel: "キャンセル",
  close: "閉じる",
  captchaNeeded: "先に人間による操作の確認を完了してください。",
  loading: "読み込み中…",
  saved: "保存しました。",
  sharedNote: "共有ノート",
  by: "作成者",
  readOnly: "読み取り専用",
  notFound: "ページが見つかりません。",
  backHome: "ホームへ戻る",
  signInTitle: "ノートに戻る",
  signInBody: "ログイン情報を入力し、人間による操作の確認を完了してください。",
  username: "ユーザー名",
  password: "パスワード",
  noRecovery: "パスワードの復元はできません。安全に保管してください。",
  registerTitle: "AstraNote をはじめる",
  registerBody: "毎日の記録をひとつの場所に。",
  email: "メールアドレス",
  confirmPassword: "パスワードを再入力",
  agreeTerms: "利用規約とプライバシーポリシーを読み、同意します。",
  agreeCapacity:
    "同意する法的能力があるか、法定代理人が内容を確認し承認しています。7歳未満の場合は保護者がアカウントを作成・管理します。",
  editorUnsaved: "未保存の変更があります。このページを閉じますか？",
  humanVerification: "人間による操作の確認",
  notesEyebrow: "ノートブック",
  newNoteEyebrow: "新しい記録",
  dashboardEyebrow: "ダッシュボード",
  settingsEyebrow: "環境設定",
  maxNotesDynamic: "上限 {count} 件",
  noEncryptionOption: "暗号化なし",
  noteNameRequired: "ノート名を入力してください。",
  confirmCurrentPassword: "現在のパスワード",
  legalEyebrow: "サービスについて",
  encryptionSecretExposure:
    "ノートファイル、サーバー側の保護、正しい（または推測された）数字 PIN",
  encryptionSecretSecurity: "日常向け",
  encryptionSchybridStepTwoBody:
    "AstraSecret は日常向け。AstraConfidential はより強い鍵導出に対応し、Plus／Pro／Ultra で新規作成できます。",
});
Object.assign(I18N.en, {
  noteContent: "Note content",
  filters: "Filters",
  couponOnceTitle: "Coupon use",
  couponOncePolicy:
    "Each coupon can be redeemed once per account, except for codes expressly designated as reusable by AstraNote. Reusing a coupon will not add plan time, even if Satora accepts the payment. Do not pay again; contact support with the order ID if a payment was made.",
  orderCouponReused: "Coupon already used",
  couponRejectedBody:
    "You have already redeemed this coupon on this account. Satora reported this payment as successful, but AstraNote has not added any plan time. Do not pay again. Contact support with the order ID below if you paid Bitcoin; no automatic refund has been issued.",
  orderIdLabel: "Order ID",
  viewPaymentDetails: "View details",
  billingData:
    "Payment records retain the account association, plan, amount, payment identifiers, status and necessary timestamps for reconciliation and preventing duplicate credit. Coupon-use receipts store a code digest, account association and order ID, not the plaintext coupon. Full payment-service responses are not stored.",
});
Object.assign(I18N["zh-Hant"], {
  noteContent: "筆記內容",
  filters: "篩選",
  couponOnceTitle: "優惠碼使用規則",
  couponOncePolicy:
    "除 AstraNote 明確指定可重複使用的優惠碼外，每個帳號的同一優惠碼只能兌換一次。重複使用不會增加方案天數，即使 Satora 接受付款也一樣。請勿再次付款；若已支付款項，請提供訂單編號聯絡支援。",
  orderCouponReused: "優惠碼已使用過",
  couponRejectedBody:
    "這個帳號已兌換過此優惠碼，不能再次使用。Satora 回報這筆付款成功，但 AstraNote 沒有增加任何方案天數。請勿再次付款；若已支付 Bitcoin，請提供下方訂單編號聯絡支援。目前沒有自動退款。",
  orderIdLabel: "訂單編號",
  viewPaymentDetails: "查看詳情",
  billingData:
    "付款紀錄保留帳號關聯、方案、金額、付款識別碼、狀態及必要時間，用於核對款項並防止重複入帳。優惠碼使用紀錄僅保留代碼摘要、帳號關聯與訂單編號，不儲存優惠碼明碼，也不儲存付款服務的完整回應。",
});
Object.assign(I18N.ja, {
  noteContent: "ノート内容",
  filters: "絞り込み",
  couponOnceTitle: "クーポンの利用",
  couponOncePolicy:
    "AstraNote が繰り返し利用可能と指定したコードを除き、同じクーポンは1アカウントにつき1回のみ利用できます。再利用では Satora が支払いを受け付けてもプラン期間は追加されません。再度支払わず、支払い済みの場合は注文番号を添えてサポートへご連絡ください。",
  orderCouponReused: "このクーポンは使用済みです",
  couponRejectedBody:
    "このアカウントでは既に同じクーポンを利用しています。Satora は支払い成功と報告しましたが、AstraNote のプラン期間は追加されていません。再度支払わないでください。Bitcoin を支払い済みの場合は下の注文番号を添えてサポートへご連絡ください。自動返金は行われていません。",
  orderIdLabel: "注文番号",
  viewPaymentDetails: "詳細を見る",
  billingData:
    "支払い記録には照合と重複付与の防止に必要なアカウント関連、プラン、金額、支払い識別子、状態、日時を保持します。クーポンの利用記録にはコードのダイジェスト、アカウント関連、注文番号のみを保存し、コードの平文や決済サービスの応答全体は保存しません。",
});
const state = {
  session: null,
  account: null,
  captcha: null,
  actionCaptcha: null,
  language: "en",
  theme: "dark",
};
const LEGACY_SCHYBRID_MODE = "astra-confidential-schybrid-v1";
const LEGACY_CONFIDENTIAL_MODE = "astra-confidential-v2";
const ASTRA_SECRET_MODE = "astra-secret-v1";
const CONFIDENTIAL_MODE = "astra-confidential-v3";
const ZERO_MODE = "astra-zero-v1";
const CURRENT_AES_MODES = new Map([
  ["aes-128-gcm-new", "AES-128-GCM"],
  ["aes-256-gcm-new", "AES-256-GCM"],
]);
Object.assign(I18N["en"], {
  plusUsdEstimate: "About US$2 / month",
  proUsdEstimate: "About US$5 / month",
  ultraUsdEstimate: "About US$10 / month",
  usdEstimateNote:
    "USD estimates use a reference rate of 1 BTC ≈ US$80,000, not a live exchange rate. Actual prices and payments are in BTC.",
  zeroPlanSummary:
    "Pro and Ultra include AstraZero: encryption keys are generated entirely on your client; the server stores only protected keys and encrypted content.",
  encryptionDetails: "Explore encryption options",
  legalUpdated: "Effective and last updated: 5 September 2026",
  zeroIncluded: "AstraZero · client-held protection",
  zeroHeadline: "AstraZero. Even the key stays protected.",
  zeroExplanation:
    "Each note gets its own random key, generated on your client. The client encrypts the content with AES-256-GCM and protects that key with your PIN before uploading. AstraNote receives encrypted content and a protected key—not your PIN or a usable plaintext key. Key generation and unlocking do not rely on server encryption environment variables.",
  zeroWarning:
    "Keep your PIN safe; we cannot recover it. Use a random 12–16 character PIN and a trusted device. Encrypted files still permit offline guesses of weak PINs. Note titles are not encrypted.",
  zeroSecurity: "No server-held plaintext key",
  zeroClientFeature: "Keys generated on your client",
  zeroNoteFeature: "A separate random key for every note",
  zeroBenefit:
    "Leaked server settings alone cannot directly decrypt your AstraZero content. Pair strong client-side protection with a strong PIN.",
  securityCaution:
    "Usable keys exist temporarily in client memory while you unlock or edit. A compromised device, malicious application code or a guessed PIN can still expose content. This protection is not a promise of absolute security.",
  lockedAccessTermsTitle: "What a locked note allows",
  lockedAccessTerms:
    "When a plan expires or usage exceeds its allowance, over-limit notes are locked immediately, largest first. Only the title, size, lock status and deletion deadlines remain visible; you may permanently delete the note or upgrade for sufficient allowance. Reading content or ciphertext, decryption-factor requests, editing, sharing, pinning or unpinning, moving, archiving or unarchiving, trash restoration, and viewing or restoring a previous version are refused by the server. Existing pins and archive status do not bypass the lock. An upgrade clears a lock only when the new allowance permits it. Continuous over-limit locks expire after 30 days; trash retains its original expiry and may be deleted sooner. Neither pinning nor upgrading extends a trash deadline. Content previously downloaded or decrypted on your own device cannot be recalled by the service.",
  privacyNotebookTitle: "Notes, search and client encryption",
  privacyNotebookData:
    "AstraNote keeps note titles, pin and archive status, encryption metadata, and—for eligible notes—one previous version and trash timestamps. Titles stay unencrypted. Title search runs on the note list already loaded by your client; search queries are not submitted to a search service, and content is not decrypted or indexed for search. Folders and tags are no longer supported; retired classification fields are removed when account metadata is saved, without deleting note content.",
  privacyRetention:
    "Ultra and Admin manual deletion normally moves an unlocked note into trash for the chosen 1, 3, 7, 14 or 30 days (default 7). Trash and the one previous version count toward storage. A permanent deletion, account deletion, or a 30-day over-limit deletion does not create a recoverable copy. Trash keeps its original deadline after downgrade, locking, or upgrade; an expired item cannot be restored even if scheduled file cleanup has not run yet. A remaining trash item keeps the navigation entry available after downgrade, but over-limit locked items cannot be restored until unlocked within an adequate allowance.",
  termsUpdated: "Effective and last updated: 5 September 2026",
  expiryLockNotice:
    "When your subscription expires, notes exceeding your remaining plan allowance are locked, largest first. You can only view their title and size, delete them, or upgrade to unlock. After 30 continuous days locked, they are permanently deleted. Trash keeps its original expiry, which may be sooner.",
  zeroServerFeature: "No reliance on server encryption environment variables",
});
Object.assign(I18N["zh-Hant"], {
  plusUsdEstimate: "約 US$2／月",
  proUsdEstimate: "約 US$5／月",
  ultraUsdEstimate: "約 US$10／月",
  usdEstimateNote:
    "美元約數以 1 BTC ≈ US$80,000 估算，非即時匯率；實際價格與付款均以 BTC 為準。",
  zeroPlanSummary:
    "Pro 與 Ultra 提供 AstraZero：加密金鑰完全由客戶端自行產生，伺服器只保存受保護的金鑰與密文。",
  encryptionDetails: "了解加密方式",
  legalUpdated: "生效及最後更新：2026 年 9 月 5 日",
  zeroIncluded: "AstraZero · 客戶端金鑰保護",
  zeroHeadline: "AstraZero，連金鑰也先加密。",
  zeroExplanation:
    "每篇筆記都有由客戶端獨立產生的隨機金鑰。客戶端以 AES-256-GCM 加密內容，再用你的 PIN 保護金鑰，才將資料上傳。AstraNote 收到的是密文與受保護的金鑰，不是你的 PIN 或可直接解密的明文金鑰；也不依賴伺服器加密環境變數來產生或解鎖金鑰。",
  zeroWarning:
    "PIN 由你自行保管，遺失無法找回。請使用隨機12～16個字元，並只在信任的裝置解鎖。取得加密檔案者仍能離線猜測弱 PIN。筆記標題不加密。",
  zeroSecurity: "伺服器不持有明文金鑰",
  zeroClientFeature: "金鑰在客戶端產生",
  zeroNoteFeature: "每篇筆記使用獨立隨機金鑰",
  zeroBenefit:
    "只取得外洩的伺服器設定，無法直接解密 AstraZero 內容。用強 PIN 搭配客戶端加密，為重要筆記多一層保護。",
  securityCaution:
    "解鎖或編輯期間，可用金鑰會短暫存在客戶端記憶體。受控制的裝置、惡意程式碼或被猜中的 PIN 仍可能使內容外洩；這不是絕對安全的保證。",
  lockedAccessTermsTitle: "筆記鎖定後的存取限制",
  lockedAccessTerms:
    "方案到期或超出額度時，超額筆記會立即由大到小鎖定。只保留標題、容量、鎖定狀態及刪除期限；你可永久刪除該筆記，或升級至足夠額度。後端拒絕讀取內容或密文、取得解密因子、編輯、分享、釘選或取消釘選、移動、封存或取消封存、垃圾桶還原，以及讀取或還原上一版本。既有釘選或封存狀態不能繞過鎖定。升級後仍須符合新額度才會解鎖。連續超額鎖定滿30天會永久刪除；垃圾桶維持原到期時間，可能更早清除。釘選或升級不會延長垃圾桶期限。使用者曾自行下載或在裝置上解密的內容，無法由本服務追溯收回。",
  privacyNotebookTitle: "筆記整理、搜尋與客戶端加密",
  privacyNotebookData:
    "AstraNote 保存筆記標題、釘選及封存狀態、加密中繼資料，以及符合資格筆記的上一版本與垃圾桶時間紀錄。標題不加密。標題搜尋僅在客戶端已載入的筆記清單中執行，不會將查詢字串傳至搜尋服務，也不會為搜尋解密或建立內容索引。資料夾與標籤功能已取消；舊分類欄位於帳號中繼資料儲存時清理，不刪除筆記內容。",
  privacyRetention:
    "Ultra 與 Admin 手動刪除未鎖定筆記時，原則上移至垃圾桶，依選擇保留1、3、7、14或30天，預設7天。垃圾桶與上一版本都計入空間。永久刪除、刪除帳號及超額鎖定滿30天的系統刪除，不會建立可復原副本。降級、鎖定或升級均不延長垃圾桶原到期時間；即使排程尚未實際清理檔案，已到期項目也不能還原。降級後只要仍有垃圾桶項目，就保留導覽入口；超額鎖定的項目須先取得足夠額度並解鎖才能還原。",
  termsUpdated: "生效及最後更新：2026 年 9 月 5 日",
  expiryLockNotice:
    "訂閱到期後，超出剩餘方案額度的筆記會從容量最大者開始鎖定。你只能查看標題與容量、刪除筆記，或升級解鎖；連續鎖定滿30天將永久刪除。垃圾桶維持原期限，可能更早清除。",
  zeroServerFeature: "不依賴伺服器加密環境變數",
});
Object.assign(I18N["ja"], {
  plusUsdEstimate: "月額 約 US$2",
  proUsdEstimate: "月額 約 US$5",
  ultraUsdEstimate: "月額 約 US$10",
  usdEstimateNote:
    "米ドルの目安は 1 BTC ≈ US$80,000 で換算しています。リアルタイムの為替レートではなく、実際の価格と支払いは BTC 建てです。",
  zeroPlanSummary:
    "Pro と Ultra の AstraZero は、暗号鍵をすべてクライアント側で生成し、サーバーには保護した鍵と暗号文のみ保存します。",
  encryptionDetails: "暗号化方式について",
  legalUpdated: "施行・最終更新：2026年9月5日",
  zeroIncluded: "AstraZero · クライアント側の鍵保護",
  zeroHeadline: "AstraZero。鍵まで暗号化。",
  zeroExplanation:
    "クライアントがノートごとに独立したランダム鍵を生成し、AES-256-GCM で内容を暗号化します。その鍵も PIN で保護してから送信します。AstraNote が受け取るのは暗号文と保護された鍵だけで、PIN や直接復号できる平文の鍵ではありません。鍵の生成や解除はサーバーの暗号化用環境変数に依存しません。",
  zeroWarning:
    "PIN はご自身で保管してください。再発行できません。ランダムな12～16文字と信頼できる端末を使ってください。暗号化ファイルから弱い PIN をオフラインで推測できる可能性は残ります。タイトルは暗号化されません。",
  zeroSecurity: "サーバーに平文の鍵を預けない",
  zeroClientFeature: "鍵はクライアントで生成",
  zeroNoteFeature: "ノートごとに独立したランダム鍵",
  zeroBenefit:
    "サーバー設定の漏えいだけでは AstraZero の内容を直接復号できません。強い PIN とクライアント側暗号化で大切なノートを守ります。",
  securityCaution:
    "解除・編集中は、利用可能な鍵がクライアントのメモリーに一時的に存在します。侵害された端末、悪意あるコード、推測された PIN からは内容が漏れる可能性があり、絶対的な安全の保証ではありません。",
  lockedAccessTermsTitle: "ロック中のノートの制限",
  lockedAccessTerms:
    "期限切れや上限超過では、容量の大きいノートから直ちにロックします。タイトル、サイズ、ロック状態、削除期限のみ表示でき、完全削除または十分な容量へのアップグレードが可能です。内容・暗号文・復号用因子の取得、編集、共有、ピン留めと解除、移動、アーカイブと解除、ゴミ箱からの復元、直前のバージョンの閲覧・復元はサーバー側で拒否します。既存のピンやアーカイブで回避できません。アップグレード後も新しい上限を満たす場合のみ解除します。上限超過のロックが30日続くと完全削除し、ゴミ箱は元の期限でそれより早く削除される場合があります。ピン留めやアップグレードでゴミ箱の期限は延長されません。すでに端末に保存・復号された内容をサービス側で回収することはできません。",
  privacyNotebookTitle: "ノート整理、検索とクライアント暗号化",
  privacyNotebookData:
    "タイトル、ピンとアーカイブの状態、暗号化メタデータ、対象ノートの直前のバージョンとゴミ箱の日時を保存します。タイトルは平文です。タイトル検索はクライアントに読み込み済みの一覧だけで行い、検索語を検索サービスに送信せず、内容の復号や検索用索引の作成もしません。フォルダーとタグは廃止し、アカウント情報の保存時に旧分類を除去します。ノートの内容は削除しません。",
  privacyRetention:
    "Ultra と Admin が未ロックのノートを手動削除した場合、通常はゴミ箱に移動し、1・3・7・14・30日から選んだ期間（既定7日）保管します。ゴミ箱と直前のバージョンも容量に含みます。完全削除、アカウント削除、30日間の上限超過によるシステム削除では復元用コピーを作りません。降格・ロック・アップグレードでも元の期限は延長せず、ファイル清掃の実行前でも期限後は復元できません。降格後もゴミ箱に項目があればナビゲーションを残しますが、上限超過でロックされた項目は十分な容量で解除するまで復元できません。",
  termsUpdated: "施行・最終更新：2026年9月5日",
  expiryLockNotice:
    "契約期限後、残りのプラン上限を超えるノートは容量の大きい順にロックされます。タイトルとサイズの確認、完全削除、アップグレードによる解除のみ可能です。ロックが30日続くと完全削除します。ゴミ箱は元の期限で、それより早く削除される場合があります。",
  zeroServerFeature: "サーバーの暗号化用環境変数に依存しない",
});

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const page = document.body.dataset.page || "";
const t = (key) => I18N[state.language]?.[key] || I18N.en[key] || key;
const formatBytes = (bytes) =>
  `${Number((Number(bytes || 0) / 1000).toFixed(2))} KB`;
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
const planDisplayName = (value) =>
  value ? `${value[0].toUpperCase()}${value.slice(1)}` : "Free";
const planDaysText = (days) =>
  t("daysRemaining").replace("{days}", Number(days || 0).toLocaleString());

function showPlanWarning(account) {
  const plan = account?.plan;
  if (!plan || !["plus", "pro", "ultra"].includes(plan.type)) return;
  const activeDays = plan[`${plan.type}Days`];
  if (activeDays < 1 || activeDays > 7) return;
  const loginMarker =
    state.session?.loginAt || state.session?.username || "current";
  const warningKey = `astranote_plan_warning:${loginMarker}:${plan.type}`;
  try {
    if (sessionStorage.getItem(warningKey)) return;
    sessionStorage.setItem(warningKey, "shown");
  } catch {}
  const fallback =
    plan.type === "ultra" && plan.proDays > 0
      ? "Pro"
      : plan.plusDays > 0 && plan.type !== "plus"
        ? "Plus"
        : "Free";
  modal({
    title: t("planEndingTitle").replace("{plan}", planDisplayName(plan.type)),
    body: t(fallback === "Free" ? "planEndingFree" : "planEndingFallback")
      .replace("{plan}", planDisplayName(plan.type))
      .replace("{days}", activeDays)
      .replace("{fallback}", fallback),
    confirm: t("renewNow"),
    cancel: t("later"),
    danger: false,
    onConfirm: () => {
      location.href = "/plans";
    },
  });
}

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
  const normalized = String(value || "")
    .replaceAll("-", "+")
    .replaceAll("_", "/");
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
  return [...digest].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function encryptionLabel(mode) {
  if (mode === "none") return t("unencrypted");
  if (mode === LEGACY_SCHYBRID_MODE) return "AstraConfidential SCHybrid";
  if ([LEGACY_CONFIDENTIAL_MODE, CONFIDENTIAL_MODE].includes(mode))
    return "AstraConfidential";
  if (mode === ASTRA_SECRET_MODE) return "AstraSecret";
  if (mode === ZERO_MODE) return "AstraZero";
  if (CURRENT_AES_MODES.has(mode)) return CURRENT_AES_MODES.get(mode);
  return mode.toUpperCase();
}
function isClientEncryptedMode(mode) {
  return [
    LEGACY_SCHYBRID_MODE,
    LEGACY_CONFIDENTIAL_MODE,
    ASTRA_SECRET_MODE,
    CONFIDENTIAL_MODE,
    ZERO_MODE,
  ].includes(mode);
}
function validVaultPin(pin, mode, allowEarlierConfidentialLength = false) {
  if ([LEGACY_SCHYBRID_MODE, ASTRA_SECRET_MODE].includes(mode))
    return /^\d{4,6}$/u.test(pin);
  if (mode === CONFIDENTIAL_MODE && allowEarlierConfidentialLength)
    return /^[\x21-\x7e]{4,64}$/u.test(pin);
  return /^[\x21-\x7e]{4,16}$/u.test(pin);
}
function vaultPinError(mode) {
  if (mode === ASTRA_SECRET_MODE) return t("astraSecretPinInvalid");
  if (mode === CONFIDENTIAL_MODE || mode === ZERO_MODE)
    return t("confidentialPinInvalid");
  return mode === LEGACY_SCHYBRID_MODE
    ? t("legacyVaultPinInvalid")
    : t("vaultPinInvalid");
}
async function deriveConfidentialKey(noteId, clientSalt, pin, mode) {
  if (!validVaultPin(pin, mode, true)) throw new Error(vaultPinError(mode));
  if (!state.account) throw new Error(t("error"));
  if (!window.hashwasm?.argon2id) throw new Error(t("vaultCryptoUnavailable"));
  const clientParts = [
    state.account.username.toLowerCase(),
    state.account.email.toLowerCase(),
    pin,
    noteId,
    clientSalt,
  ];
  const contexts = {
    [LEGACY_SCHYBRID_MODE]: "AstraConfidential SCHybrid v1",
    [LEGACY_CONFIDENTIAL_MODE]: "AstraConfidential v2",
    [ASTRA_SECRET_MODE]: "AstraSecret v1",
    [CONFIDENTIAL_MODE]: "AstraConfidential v3",
  };
  clientParts.unshift(contexts[mode]);
  const clientHash = await sha256Hex(clientParts.join("\0"));
  const { serverFactor } = await api("/api/vault/key-factor", {
    method: "POST",
    body: { noteId, clientSalt, clientHash, encryption: mode },
  });
  const keyBytes = await window.hashwasm.argon2id({
    password: `${pin}\0${serverFactor}`,
    salt: base64ToBytes(clientSalt),
    parallelism: 1,
    iterations:
      mode === CONFIDENTIAL_MODE
        ? 5
        : mode === ASTRA_SECRET_MODE
          ? 3
          : mode === LEGACY_CONFIDENTIAL_MODE
            ? 4
            : 3,
    memorySize: mode === CONFIDENTIAL_MODE ? 98304 : 65536,
    hashLength: 32,
    outputType: "binary",
  });
  return crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}
function confidentialAdditionalData(noteId, mode) {
  const contexts = {
    [LEGACY_SCHYBRID_MODE]: "AstraConfidential SCHybrid v1",
    [LEGACY_CONFIDENTIAL_MODE]: "AstraConfidential v2",
    [ASTRA_SECRET_MODE]: "AstraSecret v1",
    [CONFIDENTIAL_MODE]: "AstraConfidential v3",
  };
  return textEncoder.encode(
    `${contexts[mode]}\0${state.account.username.toLowerCase()}\0${noteId}`,
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
  if (mode === ZERO_MODE)
    return AstraZero.encrypt(
      state.account.username,
      noteId,
      clientSalt,
      pin,
      payload,
      existingKey,
    );
  const key =
    existingKey || (await deriveConfidentialKey(noteId, clientSalt, pin, mode));
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
    if (note.encryption === ZERO_MODE)
      return await AstraZero.decrypt(state.account.username, note, pin);
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
  const language = String(value || "")
    .toLowerCase()
    .replaceAll("_", "-");
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

function resetCaptcha(scope = "page") {
  if (scope === "action") state.actionCaptcha = null;
  else state.captcha = null;
  const mount =
    scope === "action"
      ? $("#global-captcha")
      : $(".nexa-captcha:not(#global-captcha)");
  if (!mount || !window.NexaCAPTCHA?.render) return;
  try {
    window.NexaCAPTCHA.render(mount).reset();
  } catch {
    // The user can still request a new verification from the CAPTCHA itself.
  }
}

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
    throw Object.assign(
      new Error(
        {
          note_conflict: t("noteConflict"),
          organization_required: t("organizationRequired"),
          storage_limit: t("storageLimit"),
          restore_quota: t("restoreQuota"),
          note_locked: t("noteLocked"),
        }[data.error] ||
          data.message ||
          t("error"),
      ),
      {
        status: response.status,
        code: data.error,
        data,
      },
    );
  return data;
}

function applyPageSeo() {
  const pageTitleKey = {
    trash: "trash",
    notes: "notes",
    settings: "settings",
    terms: "terms",
    privacy: "privacy",
  }[page];
  if (pageTitleKey) {
    document.title = `${t(pageTitleKey)} — AstraNote`;
    return;
  }
  if (page !== "plans") return;
  const title = `${t("plans")} — AstraNote`;
  const description = t("plansBody");
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

function renderPlanComparison() {
  const target = $("#plan-comparison-body");
  if (!target) return;
  const rows = [
    [
      "monthlyPrice",
      null,
      [t("freePrice"), "0.000025 BTC", "0.000060 BTC", "0.000125 BTC"],
    ],
    ["totalStorage", null, ["128 KB", "256 KB", "512 KB", "1024 KB"]],
    ["noteAllowance", null, ["20", "50", t("unlimited"), t("unlimited")]],
    ["basicEncryption", null, [true, true, true, true]],
    ["AstraSecret", null, [true, true, true, true]],
    ["AstraConfidential", null, [false, true, true, true]],
    ["organizeFeature", "organizeDetail", [false, true, true, true]],
    ["AstraZero", null, [false, false, true, true]],
    ["recoveryFeature", "recoveryDetail", [false, false, false, true]],
    ["prioritySupport", "prioritySupportDetail", [false, false, false, true]],
  ];
  target.replaceChildren(
    ...rows.map(([title, detail, values]) => {
      const row = document.createElement("tr");
      const heading = document.createElement("th");
      heading.scope = "row";
      const label = document.createElement("span");
      label.textContent = t(title);
      heading.append(label);
      if (detail) {
        const small = document.createElement("small");
        small.textContent = t(detail);
        heading.append(small);
      }
      row.append(heading);
      for (const value of values) {
        const cell = document.createElement("td");
        if (typeof value === "boolean") {
          const icon = document.createElement("i");
          icon.className = `fa-solid ${value ? "fa-check" : "fa-minus"}`;
          icon.setAttribute("aria-hidden", "true");
          const text = document.createElement("span");
          text.className = "sr-only";
          text.textContent = t(
            value ? "featureIncluded" : "featureNotIncluded",
          );
          cell.className = value ? "comparison-yes" : "comparison-no";
          cell.append(icon, text);
        } else cell.textContent = value;
        row.append(cell);
      }
      return row;
    }),
  );
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
  renderPlanComparison();
  if (state.billingOrders) renderOrders(state.billingOrders);
  $$("[data-retention-days]").forEach((option) => {
    option.textContent = `${option.dataset.retentionDays} ${t("days")}`;
  });
}

function buildNav() {
  const authenticated = Boolean(state.session?.authenticated);
  const trashLink =
    authenticated &&
    (state.account?.plan.canRecover || state.account?.trash?.length)
      ? '<a class="nav-link" href="/trash"><i class="fa-solid fa-trash-can" aria-hidden="true"></i> <span data-i18n="trash"></span></a>'
      : "";
  const protectedLinks = authenticated
    ? `
    <a class="nav-link" href="/dashboard"><i class="fa-solid fa-chart-line"></i> <span data-i18n="dashboard"></span></a>
    <a class="nav-link" href="/notes"><i class="fa-solid fa-book"></i> <span data-i18n="notes"></span></a>
    ${trashLink}
    <a class="nav-link plans-nav-link" href="/plans"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> <span data-i18n="plans"></span></a>
    <a class="nav-link" href="/settings"><i class="fa-solid fa-gear"></i> <span data-i18n="settings"></span></a>`
    : "";
  const publicPlansLink = authenticated
    ? ""
    : '<a class="nav-link plans-nav-link" href="/plans"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> <span data-i18n="plans"></span></a>';
  const nav = document.createElement("nav");
  nav.className = `site-nav ${page === "home" ? "" : "solid"}`;
  nav.dataset.i18nAriaLabel = "primaryNavigation";
  const reportedPlanName = String(
    state.account?.plan?.type || "",
  ).toLowerCase();
  const planName = ["free", "plus", "pro", "ultra", "admin"].includes(
    reportedPlanName,
  )
    ? reportedPlanName
    : null;
  const planSuffix =
    authenticated && planName
      ? `<small class="brand-plan brand-plan--${planName}">${planName}</small>`
      : "";
  nav.innerHTML = `<a class="brand" href="/"><img src="/asset/logo.svg" alt=""><span>AstraNote</span>${planSuffix}</a>
    <button class="mobile-toggle" type="button" data-i18n-aria-label="menu" aria-expanded="false"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
    <div class="nav-links"><a class="nav-link" href="/"><i class="fa-solid fa-house" aria-hidden="true"></i> <span data-i18n="home"></span></a>${protectedLinks}${publicPlansLink}</div>
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
    if (
      ["dashboard", "notes", "trash", "note", "shared", "settings"].includes(
        page,
      )
    )
      location.reload();
  });
  $$(".nav-link", nav).forEach((link) => {
    if (
      link.getAttribute("href") === location.pathname ||
      (link.getAttribute("href") === "/plans" &&
        location.pathname.startsWith("/plans"))
    )
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
  footer.innerHTML = `<div class="shell footer-inner"><span data-i18n="copyright"></span><div class="footer-links"><a href="mailto:astranote@nxlabtw.com"><i class="fa-regular fa-envelope"></i> astranote@nxlabtw.com</a><a href="/terms"><i class="fa-solid fa-scale-balanced"></i> <span data-i18n="terms"></span></a><a href="/privacy"><i class="fa-solid fa-shield-halved"></i> <span data-i18n="privacy"></span></a><a href="https://github.com/NeuralNexusLab-nh/AstraNote" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> <span data-i18n="source"></span></a><a href="https://nxlabtw.com" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> NeuralNexusLab</a></div></div>`;
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
  const previousFocus = document.activeElement;
  document.body.classList.add("modal-open");
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  const dialog = document.createElement("section");
  dialog.className = "modal";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  const heading = document.createElement("h2");
  heading.id = `dialog-title-${randomHex(4)}`;
  dialog.setAttribute("aria-labelledby", heading.id);
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
      captcha.inert = true;
      captcha.setAttribute("aria-hidden", "true");
      document.body.append(captcha);
    }
    backdrop.remove();
    document.body.classList.remove("modal-open");
    if (previousFocus?.isConnected)
      previousFocus.focus({ preventScroll: true });
  };
  const cancelDialog = () => {
    close();
    onCancel?.();
  };
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !confirmButton.disabled) {
      event.preventDefault();
      cancelDialog();
    }
    if (
      event.key === "Enter" &&
      event.target.tagName === "INPUT" &&
      !confirmButton.disabled
    ) {
      event.preventDefault();
      confirmButton.click();
    }
    if (event.key === "Tab") {
      const focusable = [
        ...dialog.querySelectorAll(
          "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea, a[href], [tabindex='0']",
        ),
      ].filter((element) => element.getClientRects().length);
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
  requestAnimationFrame(() =>
    (dialog.querySelector("input, select, textarea") || cancelButton).focus(),
  );
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
      note.encryption === ZERO_MODE
        ? t("zeroPin")
        : note.encryption === ASTRA_SECRET_MODE
          ? t("astraSecretPin")
          : note.encryption === CONFIDENTIAL_MODE
            ? t("confidentialPin")
            : note.encryption === LEGACY_SCHYBRID_MODE
              ? t("legacyVaultPin")
              : t("vaultPin");
    const input = document.createElement("input");
    input.id = `unlock-pin-${randomHex(4)}`;
    label.htmlFor = input.id;
    input.type = "text";
    const numericPin = [LEGACY_SCHYBRID_MODE, ASTRA_SECRET_MODE].includes(
      note.encryption,
    );
    input.inputMode = numericPin ? "numeric" : "text";
    input.autocomplete = "off";
    input.minLength = 4;
    input.maxLength = numericPin
      ? 6
      : note.encryption === CONFIDENTIAL_MODE
        ? 64
        : 16;
    input.pattern = numericPin
      ? "[0-9]{4,6}"
      : note.encryption === CONFIDENTIAL_MODE
        ? "[!-~]{4,64}"
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
        note.encryption === ZERO_MODE
          ? t("zeroWarning")
          : note.encryption === ASTRA_SECRET_MODE
            ? t("astraSecretExplanation")
            : note.encryption === CONFIDENTIAL_MODE
              ? t("unlockConfidentialBody")
              : note.encryption === LEGACY_SCHYBRID_MODE
                ? t("unlockLegacyVaultBody")
                : t("unlockVaultBody"),
      content,
      confirm: t("unlock"),
      danger: false,
      onCancel: () =>
        reject(Object.assign(new Error("cancelled"), { cancelled: true })),
      onConfirm: async (close) => {
        if (!validVaultPin(input.value, note.encryption, true))
          throw new Error(vaultPinError(note.encryption));
        const decrypted = await decryptConfidentialPayload(note, input.value);
        if (note.payloadVersion !== 2 && !note.isPrevious) {
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
                revision: note.revision,
              },
            });
            note.name = decrypted.payload.name;
            note.encrypted = encrypted;
            note.payloadVersion = 2;
          } catch (error) {
            console.warn(
              "Could not migrate the legacy encrypted title.",
              error,
            );
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
  resetCaptcha("action");
  const content = document.createElement("div");
  if (extra) content.append(extra);
  const captcha = $("#global-captcha");
  if (captcha) {
    captcha.classList.remove("captcha-parking");
    captcha.inert = false;
    captcha.removeAttribute("aria-hidden");
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
      try {
        const result = await run();
        close();
        if (result.redirect) location.href = result.redirect;
        else location.reload();
      } catch (error) {
        resetCaptcha("action");
        throw error;
      }
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

function noteAction(icon, label, run, danger = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `btn icon-btn note-action${danger ? " btn-danger" : ""}`;
  button.setAttribute("aria-label", label);
  button.title = label;
  const image = document.createElement("i");
  image.className = `fa-solid ${icon}`;
  image.setAttribute("aria-hidden", "true");
  button.append(image);
  button.onclick = async (event) => {
    event.stopPropagation();
    button.disabled = true;
    try {
      await run();
    } catch (error) {
      toast(error.message || t("error"));
    } finally {
      button.disabled = false;
    }
  };
  return button;
}

function upgradeNoteLink() {
  const link = document.createElement("a");
  link.href = "/plans";
  link.className = "btn note-upgrade-link";
  link.innerHTML =
    '<i class="fa-solid fa-arrow-up-right-dots" aria-hidden="true"></i><span></span>';
  $("span", link).textContent = t("unlockByUpgrade");
  return link;
}

function noteRow(note, deletable = false, onChange = () => location.reload()) {
  const row = document.createElement("article");
  row.className = `note-row${note.locked ? " note-row-locked" : ""}${note.pinned ? " note-row-pinned" : ""}`;
  row.dataset.noteId = note.id;
  const visibleName = note.name || t("confidentialNote");
  const link = document.createElement(note.locked ? "div" : "a");
  link.className = "note-card-link";
  if (!note.locked) {
    link.href = `/notes/${note.id}`;
    link.setAttribute("aria-label", `${t("open")}: ${visibleName}`);
  }
  const main = document.createElement("div");
  main.className = "note-main";
  const name = document.createElement("strong");
  name.textContent = visibleName;
  const tag = document.createElement("small");
  tag.textContent = note.locked
    ? t("noteLocked")
    : encryptionLabel(note.encryption);
  const badges = document.createElement("div");
  badges.className = "note-badges";
  if (note.pinned) {
    const pin = document.createElement("small");
    pin.className = "note-pin-badge";
    pin.innerHTML =
      '<i class="fa-solid fa-thumbtack" aria-hidden="true"></i><span></span>';
    $("span", pin).textContent = t("pinned");
    badges.append(pin);
  }
  badges.append(tag);
  if (note.archived) {
    const archived = document.createElement("small");
    archived.textContent = t("archivedNotes");
    badges.append(archived);
  }
  main.append(name, badges);
  const metadata = document.createElement("div");
  metadata.className = "note-metadata";
  const chars = document.createElement("span");
  chars.className = "note-meta note-characters";
  chars.textContent = note.locked
    ? ""
    : note.characters === null
      ? t("hiddenCharacters")
      : `${note.characters.toLocaleString()} ${t("characters")}`;
  const size = document.createElement("span");
  size.className = "note-meta note-size";
  size.textContent = formatBytes(note.bytes);
  metadata.append(chars, size);
  const updated = document.createElement("small");
  updated.className = "note-meta note-updated";
  updated.textContent = note.locked
    ? t("scheduledDeletion").replace(
        "{date}",
        formatUtc(note.scheduledDeletionAt),
      )
    : `${t("updated")} ${formatUtc(note.updatedAt)}`;
  metadata.append(updated);
  link.append(main, metadata);
  row.append(link);
  if (deletable) {
    const actions = document.createElement("div");
    actions.className = "note-card-actions";
    if (note.locked) actions.append(upgradeNoteLink());
    if (state.account?.plan.canOrganize && !note.locked) {
      const change = async (action, value) => {
        await api("/api/notes/organize", {
          method: "PATCH",
          body: { ids: [note.id], action, value },
        });
        await onChange();
      };
      const pin = noteAction(
        "fa-thumbtack",
        t(note.pinned ? "unpin" : "pin"),
        () => change("pin", !note.pinned),
      );
      pin.setAttribute("aria-pressed", String(Boolean(note.pinned)));
      actions.append(
        pin,
        noteAction(
          note.archived ? "fa-box-open" : "fa-box-archive",
          t(note.archived ? "unarchive" : "archive"),
          () => change("archive", !note.archived),
        ),
      );
    }
    actions.append(
      noteAction(
        "fa-trash-can",
        t(
          state.account?.plan.canRecover && !note.locked
            ? "moveToTrash"
            : "delete",
        ),
        () => deleteNote(note),
        true,
      ),
    );
    row.append(actions);
  } else if (note.locked) {
    const actions = document.createElement("div");
    actions.className = "note-card-actions";
    actions.append(upgradeNoteLink());
    row.append(actions);
  } else {
    const open = document.createElement("span");
    open.className = "note-open";
    open.setAttribute("aria-hidden", "true");
    open.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    row.append(open);
  }
  return row;
}

function deleteNote(note) {
  actionModal({
    title: t(
      state.account?.plan.canRecover && !note.locked
        ? "trashNoteTitle"
        : "deleteNoteTitle",
    ),
    body: t(
      state.account?.plan.canRecover && !note.locked
        ? "trashNoteBody"
        : "deleteNoteBody",
    ),
    confirm: t(
      state.account?.plan.canRecover && !note.locked ? "moveToTrash" : "delete",
    ),
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
      const next = params.get("next");
      location.href =
        !cancellation && next && /^\/(?!\/)/u.test(next)
          ? next
          : result.redirect;
    } catch (error) {
      resetCaptcha();
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
  $("#note-count").textContent =
    account.maxNotes === null
      ? `${account.noteCount} / ${t("unlimited")}`
      : `${account.noteCount} / ${account.maxNotes}`;
  $("#note-limit-caption").textContent =
    account.maxNotes === null
      ? t("unlimited")
      : t("maxNotesDynamic").replace("{count}", account.maxNotes);
  $("#storage-count").textContent =
    account.maxBytes === null
      ? `${formatBytes(account.usedBytes)} / ${t("unlimited")}`
      : `${formatBytes(account.usedBytes)} / ${formatBytes(account.maxBytes)}`;
  $("#age-count").textContent = Math.max(
    0,
    Math.floor((Date.now() - Date.parse(account.createdAt)) / 864e5),
  );
  $(".meter span").style.setProperty(
    "--progress",
    `${account.maxBytes === null ? 0 : Math.min(100, (account.usedBytes / account.maxBytes) * 100)}%`,
  );
  $("#dashboard-plan").textContent = planDisplayName(account.plan.type);
  $("#dashboard-ultra-days").textContent =
    account.plan.type === "admin"
      ? t("unlimited")
      : planDaysText(account.plan.ultraDays);
  $("#dashboard-pro-days").textContent =
    account.plan.type === "admin"
      ? t("unlimited")
      : planDaysText(account.plan.proDays);
  $("#dashboard-plus-days").textContent =
    account.plan.type === "admin"
      ? t("unlimited")
      : planDaysText(account.plan.plusDays);
  if (account.plan.type === "admin") $(".account-plan-card .btn").hidden = true;
  const lockedWarning = $("#dashboard-locked-warning");
  if (account.lockedNoteCount) {
    lockedWarning.hidden = false;
    lockedWarning.innerHTML = `<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><span>${t("lockedAccountWarning").replace("{count}", account.lockedNoteCount)}</span><a class="btn" href="/plans"><i class="fa-solid fa-arrow-up-right-dots" aria-hidden="true"></i><span>${t("viewPlans")}</span></a>`;
  }
  const list = $("#note-list");
  list.replaceChildren(
    ...filterNotes(account.notes)
      .filter((note, index) => note.pinned || index < 6)
      .map((note) => noteRow(note)),
  );
  if (!account.notes.length)
    list.innerHTML = `<div class="empty-state"><div class="empty-orbit"></div><p>${t("noNotes")}</p></div>`;
}

function filterNotes(notes, query = "", mode = "active") {
  const search = query.normalize("NFKC").toLocaleLowerCase().trim();
  return notes
    .filter((note) => {
      if (note.trashedAt) return false;
      if (
        mode === "pinned"
          ? !note.pinned
          : mode === "archived"
            ? !note.archived
            : note.archived && !note.pinned
      )
        return false;
      return String(note.name || "")
        .normalize("NFKC")
        .toLocaleLowerCase()
        .includes(search);
    })
    .sort(
      (a, b) =>
        Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
        Date.parse(b.updatedAt) - Date.parse(a.updatedAt) ||
        a.id.localeCompare(b.id),
    );
}

async function initNotes() {
  let account = await requireAccount();
  if (!account) return;
  const list = $("#note-list");
  $("#batch-controls").hidden = !account.plan.canOrganize;
  $("#organization-upgrade").hidden = account.plan.canOrganize;
  const search = $("#note-search");
  const filterToggle = $("#note-filter-toggle");
  const filters = $("#note-filters");
  let mode = "active";
  const selected = new Set();
  let visible = [];
  let batchBusy = false;
  const selectedActions = () =>
    selectionActions(visible.filter((note) => selected.has(note.id)));
  const updateSelection = () => {
    $("#selected-count").textContent = t("selectedNotes").replace(
      "{count}",
      selected.size,
    );
    $("#selected-count").hidden = $("#batch-actions").hidden = !selected.size;
    const actions = selectedActions();
    $("#batch-pin span").textContent = t(actions.pin ? "pin" : "unpin");
    $("#batch-archive span").textContent = t(
      actions.archive ? "archive" : "unarchive",
    );
    $("#batch-delete span").textContent = t(
      account.plan.canRecover ? "moveToTrash" : "delete",
    );
    $$("#batch-actions button").forEach((button) => {
      button.disabled = batchBusy || !selected.size;
    });
    $$(".note-select input", list).forEach((input) => {
      input.disabled = batchBusy;
    });
    const selectable = visible.filter((note) => !note.locked);
    $("#select-all").checked =
      selectable.length > 0 &&
      selectable.every((note) => selected.has(note.id));
    $("#select-all").disabled = batchBusy || !selectable.length;
    $("#select-all").indeterminate =
      selected.size > 0 && !$("#select-all").checked;
  };
  const refresh = async () => {
    account = state.account = await api("/api/account");
    render(false);
  };
  const render = (resetSelection = true) => {
    if (resetSelection) selected.clear();
    visible = filterNotes(account.notes, search.value, mode);
    const selectableIds = new Set(
      visible.filter((note) => !note.locked).map((note) => note.id),
    );
    for (const id of selected) if (!selectableIds.has(id)) selected.delete(id);
    $("#notes-result-count").textContent =
      `${t(mode === "pinned" ? "pinned" : mode === "archived" ? "archivedNotes" : "notes")} · ${visible.length}`;
    list.replaceChildren(
      ...visible.map((note) => {
        const row = noteRow(note, true, refresh);
        if (account.plan.canOrganize && !note.locked) {
          const label = document.createElement("label");
          label.className = "note-select";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = selected.has(note.id);
          checkbox.setAttribute(
            "aria-label",
            `${t("selectNote")}: ${note.name}`,
          );
          checkbox.onchange = () => {
            if (checkbox.checked && selected.size >= 100) {
              checkbox.checked = false;
              toast(t("selectionLimit"));
              return;
            }
            checkbox.checked ? selected.add(note.id) : selected.delete(note.id);
            updateSelection();
          };
          label.append(checkbox);
          label.onclick = (event) => event.stopPropagation();
          label.onkeydown = (event) => event.stopPropagation();
          row.classList.add("note-row-selectable");
          row.prepend(label);
        }
        return row;
      }),
    );
    if (!visible.length)
      list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><p>${t(account.notes.length ? "noMatchingNotes" : "noNotes")}</p></div>`;
    updateSelection();
  };
  search.addEventListener("input", () => render());
  const closeFilters = () => {
    filters.hidden = true;
    filterToggle.setAttribute("aria-expanded", "false");
  };
  filterToggle.onclick = () => {
    filters.hidden = !filters.hidden;
    filterToggle.setAttribute("aria-expanded", String(!filters.hidden));
  };
  for (const button of $$("[data-note-filter]")) {
    button.onclick = () => {
      mode = button.dataset.noteFilter;
      $$("[data-note-filter]").forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      $("#filter-dot").hidden = mode === "active";
      filterToggle.classList.toggle("has-filter", mode !== "active");
      render();
      closeFilters();
      filterToggle.focus();
    };
  }
  $("#notes-toolbar").addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !filters.hidden) {
      closeFilters();
      filterToggle.focus();
      event.preventDefault();
    }
  });
  document.addEventListener("click", (event) => {
    if (!$("#notes-toolbar").contains(event.target)) closeFilters();
  });
  $("#select-all").onchange = (event) => {
    selected.clear();
    if (event.target.checked)
      visible
        .filter((note) => !note.locked)
        .slice(0, 100)
        .forEach((note) => selected.add(note.id));
    $$(".note-select input", list).forEach((input) => {
      const index = [...list.children].indexOf(input.closest(".note-row"));
      input.checked = selected.has(visible[index].id);
    });
    updateSelection();
  };
  const runBatch = async (action) => {
    if (batchBusy || !selected.size) return;
    const ids = [...selected],
      value = selectedActions()[action];
    batchBusy = true;
    updateSelection();
    try {
      await api("/api/notes/organize", {
        method: "PATCH",
        body: { ids, action, value },
      });
      await refresh();
    } catch (error) {
      toast(error.message);
    } finally {
      batchBusy = false;
      updateSelection();
    }
  };
  $("#batch-pin").onclick = () => runBatch("pin");
  $("#batch-archive").onclick = () => runBatch("archive");
  $("#batch-delete").onclick = () => {
    if (selected.size && !batchBusy) deleteSelectedNotes([...selected]);
  };
  render();
}

function selectionActions(notes) {
  return {
    pin: !notes.length || !notes.every((note) => note.pinned),
    archive: !notes.length || !notes.every((note) => note.archived),
  };
}

function deleteSelectedNotes(ids) {
  actionModal({
    title: t(
      state.account.plan.canRecover ? "trashNoteTitle" : "deleteNoteTitle",
    ),
    body: t(state.account.plan.canRecover ? "trashNoteBody" : "deleteNoteBody"),
    confirm: t(state.account.plan.canRecover ? "moveToTrash" : "delete"),
    run: () =>
      api("/api/notes/batch-delete", {
        method: "POST",
        body: { ids, captcha: state.actionCaptcha },
      }),
  });
}

async function initTrash() {
  const account = await requireAccount();
  if (!account) return;
  const list = $("#trash-list");
  list.replaceChildren(
    ...account.trash.map((note) => {
      const row = document.createElement("article");
      row.className = `trash-row${note.locked ? " note-row-locked" : ""}`;
      row.dataset.noteId = note.id;
      const main = document.createElement("div");
      main.className = "note-main";
      const title = document.createElement("strong");
      title.textContent = note.name || t("note");
      const expiry = document.createElement("small");
      expiry.textContent = t("trashUntil").replace(
        "{date}",
        formatUtc(note.trashExpiresAt),
      );
      const size = document.createElement("small");
      size.textContent = formatBytes(note.bytes);
      main.append(title, size, expiry);
      if (note.locked) {
        const warning = document.createElement("small");
        warning.className = "trash-locked-message";
        warning.textContent = t("trashLocked");
        main.append(warning);
      }
      const controls = document.createElement("div");
      controls.className = "trash-actions";
      const restore = document.createElement("button");
      restore.type = "button";
      restore.className = "btn";
      restore.innerHTML = `<i class="fa-solid fa-trash-arrow-up" aria-hidden="true"></i><span>${t("restore")}</span>`;
      restore.onclick = () =>
        modal({
          title: t("restore"),
          body: t("restoreNoteBody"),
          confirm: t("restore"),
          onConfirm: async (close) => {
            await api(`/api/trash/${note.id}/restore`, {
              method: "POST",
              body: {},
            });
            close();
            location.reload();
          },
        });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn btn-danger";
      remove.innerHTML = `<i class="fa-solid fa-trash-can" aria-hidden="true"></i><span>${t("permanentlyDelete")}</span>`;
      remove.onclick = () =>
        actionModal({
          title: t("deleteNoteTitle"),
          body: t("deleteNoteBody"),
          confirm: t("permanentlyDelete"),
          run: () =>
            api(`/api/trash/${note.id}`, {
              method: "DELETE",
              body: { captcha: state.actionCaptcha },
            }),
        });
      controls.append(note.locked ? upgradeNoteLink() : restore, remove);
      row.append(main, controls);
      return row;
    }),
  );
  if (!account.trash.length)
    list.innerHTML = `<div class="empty-state"><p>${t("trashEmpty")}</p></div>`;
}

async function showPrevious(note) {
  const previous = await api(`/api/notes/${note.id}/previous`);
  previous.isPrevious = true;
  if (isClientEncryptedMode(previous.encryption)) {
    const unlocked = await unlockConfidential(previous);
    previous.name = unlocked.payload.name;
    previous.content = unlocked.payload.content;
  }
  $("#previous-title").textContent = previous.name;
  $("#previous-time").textContent = formatUtc(previous.updatedAt);
  $("#previous-content").textContent = previous.content;
  $("#previous-panel").hidden = false;
  $("#previous-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  $("#close-previous").onclick = () => {
    $("#previous-panel").hidden = true;
    $("#previous-content").textContent = "";
  };
  $("#restore-previous").onclick = () =>
    modal({
      title: t("restoreVersion"),
      body: t("restoreVersionBody"),
      confirm: t("restore"),
      onConfirm: async (close) => {
        await api(`/api/notes/${note.id}/previous/restore`, {
          method: "POST",
          body: { revision: previous.revision },
        });
        close();
        location.reload();
      },
    });
}

async function initNewNote() {
  const account = await requireAccount();
  if (!account) return;
  const form = $("#note-form");
  const encryption = form.encryption;
  const vaultFields = $("#vault-fields");
  const protectedOptions = [
    ...encryption.querySelectorAll(
      '[value$="-new"], [value="astra-secret-v1"], [value="astra-confidential-v3"]',
    ),
  ];
  requireManualPinEntry(form.vaultPin);
  requireManualPinEntry(form.vaultPinConfirmation);
  if (!account.vaultAvailable)
    protectedOptions.forEach((option) => {
      option.disabled = true;
    });
  const confidentialOption = encryption.querySelector(
    `[value="${CONFIDENTIAL_MODE}"]`,
  );
  if (!account.plan.canCreateConfidential) confidentialOption.disabled = true;
  encryption.querySelector(`[value="${ZERO_MODE}"]`).disabled =
    !account.plan.canCreateZero;
  const updateEncryptionFields = () => {
    const enabled = [ASTRA_SECRET_MODE, CONFIDENTIAL_MODE, ZERO_MODE].includes(
      encryption.value,
    );
    const astraSecret = encryption.value === ASTRA_SECRET_MODE;
    const zero = encryption.value === ZERO_MODE;
    vaultFields.hidden = !enabled;
    form.vaultPin.required = enabled;
    form.vaultPinConfirmation.required = enabled;
    if (enabled) {
      form.vaultPin.inputMode = astraSecret ? "numeric" : "text";
      form.vaultPinConfirmation.inputMode = astraSecret ? "numeric" : "text";
      form.vaultPin.minLength = 4;
      form.vaultPinConfirmation.minLength = 4;
      form.vaultPin.maxLength = astraSecret ? 6 : 16;
      form.vaultPinConfirmation.maxLength = astraSecret ? 6 : 16;
      form.vaultPin.pattern = astraSecret ? "[0-9]{4,6}" : "[!-~]{4,16}";
      form.vaultPinConfirmation.pattern = form.vaultPin.pattern;
      const pinLabel = $("label[for='vault-pin']");
      pinLabel.dataset.i18n = astraSecret
        ? "astraSecretPin"
        : zero
          ? "zeroPin"
          : "confidentialPin";
      pinLabel.textContent = t(pinLabel.dataset.i18n);
      $(".vault-explanation h3 span").removeAttribute("data-i18n");
      $(".vault-explanation h3 span").textContent = astraSecret
        ? "AstraSecret"
        : zero
          ? "AstraZero"
          : "AstraConfidential";
      const explanation = $(".vault-explanation p");
      explanation.dataset.i18n = astraSecret
        ? "astraSecretExplanation"
        : zero
          ? "zeroExplanation"
          : "vaultExplanation";
      explanation.textContent = t(explanation.dataset.i18n);
      const warning = $$(".vault-explanation p")[1];
      warning.dataset.i18n = astraSecret
        ? "astraSecretPinWarning"
        : zero
          ? "zeroWarning"
          : "vaultPinWarning";
      warning.textContent = t(warning.dataset.i18n);
    }
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
      if ([ASTRA_SECRET_MODE, CONFIDENTIAL_MODE, ZERO_MODE].includes(mode)) {
        if (mode !== ZERO_MODE && !account.vaultAvailable)
          throw new Error(t("vaultUnavailable"));
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
      resetCaptcha();
      message.textContent = error.message;
      button.disabled = false;
    }
  });
}

function currentNoteId() {
  return location.pathname.split("/").filter(Boolean)[1];
}
function renderLockedNote(note) {
  const noteName = $("#note-name");
  noteName.removeAttribute("data-i18n");
  noteName.textContent = note.name;
  $(".note-stats").innerHTML =
    `<span class="pill"><i class="fa-solid fa-lock" aria-hidden="true"></i> ${t("noteLocked")}</span><span><i class="fa-solid fa-hard-drive" aria-hidden="true"></i> ${formatBytes(note.bytes)}</span>`;
  $(".note-controls").hidden = true;
  $(".note-secondary-actions").hidden = true;
  $("#note-content").hidden = true;
  const panel = $("#locked-note-panel");
  panel.hidden = false;
  $("#locked-delete-date").textContent = t("scheduledDeletion").replace(
    "{date}",
    formatUtc(note.scheduledDeletionAt),
  );
  $("#locked-delete-note").onclick = () => deleteNote(note);
}
async function initNote() {
  if (!(await requireAccount())) return;
  let note;
  try {
    note = await api(`/api/notes/${currentNoteId()}`);
  } catch (error) {
    if (error.code === "note_locked" && error.data?.note) {
      renderLockedNote(error.data.note);
      return;
    }
    throw error;
  }
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
  const reference =
    state.account.notes.find((item) => item.id === note.id) || {};
  for (const [action, key] of [
    ["pin", "pinned"],
    ["archive", "archived"],
  ]) {
    const button = $(`#${action}-note`);
    button.hidden = !state.account.plan.canOrganize;
    $("span", button).textContent = t(
      reference[key] ? (action === "pin" ? "unpin" : "unarchive") : action,
    );
    button.onclick = async () => {
      button.disabled = true;
      try {
        await api("/api/notes/organize", {
          method: "PATCH",
          body: { ids: [note.id], action, value: !reference[key] },
        });
        location.reload();
      } catch (error) {
        toast(error.message);
        button.disabled = false;
      }
    };
  }
  $("#previous-note").hidden = !note.hasPrevious;
  $("#previous-note").onclick = () =>
    showPrevious(note).catch((error) => {
      if (!error.cancelled) toast(error.message);
    });
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
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
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
  let note;
  try {
    note = await api(`/api/notes/${currentNoteId()}`);
  } catch (error) {
    if (error.code === "note_locked") {
      location.replace(`/notes/${currentNoteId()}`);
      return;
    }
    throw error;
  }
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
      const body = {
        name: name.value,
        content: content.value,
        revision: note.revision,
      };
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
          note.encryption === ZERO_MODE ? note.encrypted : null,
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
  $("#settings-plan").textContent = planDisplayName(account.plan.type);
  $("#priority-support").hidden = !account.plan.canRecover;
  $("#settings-ultra-days").textContent =
    account.plan.type === "admin"
      ? t("unlimited")
      : planDaysText(account.plan.ultraDays);
  $("#trash-settings").hidden = !account.plan.canRecover;
  form.trashDays.value = account.settings.trashDays;
  $("#settings-pro-days").textContent =
    account.plan.type === "admin"
      ? t("unlimited")
      : planDaysText(account.plan.proDays);
  $("#settings-plus-days").textContent =
    account.plan.type === "admin"
      ? t("unlimited")
      : planDaysText(account.plan.plusDays);
  if (account.plan.type === "admin")
    $(".plan-settings-card a[href='/plans']").hidden = true;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const saveButton = $("#save-settings");
    if (saveButton.disabled) return;
    saveButton.disabled = true;
    try {
      await api("/api/settings", {
        method: "PATCH",
        body: {
          displayName: form.displayName.value,
          theme: form.theme.value,
          language: form.language.value,
          ...(account.plan.canRecover
            ? { trashDays: Number(form.trashDays.value) }
            : {}),
        },
      });
      state.theme = form.theme.value;
      state.language = form.language.value;
      setStoredPreference("astranote_theme", state.theme);
      setStoredPreference("astranote_language", state.language);
      applyLocale();
      toast(t("saved"));
    } catch (error) {
      toast(error.message);
    } finally {
      saveButton.disabled = false;
    }
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

function billingStatusText(status) {
  const key = {
    confirming: "orderConfirming",
    pending: "orderPending",
    paid: "orderPaid",
    failed: "orderFailed",
    expired: "orderExpired",
    created: "orderCreated",
    verification_error: "orderVerificationError",
    coupon_reused: "orderCouponReused",
  }[status];
  return t(key || "orderVerificationError");
}

function formatBitcoin(sats) {
  return `${(Number(sats) / 1e8).toFixed(8)} BTC`;
}

function orderRow(order) {
  const row = document.createElement("article");
  row.className = "order-row";
  const main = document.createElement("div");
  main.innerHTML = `<strong>AstraNote ${planDisplayName(order.plan)}</strong><small>${order.days} ${t("days")} · ${formatUtc(order.createdAt)}</small>`;
  const amount = document.createElement("span");
  amount.className = "order-amount";
  amount.textContent = formatBitcoin(order.chargedSats ?? order.expectedSats);
  const status = document.createElement("span");
  status.className = `pill order-status order-status-${order.localStatus}`;
  status.textContent = billingStatusText(order.localStatus);
  if (order.localStatus === "coupon_reused")
    status.dataset.i18n = "orderCouponReused";
  row.append(main, amount, status);
  if (
    ["confirming", "pending"].includes(order.localStatus) &&
    order.paymentUrl
  ) {
    const link = document.createElement("a");
    link.className = "btn";
    link.href = order.paymentUrl;
    link.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i><span>${t("continuePayment")}</span>`;
    row.append(link);
  }
  if (order.localStatus === "coupon_reused") {
    const link = document.createElement("a");
    link.className = "btn";
    link.href = `/plans/return?order_id=${encodeURIComponent(order.orderId)}`;
    link.innerHTML = `<i class="fa-solid fa-circle-info" aria-hidden="true"></i><span data-i18n="viewPaymentDetails">${t("viewPaymentDetails")}</span>`;
    row.append(link);
  }
  return row;
}

async function loadOrders() {
  if (!state.session?.authenticated) return;
  const result = await api("/api/billing/orders");
  state.billingOrders = result.orders;
  renderOrders(state.billingOrders);
}
function renderOrders(orders) {
  const panel = $("#orders-panel");
  const list = $("#order-list");
  if (!panel || !list) return;
  panel.hidden = false;
  list.replaceChildren(...orders.map(orderRow));
  if (!orders.length)
    list.innerHTML = `<div class="empty-state"><p>${t("noPayments")}</p></div>`;
}

function refreshAfterPayment(order) {
  if (order.localStatus !== "paid" || !order.fulfilledAt) return false;
  if (history.state?.astraBillingRefreshed === order.orderId) return false;
  try {
    // History state survives a reload without relying on browser storage.
    history.replaceState(
      { ...history.state, astraBillingRefreshed: order.orderId },
      "",
      location.href,
    );
    location.reload();
  } catch {
    // A clean plans URL also prevents a loop when history state is unavailable.
    location.replace("/plans");
  }
  return true;
}

async function renderBillingReturn(orderId, returnedPaymentId = "") {
  const panel = $("#billing-return");
  panel.hidden = false;
  panel.innerHTML = `<div class="billing-return-icon"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i></div><div><h2>${t("paymentChecking")}</h2></div>`;
  const refresh = async () => {
    try {
      const query = new URLSearchParams({ order_id: orderId });
      if (returnedPaymentId) query.set("satora_payment_id", returnedPaymentId);
      const result = await api(`/api/billing/status?${query}`);
      const order = result.order;
      const paid = order.localStatus === "paid";
      const couponReused = order.localStatus === "coupon_reused";
      const needsHelp = [
        "failed",
        "verification_error",
        "coupon_reused",
      ].includes(order.localStatus);
      panel.innerHTML = "";
      const icon = document.createElement("div");
      icon.className = "billing-return-icon";
      icon.innerHTML = `<i class="fa-solid ${paid ? "fa-circle-check" : needsHelp ? "fa-circle-exclamation" : "fa-clock"}" aria-hidden="true"></i>`;
      const content = document.createElement("div");
      content.className = "billing-return-content";
      const heading = document.createElement("h2");
      heading.textContent = paid
        ? t("paymentActivated")
        : billingStatusText(order.localStatus);
      if (couponReused) heading.dataset.i18n = "orderCouponReused";
      const detail = document.createElement("p");
      detail.className = "muted";
      detail.textContent = `${formatBitcoin(order.expectedSats)} · ${order.days} ${t("days")}`;
      if (couponReused) {
        detail.dataset.i18n = "couponRejectedBody";
        detail.textContent = t("couponRejectedBody");
      }
      content.append(heading, detail);
      if (couponReused) {
        const reference = document.createElement("p");
        const label = document.createElement("span");
        label.dataset.i18n = "orderIdLabel";
        label.textContent = t("orderIdLabel");
        const id = document.createElement("code");
        id.textContent = order.orderId;
        reference.append(label, ": ", id);
        content.append(reference);
      }
      panel.append(icon, content);
      if (
        ["confirming", "pending"].includes(order.localStatus) &&
        order.paymentUrl
      ) {
        const link = document.createElement("a");
        link.className = "btn btn-primary";
        link.href = order.paymentUrl;
        link.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i><span>${t("continuePayment")}</span>`;
        panel.append(link);
        window.setTimeout(refresh, 20_000);
      } else if (needsHelp) {
        const support = document.createElement("a");
        support.className = "btn";
        support.href = `mailto:astranote@nxlabtw.com?subject=${encodeURIComponent(`AstraNote order ${order.orderId}`)}`;
        support.innerHTML = `<i class="fa-regular fa-envelope" aria-hidden="true"></i><span>astranote@nxlabtw.com</span>`;
        panel.append(support);
      }
      if (refreshAfterPayment(order)) return;
      await loadOrders();
    } catch (error) {
      panel.innerHTML = `<div class="billing-return-icon"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i></div><div><h2>${error.message}</h2><p class="muted">astranote@nxlabtw.com</p></div>`;
    }
  };
  await refresh();
}

async function initPlans() {
  const prices = { plus: 2500, pro: 6000, ultra: 12500 };
  let selectedPlan = null;
  let checkoutToken = randomHex(16);
  const panel = $("#checkout-panel");
  const monthsInput = $("#purchase-months");
  const isAdminAccount = state.account?.plan?.type === "admin";
  if (isAdminAccount) {
    $$("[data-plan-buy]").forEach((button) => {
      button.disabled = true;
      const label = button.querySelector("span");
      if (label) {
        label.dataset.i18n = "permanent";
        label.textContent = t("permanent");
      }
    });
  }
  const updateTotal = () => {
    const months = Math.min(
      36,
      Math.max(1, Number.parseInt(monthsInput.value, 10) || 1),
    );
    monthsInput.value = String(months);
    const sats = prices[selectedPlan] * months;
    $("#checkout-total-btc").textContent = formatBitcoin(sats);
  };
  $$("[data-plan-buy]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isAdminAccount) return;
      if (!state.session?.authenticated) {
        location.href = "/login?next=%2Fplans";
        return;
      }
      selectedPlan = button.dataset.planBuy;
      checkoutToken = randomHex(16);
      panel.hidden = false;
      updateTotal();
      panel.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  monthsInput.addEventListener("change", updateTotal);
  $("#checkout-button").addEventListener("click", async () => {
    const message = $("#checkout-message");
    message.textContent = "";
    if (!selectedPlan) return;
    if (!state.captcha) {
      message.textContent = t("captchaNeeded");
      return;
    }
    const button = $("#checkout-button");
    button.disabled = true;
    try {
      const result = await api("/api/billing/create", {
        method: "POST",
        body: {
          plan: selectedPlan,
          months: Number(monthsInput.value),
          checkoutToken,
          captcha: state.captcha,
        },
      });
      location.href =
        result.redirect || `/plans/return?order_id=${result.order.orderId}`;
    } catch (error) {
      resetCaptcha();
      message.textContent = error.message;
      button.disabled = false;
    }
  });
  if (state.session?.authenticated) await loadOrders();
  const orderId = new URLSearchParams(location.search).get("order_id");
  if (orderId) {
    if (!state.session?.authenticated) {
      location.href = `/login?next=${encodeURIComponent(location.pathname + location.search)}`;
      return;
    }
    const returnedPaymentId =
      new URLSearchParams(location.search).get("satora_payment_id") || "";
    await renderBillingReturn(orderId, returnedPaymentId);
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
  if (state.account) showPlanWarning(state.account);
  cookieBanner();
  initReveal();
  const initializers = {
    home: initHome,
    login: () => initAuthForm("login"),
    register: () => initAuthForm("register"),
    dashboard: initDashboard,
    notes: initNotes,
    trash: initTrash,
    "new-note": initNewNote,
    note: initNote,
    editor: initEditor,
    settings: initSettings,
    shared: initShared,
    plans: initPlans,
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
