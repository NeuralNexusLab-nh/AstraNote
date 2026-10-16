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
  const imageFiles=[0,1,2].map(i=>({name:`synthetic-${i}.png`,mimeType:"image/png",buffer:fixture}));
  let checks=0,first;
  for(const [mode,pin] of [["none",null],["aes-256-gcm-new",null],["astra-secret-v1","659371"],["astra-confidential-v3","Qa!2Only4Fixture"],["astra-zero-v1","Zero!8Fixture"]]) {
    console.log("Media round-trip:",mode);await page.goto(base+"/notes/new");await page.locator(".note-media-editor").waitFor();
    await page.locator("#name").fill("Media "+mode);
    await page.locator('.media-toolbar input[type="file"]').setInputFiles(imageFiles);
    await page.waitForFunction(()=>document.querySelectorAll(".media-image-card").length===3);
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
    await page.getByRole("button",{name:"Erase drawing",exact:true}).click();await page.mouse.click(rect.x+rect.width*.3,rect.y+rect.height*.3);
    await page.getByRole("button",{name:"Undo",exact:true}).click();await page.getByRole("button",{name:"Redo",exact:true}).click();
    await page.getByRole("button",{name:"Apply changes",exact:true}).click();await page.locator(".image-edit-modal").waitFor({state:"detached"});
    await page.locator("#editor-content").fill("Updated image version");await page.locator("#save-note").click();await page.waitForURL(new RegExp(`/notes/${id}$`));await page.locator("#note-content .note-image").first().waitFor();
    await page.locator("#previous-note").click();await page.locator("#previous-content .note-image").first().waitFor();assert.equal(await page.locator("#previous-content .note-image").count(),3);checks+=12;
    await page.locator("#close-previous").click();
    await page.locator("#astra-ai").click();await page.locator(".agent-image-selection input").first().check();await page.locator(".astra-ai-form textarea").fill("Add a short QA label to the selected image");await page.locator(".modal-actions .btn-primary").click();
    await page.locator(".astra-ai-preview .media-image-card").first().waitFor();assert.equal(await page.locator(".astra-ai-preview .media-image-card").count(),3);await page.locator(".modal-actions .btn-primary").click();await page.waitForURL(new RegExp(`/notes/${id}$`));await page.locator("#note-content").filter({hasText:"Reviewed."}).waitFor();
    assert.equal(apiRequests.at(-1).input[1].content.filter(item=>item.type==="input_image").length,1);checks+=2;
  }
  for(const locale of ["en","zh-Hant","ja"])for(const theme of ["dark","light"]){
    await page.goto(base+`/notes/${first}/edit`);await page.locator(".media-image-card").first().waitFor();
    await page.evaluate(({locale,theme})=>{state.language=locale;state.theme=theme;applyLocale();document.documentElement.style.scrollBehavior="auto";},{locale,theme});
    for(const [width,height]of sizes){await page.setViewportSize({width,height});await page.waitForTimeout(70);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${locale}/${theme}/${width}`);assert.equal(await page.locator('.media-toolbar input[type="range"]').count(),1);checks++;
      if(width===320||width===1440){await page.locator(".note-media-editor").scrollIntoViewIfNeeded();await page.screenshot({path:path.join(artifacts,`editor-${locale}-${theme}-${width}.png`),animations:"disabled"});}
    }
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({success:true,checks,screenshots:artifacts}));
})().catch(async error=>{console.error(error);if(page&&artifacts)await page.screenshot({path:path.join(artifacts,"failure.png"),fullPage:true}).catch(()=>{});process.exitCode=1;}).finally(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));core?.testables.closeOrderStore();if(directory){assert.ok(directory.startsWith(path.join(os.tmpdir(),"astranote-media-data-")));await fs.rm(directory,{recursive:true,force:true});}});
