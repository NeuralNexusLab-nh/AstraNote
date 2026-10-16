/* Local raster editing and safe Markdown. No network requests or dynamic code. */
(function () {
  "use strict";
  const D = window.AstraDocument;
  const copy = {
    en: { images: "Images", addImages: "Add images", mediaHint: "Up to 3 images. Paste, drop or choose files. Images share your note storage and encryption.", compression: "Compression", smallImage: "Small · target 5 KB", balancedImage: "Balanced", clearImage: "Clear", quality: "Quality", caption: "Image caption", insertImage: "Insert in text", copyImageId: "Copy reference", editImage: "Draw & edit", replaceImage: "Replace", removeImage: "Remove", imageLimit: "A note can contain up to 3 images.", invalid_image: "Choose a PNG, JPEG or WebP image up to 8 MB and 16 million pixels. SVG and animated images are not supported.", image_busy: "Image processing is busy. Please try again shortly.", pass_limit: "Your active AstraPass limit has been reached. Disable one or wait for it to expire before creating another.", imageGoal: "5 KB is a target, not a limit. Check the preview; use Balanced or Clear if text is hard to read.", imageStorage: "Estimated saved size", textSize: "Text", imageSize: "Images", accountEstimate: "Estimated account use", mediaPreview: "Preview note", writeNote: "Write", brush: "Brush", eraser: "Erase drawing", addText: "Add text", undo: "Undo", redo: "Redo", imageText: "Text to place", imageColor: "Color", imageWidth: "Stroke width", downloadImage: "Download image", zoomImage: "View image", imageChanges: "Image changes", agentImages: "Include images in this request", agentImageNotice: "Only checked images are sent to OpenAI with the readable note and instruction. PINs and keys are never sent. Image analysis uses more allowance; manual drawing does not.", agentWorking: "Sending and processing your request… If Flex is unavailable, Standard is tried automatically at twice the rate.", mediaPrivacy: "Captions, drawings and images use this note's encryption. Saved versions retain full image copies and count toward storage.", passCapacity: "Active AstraPass", imageSelected: "Selected image", mediaSaved: "Apply changes", mediaRemoveBody: "Remove this image from the current draft? Saved versions, if any, keep their own copy.", imageError: "This image could not be opened. It may be damaged or use an unsupported format.", agentUnsupported: "Astra Agent can draw, add text, crop, rotate and adjust images; it does not regenerate pictures or remove objects." },
    "zh-Hant": { images: "圖片", addImages: "加入圖片", mediaHint: "每篇最多 3 張，可貼上、拖放或選擇檔案。圖片與筆記共用空間及加密方式。", compression: "壓縮方式", smallImage: "精簡 · 目標 5 KB", balancedImage: "均衡", clearImage: "清晰", quality: "畫質", caption: "圖片註解", insertImage: "插入內文", copyImageId: "複製引用", editImage: "繪圖與編輯", replaceImage: "重新上傳", removeImage: "移除", imageLimit: "每篇筆記最多能放 3 張圖片。", invalid_image: "請選擇 8 MB、1,600 萬像素以內的 PNG、JPEG 或 WebP 圖片；不支援 SVG 與動態圖片。", image_busy: "目前圖片處理繁忙，請稍後再試。", pass_limit: "同時有效的 AstraPass 已達方案上限。請停用一個或等它到期，再建立新的。", imageGoal: "5 KB 是壓縮目標，不是硬性限制。請確認預覽；文字不清楚時，改選均衡或清晰。", imageStorage: "預估儲存大小", textSize: "文字", imageSize: "圖片", accountEstimate: "預估帳號用量", mediaPreview: "預覽筆記", writeNote: "編寫", brush: "畫筆", eraser: "擦除畫筆", addText: "加入文字", undo: "復原", redo: "重做", imageText: "要放上的文字", imageColor: "顏色", imageWidth: "筆畫粗細", downloadImage: "下載圖片", zoomImage: "檢視圖片", imageChanges: "圖片變更", agentImages: "這次要交給 AI 的圖片", agentImageNotice: "只有勾選的圖片會與可讀筆記、指令傳送至 OpenAI，不包含 PIN 或金鑰。分析圖片較耗額度；手動繪圖不扣 AI 額度。", agentWorking: "正在傳送並處理指令… 若 Flex 暫時不可用，會自動改試 Standard，費率為兩倍。", mediaPrivacy: "圖片、註解與繪圖沿用此筆記的加密。每個版本保存完整圖片，並計入空間。", passCapacity: "同時有效的 AstraPass", imageSelected: "選取的圖片", mediaSaved: "套用變更", mediaRemoveBody: "要從目前草稿移除此圖片嗎？已保留的版本仍會有各自的副本。", imageError: "無法開啟這張圖片，檔案可能已損壞或格式不支援。", agentUnsupported: "Astra Agent 可繪圖、加字、裁切、旋轉與調整圖片；不會重新生成圖片或移除物件。" },
    ja: { images: "画像", addImages: "画像を追加", mediaHint: "1ノートにつき3枚まで。貼り付け・ドロップ・ファイル選択に対応。ノートと容量・暗号化を共有します。", compression: "圧縮", smallImage: "軽量 · 目標5 KB", balancedImage: "バランス", clearImage: "鮮明", quality: "画質", caption: "画像の説明", insertImage: "本文に挿入", copyImageId: "参照をコピー", editImage: "描画・編集", replaceImage: "差し替え", removeImage: "削除", imageLimit: "1ノートに追加できる画像は3枚までです。", invalid_image: "8 MB・1,600万画素以内のPNG、JPEG、WebPを選択してください。SVGやアニメーション画像は使えません。", image_busy: "画像処理が混み合っています。少し待ってお試しください。", pass_limit: "有効なAstraPassが上限に達しました。一つ無効にするか、期限終了までお待ちください。", imageGoal: "5 KBは目標です。読みにくい場合は、プレビューを確認してバランスか鮮明を選んでください。", imageStorage: "保存サイズの目安", textSize: "テキスト", imageSize: "画像", accountEstimate: "アカウント使用量の目安", mediaPreview: "ノートをプレビュー", writeNote: "編集", brush: "ペン", eraser: "描画を消す", addText: "文字を追加", undo: "元に戻す", redo: "やり直す", imageText: "配置する文字", imageColor: "色", imageWidth: "線の太さ", downloadImage: "画像をダウンロード", zoomImage: "画像を見る", imageChanges: "画像の変更", agentImages: "今回AIに送る画像", agentImageNotice: "選択した画像と読めるノート・指示だけをOpenAIに送信します。PINや鍵は送りません。画像解析は利用枠を多く使い、手描きでは消費しません。", agentWorking: "リクエストを送信・処理中… Flexが利用できない場合、2倍の料金のStandardを自動で試します。", mediaPrivacy: "画像・説明・描画はノートと同じ暗号化を使います。保存した各版には完全な画像コピーを含み、容量を消費します。", passCapacity: "有効なAstraPass", imageSelected: "選択した画像", mediaSaved: "変更を適用", mediaRemoveBody: "現在の下書きから画像を削除しますか？保存済みの版には個別のコピーが残ります。", imageError: "画像を開けません。破損や未対応形式の可能性があります。", agentUnsupported: "Astra Agentは描画、文字、切り抜き、回転、画像調整に対応します。画像の再生成や物体の除去はできません。" },
  };
  Object.assign(copy.en,{preparingPreview:"Preparing your preview…",imageProcessing:"Processing images…"});
  Object.assign(copy.en,{ai_failed:"Astra Agent is temporarily unavailable. Your note has not changed; please try again shortly.",ai_invalid_result:"The result could not be safely applied. Your note has not changed. Try a clearer instruction.",ai_quota_exhausted:"Not enough Astra Agent allowance remains for this request. Check the reset date on your dashboard.",ai_note_too_large:"Astra Agent can process up to 64 KB of text at a time. Shorten the text before trying again."});
  Object.assign(copy["zh-Hant"],{preparingPreview:"正在準備預覽…",imageProcessing:"正在處理圖片…"});
  Object.assign(copy["zh-Hant"],{ai_failed:"Astra Agent 暫時無法使用。筆記尚未更動，請稍後再試。",ai_invalid_result:"這次結果無法安全套用，筆記尚未更動。請把指令寫得更明確後再試。",ai_quota_exhausted:"剩餘的 Astra Agent 額度不足以處理這次指令，請到儀錶板查看重設日期。",ai_note_too_large:"Astra Agent 一次最多處理 64 KB 文字，請先縮短內容再試。"});
  Object.assign(copy.ja,{preparingPreview:"プレビューを準備中…",imageProcessing:"画像を処理中…"});
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
  async function importFile(file, profile, quality) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 8_000_000 || file.size < 16) throw new Error("invalid_image");
    const raw = new Uint8Array(await file.arrayBuffer());
    dimensions(raw, file.type);
    const source = await createImageBitmap(file, { imageOrientation: "from-image" });
    try { return await compress(source, quality, profile === "small" ? 640 : profile === "balanced" ? 1024 : 2048, profile === "small"); }
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
    const toolbar = element("div", "media-toolbar");
    const profile = element("select"); profile.setAttribute("aria-label", options.t("compression")); profile.dataset.mediaAria="compression";
    for (const [value, key] of [["small","smallImage"],["balanced","balancedImage"],["clear","clearImage"]]) { const opt = element("option", "", options.t(key)); opt.value = value; profile.append(opt); }
    const quality = element("input"); quality.type = "range"; quality.min = "35"; quality.max = "95"; quality.value = "65"; quality.setAttribute("aria-label", options.t("quality")); quality.dataset.mediaAria="quality";
    profile.onchange = () => { quality.value = profile.value === "small" ? "65" : profile.value === "balanced" ? "78" : "90"; recompress(); };
    quality.onchange = recompress;
    const picker = element("input"); picker.type = "file"; picker.accept = "image/png,image/jpeg,image/webp"; picker.multiple = true; picker.hidden = true;
    const add = button(options.t("addImages"), "image", () => picker.click());
    const preview = element("div", "media-note-preview"); preview.hidden = true;
    const previewToggle = button(options.t("mediaPreview"), "eye", () => { preview.hidden = !preview.hidden; if (!preview.hidden) render(preview, get(), options); });
    const qualityLabel = element("label", "media-quality"); qualityLabel.append(element("span","",options.t("quality")),quality);
    toolbar.append(add, profile, qualityLabel, previewToggle, picker);
    const hint = element("p", "field-help", options.t("mediaHint"));
    const goal = element("p", "field-help", options.t("imageGoal"));
    const grid = element("div", "media-grid");
    const sizes = element("p", "media-size"); sizes.setAttribute("aria-live", "polite");
    const processing = element("p","field-help",options.t("imageProcessing")); processing.hidden=true; processing.setAttribute("role","status");
    wrap.append(toolbar, processing, hint, goal, grid, sizes, element("p", "field-help", options.t("mediaPrivacy")), preview);
    textarea.after(wrap);
    function get() { return D.pack(textarea.value, images); }
    function changed() { drawSizes(); options.onchange?.(); if (!preview.hidden) render(preview, get(), options); }
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
      sizes.textContent = `${options.t("textSize")} ${options.formatBytes(bytes(textarea.value))} · ${options.t("imageSize")} ${options.formatBytes(images.reduce((sum,image) => sum + D.imageBytes(image) + bytes(image.caption),0))} · ${options.t("imageStorage")} ≈ ${options.formatBytes(estimate)}`;
      if (account) sizes.textContent += ` · ${options.t("accountEstimate")} ≈ ${options.formatBytes(used)}${account.plan?.maxBytes ? " / " + options.formatBytes(account.plan.maxBytes) : ""}`;
    }
    function draw() {
      processing.hidden = !busy;
      add.disabled = busy || images.length >= 3;
      grid.replaceChildren(...images.map((image, index) => {
        const card = element("article", "media-image-card"); card.append(figure(image, options));
        const info = element("p", "media-image-data", `{${image.id}} · ${options.formatBytes(D.imageBytes(image))}`);
        const caption = element("input"); caption.value = image.caption; caption.maxLength = 400; caption.placeholder = options.t("caption"); caption.dataset.mediaPlaceholder="caption"; caption.dataset.mediaAria="caption"; caption.setAttribute("aria-label", options.t("caption")); caption.oninput = () => { image.caption = caption.value; changed(); };
        const actions = element("div", "media-image-actions");
        actions.append(button(options.t("insertImage"), "plus", () => { const ref = `{${image.id}}`; textarea.setRangeText(ref, textarea.selectionStart, textarea.selectionEnd, "end"); textarea.focus(); changed(); }), button(options.t("copyImageId"), "copy", async () => { if (await options.copyText(`{${image.id}}`)) options.feedback?.(); }), button(options.t("editImage"), "pen", () => edit(image, options, async result => { images[index] = result; originals.delete(image.id); draw(); changed(); })), button(options.t("replaceImage"), "arrow-up-from-bracket", () => {
          const file = element("input"); file.type = "file"; file.accept = picker.accept; file.onchange = () => ingest(file.files, index); file.click();
        }), button(options.t("removeImage"), "trash-can", () => options.modal({ title: options.t("removeImage"), body: options.t("mediaRemoveBody"), danger: true, confirm: options.t("removeImage"), onConfirm: close => { images.splice(index,1); originals.delete(image.id); close(); draw(); changed(); } }), "btn btn-danger"));
        actions.querySelectorAll("button").forEach(button => { button.disabled = busy; });
        card.append(info, caption, actions); return card;
      })); drawSizes();
    }
    async function ingest(files, replace = null) {
      if (busy) return;
      if (replace === null && images.length + files.length > 3) return options.showError(new Error(options.t("imageLimit")));
      busy = true; draw();
      const pending = [];
      try {
        for (const file of files) {
          const image = await importFile(file, profile.value, Number(quality.value)/100);
          const id = replace === null ? `img_${[...crypto.getRandomValues(new Uint8Array(12))].map(n => n.toString(16).padStart(2,"0")).join("")}` : images[replace].id;
          pending.push({ ...image, id, caption: replace === null ? "" : images[replace].caption });
          originals.set(id,file);
        }
        if (replace === null) images.push(...pending); else if (pending[0]) images[replace] = pending[0];
        changed();
      } catch { options.showError(new Error(options.t("invalid_image"))); }
      finally { busy = false; picker.value = ""; draw(); }
    }
    async function recompress() {
      if (busy || !images.length) return;
      busy = true; profile.disabled = quality.disabled = true; draw();
      try {
        const results = [];
        for (const image of images) {
          if (originals.has(image.id)) results.push({...image,...await importFile(originals.get(image.id),profile.value,Number(quality.value)/100)});
          else { const source = await bitmap(image); try { results.push({...image,...await compress(source,Number(quality.value)/100,profile.value==="small"?640:profile.value==="balanced"?1024:2048,profile.value==="small")}); } finally {source.close();} }
        }
        images = results; changed();
      } catch { options.showError(new Error(options.t("imageError"))); }
      finally { busy=false; profile.disabled = quality.disabled = false; draw(); }
    }
    picker.onchange = () => ingest(picker.files);
    textarea.addEventListener("paste", event => { const files = [...event.clipboardData.files].filter(file => file.type.startsWith("image/")); if (files.length) { event.preventDefault(); ingest(files); } });
    wrap.addEventListener("dragover", event => event.preventDefault());
    wrap.addEventListener("drop", event => { event.preventDefault(); ingest(event.dataTransfer.files); });
    textarea.addEventListener("input", changed);
    wrap.astraRefreshLocale = drawSizes;
    draw();
    return { get, busy: () => busy, images: () => clone(images), refresh: drawSizes };
  }
  async function edit(image, options, apply) {
    const source = await bitmap(image), base = document.createElement("canvas"), overlay = document.createElement("canvas");
    base.width = overlay.width = source.width; base.height = overlay.height = source.height; base.getContext("2d").drawImage(source,0,0); source.close();
    const content = element("div", "image-editor");
    const stage = element("div", "image-editor-stage"); stage.append(base,overlay);
    let tool = "brush", down = false, undo = [], redo = [];
    const ctx = overlay.getContext("2d");
    const maxUndo = Math.max(1,Math.min(12,Math.floor(16_777_216/(overlay.width*overlay.height*4))));
    const remember = () => { undo.push(ctx.getImageData(0,0,overlay.width,overlay.height)); if (undo.length > maxUndo) undo.shift(); redo = []; };
    const color = element("input"); color.type = "color"; color.value = "#6566ff"; color.setAttribute("aria-label", options.t("imageColor"));
    const width = element("input"); width.type = "range"; width.min = "1"; width.max = "32"; width.value = "4"; width.setAttribute("aria-label", options.t("imageWidth"));
    const text = element("input"); text.maxLength = 200; text.placeholder = options.t("imageText"); text.setAttribute("aria-label", options.t("imageText")); text.dataset.mediaPlaceholder="imageText"; text.dataset.mediaAria="imageText";
    const tools = element("div", "image-draw-tools");
    const controls = [];
    for (const [mode,key,icon] of [["brush","brush","paintbrush"],["erase","eraser","eraser"],["text","addText","font"]]) {
      const control = button(options.t(key), icon, () => { tool = mode; controls.forEach(b => b.setAttribute("aria-pressed", String(b === control))); });
      control.setAttribute("aria-pressed", String(mode === tool)); controls.push(control); tools.append(control);
    }
    tools.append(button(options.t("undo"), "rotate-left", () => { if (!undo.length) return; redo.push(ctx.getImageData(0,0,overlay.width,overlay.height)); ctx.putImageData(undo.pop(),0,0); }), button(options.t("redo"), "rotate-right", () => { if (!redo.length) return; undo.push(ctx.getImageData(0,0,overlay.width,overlay.height)); ctx.putImageData(redo.pop(),0,0); }), color, width, text);
    const point = event => { const rect = overlay.getBoundingClientRect(); return [(event.clientX-rect.left)*overlay.width/rect.width,(event.clientY-rect.top)*overlay.height/rect.height]; };
    overlay.onpointerdown = event => { event.preventDefault(); overlay.setPointerCapture(event.pointerId); remember(); const [x,y] = point(event); ctx.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over"; ctx.strokeStyle = ctx.fillStyle = color.value; ctx.lineWidth = Number(width.value); ctx.lineCap = "round"; if (tool === "text") { ctx.font = `${Math.max(14,base.width/24)}px sans-serif`; ctx.fillText(text.value,x,y,base.width-x); return; } down = true; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+.1,y); ctx.stroke(); };
    overlay.onpointermove = event => { if (!down) return; const [x,y] = point(event); ctx.lineTo(x,y); ctx.stroke(); };
    overlay.onpointerup = overlay.onpointercancel = () => { down = false; };
    content.append(tools,stage);
    options.modal({ title: options.t("editImage"), content, dialogClass: "image-edit-modal", closeOnBackdrop: false, confirm: options.t("mediaSaved"), onConfirm: async close => { const flattened = document.createElement("canvas"); flattened.width = base.width; flattened.height = base.height; const c = flattened.getContext("2d"); c.drawImage(base,0,0); c.drawImage(overlay,0,0); const result = await compress(flattened,.9,2048); await apply({ ...image, ...result }); close(); } });
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
    document.querySelectorAll(".note-media-editor").forEach(node => node.astraRefreshLocale?.());
  });
  window.AstraMedia = Object.freeze({ copy, render, mount, agentSelection, applyCommands, compress, dimensions });
})();
