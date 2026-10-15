"use strict";
// Local-only responsive review. No production accounts, notes, mail or API keys.
const fs = require("node:fs/promises"), path = require("node:path"), os = require("node:os"), crypto = require("node:crypto"), assert = require("node:assert/strict");
const dependencies = "C:/Users/eaton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/";
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || dependencies + "playwright");
const sizes = [[1440,900],[1024,768],[768,1024],[430,932],[390,844],[360,740],[320,568],[844,390]];
let browser, server, core, data;
(async () => {
  data = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-product-review-data-"));
  const images = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-product-review-images-"));
  process.env.DATA_DIR = data;
  for (const key of ["ASTRANOTE_SECRET", "ASTRA_CONFIDENTIAL_KEY", "ASTRANOTE_VAULT_SECRET"]) process.env[key] = crypto.randomBytes(64).toString("base64url");
  core = require("../server"); await core.ensureData();
  server = require("../bootstrap").createOuterApp().listen(0, "127.0.0.1");
  await new Promise(r => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({channel:"msedge",headless:true});
  const page = await browser.newPage();
  await page.addInitScript(() => localStorage.setItem("astranote_cookie_notice", "accepted"));
  await page.route("https://**/*", route => route.abort());
  const errors = []; page.on("pageerror", error => errors.push(error.message));
  const routes = process.argv.includes("--polish") ? ["/docs/plans", "/limited-edit"] : ["/", "/docs", "/docs/getting-started", "/docs/notes", "/docs/encryption", "/docs/sharing", "/docs/astra-pass", "/docs/security", "/docs/astra-agent", "/docs/plans", "/docs/faq", "/limited-edit"];
  const screenshots = new Map();
  let checks = 0;
  for (const locale of ["en","zh-Hant","ja"]) for (const theme of ["dark","light"]) {
    for (const route of routes) {
      await page.setViewportSize({width:1440,height:900});
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.locator(".site-nav").waitFor();
      await page.evaluate(({locale,theme}) => {document.documentElement.style.scrollBehavior="auto";state.language=locale;state.theme=theme;applyLocale();}, {locale,theme});
      if (route.startsWith("/docs")) await page.locator(".docs-article h1").waitFor();
      assert.ok(!(await page.locator("body").innerText()).includes("Astra AI"), route);
      for (const [width,height] of sizes) {
        await page.setViewportSize({width,height});
        await page.waitForTimeout(45);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false, `${route} ${locale} ${theme} ${width}`);
        if (route.startsWith("/docs")) {
          const nav = page.locator(".docs-nav-details");
          assert.equal(await nav.evaluate(el=>el.open), width > 900);
          if (width === 320) {
            await nav.locator("summary").click();
            assert.equal(await nav.evaluate(el=>el.open),true);
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
            await nav.locator("summary").click();
          }
        }
        checks++;
        if (width === 320 || width === 1440) {
          if (route === "/") await page.locator("#astrapass").scrollIntoViewIfNeeded(); else await page.evaluate(()=>scrollTo(0,0));
          await page.waitForTimeout(120);
          const file = path.join(images, `${route.replaceAll("/","_") || "home"}-${locale}-${theme}-${width}.png`);
          await page.screenshot({path:file,animations:"disabled"});
          if(width===320) {const list=screenshots.get(route)||[];list.push(file);screenshots.set(route,list);}
        }
      }
    }
    // Rendering the form does not submit anything or use a real note.
    await page.goto(base + "/limited-edit");
    await page.locator(".site-nav").waitFor();
    await page.evaluate(({locale,theme})=>{state.language=locale;state.theme=theme;applyLocale();openLimitedEditor({id:"isolated-layout-note",encryption:"none"});},{locale,theme});
    for (const [width,height] of sizes) {
      await page.setViewportSize({width,height});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      const fields = await page.locator(".limited-password-row input").evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().width));
      assert.ok(Math.abs(fields[0]-fields[1]) < 1, "symmetric password fields");
      assert.equal(await page.locator(".limited-editor-form input[type=checkbox]").isChecked(),true);
      checks++;
      if(width===320 || width===1440){
        const file=path.join(images,`pass-modal-${locale}-${theme}-${width}.png`);await page.screenshot({path:file,animations:"disabled"});
        if(width===320){const list=screenshots.get("pass-modal")||[];list.push(file);screenshots.set("pass-modal",list);}
      }
    }
  }
  // Verify legacy documentation URL, canonical URL and next/previous sequence.
  await page.goto(base + "/docs/astra-ai"); await page.locator(".docs-article h1").waitFor();
  assert.match(await page.title(), /Astra Agent/u);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"),"https://astranote.nxlabtw.com/docs/astra-agent");
  await page.goto(base+"/docs"); await page.locator(".docs-next").waitFor();
  assert.equal(await page.locator(".docs-next a").last().getAttribute("href"),"/docs/getting-started");
  const sharp = require(process.env.SHARP_MODULE || dependencies + "sharp");
  for(const [route,files] of screenshots){
    await sharp({create:{width:960,height:1136,channels:3,background:"#777"}}).composite(await Promise.all(files.map(async(file,i)=>({input:await sharp(file).resize(320,568).png().toBuffer(),left:(i%3)*320,top:Math.floor(i/3)*568})))).png().toFile(path.join(images,`sheet-${route.replaceAll("/","_")||"home"}.png`));
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({success:true,checks,screenshots:images}));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{
  await browser?.close(); if(server) await new Promise(r=>server.close(r));core?.testables.closeOrderStore();
  if(data){assert.ok(path.resolve(data).startsWith(path.resolve(os.tmpdir())+path.sep+"astranote-product-review-data-"));await fs.rm(data,{recursive:true,force:true});}
});
