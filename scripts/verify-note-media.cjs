"use strict";
// Entirely isolated fixtures and a Responses API mock; no production data/mail.
const fs=require("node:fs/promises"),path=require("node:path"),os=require("node:os"),crypto=require("node:crypto"),assert=require("node:assert/strict"),sharp=require("sharp");
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||"C:/Users/eaton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const sizes=[[1440,900],[1024,768],[768,1024],[430,932],[390,844],[360,740],[320,568],[844,390]];
let browser,server,core,directory,artifacts,page;
const stamp=()=>new Date().toISOString();
(async()=>{
  directory=await fs.mkdtemp(path.join(os.tmpdir(),"astranote-media-data-")); artifacts=await fs.mkdtemp(path.join(os.tmpdir(),"astranote-media-review-"));
  process.env.DATA_DIR=directory;
  for(const key of ["ASTRANOTE_SECRET","ASTRA_CONFIDENTIAL_KEY","ASTRANOTE_VAULT_SECRET"])process.env[key]=crypto.randomBytes(64).toString("base64url");
  process.env.API_KEY="isolated-not-real-key";
  const original=global.fetch, apiRequests=[];
  global.fetch=async(url,options)=>{
    if(String(url).startsWith("https://api.openai.com/")) {
      const request=JSON.parse(options.body); apiRequests.push(request);
      const input=JSON.parse(request.input[1].content[0].text),id=input.images[0]?.id;
      return Response.json({service_tier:request.service_tier,output_text:JSON.stringify({message:"Added a test annotation.",title:"Reviewed media",content:input.note.content+"\n\nReviewed.",imageEdits:id?[{type:"text",id,x:.1,y:.5,w:.5,h:.2,value:5,text:"QA",color:"#3456cc"}]:[]}),usage:{input_tokens:500,output_tokens:200}});
    }
    if(!String(url).startsWith("http://127.0.0.1:"))throw new Error("External requests blocked");
    return original(url,options);
  };
  core=require("../server");await core.ensureData();server=require("../bootstrap").createOuterApp().listen(0,"127.0.0.1");await new Promise(resolve=>server.once("listening",resolve));
  const base=`http://127.0.0.1:${server.address().port}`,username="codex_media_qa",csrf=crypto.randomBytes(16).toString("hex"),token=crypto.randomBytes(32).toString("base64url"),user=path.join(directory,username);
  await fs.mkdir(path.join(user,"notes"),{recursive:true});
  const metadata={username,email:"codex@example.test",emailVerified:true,passwordHash:await require("argon2").hash("Qa!9SafeOnly"),cryptoFactor:crypto.randomBytes(48).toString("base64url"),createdAt:stamp(),notes:[],settings:{language:"en",theme:"dark"},entitlements:{ultraMs:30*864e5,proMs:0,plusMs:0,updatedAt:stamp()}};
  await fs.writeFile(path.join(user,"metadata.json"),JSON.stringify(metadata));
  await fs.writeFile(path.join(user,"sessions.json"),JSON.stringify({[crypto.createHash("sha256").update(token).digest("hex")]:{username,csrf,createdAt:stamp(),expiresAt:new Date(Date.now()+864e5).toISOString(),maxExpiresAt:new Date(Date.now()+28*864e5).toISOString()}}));
  browser=await chromium.launch({channel:"msedge",headless:true});const context=await browser.newContext();await context.addCookies([{name:"astranote_session",value:`${username}.${token}`,url:base}]);
  await context.addInitScript(()=>{localStorage.setItem("astranote_cookie_notice","accepted");localStorage.setItem("astranote_language","en");});
  const outbound=[];await context.route("https://**/*",route=>{outbound.push(route.request().url());return route.abort();});
  let navigation=1;await context.route(base+"/**",route=>route.continue({headers:{...route.request().headers(),"x-forwarded-for":`198.51.100.${(++navigation%200)+1}`}}));
  page=await context.newPage();page.setDefaultTimeout(20_000);page.setDefaultNavigationTimeout(20_000);const errors=[];page.on("pageerror",error=>errors.push(error.message));
  const fixture=await sharp({create:{width:480,height:320,channels:3,background:"#d5d7ff"}}).composite([{input:Buffer.from('<svg width="480" height="320"><text x="30" y="80" font-size="28" fill="#253064">Synthetic QA image</text></svg>')}]).png().toBuffer();
  const imageFiles=await Promise.all([[480,320],[360,640],[960,240]].map(async([width,height],i)=>({name:`synthetic-${i}.png`,mimeType:"image/png",buffer:await sharp(fixture).resize(width,height,{fit:'fill'}).png().toBuffer()})));
  let checks=0,first;
  for(const [mode,pin] of [["none",null],["aes-256-gcm-new",null],["astra-secret-v1","659371"],["astra-confidential-v3","Qa!2Only4Fixture"],["astra-zero-v1","Zero!8Fixture"]]) {
    console.log("Media round-trip:",mode);await page.goto(base+"/notes/new");await page.locator(".note-media-editor").waitFor();
    await page.locator("#name").fill("Media "+mode);
    await page.locator('.media-toolbar input[type="file"]').setInputFiles(imageFiles);
    await page.waitForFunction(()=>document.querySelectorAll(".media-image-card").length===3);
    if(mode==='none'){
      const originalIds=await page.locator('.media-image-data').allTextContents();
      for(const preset of ['balanced','clear','small']){
        await page.locator('.media-toolbar select').selectOption(preset);await page.waitForFunction(()=>document.querySelector('.note-media-editor').getAttribute('aria-busy')==='false');
        assert.deepEqual(await page.locator('.media-image-data').allTextContents(),originalIds);checks++;
      }
      await page.locator('.media-preview-toggle').click();await page.locator('.note-preview-modal .note-image').first().waitFor();
      assert.equal(await page.locator('.note-preview-modal .note-image').count(),3);
      await page.locator('.note-preview-modal .modal-actions button').click();assert.equal(await page.locator('.note-preview-modal').count(),0);checks+=2;
    }
    await page.locator('.media-image-card input').first().fill("Fixture caption");
    const reference=(await page.locator(".media-image-data").first().textContent()).match(/\{img_[a-f0-9]{24}\}/)[0];
    await page.locator("#new-content").fill(`# A real heading\n\n**Bold text**\n\n${reference}\n\n\`${reference}\`\n\n![remote](https://image.invalid/tracker.png)\n\n<script>window.mediaXss=true</script>\n\n[bad](javascript:alert(1))`);
    await page.locator("#encryption").selectOption(mode);
    if(pin){await page.locator("#vault-pin").click();await page.locator("#vault-pin").fill(pin);await page.locator("#vault-pin-confirm").click();await page.locator("#vault-pin-confirm").fill(pin);}
    await page.locator('#note-form button[type="submit"]').click();await page.waitForURL(/\/notes\/[a-f0-9]{24}$/);await page.locator("#note-content .note-image").first().waitFor();
    assert.equal(await page.locator("#note-content .note-image").count(),3);assert.equal(await page.locator("#note-content h1").textContent(),"A real heading");assert.equal(await page.locator("#note-content code").textContent(),reference);assert.equal(await page.evaluate(()=>window.mediaXss),undefined);
    assert.equal(await page.locator('#note-content a[href^="javascript:"]').count(),0);assert.equal(outbound.some(url=>url.includes("image.invalid")),false);
    const id=page.url().split("/").at(-1);if(!first)first=id;
    const stored=await fs.readFile(path.join(user,"notes",id+".json"),"utf8");if(pin)assert.ok(!stored.includes("Fixture caption")&&!stored.includes("Synthetic"));
    await page.goto(base+`/notes/${id}/edit`);await page.locator(".media-image-card").first().waitFor();
    assert.equal(await page.locator(".media-image-card").count(),3);
    await page.locator(".media-image-actions").first().getByRole("button",{name:"Draw & edit",exact:true}).click();await page.locator(".image-editor-stage canvas").first().waitFor();
    const canvas=page.locator(".image-editor-stage canvas").last(),rect=await canvas.boundingBox();await page.mouse.move(rect.x+rect.width*.2,rect.y+rect.height*.2);await page.mouse.down();await page.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.5,{steps:6});await page.mouse.up();
    await page.getByRole("button",{name:"Eraser",exact:true}).click();await page.mouse.click(rect.x+rect.width*.3,rect.y+rect.height*.3);
    await page.getByRole("button",{name:"Undo",exact:true}).click();await page.getByRole("button",{name:"Redo",exact:true}).click();
    await page.getByRole("button",{name:"Add text",exact:true}).click();
    await page.getByRole("button",{name:"Place text",exact:true}).click();
    assert.equal(await page.locator('.image-text-controls input').getAttribute('aria-invalid'),'true');
    const inkBefore=await canvas.evaluate(el=>el.getContext('2d').getImageData(0,0,el.width,el.height).data.filter((n,i)=>i%4===3&&n>0).length);
    await page.locator('.image-text-controls input').fill('Saved text QA');await page.getByRole('button',{name:'Place text',exact:true}).click();
    const inkAfter=await canvas.evaluate(el=>el.getContext('2d').getImageData(0,0,el.width,el.height).data.filter((n,i)=>i%4===3&&n>0).length);
    assert.ok(inkAfter>inkBefore,'text changes real image pixels');
    await page.locator('.image-text-controls input').fill('Enter also places text');await page.locator('.image-text-controls input').press('Enter');
    assert.equal(await page.locator('.image-edit-modal').count(),1,'Enter must not submit and close the image editor');checks+=3;
    await page.getByRole("button",{name:"Apply changes",exact:true}).click();await page.locator(".image-edit-modal").waitFor({state:"detached"});
    await page.locator("#editor-content").fill("Updated image version");await page.locator("#save-note").click();await page.waitForURL(new RegExp(`/notes/${id}$`));await page.locator("#note-content .note-image").first().waitFor();
    const currentSources=await page.locator('#note-content .note-image img').evaluateAll(nodes=>nodes.map(node=>node.src));
    await page.locator("#previous-note").click();await page.locator("#previous-content .note-image").first().waitFor();assert.equal(await page.locator("#previous-content .note-image").count(),3);
    assert.deepEqual(await page.locator('#previous-content .note-image img').evaluateAll(nodes=>nodes.map(node=>node.src)),currentSources,'history preview uses live images, not old drawings');
    await page.locator('#restore-previous').click();await page.locator('.modal-actions .btn-primary').click();await page.locator('#note-content h1').waitFor();
    assert.deepEqual(await page.locator('#note-content .note-image img').evaluateAll(nodes=>nodes.map(node=>node.src)),currentSources,'restoring text preserves exact live image data');
    const retained=JSON.parse(await fs.readFile(path.join(user,'notes',id+'.json'),'utf8'));
    let patches;
    if(pin) patches=await page.evaluate(async retained=>{const note=await api(`/api/notes/${retained.id}`);const key=await cachedNoteKey(note);return Promise.all(retained.history.map(async entry=>{const bytes=base64ToBytes(entry.data.ciphertext),tag=base64ToBytes(entry.data.tag),combined=new Uint8Array(bytes.length+tag.length);combined.set(bytes);combined.set(tag,bytes.length);return JSON.parse(textDecoder.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:base64ToBytes(entry.data.iv),additionalData:historyAAD(note,entry.revision),tagLength:128},key,combined)));}));},retained);
    else patches=retained.history.map(entry=>mode==='none'?entry.data:JSON.parse(core.testables.decryptContent(entry.data,username,`${id}:history:${entry.revision}`,mode)));
    assert.ok(patches.every(patch=>patch.v===3&&!Object.hasOwn(patch,'images')&&!JSON.stringify(patch).includes('Fixture caption')),'saved history contains only text and integrity metadata');checks+=15;
    await page.locator("#astra-ai").click();await page.locator(".agent-image-selection input").first().check();await page.locator(".astra-ai-form textarea").fill("Add a short QA label to the selected image");await page.locator(".modal-actions .btn-primary").click();
    await page.locator(".astra-ai-preview .media-image-card").first().waitFor();assert.equal(await page.locator(".astra-ai-preview .media-image-card").count(),3);await page.locator(".modal-actions .btn-primary").click();await page.waitForURL(new RegExp(`/notes/${id}$`));await page.locator("#note-content").filter({hasText:"Reviewed."}).waitFor();
    assert.equal(apiRequests.at(-1).input[1].content.filter(item=>item.type==="input_image").length,1);checks+=2;
  }
  if(!process.argv.includes('--functional-only'))for(const locale of ["en","zh-Hant","ja"])for(const theme of ["dark","light"]){
    await page.goto(base+`/notes/${first}/edit`);await page.locator(".media-image-card").first().waitFor();
    await page.evaluate(({locale,theme})=>{state.language=locale;state.theme=theme;applyLocale();document.documentElement.style.scrollBehavior="auto";},{locale,theme});
    for(const [width,height]of sizes){await page.setViewportSize({width,height});await page.waitForTimeout(70);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${locale}/${theme}/${width}`);assert.equal(await page.locator('.media-toolbar input[type="range"]').count(),0);assert.equal(await page.locator('.media-toolbar select option').count(),3);assert.doesNotMatch(await page.evaluate(()=>Object.values(AstraMedia.copy).flatMap(Object.values).join(' ')),/5\s?KB/);checks++;
      if(width===320||width===1440){await page.locator(".note-media-editor").evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-110));await page.screenshot({path:path.join(artifacts,`editor-${locale}-${theme}-${width}.png`),animations:"disabled"});}
      const cardsFit=await page.locator('.media-image-card > .note-image').evaluateAll(nodes=>nodes.every(node=>{const a=node.getBoundingClientRect(),b=node.parentElement.getBoundingClientRect();return a.left>=b.left&&a.right<=b.right+1;}));assert.ok(cardsFit,'preview stays inside its image card');
      await page.locator('.media-image-actions').first().locator('button').nth(1).click();await page.locator('.image-editor-stage canvas').last().waitFor();await page.waitForTimeout(100);
      const fit=await page.locator('.image-editor-stage canvas').last().evaluate(canvas=>{const a=canvas.getBoundingClientRect(),w=canvas.closest('.image-editor-workspace').getBoundingClientRect();return {ratio:a.width/a.height,original:canvas.width/canvas.height,visible:a.width>0&&a.height>0&&a.left>=w.left&&a.top>=w.top&&a.right<=w.right+1&&a.bottom<=w.bottom+1&&a.bottom<=innerHeight};});
      assert.ok(fit.visible,`whole drawing image fits ${locale}/${theme}/${width}`);assert.ok(Math.abs(fit.ratio-fit.original)<.02);
      await page.locator('.image-draw-tools button').last().click();await page.locator('.image-text-controls input').fill(locale==='zh-Hant'?'放上文字':locale==='ja'?'文字を追加':'Add a label');await page.waitForTimeout(70);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      if(width===320||width===1440||width===844)await page.screenshot({path:path.join(artifacts,`draw-${locale}-${theme}-${width}.png`),animations:'disabled'});
      const confirmBox=await page.locator('.image-edit-modal .modal-actions .btn-primary').boundingBox();assert.ok(confirmBox.y+confirmBox.height<=height);
      await page.locator('.image-edit-modal .modal-actions button').first().click();checks++;
      if(locale==='en'&&theme==='dark')for(const index of [1,2]){
        await page.locator('.media-image-actions').nth(index).locator('button').nth(1).click();await page.waitForTimeout(100);
        assert.ok(await page.locator('.image-editor-stage canvas').last().evaluate(el=>{const a=el.getBoundingClientRect(),w=el.closest('.image-editor-workspace').getBoundingClientRect();return a.width>0&&a.height>0&&a.right<=w.right&&a.bottom<=w.bottom&&a.left>=w.left&&a.top>=w.top&&Math.abs(a.width/a.height-el.width/el.height)<.02;}),'portrait and panoramic drawing fit');
        if(width===320||width===1440||width===844)await page.screenshot({path:path.join(artifacts,`draw-shape${index}-${width}.png`),animations:'disabled'});
        await page.locator('.image-edit-modal .modal-actions button').first().click();checks++;
      }
    }
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({success:true,checks,screenshots:artifacts}));
})().catch(async error=>{console.error(error);if(page&&artifacts)await page.screenshot({path:path.join(artifacts,"failure.png"),fullPage:true}).catch(()=>{});process.exitCode=1;}).finally(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));core?.testables.closeOrderStore();if(directory){assert.ok(directory.startsWith(path.join(os.tmpdir(),"astranote-media-data-")));await fs.rm(directory,{recursive:true,force:true});}});
