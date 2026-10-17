/* Local raster editing and safe Markdown. No network requests or dynamic code. */
(function () {
  "use strict";
  const D = window.AstraDocument;
  const copy = {
    en: { images: "Images", addImages: "Add images", mediaHint: "Paste or drop images here. Storage and encryption are shared with your note.", compression: "Compression", smallImage: "Small", balancedImage: "Balanced", clearImage: "Clear", quality: "Image quality", caption: "Image caption", insertImage: "Insert in text", copyImageId: "Copy reference", editImage: "Draw & edit", replaceImage: "Replace", removeImage: "Remove", imageLimit: "A note can contain up to 3 images.", invalid_image: "Choose a PNG, JPEG or WebP image up to 8 MB and 16 million pixels. SVG and animated images are not supported.", image_busy: "Image processing is busy. Please try again shortly.", pass_limit: "Your active AstraPass limit has been reached. Disable one or wait for it to expire before creating another.", imageGoal: "Choose Small to save space, or Clear to preserve more detail.", imageStorage: "Note size", textSize: "Text", imageSize: "Images", accountEstimate: "Account storage", mediaPreview: "Preview note", writeNote: "Write", brush: "Brush", eraser: "Erase drawing", addText: "Add text", undo: "Undo", redo: "Redo", imageText: "Text to place", imageColor: "Color", imageWidth: "Stroke width", downloadImage: "Download image", zoomImage: "View image", imageChanges: "Image changes", agentImages: "Include images in this request", agentImageNotice: "Only checked images are sent to OpenAI with the readable note and instruction. PINs and keys are never sent. Image analysis uses more allowance; manual drawing does not.", agentWorking: "Sending and processing your request… If Flex is unavailable, Standard is tried automatically at twice the rate.", mediaPrivacy: "Images and saved versions count toward your storage.", passCapacity: "Active AstraPass", imageSelected: "Selected image", mediaSaved: "Apply changes", mediaRemoveBody: "Remove this image? Version history cannot restore removed images.", imageError: "This image could not be opened. It may be damaged or use an unsupported format.", agentUnsupported: "Astra Agent can draw, add text, crop, rotate and adjust images; it does not regenerate pictures or remove objects." },
    "zh-Hant": { images: "圖片", addImages: "加入圖片", mediaHint: "可貼上或拖放圖片，與筆記共用空間及加密。", compression: "壓縮方式", smallImage: "精簡", balancedImage: "均衡", clearImage: "清晰", quality: "圖片畫質", caption: "圖片註解", insertImage: "插入內文", copyImageId: "複製引用", editImage: "繪圖與編輯", replaceImage: "重新上傳", removeImage: "移除", imageLimit: "每篇筆記最多能放 3 張圖片。", invalid_image: "請選擇 8 MB、1,600 萬像素以內的 PNG、JPEG 或 WebP 圖片；不支援 SVG 與動態圖片。", image_busy: "目前圖片處理繁忙，請稍後再試。", pass_limit: "同時有效的 AstraPass 已達方案上限。請停用一個或等它到期，再建立新的。", imageGoal: "精簡節省空間，清晰保留更多細節。", imageStorage: "筆記大小", textSize: "文字", imageSize: "圖片", accountEstimate: "帳號用量", mediaPreview: "預覽筆記", writeNote: "編寫", brush: "畫筆", eraser: "擦除畫筆", addText: "加入文字", undo: "復原", redo: "重做", imageText: "要放上的文字", imageColor: "顏色", imageWidth: "筆畫粗細", downloadImage: "下載圖片", zoomImage: "檢視圖片", imageChanges: "圖片變更", agentImages: "這次要交給 AI 的圖片", agentImageNotice: "只有勾選的圖片會與可讀筆記、指令傳送至 OpenAI，不包含 PIN 或金鑰。分析圖片較耗額度；手動繪圖不扣 AI 額度。", agentWorking: "正在傳送並處理指令… 若 Flex 暫時不可用，會自動改試 Standard，費率為兩倍。", mediaPrivacy: "圖片與保留的版本都會計入儲存空間。", passCapacity: "同時有效的 AstraPass", imageSelected: "選取的圖片", mediaSaved: "套用變更", mediaRemoveBody: "要移除這張圖片嗎？版本紀錄無法還原圖片。", imageError: "無法開啟這張圖片，檔案可能已損壞或格式不支援。", agentUnsupported: "Astra Agent 可繪圖、加字、裁切、旋轉與調整圖片；不會重新生成圖片或移除物件。" },
    ja: { images: "画像", addImages: "画像を追加", mediaHint: "貼り付け・ドロップに対応。容量と暗号化はノートと共通です。", compression: "圧縮", smallImage: "軽量", balancedImage: "バランス", clearImage: "鮮明", quality: "画質", caption: "画像の説明", insertImage: "本文に挿入", copyImageId: "参照をコピー", editImage: "描画・編集", replaceImage: "差し替え", removeImage: "削除", imageLimit: "1ノートに追加できる画像は3枚までです。", invalid_image: "8 MB・1,600万画素以内のPNG、JPEG、WebPを選択してください。SVGやアニメーション画像は使えません。", image_busy: "画像処理が混み合っています。少し待ってお試しください。", pass_limit: "有効なAstraPassが上限に達しました。一つ無効にするか、期限終了までお待ちください。", imageGoal: "軽量は容量を節約、鮮明は細部を優先します。", imageStorage: "ノート容量", textSize: "テキスト", imageSize: "画像", accountEstimate: "使用容量", mediaPreview: "ノートをプレビュー", writeNote: "編集", brush: "ペン", eraser: "描画を消す", addText: "文字を追加", undo: "元に戻す", redo: "やり直す", imageText: "配置する文字", imageColor: "色", imageWidth: "線の太さ", downloadImage: "画像をダウンロード", zoomImage: "画像を見る", imageChanges: "画像の変更", agentImages: "今回AIに送る画像", agentImageNotice: "選択した画像と読めるノート・指示だけをOpenAIに送信します。PINや鍵は送りません。画像解析は利用枠を多く使い、手描きでは消費しません。", agentWorking: "リクエストを送信・処理中… Flexが利用できない場合、2倍の料金のStandardを自動で試します。", mediaPrivacy: "画像と保存済みの版はストレージに含まれます。", passCapacity: "有効なAstraPass", imageSelected: "選択した画像", mediaSaved: "変更を適用", mediaRemoveBody: "この画像を削除しますか？変更履歴から画像は復元できません。", imageError: "画像を開けません。破損や未対応形式の可能性があります。", agentUnsupported: "Astra Agentは描画、文字、切り抜き、回転、画像調整に対応します。画像の再生成や物体の除去はできません。" },
  };
  Object.assign(copy.en,{preparingPreview:"Preparing your preview…",imageProcessing:"Processing images…"});
  Object.assign(copy.en,{ai_failed:"Astra Agent is temporarily unavailable. Your note has not changed; please try again shortly.",ai_invalid_result:"The result could not be safely applied. Your note has not changed. Try a clearer instruction.",ai_quota_exhausted:"Not enough Astra Agent allowance remains for this request. Check the reset date on your dashboard.",ai_note_too_large:"Astra Agent can process up to 64 KB of text at a time. Shorten the text before trying again."});
  Object.assign(copy["zh-Hant"],{preparingPreview:"正在準備預覽…",imageProcessing:"正在處理圖片…"});
  Object.assign(copy["zh-Hant"],{ai_failed:"Astra Agent 暫時無法使用。筆記尚未更動，請稍後再試。",ai_invalid_result:"這次結果無法安全套用，筆記尚未更動。請把指令寫得更明確後再試。",ai_quota_exhausted:"剩餘的 Astra Agent 額度不足以處理這次指令，請到儀錶板查看重設日期。",ai_note_too_large:"Astra Agent 一次最多處理 64 KB 文字，請先縮短內容再試。"});
  Object.assign(copy.ja,{preparingPreview:"プレビューを準備中…",imageProcessing:"画像を処理中…"});
  Object.assign(copy.en, { imageNumber: "Image {number}", imageReference: "Image reference", mediaEmpty: "Keep an image with your note", mediaEmptyHint: "Choose a file, paste an image, or drop it here.", caption: "Caption (optional)", textPlacement: "Type your text, then place it on the image.", placeText: "Place text", textRequired: "Enter some text first.", textPlaced: "Text added. You can place more, or apply your changes.", imageText: "Enter text", smallImageHint: "Save space", balancedImageHint: "Size and detail in balance", clearImageHint: "Preserve more detail", drawingHint: "Draw directly on the image. Erase removes your new drawing." });
  Object.assign(copy["zh-Hant"], { imageNumber: "圖片 {number}", imageReference: "圖片引用", mediaEmpty: "為筆記留下一張圖片", mediaEmptyHint: "選擇檔案、貼上圖片，或拖放至此。", caption: "註解（選填）", textPlacement: "輸入文字後，按下放置，或點選圖片上的位置。", placeText: "放置文字", textRequired: "請先輸入要放上的文字。", textPlaced: "文字已加入，可繼續放置或套用變更。", imageText: "輸入要加入的文字", smallImageHint: "節省空間", balancedImageHint: "兼顧大小與細節", clearImageHint: "保留更多細節", drawingHint: "直接在圖片上繪圖；橡皮擦只擦除新增的筆畫。" });
  Object.assign(copy.ja, { imageNumber: "画像 {number}", imageReference: "画像の参照", mediaEmpty: "ノートに画像を添える", mediaEmptyHint: "ファイルを選択、貼り付け、またはここにドロップ。", caption: "説明（任意）", textPlacement: "文字を入力し、配置ボタンか画像上の位置を押してください。", placeText: "文字を配置", textRequired: "先に文字を入力してください。", textPlaced: "文字を追加しました。続けて配置するか変更を適用してください。", imageText: "追加する文字を入力", smallImageHint: "容量を節約", balancedImageHint: "容量と細部のバランス", clearImageHint: "細部を優先", drawingHint: "画像に直接描画。消しゴムは追加した線だけを消します。" });
  Object.assign(copy.en, { mediaHint: "Paste or drop images here.", writeNote: "Back to editing", mediaPreview: "Note preview", textPlacement: "Enter text, then click the image to place it.", textPlaced: "Text added.", drawingHint: "Draw directly on the image.", eraser: "Eraser" });
  Object.assign(copy["zh-Hant"], { mediaHint: "可貼上或拖放圖片。", writeNote: "返回編輯", mediaPreview: "預覽筆記", textPlacement: "輸入文字，再點圖片放置。", textPlaced: "文字已加入。", drawingHint: "直接在圖片上繪圖。", eraser: "橡皮擦" });
  Object.assign(copy.ja, { mediaHint: "貼り付け・ドロップもできます。", writeNote: "編集に戻る", mediaPreview: "ノートのプレビュー", textPlacement: "文字を入力し、画像を押して配置。", textPlaced: "文字を追加しました。", drawingHint: "画像に直接描画できます。", eraser: "消しゴム", addText: "文字" });
  Object.assign(copy.ja,{ai_failed:"Astra Agentは一時的に利用できません。ノートは変更されていません。少し待ってお試しください。",ai_invalid_result:"結果を安全に適用できませんでした。ノートは未変更です。より具体的な指示でお試しください。",ai_quota_exhausted:"この処理に必要なAstra Agentの利用枠が不足しています。ダッシュボードでリセット日を確認してください。",ai_note_too_large:"Astra Agentが一度に処理できる文章は64 KBまでです。短くしてお試しください。"});
  const bytes = value => new TextEncoder().encode(value).length;
  const clone = value => JSON.parse(JSON.stringify(value));
  function element(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) { node.textContent = text; const key = Object.values(copy).flatMap(value => Object.entries(value)).find(([,value]) => value === text)?.[0]; if (key) node.dataset.mediaKey = key; } return node; }
  function button(label, icon, action, className = "btn") { const node = element("button", className); node.type = "button"; const glyph = element("i", `fa-solid fa-${icon}`); glyph.setAttribute("aria-hidden", "true"); node.append(glyph, element("span", "", label)); node.onclick = action; return node; }
  function dataUrl(image) { return `data:${image.type};base64,${image.data}`; }
  function checkImage(image) { const raw = Uint8Array.from(atob(image.data), c => c.charCodeAt(0)); const [w,h] = dimensions(raw,image.type); if (w !== image.width || h !== image.height || w > 2048 || h > 2048) throw new Error("invalid_image"); }
  async function bitmap(image) {
    D.unpack(D.pack("", [image]));
    const raw = Uint8Array.from(atob(image.data), c => c.charCodeAt(0));
    const dims = dimensions(raw, image.type);
    if (dims[0] !== image.width || dims[1] !== image.height) throw new Error("invalid_image");
    return createImageBitmap(new Blob([raw], { type: image.type }));
  }
  function dimensions(raw, type) {
    const v = new DataView(raw.buffer, raw.byteOffset, raw.byteLength), ascii = (at, n) => String.fromCharCode(...raw.subarray(at, at + n));
    let width, height;
    if (type === "image/png" && raw.length >= 33 && [...raw.subarray(0,8)].join(",") === "137,80,78,71,13,10,26,10" && ascii(12,4) === "IHDR" && v.getUint32(8) === 13) {
      width = v.getUint32(16); height = v.getUint32(20);
      let ended=false;
      for(let at=8;at+12<=raw.length;) { const size=v.getUint32(at),kind=ascii(at+4,4); if(size>raw.length-at-12 || kind==="acTL" || kind==="fcTL" || kind==="fdAT")throw new Error("invalid_image"); at+=size+12; if(kind==="IEND"){if(at!==raw.length)throw new Error("invalid_image");ended=true;break;} }
      if(!ended)throw new Error("invalid_image");
    }
    else if (type === "image/jpeg" && raw[0] === 255 && raw[1] === 216) {
      for (let i = 2; i + 9 < raw.length;) {
        if (raw[i++] !== 255) break;
        while (raw[i] === 255) i++;
        const marker = raw[i++];
        if ([0xc0,0xc1,0xc2].includes(marker)) { height = v.getUint16(i + 3); width = v.getUint16(i + 5); break; }
        if (marker === 0xda || marker === 0xd9) break;
        const size = v.getUint16(i); if (size < 2) break; i += size;
      }
    } else if (type === "image/webp" && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
      if(v.getUint32(4,true)+8!==raw.length)throw new Error("invalid_image");
      let outer=null,frames=0,at=12;
      while(at+8<=raw.length) {
        const kind=ascii(at,4),size=v.getUint32(at+4,true),start=at+8;
        if(size>raw.length-start || kind==="ANIM" || kind==="ANMF")throw new Error("invalid_image");
        if(kind==="VP8X") { if(size!==10 || outer || (raw[start]&2))throw new Error("invalid_image"); outer=[1+raw[start+4]+(raw[start+5]<<8)+(raw[start+6]<<16),1+raw[start+7]+(raw[start+8]<<8)+(raw[start+9]<<16)]; }
        if(kind==="VP8 ") { if(size<10 || ascii(start+3,3)!=="\x9d\x01\x2a")throw new Error("invalid_image"); width=v.getUint16(start+6,true)&16383;height=v.getUint16(start+8,true)&16383;frames++; }
        if(kind==="VP8L") {if(size<5 || raw[start]!==0x2f)throw new Error("invalid_image"); const n=v.getUint32(start+1,true);width=1+(n&16383);height=1+((n>>>14)&16383);frames++;}
        at=start+size+(size&1);
      }
      if(at!==raw.length || frames!==1 || outer && (outer[0]!==width || outer[1]!==height))throw new Error("invalid_image");
    }
    if (!width || !height || width > 8192 || height > 8192 || width * height > 16_777_216) throw new Error("invalid_image");
    return [width, height];
  }
  const IMAGE_PRESETS = Object.freeze({
    small: { quality: .46, edge: 640, target: true },
    balanced: { quality: .8, edge: 1280, target: false },
    clear: { quality: .96, edge: 2048, target: false },
  });
  async function compress(source, quality = 0.65, maximum = 640, target = false) {
    const canvas = document.createElement("canvas");
    let scale = Math.min(1, maximum / Math.max(source.width, source.height));
    let blob;
    for (let attempt = 0; attempt < 6; attempt++) {
      canvas.width = Math.max(1, Math.round(source.width * scale)); canvas.height = Math.max(1, Math.round(source.height * scale));
      canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
      blob = await new Promise(resolve => canvas.toBlob(resolve, "image/webp", quality));
      if (!blob || blob.type !== "image/webp") throw new Error("invalid_image");
      if (!target || blob.size <= 5000 || Math.max(canvas.width, canvas.height) <= 320) break;
      scale = Math.max(320 / Math.max(source.width, source.height), scale * 0.8);
    }
    if (blob.size > D.MAX_IMAGE_BYTES) throw new Error("invalid_image");
    const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(",")[1]); reader.onerror = reject; reader.readAsDataURL(blob); });
    return { data, type: "image/webp", width: canvas.width, height: canvas.height };
  }
  async function importFile(file, profile) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 8_000_000 || file.size < 16) throw new Error("invalid_image");
    const raw = new Uint8Array(await file.arrayBuffer());
    dimensions(raw, file.type);
    const source = await createImageBitmap(file, { imageOrientation: "from-image" });
    const preset = IMAGE_PRESETS[profile] || IMAGE_PRESETS.small;
    try { return await compress(source, preset.quality, preset.edge, preset.target); }
    finally { source.close(); }
  }
  function figure(image, options) {
    checkImage(image);
    const node = element("figure", "note-image");
    const img = element("img"); img.src = dataUrl(image); img.alt = image.caption || options.t("images"); img.width = image.width; img.height = image.height; img.loading = "lazy"; img.decoding = "async";
    const open = button(options.t("zoomImage"), "expand", () => {
      const view = element("div", "image-lightbox"); const full = img.cloneNode(); full.loading = "eager"; view.append(full);
      const link = element("a", "btn"); const glyph = element("i","fa-solid fa-download"); glyph.setAttribute("aria-hidden","true"); link.append(glyph,element("span","",options.t("downloadImage"))); link.href = dataUrl(image); link.download = `${image.id}.${image.type === "image/jpeg" ? "jpg" : image.type.split("/")[1]}`; view.append(link);
      options.modal({ title: image.caption || options.t("images"), content: view, confirm: options.t("understood"), showCancel: false, onConfirm: close => close() });
    }, "btn image-zoom");
    node.append(img, open);
    if (image.caption) node.append(element("figcaption", "", image.caption));
    return node;
  }
  function render(container, value, options) {
    const doc = D.unpack(value), used = new Set();
    const md = window.markdownit({ html: false, breaks: true, linkify: false, typographer: false });
    // No external images, raw HTML, iframe, SVG or arbitrary URL fetching.
    md.renderer.rules.image = (tokens, index) => md.utils.escapeHtml(tokens[index].content);
    md.renderer.rules.text = (tokens, index, opts, env, self) => {
      const text = tokens[index].content;
      return text.split(/(\{img_[a-f0-9]{24}\})/g).map(part => {
        const image = doc.images.find(image => `{${image.id}}` === part);
        if (!image) return md.utils.escapeHtml(part);
        used.add(image.id); return `<span class="note-image-placeholder" data-note-image="${image.id}"></span>`;
      }).join("");
    };
    const linkOpen = md.renderer.rules.link_open || ((tokens, index, opts, env, self) => self.renderToken(tokens, index, opts));
    md.renderer.rules.link_open = (tokens, index, opts, env, self) => { tokens[index].attrSet("rel", "noopener noreferrer"); return linkOpen(tokens, index, opts, env, self); };
    container.classList.add("note-markdown");
    // markdown-it has raw HTML disabled and safe link validation. The only
    // custom HTML above consists of constant markup and validated image IDs.
    container.innerHTML = md.render(doc.text);
    for (const slot of container.querySelectorAll("[data-note-image]")) slot.replaceChildren(figure(doc.images.find(image => image.id === slot.dataset.noteImage), options));
    const rest = doc.images.filter(image => !used.has(image.id));
    if (rest.length) { const gallery = element("div", "note-image-gallery"); gallery.append(...rest.map(image => figure(image, options))); container.append(gallery); }
  }
  function mount(textarea, value, options) {
    const doc = D.unpack(value); textarea.value = doc.text;
    let images = clone(doc.images), busy = false;
    const originals = new Map();
    const wrap = element("section", "note-media-editor");
    wrap.setAttribute("aria-label", options.t("images")); wrap.dataset.mediaAria = "images";
    const heading = element("div", "media-section-head");
    const title = element("h2", "media-section-title");
    const titleIcon = element("i", "fa-regular fa-images"); titleIcon.setAttribute("aria-hidden", "true");
    const count = element("span", "media-count");
    title.append(titleIcon, element("span", "", options.t("images")), count);
    const toolbar = element("div", "media-toolbar");
    const profile = element("select"); profile.setAttribute("aria-label", options.t("compression")); profile.dataset.mediaAria="compression";
    for (const [value, key] of [["small","smallImage"],["balanced","balancedImage"],["clear","clearImage"]]) { const opt = element("option", "", options.t(key)); opt.value = value; profile.append(opt); }
    const profileHint = element("span", "media-compression-hint");
    function updateProfileHint() { const key = profile.value === "small" ? "smallImageHint" : profile.value === "balanced" ? "balancedImageHint" : "clearImageHint"; profileHint.dataset.mediaKey = key; profileHint.textContent = options.t(key); }
    profile.onchange = () => { updateProfileHint(); recompress(); };
    const compression = element("label", "media-compression"); compression.append(element("span", "", options.t("compression")), profile);
    const compressionGroup = element("div", "media-compression-group"); compressionGroup.append(compression, profileHint);
    const picker = element("input"); picker.type = "file"; picker.accept = "image/png,image/jpeg,image/webp"; picker.multiple = true; picker.hidden = true;
    const add = button(options.t("addImages"), "plus", () => picker.click(), "btn btn-primary media-add");
    const previewToggle = button(options.t("mediaPreview"), "eye", () => {
      const preview = element("div", "media-note-preview"); render(preview, get(), options);
      options.modal({ title: options.t("mediaPreview"), content: preview, dialogClass: "note-preview-modal", confirm: options.t("writeNote"), confirmIcon: "fa-pen", showCancel: false, onConfirm: close => close() });
    }, "btn media-preview-toggle");
    heading.append(title, previewToggle);
    toolbar.append(add, compressionGroup, picker);
    const hint = element("p", "media-hint", options.t("mediaHint"));
    const empty = element("div", "media-empty");
    const emptyIcon = element("i", "fa-regular fa-image"); emptyIcon.setAttribute("aria-hidden", "true");
    empty.append(emptyIcon, element("strong", "", options.t("mediaEmpty")), element("span", "", options.t("mediaEmptyHint")));
    const grid = element("div", "media-grid");
    const sizes = element("div", "media-size"); sizes.setAttribute("aria-live", "polite");
    const processing = element("p","field-help",options.t("imageProcessing")); processing.hidden=true; processing.setAttribute("role","status");
    wrap.append(heading, hint, toolbar, processing, empty, grid, sizes);
    textarea.after(wrap);
    updateProfileHint();
    function get() { return D.pack(textarea.value, images); }
    function changed() { drawSizes(); options.onchange?.(); }
    function drawSizes() {
      const raw = bytes(get());
      // Base64 document serialization and encryption/authentication overhead
      // are included in this conservative client estimate; server is final.
      const mode = options.mode?.() || "none";
      const estimate = mode === "none" ? raw + 550 : Math.ceil((raw + 350) * 4 / 3) + 750;
      const account = options.account;
      const storageEstimate = raw => mode === "none" ? raw + 550 : Math.ceil((raw + 350) * 4/3) + 750;
      const before = options.originalBytes ? storageEstimate(bytes(value)) : 0;
      const version = options.originalBytes && account?.settings?.historyCount > 0
        ? storageEstimate(bytes(JSON.stringify(AstraHistory.reverse({name:"",content:get()},{name:"",content:value})))) : 0;
      const used = Math.max(0, (account?.usedBytes || 0) - before) + estimate + version;
      const stat = (label, value) => { const node = element("div", "media-size-item"); node.append(element("span", "", label), element("strong", "", value)); return node; };
      sizes.replaceChildren(stat(options.t("imageStorage"), `≈ ${options.formatBytes(estimate)}`));
      if (account) sizes.append(stat(options.t("accountEstimate"), `≈ ${options.formatBytes(used)}${account.plan?.maxBytes ? " / " + options.formatBytes(account.plan.maxBytes) : ""}`));
      sizes.title = `${options.t("textSize")} ${options.formatBytes(bytes(textarea.value))} · ${options.t("imageSize")} ${options.formatBytes(images.reduce((sum,image) => sum + D.imageBytes(image) + bytes(image.caption),0))}`;
    }
    function draw() {
      processing.hidden = !busy;
      add.disabled = busy || images.length >= 3;
      profile.disabled = busy;
      count.textContent = `${images.length} / 3`;
      empty.hidden = images.length > 0;
      grid.hidden = images.length === 0;
      wrap.setAttribute("aria-busy", String(busy));
      grid.replaceChildren(...images.map((image, index) => {
        const card = element("article", "media-image-card");
        const number = element("strong", "media-image-number", options.t("imageNumber").replace("{number}", index + 1)); number.dataset.imageNumber = index + 1;
        const fileSize = element("span", "media-file-size", options.formatBytes(D.imageBytes(image)));
        const cardHeading = element("header", "media-card-heading"); cardHeading.append(number, fileSize);
        const utilities = element("div", "media-card-utilities");
        const utility = (key, icon, action, danger = false) => { const control = button(options.t(key), icon, action, `btn media-icon-button${danger ? " media-remove" : ""}`); control.setAttribute("aria-label", options.t(key)); control.title = options.t(key); control.dataset.mediaAria = key; control.dataset.mediaTitle = key; return control; };
        utilities.append(utility("replaceImage", "arrow-up-from-bracket", () => {
          const file = element("input"); file.type = "file"; file.accept = picker.accept; file.onchange = () => ingest(file.files, index); file.click();
        }), utility("removeImage", "trash-can", () => options.modal({ title: options.t("removeImage"), body: options.t("mediaRemoveBody"), danger: true, confirm: options.t("removeImage"), onConfirm: close => { images.splice(index,1); originals.delete(image.id); close(); draw(); changed(); } }), true));
        cardHeading.append(utilities);
        const info = element("details", "media-image-data");
        const summary = element("summary"); summary.append(element("span", "", options.t("imageReference")));
        const reference = element("div", "media-reference-value");
        reference.append(element("code", "", `{${image.id}}`), utility("copyImageId", "copy", async () => { if (await options.copyText(`{${image.id}}`)) options.feedback?.(); })); info.append(summary, reference);
        const caption = element("input"); caption.value = image.caption; caption.maxLength = 400; caption.placeholder = options.t("caption"); caption.dataset.mediaPlaceholder="caption"; caption.dataset.mediaAria="caption"; caption.setAttribute("aria-label", options.t("caption")); caption.oninput = () => { image.caption = caption.value; changed(); };
        const captionField = element("label", "media-caption"); captionField.append(element("span", "", options.t("caption")), caption);
        const actions = element("div", "media-image-actions");
        actions.append(button(options.t("insertImage"), "plus", () => { const ref = `{${image.id}}`; textarea.setRangeText(ref, textarea.selectionStart, textarea.selectionEnd, "end"); textarea.focus(); changed(); }), button(options.t("editImage"), "pen", () => edit(image, { ...options, imagePreset: profile.value }, async result => { images[index] = result; originals.delete(image.id); draw(); changed(); })));
        const body = element("div", "media-card-body"); body.append(captionField, actions, info);
        card.append(cardHeading, figure(image, options), body);
        card.querySelectorAll("button, input").forEach(control => { control.disabled = busy; });
        return card;
      })); drawSizes();
    }
    async function ingest(files, replace = null) {
      if (busy || !files.length) return;
      if (replace === null && images.length + files.length > 3) return options.showError(new Error(options.t("imageLimit")));
      busy = true; draw();
      const pending = [];
      try {
        for (const file of files) {
          const image = await importFile(file, profile.value);
          const id = replace === null ? `img_${[...crypto.getRandomValues(new Uint8Array(12))].map(n => n.toString(16).padStart(2,"0")).join("")}` : images[replace].id;
          pending.push({ ...image, id, caption: replace === null ? "" : images[replace].caption });
        }
        pending.forEach((image, index) => originals.set(image.id, files[index]));
        if (replace === null) images.push(...pending); else if (pending[0]) images[replace] = pending[0];
        changed();
      } catch { options.showError(new Error(options.t("invalid_image"))); }
      finally { busy = false; picker.value = ""; draw(); }
    }
    async function recompress() {
      if (busy || !images.length) return;
      busy = true; draw();
      try {
        const results = [];
        for (const image of images) {
          if (originals.has(image.id)) results.push({...image,...await importFile(originals.get(image.id),profile.value)});
          else { const source = await bitmap(image), preset = IMAGE_PRESETS[profile.value]; try { results.push({...image,...await compress(source,preset.quality,preset.edge,preset.target)}); } finally {source.close();} }
        }
        images = results; changed();
      } catch { options.showError(new Error(options.t("imageError"))); }
      finally { busy=false; draw(); }
    }
    picker.onchange = () => ingest(picker.files);
    textarea.addEventListener("paste", event => { const files = [...event.clipboardData.files].filter(file => file.type.startsWith("image/")); if (files.length) { event.preventDefault(); ingest(files); } });
    wrap.addEventListener("dragover", event => { event.preventDefault(); wrap.classList.add("is-dragover"); });
    wrap.addEventListener("dragleave", event => { if (!wrap.contains(event.relatedTarget)) wrap.classList.remove("is-dragover"); });
    wrap.addEventListener("drop", event => { event.preventDefault(); wrap.classList.remove("is-dragover"); ingest(event.dataTransfer.files); });
    textarea.addEventListener("input", changed);
    wrap.astraRefreshLocale = () => { drawSizes(); wrap.querySelectorAll("[data-image-number]").forEach(node => { node.textContent = options.t("imageNumber").replace("{number}", node.dataset.imageNumber); }); };
    draw();
    return { get, busy: () => busy, images: () => clone(images), refresh: drawSizes };
  }
  async function edit(image, options, apply) {
    const source = await bitmap(image), base = document.createElement("canvas"), overlay = document.createElement("canvas");
    base.width = overlay.width = source.width; base.height = overlay.height = source.height; base.getContext("2d").drawImage(source,0,0); source.close();
    const content = element("div", "image-editor");
    const stage = element("div", "image-editor-stage"); stage.append(base,overlay);
    const workspace = element("div", "image-editor-workspace"); workspace.append(stage);
    const panel = element("div", "image-editor-controls");
    let tool = "brush", down = false, undo = [], redo = [];
    const ctx = overlay.getContext("2d");
    const maxUndo = Math.max(1,Math.min(12,Math.floor(16_777_216/(overlay.width*overlay.height*4))));
    const remember = () => { undo.push(ctx.getImageData(0,0,overlay.width,overlay.height)); if (undo.length > maxUndo) undo.shift(); redo = []; };
    const color = element("input"); color.type = "color"; color.value = "#5266eb"; color.setAttribute("aria-label", options.t("imageColor")); color.dataset.mediaAria = "imageColor";
    const width = element("input"); width.type = "range"; width.min = "1"; width.max = "32"; width.value = "4"; width.setAttribute("aria-label", options.t("imageWidth")); width.dataset.mediaAria = "imageWidth";
    const text = element("input"); text.maxLength = 200; text.placeholder = options.t("imageText"); text.setAttribute("aria-label", options.t("imageText")); text.dataset.mediaPlaceholder="imageText"; text.dataset.mediaAria="imageText";
    const status = element("p", "image-editor-hint", options.t("drawingHint")); status.setAttribute("aria-live", "polite");
    const textControls = element("div", "image-text-controls"); textControls.hidden = true;
    const place = button(options.t("placeText"), "plus", () => placeText(base.width / 2, base.height / 2, true), "btn btn-primary");
    textControls.append(text, place);
    const colorField = element("label", "image-color-field"); colorField.append(element("span", "", options.t("imageColor")), color);
    const strokeField = element("label", "image-stroke-field"); strokeField.append(element("span", "", options.t("imageWidth")), width);
    const settings = element("div", "image-draw-settings"); settings.append(colorField, strokeField);
    const tools = element("div", "image-draw-tools");
    const controls = [];
    for (const [mode,key,icon] of [["brush","brush","paintbrush"],["erase","eraser","eraser"],["text","addText","font"]]) {
      const control = button(options.t(key), icon, () => { tool = mode; controls.forEach(b => b.setAttribute("aria-pressed", String(b === control))); textControls.hidden = mode !== "text"; strokeField.hidden = mode === "text"; status.textContent = options.t(mode === "text" ? "textPlacement" : "drawingHint"); status.dataset.mediaKey = mode === "text" ? "textPlacement" : "drawingHint"; text.removeAttribute("aria-invalid"); if (mode === "text") text.focus({preventScroll:true}); });
      control.setAttribute("aria-label", options.t(key)); control.title = options.t(key); control.dataset.mediaAria = control.dataset.mediaTitle = key;
      control.setAttribute("aria-pressed", String(mode === tool)); controls.push(control); tools.append(control);
    }
    const history = element("div", "image-draw-history");
    for (const [key,icon,action] of [["undo","rotate-left",() => { if (!undo.length) return; redo.push(ctx.getImageData(0,0,overlay.width,overlay.height)); ctx.putImageData(undo.pop(),0,0); }],["redo","rotate-right",() => { if (!redo.length) return; undo.push(ctx.getImageData(0,0,overlay.width,overlay.height)); ctx.putImageData(redo.pop(),0,0); }]]) {
      const control = button(options.t(key), icon, action, "btn media-icon-button"); control.setAttribute("aria-label", options.t(key)); control.title = options.t(key); control.dataset.mediaAria = control.dataset.mediaTitle = key; history.append(control);
    }
    function placeText(x, y, centered = false) {
      const value = text.value.trim();
      if (!value) { text.setAttribute("aria-invalid", "true"); status.textContent = options.t("textRequired"); status.dataset.mediaKey = "textRequired"; text.focus({preventScroll:true}); return; }
      remember(); ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = color.value;
      ctx.font = `${Math.max(14,base.width/24)}px sans-serif`; ctx.textBaseline = "middle"; ctx.textAlign = centered ? "center" : "left";
      ctx.fillText(value, x, y, Math.max(1, centered ? base.width * .9 : base.width - x));
      text.removeAttribute("aria-invalid"); status.textContent = options.t("textPlaced"); status.dataset.mediaKey = "textPlaced";
    }
    text.addEventListener("input", () => text.removeAttribute("aria-invalid"));
    text.addEventListener("keydown", event => { if (event.key !== "Enter") return; event.stopPropagation(); if (event.isComposing) return; event.preventDefault(); placeText(base.width / 2, base.height / 2, true); });
    const point = event => { const rect = overlay.getBoundingClientRect(); return [(event.clientX-rect.left)*overlay.width/rect.width,(event.clientY-rect.top)*overlay.height/rect.height]; };
    overlay.onpointerdown = event => { event.preventDefault(); const [x,y] = point(event); if (tool === "text") return placeText(x,y); overlay.setPointerCapture(event.pointerId); remember(); ctx.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over"; ctx.strokeStyle = ctx.fillStyle = color.value; ctx.lineWidth = Number(width.value); ctx.lineCap = "round"; down = true; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+.1,y); ctx.stroke(); };
    overlay.onpointermove = event => { if (!down) return; const [x,y] = point(event); ctx.lineTo(x,y); ctx.stroke(); };
    overlay.onpointerup = overlay.onpointercancel = () => { down = false; };
    panel.append(tools, settings, history, textControls, status); content.append(panel, workspace);
    const resize = new ResizeObserver(() => { const box = workspace.getBoundingClientRect(); const inset = parseFloat(getComputedStyle(workspace).paddingLeft) * 2 + 2; const scale = Math.min((box.width - inset) / base.width, (box.height - inset) / base.height); if (scale > 0) { stage.style.width = `${base.width * scale}px`; stage.style.height = `${base.height * scale}px`; } });
    const disconnect = () => resize.disconnect();
    options.modal({ title: options.t("editImage"), content, dialogClass: "image-edit-modal", closeOnBackdrop: false, confirm: options.t("mediaSaved"), onCancel: disconnect, onConfirm: async close => { const flattened = document.createElement("canvas"); flattened.width = base.width; flattened.height = base.height; const c = flattened.getContext("2d"); c.drawImage(base,0,0); c.drawImage(overlay,0,0); const preset = IMAGE_PRESETS[options.imagePreset] || IMAGE_PRESETS.balanced; const result = await compress(flattened,preset.quality,preset.edge,preset.target); await apply({ ...image, ...result }); disconnect(); close(); } });
    resize.observe(workspace);
  }
  async function applyCommands(images, operations) {
    const result = clone(images);
    for (const op of operations || []) {
      const image = result.find(image => image.id === op.id);
      const types = ["rectangle","circle","arrow","text","crop","rotate","brightness","contrast"];
      if (!image || !types.includes(op.type) || !/^#[a-f0-9]{6}$/i.test(op.color) || typeof op.text !== "string" || op.text.length > 200
        || [op.x,op.y,op.w,op.h].some(n => !Number.isFinite(n) || n < 0 || n > 1) || !Number.isFinite(op.value) || Math.abs(op.value) > 180) throw new Error("invalid_image");
      const source = await bitmap(image), canvas = document.createElement("canvas"); canvas.width = source.width; canvas.height = source.height;
      const ctx = canvas.getContext("2d"); ctx.drawImage(source,0,0); source.close();
      const x = op.x*canvas.width, y = op.y*canvas.height, w = op.w*canvas.width, h = op.h*canvas.height;
      ctx.strokeStyle = ctx.fillStyle = op.color; ctx.lineWidth = Math.max(2,canvas.width/160);
      if (op.type === "rectangle") ctx.strokeRect(x,y,w,h);
      if (op.type === "circle") { ctx.beginPath(); ctx.ellipse(x+w/2,y+h/2,Math.max(1,w/2),Math.max(1,h/2),0,0,Math.PI*2); ctx.stroke(); }
      if (op.type === "arrow") { const ex = Math.min(canvas.width,x+w), ey = Math.min(canvas.height,y+h), a = Math.atan2(ey-y,ex-x), len = Math.max(8,canvas.width/30); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(ex,ey); ctx.lineTo(ex-len*Math.cos(a-.5),ey-len*Math.sin(a-.5)); ctx.moveTo(ex,ey); ctx.lineTo(ex-len*Math.cos(a+.5),ey-len*Math.sin(a+.5)); ctx.stroke(); }
      if (op.type === "text") { ctx.font = `${Math.max(10,Math.min(120,op.value || 4))*canvas.width/100}px sans-serif`; ctx.fillText(op.text,x,y,Math.max(1,canvas.width-x)); }
      if (["crop","rotate","brightness","contrast"].includes(op.type)) {
        const original = document.createElement("canvas"); original.width = canvas.width; original.height = canvas.height; original.getContext("2d").drawImage(canvas,0,0);
        if (op.type === "crop") { if (w < 1 || h < 1 || x+w > original.width+1 || y+h > original.height+1) throw new Error("invalid_image"); canvas.width = Math.round(w); canvas.height = Math.round(h); canvas.getContext("2d").drawImage(original,x,y,w,h,0,0,canvas.width,canvas.height); }
        else if (op.type === "rotate") { const rad = op.value*Math.PI/180, cw=canvas.width,ch=canvas.height; canvas.width = Math.ceil(Math.abs(cw*Math.cos(rad))+Math.abs(ch*Math.sin(rad))); canvas.height = Math.ceil(Math.abs(cw*Math.sin(rad))+Math.abs(ch*Math.cos(rad))); const c=canvas.getContext("2d"); c.translate(canvas.width/2,canvas.height/2); c.rotate(rad); c.drawImage(original,-cw/2,-ch/2); }
        else { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.filter = `${op.type}(${Math.max(0,Math.min(200,100+op.value))}%)`; ctx.drawImage(original,0,0); }
      }
      Object.assign(image, await compress(canvas,.9,2048));
    }
    return result;
  }
  function agentSelection(content, value, options) {
    const images = D.unpack(value).images;
    if (!images.length) return () => [];
    const group = element("fieldset", "agent-image-selection"); group.append(element("legend", "", options.t("agentImages")));
    for (const image of images) { checkImage(image); const label = element("label", ""); const input = element("input"); input.type = "checkbox"; input.value = image.id; const img = element("img"); img.src = dataUrl(image); img.alt = image.caption || options.t("imageSelected"); label.append(input,img,element("span","",image.caption || image.id)); group.append(label); }
    content.append(group, element("p","field-help",options.t("agentImageNotice")),element("p","field-help",options.t("agentUnsupported")));
    return () => [...group.querySelectorAll("input:checked")].map(input => input.value);
  }
  window.addEventListener("astranote:localechange", () => {
    document.querySelectorAll("[data-media-key]").forEach(node => { node.textContent = t(node.dataset.mediaKey); });
    document.querySelectorAll("[data-media-placeholder]").forEach(node => { node.placeholder = t(node.dataset.mediaPlaceholder); });
    document.querySelectorAll("[data-media-aria]").forEach(node => { node.setAttribute("aria-label",t(node.dataset.mediaAria)); });
    document.querySelectorAll("[data-media-title]").forEach(node => { node.title = t(node.dataset.mediaTitle); });
    document.querySelectorAll(".note-media-editor").forEach(node => node.astraRefreshLocale?.());
  });
  window.AstraMedia = Object.freeze({ copy, render, mount, agentSelection, applyCommands, compress, dimensions });
})();
