"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), sharp = require("sharp");
const D = require("../public/note-document"), H = require("../public/note-history"), Images = require("../lib/note-images"), AgentImages = require("../lib/agent-images"), Education = require("../lib/education");
async function image() { return { id: "img_" + "a".repeat(24), type: "image/png", width: 32, height: 32, caption: "QA image <script>", data: (await sharp({ create: { width: 32, height: 32, channels: 3, background: "#7274ff" } }).png().toBuffer()).toString("base64") }; }
test("images have bounded, unique note-local IDs and a canonical raster representation", async () => {
  const source = await image();
  const result = D.unpack(await Images.validate(D.pack("body",[source])));
  assert.equal(result.text,"body"); assert.equal(result.images[0].type,"image/webp"); assert.equal(result.images[0].caption,source.caption);
  assert.equal((await sharp(Buffer.from(result.images[0].data,"base64")).metadata()).width,32);
  assert.throws(()=>D.pack("",[source,source]));
  assert.throws(()=>D.pack("",[{...source,id:"../../other"}]));
  assert.throws(()=>D.pack("",[{...source,width:100000}]));
  assert.throws(()=>D.pack("",[{...source,caption:"x".repeat(401)}]));
});
test("spoofed image MIME, SVG, HTML, corrupt pixels, dimension lies and excessive counts fail closed", async () => {
  const source = await image();
  for(const bad of [{...source,data:Buffer.from('<svg onload="alert(1)"></svg>').toString('base64')},{...source,data:Buffer.from('<html>evil</html>').toString('base64')},{...source,type:"image/svg+xml"},{...source,width:64},{...source,data:source.data.slice(0,40)}])
    await assert.rejects(async()=>Images.validate(D.pack("",[bad])),/image|document/i);
  assert.throws(()=>D.pack("",Array.from({length:4},(_,i)=>({...source,id:"img_"+String(i).repeat(24)}))));
});
test("every media history revision retains its own full images while text stays a reverse delta", async () => {
  const first = await image(), second = {...first,caption:"Revised",data:(await sharp({create:{width:32,height:32,channels:3,background:"#ff5577"}}).png().toBuffer()).toString("base64")};
  const a = {name:"Note",content:D.pack("one\nkeep\nthree",[first])}, b={name:"Note 2",content:D.pack("two\nkeep\nthree",[second])}, c={name:"Text only",content:"third"};
  const ab=H.reverse(b,a), bc=H.reverse(c,b);
  assert.equal(ab.v,2); assert.deepEqual(ab.images,[first]);
  assert.deepEqual(H.restore(H.restore(c,bc),ab),a);
  assert.ok(JSON.stringify(ab.content).length<100);
  assert.deepEqual(H.restore(b,ab),a);
  assert.deepEqual(H.restore({name:"Legacy",content:"after"},H.reverse({name:"Legacy",content:"after"},{name:"Old",content:"before"})),{name:"Old",content:"before"});
});
test("Agent image edits accept only bounded declarative operations for supplied images", async () => {
  const source=await image(), op={type:"text",id:source.id,x:.1,y:.2,w:.2,h:.2,value:4,text:"Caption",color:"#123abc"};
  assert.deepEqual(AgentImages.validate([op],[source]),[op]);
  for(const bad of [{...op,type:"eval"},{...op,id:"img_"+"b".repeat(24)},{...op,color:"url(javascript:evil)"},{...op,x:2},{...op,text:"x".repeat(201)},{...op,type:"crop",x:.9,w:.8}]) assert.throws(()=>AgentImages.validate([bad],[source]));
});
test("Education requires actual verified institution suffixes, not lookalikes or arbitrary country codes", () => {
  for(const email of ["student@school.edu","student@school.edu.tw","student@dept.school.edu.tw","student@school.edu.au","STUDENT@SCHOOL.EDU.HK"])
    assert.equal(Education.eligible({email,emailVerified:true}),true,email);
  for(const email of ["student@school.edu.tw.evil.com","student@evil-edu.tw","student@edu.tw","student@school.edu.us","student@school.edu.zz","student@school.edu.id","student@school.edu@evil.com","student@school.edu.tw."])
    assert.equal(Education.eligible({email,emailVerified:true}),false,email);
  assert.equal(Education.eligible({email:"student@school.edu.tw",emailVerified:false}),false);
});
test("client dimension checks reject animated containers and mismatched WebP canvas/bitstream sizes before decoding", async () => {
  const fs=require("node:fs"),vm=require("node:vm"),window={AstraDocument:D,addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(require.resolve("../public/note-media.js"),"utf8"),{window,Uint8Array,DataView,Object});
  const dimensions=window.AstraMedia.dimensions;
  const webp=await sharp({create:{width:32,height:24,channels:3,background:"white"}}).webp().toBuffer();
  assert.deepEqual([...dimensions(webp,"image/webp")],[32,24]);
  const header=Buffer.alloc(18);header.write("VP8X");header.writeUInt32LE(10,4);header[8]=0; // canvas 1×1, bitstream 32×24
  const forged=Buffer.concat([webp.subarray(0,12),header,webp.subarray(12)]);forged.writeUInt32LE(forged.length-8,4);
  assert.throws(()=>dimensions(forged,"image/webp"),/invalid_image/);
  header[8]=2;const animated=Buffer.concat([webp.subarray(0,12),header,webp.subarray(12)]);animated.writeUInt32LE(animated.length-8,4);
  assert.throws(()=>dimensions(animated,"image/webp"),/invalid_image/);
  assert.throws(()=>dimensions(Buffer.from('<svg onload="evil"/>'),"image/png"),/invalid_image/);
});

test("image controls expose three compression presets without internal targets or a quality slider", () => {
  const fs=require("node:fs"),vm=require("node:vm"),window={AstraDocument:D,addEventListener(){}};
  const source=fs.readFileSync(require.resolve("../public/note-media.js"),"utf8");
  vm.runInNewContext(source,{window,Uint8Array,DataView,Object});
  for(const locale of ["en","zh-Hant","ja"]){
    const copy=window.AstraMedia.copy[locale];
    assert.ok(copy.smallImage&&copy.balancedImage&&copy.clearImage);
    assert.doesNotMatch(Object.values(copy).join(" "),/5\s?KB/);
    assert.ok(copy.writeNote&&copy.placeText&&copy.textRequired);
  }
  assert.doesNotMatch(source,/quality\.type\s*=\s*"range"/);
  assert.match(source,/event\.stopPropagation\(\); if \(event\.isComposing\) return/);
});
