"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs/promises"), path = require("node:path"), os = require("node:os"), crypto = require("node:crypto"), sharp = require("sharp");
let directory, core, server, base, png;
const stamp = () => new Date().toISOString();
const sessions = new Map();
async function fixture(username, plan = "free", count = 0) {
  const folder = path.join(directory, username); await fs.mkdir(path.join(folder,"notes"),{recursive:true});
  const metadata = {username,email:username+"@example.test",emailVerified:true,passwordHash:"legacy-unchanged-hash",createdAt:stamp(),settings:{language:"en",theme:"dark"},entitlements:{plusMs:0,proMs:0,ultraMs:0,updatedAt:stamp()},notes:[]};
  if (["plus","pro","ultra"].includes(plan)) metadata.entitlements[plan+"Ms"] = 30*864e5;
  if (plan === "beta") metadata.beta = true;
  if (plan === "admin") metadata.email = "neuralnexuslab@hotmail.com";
  let remaining = count;
  while (remaining) {
    const id=crypto.randomBytes(12).toString("hex"), n=Math.min(3,remaining);
    const images=Array.from({length:n},()=>({id:"img_"+crypto.randomBytes(12).toString("hex"),type:"image/png",width:16,height:16,caption:"",data:png}));
    const note={id,name:"Synthetic title",encryption:"none",createdAt:stamp(),updatedAt:stamp(),content:require("../public/note-document").pack("private synthetic body",images),revision:1};
    await fs.writeFile(path.join(folder,"notes",id+".json"),JSON.stringify(note));
    metadata.notes.push({id,path:"notes/"+id+".json"});remaining-=n;
  }
  await fs.writeFile(path.join(folder,"metadata.json"),JSON.stringify(metadata));
  const token=crypto.randomBytes(32).toString("base64url"),csrf=crypto.randomBytes(16).toString("hex");
  await fs.writeFile(path.join(folder,"sessions.json"),JSON.stringify({[crypto.createHash("sha256").update(token).digest("hex")]:{username,csrf,createdAt:stamp(),lastSeenAt:stamp(),expiresAt:new Date(Date.now()+864e5).toISOString(),maxExpiresAt:new Date(Date.now()+28*864e5).toISOString()}}));
  const headers={cookie:`astranote_session=${username}.${token}`,"x-csrf-token":csrf,origin:base,"content-type":"application/json","x-forwarded-for":"127.0.1."+(sessions.size+1)};
  sessions.set(username,headers);return metadata;
}
async function request(username, route, method="GET", body) {
  const response=await fetch(base+route,{method,headers:sessions.get(username),body:body===undefined?undefined:JSON.stringify(body)});
  return {status:response.status,data:await response.json()};
}
test.before(async()=>{
  directory=await fs.mkdtemp(path.join(os.tmpdir(),"astranote-index-test-"));process.env.DATA_DIR=directory;
  for(const key of ["ASTRANOTE_SECRET","ASTRA_CONFIDENTIAL_KEY","ASTRANOTE_VAULT_SECRET"])process.env[key]=crypto.randomBytes(64).toString("base64url");
  png=(await sharp({create:{width:16,height:16,channels:3,background:"#717aff"}}).png().toBuffer()).toString("base64");
  core=require("../server");await core.ensureData();server=core.app.listen(0,"127.0.0.1");await new Promise(resolve=>server.once("listening",resolve));base=`http://127.0.0.1:${server.address().port}`;
});
test.after(async()=>{await new Promise(resolve=>server.close(resolve));core.testables.closeOrderStore();assert.equal(path.dirname(directory),os.tmpdir());await fs.rm(directory,{recursive:true,force:true});});
test("email index rebuilds from legacy accounts, verifies the account and follows registration/deletion updates",async()=>{
  await fixture("old_email");await core.testables.rebuildEmailDirectory();
  assert.equal((await core.testables.findAccountByEmail(" OLD_EMAIL@EXAMPLE.TEST ")).username,"old_email");
  const metadata=await core.testables.loadMetadata("old_email");metadata.email="new@example.test";await core.testables.saveMetadata("old_email",metadata);
  assert.equal(await core.testables.findAccountByEmail("old_email@example.test"),null);
  assert.equal((await core.testables.findAccountByEmail("new@example.test")).passwordHash,"legacy-unchanged-hash");
});
test("warm note lists never reload image/history payloads; corrupt indexes rebuild without changing originals",async()=>{
  const metadata=await fixture("old_notes","ultra",3), file=path.join(directory,"old_notes","notes",metadata.notes[0].id+".json");
  const original=await fs.readFile(file,"utf8");
  let result=await request("old_notes","/api/account");assert.equal(result.status,200);assert.equal(result.data.imageCount,3);assert.equal(result.data.notes[0].characters,20);
  const reads=core.testables.noteIndex.metrics.noteReads;
  result=await request("old_notes","/api/account");assert.equal(result.status,200);assert.equal(core.testables.noteIndex.metrics.noteReads,reads);
  const indexFile=path.join(directory,".indexes","notes","old_notes.json");const index=await fs.readFile(indexFile,"utf8");assert.ok(!index.includes("private synthetic body")&&!index.includes(png)&&!index.includes("Synthetic title"));
  await fs.writeFile(indexFile,"broken-json");core.testables.noteIndex.invalidate("old_notes");
  result=await request("old_notes","/api/account");assert.equal(result.data.imageCount,3);assert.equal(await fs.readFile(file,"utf8"),original);
});
test("every plan enforces total image counts and still permits removal after downgrade",async()=>{
  const D=require("../public/note-document"),one=D.pack("",[{id:"img_"+"b".repeat(24),type:"image/png",width:16,height:16,caption:"",data:png}]);
  for(const [plan,count]of [["free",15],["plus",50],["pro",150],["ultra",500]]){
    const username="quota_"+plan;await fixture(username,plan,count);
    const rejected=await request(username,"/api/notes","POST",{name:"Too many images",content:one,encryption:"none"});assert.equal(rejected.status,409,JSON.stringify(rejected));assert.equal(rejected.data.error,"image_quota_exceeded");
    assert.equal((await request(username,"/api/account")).data.imageCount,count);
  }
  const metadata=await core.testables.loadMetadata("quota_ultra");metadata.entitlements.ultraMs=0;await core.testables.saveMetadata("quota_ultra",metadata);
  // A smaller image allowance alone does not destroy or lock existing notes.
  const after=await request("quota_ultra","/api/account");assert.equal(after.data.imageCount,500);assert.equal(after.data.plan.maxImages,15);
  const smaller=await fixture("image_downgrade","plus",18);smaller.entitlements.plusMs=0;await core.testables.saveMetadata("image_downgrade",smaller);
  const before=await request("image_downgrade","/api/account");assert.equal(before.data.lockedNoteCount,0);
  const removed=await request("image_downgrade","/api/notes/"+smaller.notes[0].id,"PUT",{name:"Keep text",content:"Images removed"});assert.equal(removed.status,200);
  assert.equal((await request("image_downgrade","/api/account")).data.imageCount,15);
  for(const plan of ["beta","admin"]){const username="quota_"+plan;await fixture(username,plan);assert.equal((await request(username,"/api/account")).data.plan.maxImages,null);}
});
test("session activity writes are coalesced without bypassing immediate revocation",async()=>{
  await fixture("session_io");await request("session_io","/api/account");
  const file=path.join(directory,"session_io","sessions.json"),before=await fs.readFile(file,"utf8");
  await request("session_io","/api/account");await request("session_io","/api/account");assert.equal(await fs.readFile(file,"utf8"),before);
  await fs.unlink(file);assert.equal((await request("session_io","/api/account")).status,401);
});
test("discovering legacy encrypted images preserves original ciphertext, timestamps and storage size",async()=>{
  const metadata=await fixture("legacy_media","plus"),id=crypto.randomBytes(12).toString("hex");
  metadata.notes=[{id,path:`notes/${id}.json`}];await core.testables.saveMetadata("legacy_media",metadata);
  const note={id,name:core.testables.encryptNoteTitle("Legacy","legacy_media",id),encryption:"astra-secret-v1",payloadVersion:3,clientSalt:crypto.randomBytes(32).toString("base64url"),content:{iv:Buffer.alloc(12).toString("base64"),tag:Buffer.alloc(16).toString("base64"),ciphertext:Buffer.from("Legacy encrypted bytes").toString("base64")},revision:1,createdAt:stamp(),updatedAt:stamp()};
  const file=path.join(directory,"legacy_media","notes",id+".json"),original=JSON.stringify(note);await fs.writeFile(file,original);
  const before=(await request("legacy_media","/api/account")).data;
  assert.equal((await request("legacy_media",`/api/notes/${id}/media-summary`,"POST",{imageCount:3})).status,200);
  const after=(await request("legacy_media","/api/account")).data;assert.equal(after.imageCount,3);assert.equal(after.usedBytes,before.usedBytes);assert.equal(await fs.readFile(file,"utf8"),original);
  await request("legacy_media",`/api/notes/${id}/media-summary`,"POST",{imageCount:0});assert.equal((await request("legacy_media","/api/account")).data.imageCount,3);
  assert.equal((await request("old_notes",`/api/notes/${id}/media-summary`,"POST",{imageCount:3})).status,404);
});
test("daily activity survives journal replay and never counts a returning account twice",async()=>{
  const before=await (await fetch(base+"/api/stats")).json();
  await fixture("journal_replay");await request("journal_replay","/api/account");
  const during=await (await fetch(base+"/api/stats")).json();assert.equal(during.onlineToday,before.onlineToday+1);
  await core.testables.reloadOnlineUsers();
  await request("journal_replay","/api/account");
  const after=await (await fetch(base+"/api/stats")).json();assert.equal(after.onlineToday,during.onlineToday);
});
test("an Agent network wait releases the account lock and preserves concurrent settings",async()=>{
  const metadata=await fixture("agent_io","ultra");process.env.API_KEY="synthetic-not-real";
  let release, started;const waiting=new Promise(resolve=>{release=resolve;}),ready=new Promise(resolve=>{started=resolve;});
  const original=global.fetch;global.fetch=async(url,options)=>{
    if(String(url).startsWith("https://api.openai.com/")){started();await waiting;return Response.json({output_text:JSON.stringify({message:"Done",title:"New title",content:"Updated",imageEdits:[]}),usage:{input_tokens:10,output_tokens:10},service_tier:"flex"});}
    return original(url,options);
  };
  try{
    const pending=core.testables.runAccountAgent("agent_io",async()=>({title:"Title",content:"Body",prompt:"Improve"}));await ready;
    await Promise.race([request("agent_io","/api/account").then(result=>assert.equal(result.status,200)),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Account read blocked by Agent")),2000))]);
    const current=await core.testables.loadMetadata("agent_io");current.displayName="Concurrent setting";await core.testables.saveMetadata("agent_io",current);
    await assert.rejects(()=>core.testables.runAccountAgent("agent_io",async()=>({})),error=>error.code==="ai_busy");
    release();assert.equal((await pending).preview.title,"New title");assert.equal((await core.testables.loadMetadata("agent_io")).displayName,"Concurrent setting");
  }finally{release();global.fetch=original;}
});
