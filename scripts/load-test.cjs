"use strict";
// Local synthetic workload only. Never contacts production, mail or AI services.
const fs=require("node:fs/promises"),path=require("node:path"),os=require("node:os"),crypto=require("node:crypto"),assert=require("node:assert/strict"),sharp=require("sharp"),argon2=require("argon2");
const {performance,monitorEventLoopDelay}=require("node:perf_hooks");
const option=(name,fallback)=>Number(process.argv.find(arg=>arg.startsWith(`--${name}=`))?.split("=")[1]||fallback);
const accounts=option("accounts",1000),operations=option("requests",200),concurrency=option("concurrency",8);
assert.ok(Number.isInteger(accounts)&&accounts>=10&&accounts<=70000);assert.ok(Number.isInteger(operations)&&operations>=10&&operations<=20000);assert.ok(Number.isInteger(concurrency)&&concurrency>=1&&concurrency<=32);
let directory,server,core;const realFetch=global.fetch,realLog=console.log;
const stamp=()=>new Date().toISOString();
async function pool(items,limit,task){let next=0;await Promise.all(Array.from({length:limit},async()=>{while(next<items.length){const i=next++;await task(items[i],i);}}));}
(async()=>{
  directory=await fs.mkdtemp(path.join(os.tmpdir(),"astranote-load-data-"));process.env.DATA_DIR=directory;
  for(const key of ["ASTRANOTE_SECRET","ASTRA_CONFIDENTIAL_KEY","ASTRANOTE_VAULT_SECRET"])process.env[key]=crypto.randomBytes(64).toString("base64url");
  delete process.env.API_KEY;delete process.env.ZSKEY;
  global.fetch=async(url,options)=>String(url).startsWith("https://nexacaptcha.nxlabtw.com/api/siteverify")?Response.json({success:true}):String(url).startsWith("http://127.0.0.1:")?realFetch(url,options):Promise.reject(new Error("External requests blocked"));
  console.log=()=>{};
  const D=require("../public/note-document"),history=require("../public/note-history");
  const png=(await sharp({create:{width:64,height:64,channels:3,background:"#737aff"}}).png().toBuffer()).toString("base64");
  const password="Synthetic!9Only",passwordHash=await argon2.hash(password,{type:argon2.argon2id,memoryCost:19456,timeCost:2,parallelism:1});
  const users=Array.from({length:accounts},(_,i)=>({username:"load_"+i,email:`load_${i}@example.test`,ids:[]}));
  const seedStart=performance.now();
  await pool(users,16,async(user,i)=>{
    const folder=path.join(directory,user.username);await fs.mkdir(path.join(folder,"notes"),{recursive:true});
    const metadata={username:user.username,email:user.email,emailVerified:true,passwordHash,cryptoFactor:crypto.randomBytes(48).toString("base64url"),createdAt:stamp(),settings:{language:"en",theme:"dark"},entitlements:{ultraMs:30*864e5,proMs:0,plusMs:0,updatedAt:stamp()},notes:[]};
    const text="Synthetic reference text. ".repeat(100);
    for(let j=0;j<6;j++){
      const id=crypto.randomBytes(12).toString("hex"),image={id:"img_"+crypto.randomBytes(12).toString("hex"),type:"image/png",data:png,caption:"Synthetic image",width:64,height:64};user.ids.push(id);
      const note={id,name:"Synthetic note "+j,encryption:"none",createdAt:stamp(),updatedAt:stamp(),revision:1,content:D.pack(text,[image]),history:[{kind:"delta",revision:1,updatedAt:stamp(),data:history.reverse({name:"Synthetic note "+j,content:text},{name:"Synthetic note "+j,content:text+"Previous."})}]};
      metadata.notes.push({id,path:`notes/${id}.json`});await fs.writeFile(path.join(folder,"notes",id+".json"),JSON.stringify(note));
    }
    await fs.writeFile(path.join(folder,"metadata.json"),JSON.stringify(metadata));
    user.token=crypto.randomBytes(32).toString("base64url");user.csrf=crypto.randomBytes(16).toString("hex");
    await fs.writeFile(path.join(folder,"sessions.json"),JSON.stringify({[crypto.createHash("sha256").update(user.token).digest("hex")]:{username:user.username,csrf:user.csrf,createdAt:stamp(),lastSeenAt:stamp(),expiresAt:new Date(Date.now()+864e5).toISOString(),maxExpiresAt:new Date(Date.now()+28*864e5).toISOString()}}));
  });
  core=require("../server");const startup=performance.now();await core.ensureData();const startupMs=performance.now()-startup;
  server=core.app.listen(0,"127.0.0.1");await new Promise(resolve=>server.once("listening",resolve));const base=`http://127.0.0.1:${server.address().port}`;
  let serial=0;
  async function request(user,route,method="GET",body){const n=++serial;const response=await realFetch(base+route,{method,headers:{cookie:`astranote_session=${user.username}.${user.token}`,"x-csrf-token":user.csrf,origin:base,"content-type":"application/json","x-forwarded-for":`198.18.${Math.floor(n/200)%200}.${n%200+1}`},body:body===undefined?undefined:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw new Error(`${response.status} ${data.error}`);return data;}
  const loop=monitorEventLoopDelay({resolution:20});loop.enable();let peakRss=process.memoryUsage().rss;const meter=setInterval(()=>{peakRss=Math.max(peakRss,process.memoryUsage().rss);},25);meter.unref();
  const results=[];
  async function measure(name,count,task){const times=[],errors=[];const start=performance.now(),cpu=process.cpuUsage();await pool(Array.from({length:count},(_,i)=>i),concurrency,async i=>{const time=performance.now();try{await task(i);}catch(error){errors.push(error.message);}times.push(performance.now()-time);});const elapsed=performance.now()-start,usage=process.cpuUsage(cpu);times.sort((a,b)=>a-b);const percentile=p=>Number(times[Math.min(times.length-1,Math.floor(times.length*p))].toFixed(2));results.push({name,requests:count,concurrency,p50ms:percentile(.5),p95ms:percentile(.95),p99ms:percentile(.99),requestsPerSecond:Number((count/elapsed*1000).toFixed(2)),cpuCorePercent:Number(((usage.user+usage.system)/1000/elapsed*100).toFixed(2)),errors:errors.length,errorRate:errors.length/count,errorSamples:[...new Set(errors)].slice(0,5)});}
  const active=users.slice(0,Math.min(accounts,Math.max(operations,concurrency)));
  await measure("email-password-login",Math.min(operations,accounts),i=>request(users[i],"/api/login","POST",{username:users[i].email,password,captcha:{verificationId:crypto.randomBytes(12).toString("base64url"),responseToken:crypto.randomBytes(48).toString("base64url")}}));
  await measure("note-list-cold",operations,i=>request(active[i%active.length],"/api/account"));
  const reads=core.testables.noteIndex.metrics.noteReads;
  await measure("note-list-warm",operations,i=>request(active[i%Math.min(active.length,32)],"/api/account"));
  const warmReads=core.testables.noteIndex.metrics.noteReads-reads;
  await measure("text-save",operations,i=>{const user=active[i%active.length];return request(user,"/api/notes/"+user.ids[0],"PUT",{name:"Updated synthetic",content:"Synthetic saved text "+i});});
  const image={id:"img_"+"c".repeat(24),type:"image/png",data:png,caption:"",width:64,height:64};
  await measure("image-save",operations,i=>{const user=active[i%active.length];return request(user,"/api/notes/"+user.ids[1],"PUT",{name:"Synthetic image",content:D.pack("Image test",[image])});});
  clearInterval(meter);loop.disable();
  const report={syntheticOnly:true,accounts,notes:accounts*6,seedMs:Math.round(startup-seedStart),indexAndMigrationStartupMs:Math.round(startupMs),host:{platform:process.platform,node:process.version,cpu:os.cpus()[0]?.model,logicalCpus:os.availableParallelism(),totalRamMiB:Math.round(os.totalmem()/1024/1024)},results,warmListFullNoteReads:warmReads,peakProcessRssMiB:Number((peakRss/1024/1024).toFixed(2)),eventLoopP95ms:Number((loop.percentile(95)/1e6).toFixed(2)),metrics:core.testables.noteIndex.metrics,limitations:"Local client and server share one process. CPU/RSS include the load driver. CAPTCHA uses an isolated successful siteverify stub; no real email, AI or production traffic. This is not a guarantee of production concurrency capacity."};
  const output=await fs.mkdtemp(path.join(os.tmpdir(),"astranote-load-report-"));await fs.writeFile(path.join(output,"report.json"),JSON.stringify(report,null,2));
  process.stdout.write(JSON.stringify({...report,report:path.join(output,"report.json")},null,2)+"\n");assert.equal(results.reduce((n,r)=>n+r.errors,0),0,"Load test errors must be investigated");
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{console.log=realLog;global.fetch=realFetch;if(server)await new Promise(resolve=>server.close(resolve));core?.testables.closeOrderStore();if(directory){assert.equal(path.dirname(path.resolve(directory)),path.resolve(os.tmpdir()));assert.ok(path.basename(directory).startsWith("astranote-load-data-"));await fs.rm(directory,{recursive:true,force:true});}});
