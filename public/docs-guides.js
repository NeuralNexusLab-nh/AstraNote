"use strict";

// Editorial content for the existing docs renderer and locale selector.
// Text is structured so cards, steps and FAQs share one responsive layout.
(() => {
  const translations = {
    en: {
      home: ["Get more from AstraNote", "Write, find, protect and work on your notes—from any device.", [
        ["text", "Keep useful text and images together", "AstraNote is a free online notebook for everyday notes, instructions, pictures and private information. Write in Markdown, add up to three images per note, and draw or add text directly on them. Find your notes again from another device."],
        ["cards", "Start with what you need", [
          ["fa-note-sticky", "Write and find", "Create a note with its title and content, then search titles in My notes.", "/docs/getting-started"],
          ["fa-lock", "Choose encryption", "From ordinary encrypted storage to client-generated keys and a PIN you keep.", "/docs/encryption"],
          ["fa-wand-magic-sparkles", "Use Astra Agent", "Revise one note or selected notes. Review the results before saving.", "/docs/astra-agent"],
          ["fa-user-pen", "Take one note with AstraPass", "Use a temporary account for just one note, without opening your main account.", "/docs/astra-pass"],
        ]],
        ["text", "Small storage, useful text", "Verified Free accounts get 128 KB and 20 notes; unverified Free accounts get 64 KB. Plain text takes little space. Encryption, trash and saved versions also count, so keep your notes focused."],
        ["cards", "Before you need help", [
          ["fa-user-shield", "Account security", "Verify email, choose your sign-in method and manage signed-in devices.", "/docs/security"],
          ["fa-layer-group", "Plans and limits", "Understand storage, Agent allowance, recovery and what happens after expiry.", "/docs/plans"],
        ]],
        ["text", "Contact us", "For account or payment help, email astranote@nxlabtw.com. Report security issues privately to vdp@nxlabtw.com. Never include a password, PIN or recovery phrase."],
      ]],
      "getting-started": ["Your first note", "Create it, save it, and find it again on another device.", [
        ["steps", "Three simple steps", [["Create your account", "Choose a unique username and email, and an 8–24 character password. Complete the displayed CAPTCHA."], ["Write your note", "Open New note, enter a title and content, then choose encryption. PIN-based modes ask you to confirm a PIN."], ["Find it anywhere", "Sign in on another device and search the title in My notes. Open the note to view, copy or edit its content."]]],
        ["text", "Verify your email", "Use the verification banner or Settings. Verification gives Free its full 128 KB and enables email sign-in options and password recovery. Check spam if the message is missing."],
        ["text", "Choose encryption before creating", "A note's encryption mode cannot be changed later. Encrypted titles use a separate AES-256-GCM storage layer; you can still view and search titles when signed in. A PIN is separate from your account password: keep it yourself."],
        ["text", "Keep control of changes", "Changes are saved when you choose Save. An unsaved-edit warning helps when leaving the editor. Astra Agent also shows a preview first. Ultra adds configurable version history and trash recovery."],
        ["text", "Install for quicker access", "Use Install AstraNote on a supported device, or follow the browser-specific installation guide. The app opens the same service; it is not an offline backup. Notes, CAPTCHA and payments still require an internet connection."],
        ["cards", "What next?", [["fa-user-pen", "Only need one note on another device?", "Create an AstraPass from that note's action bar.", "/docs/astra-pass"], ["fa-share-nodes", "Only want someone to read?", "Use a revocable read-only sharing link for a supported note.", "/docs/sharing"]]],
      ]],
      notes: ["Notes, storage and recovery", "Know what is saved, what counts, and how to go back.", [
        ["cards", "Everyday note controls", [["fa-magnifying-glass", "Find", "Search titles in My notes. Search does not decrypt and search every note's content."], ["fa-thumbtack", "Organize", "Plus and above can pin, archive and batch-manage notes. Pinned notes appear first; filters show pinned or archived items."]]],
        ["text", "What uses storage?", "Note text, images, captions, encrypted data, trash and saved versions count toward storage. Encryption and Base64 image encoding add overhead. Account metadata and session records are not part of the note quota. Large file attachments are not supported."],
        ["text", "Choose saved versions", "Ultra, Admin and Beta default to 3 saved versions on first activation. In Settings choose 0, 1, 3, 5, 10 or 20; other plans keep 0 new versions. Open Version history in a note, choose a timestamp, preview and restore."],
        ["steps", "How history works", [["Save a change", "The new content becomes the current note."], ["Keep the difference", "History records the text needed to return to an older version. A full rewrite may be nearly as large as a full copy."], ["Restore when needed", "Client-encrypted differences use the same note key and separate authentication for each version. Older full snapshots remain readable."]]],
        ["text", "Trash is a recovery window", "Ultra can move unlocked notes to trash without CAPTCHA. Choose a retention period of 1, 3, 7, 14 or 30 days in Settings. Restore before expiry or permanently delete earlier. Permanent deletion requires CAPTCHA; expired or permanently deleted content cannot be restored."],
        ["text", "After a downgrade or expiry", "Notes exceeding the remaining allowance are locked, largest first. You can still view or permanently delete them, but editing, sharing, organizing and restoring are blocked until an adequate upgrade. A quota lock lasting 30 days leads to permanent deletion; trash can expire sooner."],
        ["text", "Changing history settings", "Reducing the version count permanently removes older versions. After downgrade, existing versions remain available within your allowance until that note is edited and saved, which clears its history. Keep your own copy of important content."],
      ]],
      sharing: ["Share for reading", "A read-only link is different from an AstraPass account.", [
        ["steps", "Create a read-only link", [["Open a supported note", "Use the sharing switch in the note's action bar."], ["Copy the link", "The recipient can open the shared page without an AstraNote account."], ["Revoke whenever needed", "Turn sharing off to stop access through that link. Copies already made cannot be recalled."]]],
        ["text", "What the recipient can see", "The shared page shows the note and public author details, including the public display name and masked email. Treat the link as access: only send it to the people you intend."],
        ["text", "Editing and encryption", "Sharing is read-only and shows the note's current saved content. PIN-based encryption modes do not support normal sharing. To edit one note on another device without your main account, use AstraPass instead."],
        ["cards", "Need to edit rather than read?", [["fa-user-pen", "AstraPass", "A temporary account opens one existing note; saved edits go straight back to it.", "/docs/astra-pass"]]],
      ]],
      "astra-pass": ["AstraPass: one note, one temporary account", "Work on a single note elsewhere without signing in to your main account.", [
        ["steps", "Not a copy—your original note", [["Create a temporary account", "Open the note and choose AstraPass, next to Share. Set an account name, enter the password twice and choose an expiry."], ["Sign in on another device", "Open /limited-edit and use those credentials. Only this note appears; your other notes and main account settings stay out of view."], ["Save back to the same note", "Saved title and content changes directly update the note in your original account. The temporary account loses access immediately at expiry."]]],
        ["text", "Choose how long it lasts", "AstraPass is available on every plan. Choose 3 or 7 hours, or 1, 3, 7, 14 or 30 days. Only one AstraPass can be active per note. Disable it from the original account whenever needed. Expiry disables the temporary account; it does not delete your note."],
        ["cards", "What it can—and cannot—do", [["fa-pen", "Read and edit this note", "The title and content are editable. Astra Agent is allowed by default; you can turn that permission off when creating the account."], ["fa-user-shield", "No wider account access", "No dashboard, plans, account settings or trash. It cannot delete, pin or archive the note. Features and storage follow the original account."]]],
        ["text", "For encrypted notes", "An AstraPass password does not replace the note's PIN. PIN-protected notes still need that PIN to unlock. Only use a trusted device, and keep both credentials private. Reading or copying content cannot be undone by disabling access."],
        ["text", "This is not collaborative editing", "AstraPass edits the same note, not a separate snapshot. Avoid editing it simultaneously in two places; stale updates can be rejected. When access expires, is revoked, or the note is locked or deleted, further changes are blocked by the server."],
        ["text", "Keep the sign-in details", "Save the credentials shown after creation somewhere safe. The password is not shown again. To replace a lost password, disable the active AstraPass in your original account and create a new one."],
      ]],
      "astra-agent": ["Astra Agent: revise, review, save", "One instruction for one note—or a selection of notes. You choose what to keep.", [
        ["steps", "You stay in control", [["Choose your notes", "Use Astra Agent in a note, or select notes in My notes. Unlock every selected PIN-protected note before writing the instruction."], ["Describe the change", "Write your own instruction, such as organizing text into steps or improving wording. Astra Agent can change both the title and content."], ["Review before saving", "Check the proposed titles and text. Save only the results you want, or discard them. A preview alone never changes your notes."]]],
        ["text", "What is sent to the model?", "Astra Agent uses GPT-6-Luna. When you generate a preview, the selected note's readable title, content and your instruction are sent through AstraNote to OpenAI. This includes unlocked encrypted content. The PIN and note key are not sent to OpenAI. Do not submit content you do not want processed there."],
        ["text", "Keep the processing window open", "A visible loading indicator confirms processing. Closing, refreshing or leaving interrupts the workflow; do not depend on recovering an unsaved result. Cancellation cannot undo data already sent for processing."],
        ["text", "Allowance resets every 30 days", "The dashboard shows the remaining percentage and a progress bar. Plus, Pro and Ultra have larger allowances than Free. Usage depends on processing tokens, not a guaranteed number of requests; short requests may not change the rounded percentage."],
        ["text", "Availability and privacy", "Free uses the Flex service tier only. Paid plans may retry with the standard tier when Flex is unavailable. Requests are rate-limited. API requests set store:false, but OpenAI still processes data under its applicable terms and privacy practices. Always check generated facts before saving."],
      ]],
      security: ["Sign-in and account security", "Choose how to sign in, verify email and manage access.", [
        ["cards", "Three sign-in methods", [["fa-key", "Account and password", "Enter a username or email, then your password and the displayed CAPTCHA."], ["fa-envelope", "Password and email verification code", "After the correct password, enter the single-use six-digit email code. Enable this in Settings after email verification."], ["fa-link", "Email sign-in link", "With a verified email, choose Magic Link in Settings. Keep the requesting tab open, open the emailed link, then return to that original tab."]]],
        ["text", "Email verification and recovery", "Verify email from the banner or Settings. Use Forgot password on the sign-in page to request a reset link. Change a known password in Settings by entering the current password and the new password twice. Resetting the account password does not replace a note PIN."],
        ["text", "Mail limits can affect sign-in", "Service emails share a server-wide limit of 100 per UTC day. When exhausted, new email-dependent sign-ins, verification and deletion codes cannot be sent: wait until the next UTC day. Verification and reset links have a 10-minute sending cooldown; other codes have a 3-minute cooldown. Codes and links expire after 10 minutes."],
        ["text", "Signed-in devices", "Settings lists devices, login IP and country where available. At most five sessions stay active; the least recently used old session is signed out when needed. You can revoke other sessions. A password change signs out other devices."],
        ["text", "Protect your device and PIN", "Use unique credentials and only trusted devices. A note's unlock key may temporarily stay in sessionStorage for the current tab and sign-in session; the PIN is not cached there. Signing out clears it. Tab restoration can preserve a session, so explicitly sign out on a shared device."],
      ]],
      faq: ["Answers before you get stuck", "Everyday questions about notes, encryption, access and plans.", [
        ["faq", "Writing and storage", [["Why not use a file drive?", "AstraNote is for text you want to write and retrieve quickly, not large files or attachments. Use a file drive for those."], ["Why do I only have 64 KB?", "An unverified Free account starts with 64 KB. Verify email to unlock its full 128 KB. Paid-plan space follows the active plan."], ["Does search read encrypted content?", "My notes searches loaded titles, not all encrypted content. Encrypted titles are readable to the signed-in owner."], ["Why did a tiny edit use storage?", "Encryption and saved history add overhead. Small edits usually produce small differences; rewriting the whole note can use much more."]]],
        ["faq", "Encryption and Astra Agent", [["Can you recover a lost PIN?", "No. Password recovery is for account access and does not recover a note PIN. Keep a separate safe copy."], ["Are titles encrypted too?", "Encrypted titles use a separate server-managed AES-256-GCM storage layer. Your signed-in lists can show and search them. This is different from AstraZero's client-only content key."], ["Does Astra Agent change notes immediately?", "No. Generate a preview, review it, then save selected results. Unlocked text is sent to OpenAI for processing."], ["Why did the percentage stay the same?", "Usage is token-based. A small request can be less than one displayed percentage point."]]],
        ["faq", "Access and recovery", [["Does AstraPass create a copy?", "No. Its temporary account reads and edits the original note. Expiry stops access without deleting the note."], ["Can AstraPass open my other notes?", "No. It is limited to one note, with no main-account settings or deletion controls."], ["Why can't an email be sent?", "Check the shown cooldown or daily-limit message and your spam folder. The shared service mail limit is 100 per UTC day; exhausted email delivery can prevent email-dependent login."], ["What happens when a subscription expires?", "The next available plan applies. Notes beyond its allowance are locked; view or delete them, or upgrade to unlock. A 30-day quota lock can permanently delete the note."], ["Is there a backup?", "Version history and trash are limited recovery features, not an independent backup. Keep your own copy of irreplaceable information."], ["Who can help?", "Contact astranote@nxlabtw.com for account or payment problems. Never email your password, PIN or recovery phrase."]]],
      ]],
    },
    "zh-Hant": {
      home: ["從這裡，認識 AstraNote", "記下、找回、加密與整理；在不同裝置上，繼續使用你的筆記。", [
        ["text", "把實用的文字與圖片放在一起", "AstraNote 是免費的線上筆記本，能記錄日常筆記、操作說明、圖片與私密資訊。用 Markdown 編寫，每篇最多加入三張圖片，也能直接繪圖與加字；換個裝置，依然能找回需要的筆記。"],
        ["cards", "依照你的需要開始", [["fa-note-sticky", "記下與找回", "建立時直接輸入標題和內容；在「我的筆記」搜尋標題。", "/docs/getting-started"], ["fa-lock", "選擇加密", "從普通加密儲存，到客戶端獨立產生金鑰，以及由你保管的 PIN。", "/docs/encryption"], ["fa-wand-magic-sparkles", "使用 Astra Agent", "修改單篇或多篇已選筆記，先預覽，再決定儲存哪些結果。", "/docs/astra-agent"], ["fa-user-pen", "用 AstraPass 帶走一篇筆記", "為單篇筆記建立臨時帳號，不必在另一台裝置登入主帳號。", "/docs/astra-pass"]]],
        ["text", "空間不大，也能很實用", "已驗證的 Free 帳號有 128 KB、20 篇筆記；未驗證時為 64 KB。純文字很省空間，但加密、垃圾桶與歷史版本也會計入用量。把真正常用的內容留下就好。"],
        ["cards", "遇到問題前，先了解", [["fa-user-shield", "帳號安全", "驗證信箱、選擇登入方式，管理已登入裝置。", "/docs/security"], ["fa-layer-group", "方案與限制", "了解空間、Agent 用量、還原功能與訂閱到期規則。", "/docs/plans"]]],
        ["text", "聯絡我們", "帳號或付款問題請寄信至 astranote@nxlabtw.com；安全漏洞請私下回報 vdp@nxlabtw.com。請勿附上密碼、PIN 或復原詞。"],
      ]],
      "getting-started": ["開始你的第一篇筆記", "建立、儲存，再換個裝置找回；不需要複雜的準備。", [
        ["steps", "三步開始", [["建立帳號", "填寫不重複的使用者名稱、信箱，以及 8～24 字元的密碼，完成畫面上的人類驗證。"], ["直接寫下內容", "開啟「新增筆記」，輸入標題和內容，再選擇加密方式；需要 PIN 的方式會要求輸入並確認。"], ["需要時找回", "換個裝置登入，在「我的筆記」搜尋標題，開啟後就能查看、複製或編輯內容。"]]],
        ["text", "先驗證信箱", "點擊提醒橫條或到設定寄送驗證信。驗證後，Free 可完整使用 128 KB，也能使用信箱登入選項與忘記密碼功能。找不到信時，請檢查垃圾郵件。"],
        ["text", "建立前選好加密方式", "筆記建立後不能直接切換加密方式。加密筆記的標題會以獨立的 AES-256-GCM 儲存層加密，登入後仍能查看和搜尋。PIN 與帳號密碼不同，請自行妥善保存。"],
        ["text", "修改，由你決定儲存", "編輯完成後按「儲存」才會更新；離開未儲存的編輯器時會先提醒。Astra Agent 也會先顯示預覽。Ultra 另提供可設定保留數量的歷史版本與垃圾桶還原。"],
        ["text", "安裝後，開啟更順手", "支援的裝置可點「安裝 AstraNote」，或依瀏覽器專屬圖解操作。安裝後仍是同一個服務，不是離線備份；筆記、人類驗證與付款仍需要網路連線。"],
        ["cards", "接著可以做什麼？", [["fa-user-pen", "另一台裝置只需要這一篇？", "在該筆記的操作列建立 AstraPass。", "/docs/astra-pass"], ["fa-share-nodes", "只想讓別人閱讀？", "支援的筆記可開啟隨時能撤銷的唯讀分享連結。", "/docs/sharing"]]],
      ]],
      notes: ["筆記、空間與還原", "知道哪些會占空間，也知道改錯後能怎麼回頭。", [
        ["cards", "日常操作", [["fa-magnifying-glass", "找回", "在「我的筆記」搜尋標題；不會解密所有筆記並搜尋全文。"], ["fa-thumbtack", "整理", "Plus 以上可釘選、封存和批次管理。釘選筆記排在最上方，篩選可查看已釘選或已封存項目。"]]],
        ["text", "哪些內容會占空間？", "筆記文字、圖片、註解、加密資料、垃圾桶與保留的版本都計入用量；加密與圖片編碼也會增加容量。帳號設定與登入紀錄不計入筆記額度。不支援大型檔案附件。"],
        ["text", "選擇保留的版本數量", "Ultra、Admin 與 Beta 首次啟用時預設保留 3 個版本。可在設定選擇 0、1、3、5、10 或 20 個；其他方案不保存新的歷史版本。在筆記開啟「版本紀錄」，選擇時間、預覽，再還原。"],
        ["steps", "歷史版本如何保存？", [["儲存修改", "新內容成為目前筆記。"], ["保留差異", "只新增回到舊版本需要的文字；若整篇重寫，大小仍可能接近完整副本。"], ["需要時還原", "客戶端加密的差異沿用該筆記金鑰，並逐版驗證完整性；舊的完整版本仍可讀取。"]]],
        ["text", "垃圾桶是有限期的退路", "Ultra 將未鎖定筆記移到垃圾桶不需人類驗證。可在設定選擇保留 1、3、7、14 或 30 天，到期前可還原，也能提前永久刪除。永久刪除需要人類驗證；到期或永久刪除後不能還原。"],
        ["text", "訂閱到期或降級後", "超出剩餘方案額度的筆記，會從容量最大的開始鎖定。仍可瀏覽或永久刪除，但無法編輯、分享、整理或還原；升級至足夠額度才能解鎖。因額度被鎖滿 30 天將永久刪除，垃圾桶可能更早到期。"],
        ["text", "調低保留數量前請注意", "減少版本數量會永久移除較舊版本。降級後，既有版本在目前額度內仍可查看與還原，但再次編輯儲存該筆記時會清除其歷史。重要資料請另留自己的備份。"],
      ]],
      sharing: ["唯讀分享，讓對方直接看", "分享連結用來閱讀；AstraPass 臨時帳號才用來編輯。", [
        ["steps", "開啟唯讀分享", [["開啟支援的筆記", "使用筆記操作列的分享開關。"], ["複製連結", "對方不必建立 AstraNote 帳號，就能開啟分享頁面。"], ["需要時撤銷", "關閉分享後，該連結便無法再存取；已被複製的內容無法收回。"]]],
        ["text", "對方會看到什麼？", "分享頁會顯示筆記，以及公開顯示名稱、遮罩後的信箱等作者資訊。持有連結就能閱讀，請只交給你預期的對象。"],
        ["text", "修改與加密的限制", "分享頁是唯讀，顯示原筆記目前已儲存的內容。需要 PIN 的加密筆記不支援一般分享。若是想在其他裝置編輯單篇筆記，又不想登入主帳號，請改用 AstraPass。"],
        ["cards", "想編輯，不只是閱讀？", [["fa-user-pen", "AstraPass", "臨時帳號只開啟一篇現有筆記，儲存修改就會同步回原筆記。", "/docs/astra-pass"]]],
      ]],
      "astra-pass": ["AstraPass，一篇筆記的臨時帳號", "在其他裝置繼續編輯這篇筆記，不必登入你的主帳號。", [
        ["steps", "不是副本，就是原本那篇", [["單獨建立臨時帳號", "開啟筆記，在分享旁點擊 AstraPass。設定帳號名稱、輸入兩次密碼，再選擇有效時間。"], ["換個裝置登入", "到 /limited-edit 輸入這組帳密，只會看到這篇筆記，不會開啟其他筆記與主帳號設定。"], ["修改直接回到原筆記", "儲存後，標題與內容會直接更新目前帳號的同一篇筆記。到期後，臨時帳號立即失效。"]]],
        ["text", "決定可以使用多久", "所有方案皆可使用 AstraPass。可選 3、7 小時，或 1、3、7、14、30 天。同一篇筆記同時只能啟用一組 AstraPass；你也能隨時從原帳號停用。到期失效的是臨時帳號，不會因此刪除原筆記。"],
        ["cards", "能做什麼、不能做什麼", [["fa-pen", "查看與編輯這篇筆記", "可以修改標題與內容。預設允許使用 Astra Agent，建立時也能關閉此權限。"], ["fa-user-shield", "不開放整個帳號", "沒有儀表板、方案、帳號設定與垃圾桶；不能刪除、釘選或封存筆記。功能和空間沿用原帳號方案。"]]],
        ["text", "加密筆記仍需要 PIN", "AstraPass 密碼不會取代筆記的 PIN。使用 PIN 的筆記仍須先解鎖；請只在信任的裝置操作，並保密帳密與 PIN。已被讀取或複製的內容，不會因停用而收回。"],
        ["text", "不是多人即時協作", "AstraPass 修改的是同一篇筆記，不是另一份快照。請避免同時在兩個地方編輯；過期的修改可能被拒絕。到期、停用、筆記鎖定或刪除時，後端會阻止繼續修改。"],
        ["text", "妥善保存登入資料", "建立後請保存顯示的帳密，密碼不會再次顯示。忘記時，可回到原帳號停用該 AstraPass，再建立新的一組。"],
      ]],
      "astra-agent": ["Astra Agent，修改前先預覽", "一句指令處理單篇或多篇筆記；要留下哪些結果，由你決定。", [
        ["steps", "每一步，由你掌握", [["選擇筆記", "在筆記內使用 Astra Agent，或在「我的筆記」勾選多篇。使用 PIN 的筆記，會在輸入指令前逐篇要求解鎖。"], ["說明怎麼改", "自行輸入指令，例如整理步驟、改善措辭或調整結構；Astra Agent 可以修改標題與內容。"], ["預覽，再儲存", "逐篇查看建議標題與內容，只儲存你選擇的結果，也能全部捨棄。產生預覽不會直接改動筆記。"]]],
        ["text", "哪些資料會交給模型？", "Astra Agent 使用 GPT-6-Luna。產生預覽時，該筆記可讀的標題、內容與指令會透過 AstraNote 傳送至 OpenAI，包括已解鎖的加密內容；PIN 與筆記金鑰不會傳送至 OpenAI。不希望由該服務處理的資料，請勿提交。"],
        ["text", "處理時請保持視窗開啟", "畫面會顯示載入狀態，表示請求正在處理。關閉、重新整理或離開會中斷流程，未儲存的結果不保證能取回；取消也不能收回已送出處理的資料。"],
        ["text", "每 30 天重置可用額度", "儀表板會顯示剩餘百分比與橫條。Plus、Pro、Ultra 有較多用量。扣除依實際處理的詞元計算，不是保證可使用幾次；短請求可能不足以改變畫面上四捨五入後的百分比。"],
        ["text", "可用性與隱私", "Free 僅使用彈性服務層；付費方案在彈性服務暫時不可用時，可嘗試標準服務層。功能設有速率限制。請求設定 store:false，但 OpenAI 仍依其適用條款與隱私實務處理資料。儲存前請確認 AI 結果是否正確。"],
      ]],
      security: ["登入方式與帳號安全", "驗證信箱、選擇登入方式，並管理仍有效的登入。", [
        ["cards", "三種登入方式", [["fa-key", "帳號與密碼", "輸入使用者名稱或信箱，再輸入密碼，並完成畫面上的人類驗證。"], ["fa-envelope", "密碼與信箱驗證碼", "密碼正確後，還要輸入一次性的六位數信箱驗證碼；驗證信箱後可在設定啟用。"], ["fa-link", "信箱登入連結", "驗證信箱後，可在設定選擇免密碼登入連結。保留原本發送連結的分頁，開啟信件連結後再回來。"]]],
        ["text", "信箱驗證與忘記密碼", "從提醒橫條或設定驗證信箱；忘記密碼時，在登入頁請求重設連結。仍記得密碼時，可在設定輸入舊密碼與兩次新密碼來變更。重設帳號密碼不會替換筆記 PIN。"],
        ["text", "寄信限制可能影響登入", "服務信件共用全站每日 100 封的額度，以 UTC 日計算。用完時，無法再寄送需要信件的登入、驗證與刪除驗證碼，須等下一個 UTC 日。驗證與重設密碼連結每 10 分鐘可請求一次，其他驗證碼每 3 分鐘一次；連結與驗證碼皆於 10 分鐘後失效。"],
        ["text", "管理已登入裝置", "設定會列出裝置、登入 IP 與可取得的國家。每帳號最多五個有效登入；需要騰出名額時，會登出最久未使用的舊登入。可手動登出其他裝置；變更密碼也會登出其他裝置。"],
        ["text", "保護裝置，也保護 PIN", "請使用獨立帳密和可信任裝置。解鎖後，筆記金鑰可能暫存在目前分頁與登入工作階段的 sessionStorage，不會把 PIN 存在其中。登出會清除；瀏覽器可能還原分頁，因此共用裝置用完請主動登出。"],
      ]],
      faq: ["使用前後，常見的疑問", "筆記、加密、登入與方案，一次說清楚。", [
        ["faq", "筆記與空間", [["為什麼不用雲端硬碟？", "AstraNote 適合快速記下和找回常用文字，不處理大型檔案或附件；檔案儲存仍適合交給雲端硬碟。"], ["為什麼我只有 64 KB？", "未驗證的 Free 帳號先提供 64 KB，驗證信箱後完整使用 128 KB；付費空間依目前有效方案計算。"], ["搜尋會讀取所有加密內容嗎？", "不會。「我的筆記」搜尋已載入的標題，不會解密全部筆記做全文搜尋；登入的擁有者仍可讀取加密標題。"], ["只改一點文字，怎麼還會增加空間？", "加密與版本資料有額外容量。少量修改通常只保存少量差異，但整篇重寫可能接近一份完整副本。"]]],
        ["faq", "加密與 Astra Agent", [["PIN 忘記了能找回嗎？", "不能。忘記密碼只能協助恢復帳號登入，不能找回筆記 PIN；請自行另外安全保存。"], ["標題也有加密嗎？", "加密標題使用獨立、由伺服器管理的 AES-256-GCM 儲存層，登入後仍可查看與搜尋；這與 AstraZero 僅客戶端持有的內容金鑰不同。"], ["Astra Agent 會直接修改嗎？", "不會。先產生預覽，確認後再儲存選中的結果；處理時會把已解鎖文字傳送至 OpenAI。"], ["怎麼用過後百分比沒變？", "用量依處理的詞元計算，小請求可能不足一個畫面顯示的百分點。"]]],
        ["faq", "存取與還原", [["AstraPass 是另一份筆記嗎？", "不是。臨時帳號讀取和編輯的是原筆記；到期只會中止存取，不會刪除原筆記。"], ["AstraPass 能開我的其他筆記嗎？", "不能。它只限一篇筆記，沒有主帳號設定或刪除權限。"], ["為什麼無法寄信？", "請查看畫面上的冷卻或每日限制提示，也檢查垃圾郵件。服務信件全站每日限 100 封，用完可能讓需要信件的登入暫時無法進行。"], ["訂閱到期會怎樣？", "會使用下一個仍有效的方案。超出額度的筆記會鎖定，可瀏覽、刪除或升級解鎖；因額度被鎖滿 30 天可能永久刪除。"], ["這裡有備份嗎？", "版本紀錄與垃圾桶只是有限的還原功能，不是獨立備份。無法取代的資訊，請自行另存一份。"], ["需要協助找誰？", "帳號或付款問題請寄 astranote@nxlabtw.com，不要傳送密碼、PIN 或復原詞。"]]],
      ]],
    },
    ja: {
      home: ["AstraNote を使いこなす", "書く、探す、守る、整える。どの端末でもノートを手元に。", [
        ["text", "役立つ文章と画像をひとまとめに", "AstraNoteは日々のメモ、手順、画像、個人情報を保存できる無料オンラインノートです。Markdownと1ノート3枚までの画像に対応し、描画や文字も追加できます。別の端末でも必要なノートを見つけられます。"],
        ["cards", "目的から始める", [["fa-note-sticky", "書いて見つける", "タイトルと内容を入力して作成し、マイノートでタイトルを検索。", "/docs/getting-started"], ["fa-lock", "暗号化を選ぶ", "通常の暗号化保存から、クライアントが生成する鍵と自分で保管する PIN まで。", "/docs/encryption"], ["fa-wand-magic-sparkles", "Astra Agent を使う", "一つ、または選択したノートを修正。確認してから保存。", "/docs/astra-agent"], ["fa-user-pen", "AstraPass で一つだけ持ち出す", "メインアカウントを開かず、一つのノート専用の一時アカウントを利用。", "/docs/astra-pass"]]],
        ["text", "小さな容量でも、役立つ文章を", "認証済み Free は 128 KB・20件、未認証の Free は 64 KB です。文章は省容量ですが、暗号化、ごみ箱、保存済みの版も容量に含まれます。"],
        ["cards", "困る前に確認", [["fa-user-shield", "アカウント保護", "メール認証、ログイン方法、ログイン中の端末を管理。", "/docs/security"], ["fa-layer-group", "プランと制限", "容量、Agent の利用枠、復元、契約終了後のルールを確認。", "/docs/plans"]]],
        ["text", "お問い合わせ", "アカウント・決済の問題は astranote@nxlabtw.com、安全上の問題は vdp@nxlabtw.com へ。パスワード、PIN、復元フレーズは送らないでください。"],
      ]],
      "getting-started": ["最初のノートを作る", "作成して保存し、別の端末でも見つける。", [
        ["steps", "三つの手順", [["アカウントを作成", "固有のユーザー名、メール、8〜24文字のパスワードを入力し、表示された CAPTCHA を完了。"], ["内容を書く", "新規ノートでタイトルと内容を入力し、暗号化を選びます。PIN が必要な方式では確認入力も行います。"], ["必要なときに探す", "別の端末でログインし、マイノートでタイトルを検索。開いて表示、コピー、編集できます。"]]],
        ["text", "メールを認証する", "バナーまたは設定から認証メールを送信。Free の全 128 KB、メールによるログインとパスワード再設定が利用可能になります。届かない場合は迷惑メールを確認してください。"],
        ["text", "作成前に暗号化を選ぶ", "作成後は暗号化方式を切り替えられません。暗号化ノートのタイトルは別の AES-256-GCM 保存層で保護され、ログイン後は表示・検索できます。PIN はアカウントのパスワードとは別に保管してください。"],
        ["text", "保存を決めるのはあなた", "保存を選んだ時点で更新されます。未保存で編集画面を離れると警告されます。Astra Agent もまずプレビューを表示。Ultra では保持数を選べる変更履歴とごみ箱復元も使えます。"],
        ["text", "インストールですばやく開く", "対応端末で「AstraNote をインストール」を選ぶか、ブラウザー別の図解を参照してください。同じサービスを開くもので、オフラインのバックアップではありません。ノート、CAPTCHA、決済には接続が必要です。"],
        ["cards", "次に試すこと", [["fa-user-pen", "別の端末で一つだけ必要？", "ノートの操作欄から AstraPass を作成。", "/docs/astra-pass"], ["fa-share-nodes", "読むだけでよい場合", "対応ノートで、いつでも無効にできる読み取り専用リンクを作成。", "/docs/sharing"]]],
      ]],
      notes: ["ノート、容量と復元", "保存されるものと、間違えたときの戻り方を確認。", [
        ["cards", "日常の操作", [["fa-magnifying-glass", "探す", "マイノートでタイトルを検索。すべての暗号化内容を復号して全文検索する機能ではありません。"], ["fa-thumbtack", "整理", "Plus 以上はピン留め、アーカイブ、一括管理。ピン留めは先頭に並び、フィルターで対象を表示できます。"]]],
        ["text", "容量に含まれるもの", "文章、画像、説明、暗号化データ、ごみ箱、保存済みの版が含まれます。暗号化と画像の符号化には追加容量が必要です。アカウント情報とセッション記録はノート枠に含まず、大きなファイル添付は扱いません。"],
        ["text", "保持する版の数を選ぶ", "Ultra、Admin、Beta の初回有効化時は3つの版を保持。設定で0、1、3、5、10、20から選べ、他プランは新しい履歴を保存しません。ノートの変更履歴で日時を選び、確認して復元します。"],
        ["steps", "履歴の仕組み", [["変更を保存", "新しい内容が現在のノートになります。"], ["差分を保持", "以前の版に戻るための文章を保存。全面的な書き換えは完全コピーに近い容量になることもあります。"], ["必要なら復元", "クライアント暗号化の差分は同じノート鍵を使い、版ごとに完全性を検証。従来の完全な版も読めます。"]]],
        ["text", "ごみ箱は期限付きの復元手段", "Ultra はロックされていないノートをごみ箱へ CAPTCHA なしで移せます。設定で1、3、7、14、30日の保持期間を選択。期限前に復元、または CAPTCHA を完了して完全削除できます。期限切れ・完全削除後は復元できません。"],
        ["text", "契約終了・ダウングレード後", "残る枠を超えるノートは大きい順にロック。表示・完全削除はできますが、編集、共有、整理、復元には十分なアップグレードが必要です。容量超過のロックが30日続くと完全削除され、ごみ箱は先に期限が切れることもあります。"],
        ["text", "保持数を減らす前に", "数を減らすと古い版が完全削除されます。ダウングレード後も容量内の履歴は確認・復元できますが、そのノートを編集保存すると履歴は消去されます。重要な情報は別にも保存してください。"],
      ]],
      sharing: ["読むための共有リンク", "読み取り専用リンクと、編集用 AstraPass は別の機能です。", [
        ["steps", "リンクを共有", [["対応ノートを開く", "ノートの操作欄で共有スイッチを使います。"], ["リンクをコピー", "相手はアカウントなしで共有ページを開けます。"], ["必要なら無効化", "共有を止めるとリンクからのアクセスは終了。すでにコピーされた内容は取り消せません。"]]],
        ["text", "相手に見える情報", "ノートと、公開表示名・マスク済みメールなどの作者情報が表示されます。リンクを持つ人が読めるため、意図した相手にだけ送ってください。"],
        ["text", "編集と暗号化の制限", "共有は読み取り専用で、現在保存されている内容を表示します。PIN 保護ノートは通常共有に対応しません。別の端末で一つのノートを編集するなら AstraPass を使ってください。"],
        ["cards", "編集したい場合", [["fa-user-pen", "AstraPass", "一時アカウントで一つの既存ノートを開き、保存した変更をそのまま反映。", "/docs/astra-pass"]]],
      ]],
      "astra-pass": ["AstraPass：一つのノート専用アカウント", "メインアカウントにログインせず、別の端末で編集を続ける。", [
        ["steps", "コピーではなく、元のノート", [["一時アカウントを作成", "ノートの共有ボタン横で AstraPass を選択。名前、パスワード2回、有効期間を設定。"], ["別の端末でログイン", "/limited-edit でその情報を入力。一つのノートだけが表示され、他のノートやメイン設定は開きません。"], ["元のノートへ保存", "保存したタイトルと内容は元アカウントの同じノートに直接反映。有効期限になると一時アカウントは直ちに失効します。"]]],
        ["text", "有効期間を選ぶ", "全プランで利用できます。3・7時間、または1・3・7・14・30日から選択。一つのノートに同時に一つだけ有効。元アカウントからいつでも無効化できます。失効するのは一時アカウントで、元ノートは消えません。"],
        ["cards", "できること・できないこと", [["fa-pen", "このノートの表示と編集", "タイトルと内容を編集できます。Astra Agent は既定で許可され、作成時に無効にすることもできます。"], ["fa-user-shield", "アカウント全体は開かない", "ダッシュボード、プラン、設定、ごみ箱はなく、削除・ピン留め・アーカイブも不可。機能と容量は元アカウントに従います。"]]],
        ["text", "暗号化ノートには PIN も必要", "AstraPass のパスワードはノート PIN の代わりになりません。信頼できる端末で解除し、両方を秘密にしてください。無効化しても、読まれた内容やコピーは取り消せません。"],
        ["text", "リアルタイム共同編集ではありません", "同じノートを更新するため、二か所での同時編集は避けてください。古い更新は拒否される場合があります。失効、無効化、ノートのロック・削除後はサーバーが変更を拒否します。"],
        ["text", "ログイン情報を保管", "作成後に表示される情報を安全に保管してください。パスワードは再表示されません。忘れた場合は元アカウントで無効化し、新しく作成してください。"],
      ]],
      "astra-agent": ["Astra Agent：確認してから保存", "一つの指示で、一つまたは複数のノートを修正。残す結果はあなたが選びます。", [
        ["steps", "あなたが決める三つの手順", [["ノートを選ぶ", "ノート内、またはマイノートで複数選択。PIN 保護ノートは指示の入力前に一つずつ解除します。"], ["変更を説明", "手順の整理、表現や構成の改善など、自由に指示を入力。タイトルと内容の両方を変更できます。"], ["確認して保存", "提案を一つずつ確認し、選んだ結果だけ保存、または破棄。プレビューだけでは変更されません。"]]],
        ["text", "モデルへ送られるもの", "Astra Agent は GPT-6-Luna を使います。プレビュー生成時、読めるタイトル、内容、指示が AstraNote を経由して OpenAI へ送信されます。解除済みの暗号化内容も含みますが、PIN とノート鍵は OpenAI に送りません。処理させたくない情報は送信しないでください。"],
        ["text", "処理中は画面を開いたままに", "読み込み表示で処理状況を示します。閉じる、更新、移動すると処理の流れが中断され、未保存結果の回収は保証されません。取消しても送信済みデータは取り戻せません。"],
        ["text", "利用枠は30日ごとに更新", "ダッシュボードで残量の割合とバーを確認。Plus、Pro、Ultra はより多く使えます。トークン処理量に基づき、回数保証ではありません。短い処理では丸めた割合が変わらない場合があります。"],
        ["text", "可用性とプライバシー", "Free は Flex のみ。有料プランは一時的な Flex 不可時に標準階層で再試行できます。レート制限があり、リクエストは store:false を設定しますが、OpenAI の適用規約とプライバシー実務に従って処理されます。保存前に結果を確認してください。"],
      ]],
      security: ["ログインとアカウント保護", "メールを認証し、ログイン方法と端末を管理。", [
        ["cards", "三つのログイン方法", [["fa-key", "アカウントとパスワード", "ユーザー名かメール、パスワード、表示された CAPTCHA を入力。"], ["fa-envelope", "パスワードとメール認証コード", "正しいパスワードの後、使い捨て6桁コードを入力。メール認証後に設定で有効化できます。"], ["fa-link", "メールログインリンク", "認証後に設定で Magic Link を選択。送信元タブを開いたままメールのリンクを開き、元タブへ戻ります。"]]],
        ["text", "メール認証とパスワード再設定", "バナーか設定から認証。忘れた場合はログイン画面から再設定リンクを請求できます。既知の場合は設定で現在のパスワードと新しいもの2回を入力。変更してもノートの PIN は置き換わりません。"],
        ["text", "メール制限はログインにも影響", "サービスメールは UTC で一日100通を共有。枠が尽きると、メールが必要なログイン・認証・削除コードを送れず、次の UTC 日まで待つ必要があります。認証・再設定リンクは10分、他コードは3分の送信間隔が必要。コードとリンクは10分で失効します。"],
        ["text", "ログイン中の端末", "設定で端末、ログイン IP、取得できる国を確認。最大五つのセッションが有効で、必要な場合は最も長く未使用の古いものを終了。他端末は手動でログアウトでき、パスワード変更でも終了します。"],
        ["text", "端末と PIN を守る", "固有の認証情報と信頼できる端末を使用。解除後のノート鍵は現在のタブとログインに紐付いた sessionStorage に一時保存されることがあります。PIN は保存しません。ログアウトで消去されますが、タブが復元される場合もあるため共用端末では明示的にログアウトしてください。"],
      ]],
      faq: ["よくある質問", "ノート、暗号化、ログイン、プランの疑問を解消。", [
        ["faq", "ノートと容量", [["ドライブの代わりですか？", "いいえ。すぐ書いて取り出す文章用です。大きなファイルや添付はドライブを使ってください。"], ["64 KB しかないのはなぜ？", "未認証 Free は64 KB。メール認証後に128 KBすべて使えます。有料枠は有効プランに従います。"], ["暗号化した全文も検索しますか？", "いいえ。読み込んだタイトルだけを検索。認証済み所有者は暗号化タイトルを表示できます。"], ["少しの編集でも容量が増える？", "暗号化と履歴には追加容量が必要です。小さな変更は通常小さな差分ですが、全面変更は大きくなります。"]]],
        ["faq", "暗号化と Astra Agent", [["PIN を復旧できますか？", "できません。パスワード再設定はアカウント用で、ノート PIN を復旧しません。別に安全に保管してください。"], ["タイトルも暗号化されますか？", "サーバー管理の別の AES-256-GCM 保存層で保護します。ログイン後は表示・検索でき、AstraZero のクライアント専用内容鍵とは別です。"], ["Agent は直ちに変更しますか？", "いいえ。プレビューを確認して選択結果を保存します。解除済み文章は OpenAI に処理のため送信されます。"], ["残量の割合が変わらないのは？", "トークン処理量で計算するため、小さな請求は表示の1ポイント未満の場合があります。"]]],
        ["faq", "アクセスと復元", [["AstraPass はコピーですか？", "いいえ。元ノートを読み書きします。失効はアクセスを止めるだけで、ノートは消しません。"], ["他のノートも開けますか？", "いいえ。一つだけに制限され、メイン設定や削除権限もありません。"], ["メールを送れない理由は？", "待機時間と日次制限の表示、迷惑メールを確認。サービスメールは一日100通を共有し、枠切れでメール依存のログインも止まる場合があります。"], ["契約が切れると？", "次の有効プランを適用。超過ノートはロックされ、表示・削除かアップグレードが可能。容量ロックが30日続くと完全削除の場合があります。"], ["バックアップはありますか？", "履歴とごみ箱は限定的な復元機能で、独立したバックアップではありません。重要な情報は別にも保存してください。"], ["問い合わせ先は？", "アカウント・決済は astranote@nxlabtw.com へ。パスワード、PIN、復元フレーズは送らないでください。"]]],
      ]],
    },
  };
  const additions = {
    en: {
      notes: [
        ["steps", "Text and images, together", [["Add up to three images", "In New note or Edit, choose PNG, JPEG or WebP, paste an image, or drop files into the image area. Text is optional; the title is required."], ["Preview the compression", "Choose Small to save space, Balanced for everyday use, or Clear to retain more detail. Each card and the editor show sizes; server-side quota checking is final."], ["Put an image where it belongs", "Use Insert in text or copy its {img_ID} reference. References work only for images in this note, outside code blocks. Images not referenced in text appear below the body."]]],
        ["cards", "Edit without leaving your note", [["fa-paintbrush", "Draw and annotate", "Use the brush, erase new drawing, add text, undo or redo before applying. A caption stays below the image. Replace uploads keep the same reference ID."], ["fa-clock-rotate-left", "Restore text, keep current images", "History saves text differences only, under the note's encryption. Restoring text keeps the current images, captions and drawings. Replaced or removed images cannot be recovered from history. Older stored revisions remain compatible."]]],
        ["text", "Markdown and image safety", "The note page renders Markdown headings, lists, code and tables. The editor keeps the source. Raw HTML, scripts, embeds, SVG and automatic remote-image fetching are disabled. Encrypted images are unlocked only with the note; no public image URL is created."],
      ],
      agent: [["text", "Image assistance—not image generation", "Explicitly select images before sending. GPT-6-Luna can analyze them and propose arrows, boxes, circles, text, crop, rotation and brightness/contrast adjustments. The client applies a limited set of commands to a preview. It does not regenerate photographs or remove objects. Image analysis uses additional allowance; manual editing does not."], ["text", "Flex first, on every plan", "All plans try Flex first, then Standard only after temporary unavailability, timeout or a retryable service error. Standard costs twice Flex for the same token usage. Text and image input share the 30-day percentage allowance. Unverified Free has half of verified Free's allowance."]],
      pass: ["text", "How many AstraPass accounts?", "Free: 2 active; Plus and Education: 10; Pro: 25; Ultra: 100; Beta and Admin: unlimited. Expired or revoked accounts free a slot. A downgrade blocks new accounts above the limit, but existing accounts keep their expiry."],
      education: ["text", "Free Education, with Plus features", "Verify an eligible educational email to receive permanent Education with Plus-equivalent limits and features. Supported namespaces: .edu, .edu.tw, .edu.au, .edu.hk, .edu.sg, .edu.my, .edu.vn, .edu.cn, .edu.ph and .edu.tr. Other namespaces require registry-policy review. Existing paid balances are used first; new paid purchases are unavailable. Admin and Beta keep their privileges. Unverified Free gets 64 KB and half the Free Agent allowance; verified Free gets 128 KB and the full allowance."],
    },
    "zh-Hant": {
      notes: [
        ["steps", "把文字與圖片放在一起", [["每篇最多三張", "在新增或編輯筆記時選擇 PNG、JPEG、WebP，也能貼上圖片或拖放檔案到圖片區。可以只有圖片，不寫內文；標題仍必填。"], ["先確認壓縮預覽", "精簡節省空間，均衡兼顧大小與細節，清晰保留更多細節。每張圖片與編輯器都顯示大小；最終是否超額以後端檢查為準。"], ["插入需要的位置", "使用「插入內文」或複製 {img_ID} 引用。只能引用此篇筆記的圖片，程式碼區塊不會展開圖片；沒有引用的圖片會顯示在內文下方。"]]],
        ["cards", "不用離開筆記，也能編輯圖片", [["fa-paintbrush", "繪圖與註解", "使用畫筆、擦除這次的繪圖、加入文字，套用前可復原與重做。註解顯示在圖片下方；重新上傳會保留相同引用 ID。"], ["fa-clock-rotate-left", "還原文字，保留目前圖片", "版本紀錄只保存文字差異，沿用筆記加密。還原文字不會變更目前的圖片、註解與繪圖；替換或移除的圖片無法由版本紀錄找回。既有舊版本仍可相容讀取。"]]],
        ["text", "Markdown 與圖片安全", "閱讀頁呈現 Markdown 標題、清單、程式碼與表格，編輯時保留原始文字。不支援原始 HTML、腳本、嵌入、SVG 或自動載入外部圖片。圖片跟隨筆記解鎖，不建立公開圖片網址。"],
      ],
      agent: [["text", "圖片協助，不是重新生成", "先勾選這次要送出的圖片。GPT-6-Luna 能分析圖片，提出箭頭、方框、圓形、文字、裁切、旋轉與亮度／對比調整，由客戶端執行有限的指令並顯示預覽。不會重新生成照片或移除物件。分析圖片會增加用量；手動編輯不扣 AI 額度。"], ["text", "所有方案先用 Flex", "所有方案先嘗試 Flex，僅於暫時不可用、逾時或可重試的服務錯誤時改試 Standard。同樣的處理量，Standard 費率為 Flex 的兩倍。文字與圖片共用每 30 天的百分比額度；未驗證 Free 為完整 Free 額度的一半。"]],
      pass: ["text", "能同時建立多少個 AstraPass？", "Free：2 個；Plus 與 Education：10 個；Pro：25 個；Ultra：100 個；Beta、Admin 不限。到期或停用會釋出名額。降級後超額只會禁止新增，既有帳號仍按原訂時間到期。"],
      education: ["text", "Education 免費享 Plus 同等功能", "驗證符合資格的教育信箱，即永久使用 Education，額度與功能等同 Plus。目前支援 .edu、.edu.tw、.edu.au、.edu.hk、.edu.sg、.edu.my、.edu.vn、.edu.cn、.edu.ph、.edu.tr；其他網域會先核對註冊機構規則。已購買的方案先用完，之後轉 Education；不能再購買其他方案。Admin、Beta 維持原權限。未驗證 Free 提供 64 KB 與一半 Agent 額度；一般信箱驗證後為 128 KB 與完整 Free 額度。"],
    },
    ja: {
      notes: [
        ["steps", "文章と画像をひとまとめに", [["3枚まで追加", "新規作成や編集でPNG・JPEG・WebPを選択。貼り付けや画像エリアへのドロップにも対応します。本文なしの画像ノートも可能ですが、タイトルは必要です。"], ["圧縮を確認", "軽量は容量を節約、バランスは日常向け、鮮明は細部を優先します。サイズを確認でき、最終的な容量判定はサーバーで行います。"], ["本文の好きな場所へ", "本文に挿入するか{img_ID}参照をコピー。同じノートの画像のみ参照でき、コードブロック内では展開しません。未参照の画像は本文の下に表示します。"]]],
        ["cards", "ノート内で画像を編集", [["fa-paintbrush", "描画・説明", "ペン、新しい描画の消去、文字、元に戻す・やり直すに対応。説明は画像の下に表示。差し替えても参照IDを保持します。"], ["fa-clock-rotate-left", "文章を復元し、現在の画像を保持", "履歴は文章の差分だけをノートと同じ暗号化で保存。復元しても現在の画像・説明・描画は変わりません。差し替え・削除済みの画像は履歴から戻せません。既存の旧形式にも対応します。"]]],
        ["text", "Markdownと画像の安全性", "閲覧時に見出し・リスト・コード・表を表示し、編集時は元のMarkdownを保持します。生のHTML、スクリプト、埋め込み、SVG、外部画像の自動取得は無効。画像はノートと一緒に解除し、公開画像URLは作りません。"],
      ],
      agent: [["text", "画像を支援、再生成はしません", "送る画像を明示的に選択。GPT-6-Lunaが解析し、矢印、枠、円、文字、切り抜き、回転、明るさ・コントラストを提案。クライアントが限定コマンドをプレビューに適用します。写真再生成や物体除去はしません。画像解析は利用枠を多く使い、手動編集は消費しません。"], ["text", "全プランでFlexを先に", "一時的な利用不可・タイムアウト・再試行可能なサービスエラーの場合だけStandardを試します。同じトークン量でStandardはFlexの2倍。文章と画像は30日ごとの利用枠を共有し、未認証Freeの枠は認証済みFreeの半分です。"]],
      pass: ["text", "同時に使えるAstraPass", "Freeは2件、PlusとEducationは10件、Proは25件、Ultraは100件、BetaとAdminは無制限。失効や無効化で枠が空きます。降格で上限を超えても既存の期限は変えず、新規作成のみ止めます。"],
      education: ["text", "EducationはPlus相当の機能を無料で", "対象メールを認証すると、Plus相当のEducationを期限なしで利用できます。現在は.edu、.edu.tw、.edu.au、.edu.hk、.edu.sg、.edu.my、.edu.vn、.edu.cn、.edu.ph、.edu.trに対応。他の名前空間は登録規則を確認後に追加。購入済み期間は先に使い、終了後Educationへ移行。他プランは新規購入できません。Admin・Betaは権限を維持。未認証Freeは64 KBと半分のAgent枠、通常メールの認証後は128 KBと全Free枠です。"],
    },
  };
  for (const [locale, extra] of Object.entries(additions)) {
    translations[locale].notes[2].push(...extra.notes);
    const agent = translations[locale]["astra-agent"][2];
    agent.pop(); agent.push(...extra.agent);
    translations[locale]["astra-pass"][2].push(extra.pass);
    translations[locale].security[2].push(extra.education);
  }
  const imageLimits = {
    en: ["text", "Images and your plan", "Free: 15 images; Plus and free Education: 50; Pro: 150; Ultra: 500; Beta and Admin: unlimited. Each note holds up to three. Images in trash also count, and all images share your storage allowance. After downgrade, existing images are kept; remove images to add more above the new limit."],
    "zh-Hant": ["text", "圖片數量與方案", "Free 最多 15 張；Plus 與免費 Education 為 50 張；Pro 為 150 張；Ultra 為 500 張；Beta、Admin 不限。每篇最多三張，垃圾桶中的圖片也計數，且全部共用筆記空間。降級後保留既有圖片；超過新上限時，須先移除圖片才能增加。"],
    ja: ["text", "画像とプラン", "Freeは15枚、Plusと無料Educationは50枚、Proは150枚、Ultraは500枚、Beta・Adminは無制限。1ノート3枚まで。ごみ箱の画像も数と容量に含まれます。降格後も既存画像は維持し、上限を超えている間は追加できません。"],
  };
  const educationHelp = {
    en: ["text", "Education is permanently free", "Verify a supported educational email to receive Plus-equivalent Education for free. If verification succeeds but Education is missing, contact education@nxlabtw.com. Existing purchased time runs first; educational accounts cannot purchase another plan."],
    "zh-Hant": ["text", "Education 永久免費", "符合資格的教育信箱完成驗證後，即可免費享有 Plus 同等功能。若驗證後未取得 Education，請聯絡 education@nxlabtw.com。既有付費天數會先使用完；教育信箱帳號不能購買其他方案。"],
    ja: ["text", "Educationは永久無料", "対象の教育メールを認証すると、Plus相当のEducationを無料で利用できます。認証後も表示されない場合はeducation@nxlabtw.comへ。購入済み期間を先に利用し、教育アカウントは他プランを購入できません。"],
  };
  for (const locale of Object.keys(translations)) {
    translations[locale].notes[2].push(imageLimits[locale]);
    translations[locale].security[2].push(educationHelp[locale]);
    translations[locale].home[2].push(educationHelp[locale]);
  }
  const agentAvailability = {
    en: ["text", "Processing and allowance", "Astra Agent automatically retries temporary service failures. A fallback processing method uses twice the allowance for the same work. Text and images share your 30-day allowance; unverified Free has half of verified Free's allowance."],
    "zh-Hant": ["text", "處理方式與用量", "Astra Agent 會自動重試暫時失敗的請求。若改用備援處理方式，相同處理量會使用兩倍額度。文字與圖片共用每 30 天的用量；未驗證 Free 為完整 Free 額度的一半。"],
    ja: ["text", "処理方法と利用枠", "一時的なサービス障害では自動で再試行します。代替処理では同じ処理量に2倍の利用枠を使います。文章と画像は30日ごとの利用枠を共有し、未認証Freeは認証済みFreeの半分です。"],
  };
  for (const locale of Object.keys(translations)) translations[locale]["astra-agent"][2][translations[locale]["astra-agent"][2].length - 1] = agentAvailability[locale];
  const escape = text => String(text).replace(/[&<>"']/g, ch => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[ch]));
  const block = ([kind, heading, value], index) => {
    const h = `<h2 id="guide-${index}">${escape(heading)}</h2>`;
    if (kind === "text") return `<section class="docs-guide-section">${h}<p>${escape(value)}</p></section>`;
    if (kind === "steps") return `<section class="docs-guide-section">${h}<ol class="docs-guide-steps">${value.map(([title, text], i) => `<li><span class="docs-step-number" aria-hidden="true">${i + 1}</span><div><h3>${escape(title)}</h3><p>${escape(text)}</p></div></li>`).join("")}</ol></section>`;
    if (kind === "faq") return `<section class="docs-guide-section">${h}<dl class="docs-guide-faq">${value.map(([q, a]) => `<div><dt>${escape(q)}</dt><dd>${escape(a)}</dd></div>`).join("")}</dl></section>`;
    return `<section class="docs-guide-section">${h}<div class="docs-guide-cards">${value.map(([icon, title, text, href]) => `<${href ? 'a href="' + escape(href) + '"' : "div"} class="docs-guide-card"><i class="fa-solid ${escape(icon)}" aria-hidden="true"></i><h3>${escape(title)}</h3><p>${escape(text)}</p>${href ? '<i class="fa-solid fa-arrow-right docs-card-arrow" aria-hidden="true"></i>' : ""}</${href ? "a" : "div"}>`).join("")}</div></section>`;
  };
  const pages = {};
  for (const [locale, documents] of Object.entries(translations)) {
    for (const [slug, [title, lead, blocks]] of Object.entries(documents)) {
      (pages[slug] ||= {})[locale] = {title, lead, body: blocks.map(block).join("")};
    }
  }
  window.ASTRANOTE_DOCS_GUIDES = pages;
})();
