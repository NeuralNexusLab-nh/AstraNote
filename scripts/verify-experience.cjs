"use strict";
// Isolated UI acceptance checks; synthetic accounts and mail transport only.
const fs=require("node:fs/promises"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto"),assert=require("node:assert/strict"),argon2=require("argon2");
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||"C:/Users/eaton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const sizes=[[1440,900],[1024,768],[768,1024],[430,932],[390,844],[360,740],[320,568],[844,390]];
let core,server,browser,directory,artifacts;const stamp=()=>new Date().toISOString();
(async()=>{
  directory=await fs.mkdtemp(path.join(os.tmpdir(),"astranote-experience-data-"));artifacts=await fs.mkdtemp(path.join(os.tmpdir(),"astranote-experience-review-"));process.env.DATA_DIR=directory;
  for(const key of ["ASTRANOTE_SECRET","ASTRA_CONFIDENTIAL_KEY","ASTRANOTE_VAULT_SECRET"])process.env[key]=crypto.randomBytes(64).toString("base64url");
  process.env.ZSKEY="synthetic-mail-only";const native=global.fetch,mail=[];
  global.fetch=async(url,options)=>{
    if(String(url).startsWith("https://nexacaptcha.nxlabtw.com/api/siteverify"))return Response.json({success:true});
    if(String(url).startsWith("https://api.zeabur.com/api/v1/zsend/emails")){mail.push(JSON.parse(options.body));return Response.json({id:"synthetic-mail"});}
    if(!String(url).startsWith("http://127.0.0.1:"))throw new Error("External requests blocked");return native(url,options);
  };
  core=require("../server");await core.ensureData();server=require("../bootstrap").createOuterApp().listen(0,"127.0.0.1");await new Promise(resolve=>server.once("listening",resolve));const base=`http://127.0.0.1:${server.address().port}`;
  const password="Synthetic!9Only",hash=await argon2.hash(password),id=crypto.randomBytes(12).toString("hex");
  for(const username of ["experience_user","experience_otp"]){
    await fs.mkdir(path.join(directory,username,"notes"),{recursive:true});
    await core.testables.saveMetadata(username,{username,email:username+"@example.test",emailVerified:true,passwordHash:hash,cryptoFactor:crypto.randomBytes(48).toString("base64url"),createdAt:stamp(),settings:{language:"en",theme:"dark",historyCount:3},loginMethod:username.endsWith("otp")?"two_factor":"password",entitlements:{ultraMs:30*864e5,plusMs:0,proMs:0,updatedAt:stamp()},notes:username.endsWith("user")?[{id,path:`notes/${id}.json`}]:[]});
  }
  const note={id,name:"Synthetic history",encryption:"none",createdAt:"2026-10-01T00:00:00Z",updatedAt:"2026-10-02T00:00:00Z",revision:2,content:"Current text",history:[{kind:"delta",revision:2,updatedAt:"2026-10-01T00:00:00Z",data:require("../public/note-history").reverse({name:"Synthetic history",content:"Current text"},{name:"Synthetic history",content:"Previous text"})}]};
  const noteFile=path.join(directory,"experience_user","notes",id+".json");await fs.writeFile(noteFile,JSON.stringify(note));const original=await fs.readFile(noteFile,"utf8");
  browser=await chromium.launch({channel:"msedge",headless:true});const failures=[];let checks=0,navigation=0;
  async function context(){const context=await browser.newContext({timezoneId:"Asia/Taipei",serviceWorkers:"block"});await context.addInitScript(()=>{localStorage.setItem("astranote_cookie_notice","accepted");localStorage.setItem("astranote_language","en");});await context.route("https://**/*",route=>route.abort());await context.route(base+"/**",route=>route.continue({headers:{...route.request().headers(),"x-forwarded-for":`198.51.100.${++navigation%200+1}`}}));return context;}
  async function matrix(page,label,selector){
    await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
    for(const language of ["en","zh-Hant","ja"])for(const theme of ["dark","light"]){await page.evaluate(({language,theme})=>{state.language=language;state.theme=theme;applyLocale();document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));},{language,theme});
      assert.doesNotMatch(await page.evaluate(()=>t("agentWorking")),/Flex|Standard/);checks++;
      if(label==='history')assert.ok((await page.locator('#history-version option').first().textContent()).startsWith(await page.evaluate(()=>t('historyLatest'))));
      if(label==='email-code')assert.equal(await page.locator('#login-code-label').textContent(),await page.evaluate(()=>t('verificationCode')));
      for(const [width,height]of sizes){await page.setViewportSize({width,height});await page.waitForTimeout(45);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${label}/${language}/${theme}/${width}`);checks++;
        if([320,1440].includes(width))await page.locator(selector).screenshot({path:path.join(artifacts,`${label}-${language}-${theme}-${width}.png`),animations:"disabled"});
      }
    }
  }
  const first=await context(),page=await first.newPage();page.on("pageerror",e=>failures.push(e.message));await page.goto(base+"/login");await page.locator(".site-nav").waitFor();
  assert.equal(await page.locator('.auth-forgot').isVisible(),true);
  await page.locator('#username').fill('experience_user');await page.evaluate(()=>onCaptchaComplete({success:true,verificationId:'v'.repeat(16),responseToken:'r'.repeat(64)}));await page.locator('#auth-form button[type=submit]').click();await page.locator('#login-password-group').waitFor({state:'visible'});
  assert.equal(await page.locator('.captcha-box').isVisible(),false);assert.equal(await page.locator('.captcha-heading').isVisible(),false);assert.equal(await page.locator('#login-password-group .auth-forgot').count(),1);checks+=4;
  await matrix(page,"password",".form-card");
  await page.locator('#password').fill('WrongPassword');await page.locator('#auth-form button[type=submit]').click();await page.locator('.modal-backdrop').waitFor();assert.equal(await page.locator('.captcha-box').evaluate(element=>element.hidden),false);assert.equal(await page.locator('.captcha-heading').isVisible(),true);checks++;
  await page.locator('.modal-actions button').click();await page.evaluate(()=>onCaptchaComplete({success:true,verificationId:'v'.repeat(16),responseToken:'r'.repeat(64)}));await page.locator('#password').fill(password);await page.locator('#auth-form button[type=submit]').click();await page.waitForURL('**/dashboard');
  await page.goto(base+`/notes/${id}`);await page.locator('#previous-note').click();await page.locator('#history-version').waitFor({state:'visible'});assert.ok((await page.locator('#history-version').boundingBox()).height>=44);await matrix(page,"history","#previous-panel");
  const local=await page.evaluate(()=>formatUtc('2026-10-01T00:00:00Z'));assert.match(local,/0?8:00/);checks++;
  const second=await context(),otp=await second.newPage();otp.on("pageerror",e=>failures.push(e.message));await otp.goto(base+'/login');await otp.locator('#username').fill('experience_otp');await otp.evaluate(()=>onCaptchaComplete({success:true,verificationId:'v'.repeat(16),responseToken:'r'.repeat(64)}));await otp.locator('#auth-form button[type=submit]').click();await otp.locator('#password').fill(password);await otp.locator('#auth-form button[type=submit]').click();await otp.locator('.otp-inputs').waitFor();assert.equal(await otp.locator('[data-otp]').count(),6);assert.equal(await otp.locator('.captcha-box').count(),0);assert.equal(mail.length,1);checks+=3;
  await matrix(otp,"email-code",".form-card");
  assert.equal(await fs.readFile(noteFile,'utf8'),original,'UI review must not change a note');assert.deepEqual(failures,[]);
  console.log(JSON.stringify({success:true,checks,screenshots:artifacts}));
})().catch(error=>{console.error(error);console.error('Screenshots:',artifacts);process.exitCode=1;}).finally(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));core?.testables.closeOrderStore();if(directory){assert.equal(path.dirname(path.resolve(directory)),path.resolve(os.tmpdir()));await fs.rm(directory,{recursive:true,force:true});}});
