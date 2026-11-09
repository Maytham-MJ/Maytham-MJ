import{analyze,DEFAULT_DOMAINS}from'./detector.js';
chrome.webNavigation.onCommitted.addListener(async({tabId,frameId,url})=>{
  if(frameId!==0||!/^https?:/.test(url))return;
  try{
    const{customDomains=[]}=await chrome.storage.local.get('customDomains');
    const result=analyze(url,[...DEFAULT_DOMAINS,...customDomains]);
    const tab=await chrome.tabs.get(tabId);
    if(tab.url!==url)return; // Discard stale checks after another navigation.
    await chrome.action.setBadgeText({tabId,text:result.status==='warning'?'!':result.status==='matched'?'OK':'?'});
    await chrome.action.setBadgeBackgroundColor({tabId,color:result.status==='warning'?'#ba4838':'#355b76'});
    if(result.status==='warning'){
      const destination=new URL(chrome.runtime.getURL('warning.html'));
      destination.searchParams.set('host',result.host); // Never retain paths, tokens, or credentials.
      await chrome.tabs.update(tabId,{url:destination.href});
    }
  }catch(error){console.warn('Domain Guardian check failed:',error.message);}
});
