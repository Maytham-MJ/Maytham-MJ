import{test}from'node:test';
import assert from'node:assert/strict';
let listener,currentUrl,updates=[],badges=[];
globalThis.chrome={
  webNavigation:{onCommitted:{addListener:fn=>listener=fn}},
  storage:{local:{get:async()=>({customDomains:[]})}},
  tabs:{get:async()=>({url:currentUrl}),update:async(id,value)=>updates.push({id,...value})},
  action:{setBadgeText:async value=>badges.push(value),setBadgeBackgroundColor:async()=>{}},
  runtime:{getURL:path=>`chrome-extension://test/${path}`}
};
await import('../extension/background.js');
test('navigation flow: warnings, privacy, frame filtering and stale results',async()=>{
  currentUrl='https://githbu.com/private?token=secret';
  await listener({tabId:1,frameId:0,url:currentUrl});
  assert.equal(updates.length,1);
  assert.equal(new URL(updates[0].url).searchParams.get('host'),'githbu.com');
  assert.ok(!updates[0].url.includes('secret'));
  assert.equal(badges.at(-1).text,'!');
  updates=[];
  await listener({tabId:1,frameId:3,url:currentUrl});assert.equal(updates.length,0);
  await listener({tabId:1,frameId:0,url:'https://g00gle.com'});assert.equal(updates.length,0);
  currentUrl='https://github.com';
  await listener({tabId:1,frameId:0,url:currentUrl});assert.equal(updates.length,0);assert.equal(badges.at(-1).text,'OK');
  currentUrl='https://unrelated.test';
  await listener({tabId:1,frameId:0,url:currentUrl});assert.equal(badges.at(-1).text,'?');
});
