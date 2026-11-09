import{analyze,DEFAULT_DOMAINS,validateDomain}from'./detector.js';
const $=id=>document.getElementById(id);
let customDomains=[];
function render(result){
  $('result').dataset.status=result.status;
  $('status').textContent={warning:'Check this address',matched:'Protected domain matched',unknown:'Unrecognized domain',unsupported:'Cannot check address'}[result.status];
  $('host').textContent=result.host;$('reason').textContent=result.reason;
  $('official').hidden=!result.target;
  if(result.target){$('official').href=`https://${result.target}/`;$('official').textContent=`Open ${result.target}`;}
}
function list(){
  $('domains').replaceChildren();
  for(const domain of customDomains){
    const li=document.createElement('li');li.textContent=domain+' ';
    const button=document.createElement('button');button.textContent='Remove';button.type='button';
    button.addEventListener('click',async()=>{customDomains=customDomains.filter(x=>x!==domain);await chrome.storage.local.set({customDomains});list();});
    li.append(button);$('domains').append(li);
  }
}
async function start(){
  ({customDomains=[]}=await chrome.storage.local.get('customDomains'));
  if(location.pathname.endsWith('warning.html')){
    render(analyze(new URL(location.href).searchParams.get('host')||'',[...DEFAULT_DOMAINS,...customDomains]));
    $('close').addEventListener('click',async()=>{const tab=await chrome.tabs.getCurrent();if(tab)await chrome.tabs.remove(tab.id);});
  }else{
    const[tab]=await chrome.tabs.query({active:true,currentWindow:true});
    render(analyze(tab?.url||'',[...DEFAULT_DOMAINS,...customDomains]));
    $('check').addEventListener('submit',e=>{e.preventDefault();render(analyze($('address').value,[...DEFAULT_DOMAINS,...customDomains]));});
    $('add').addEventListener('submit',async e=>{
      e.preventDefault();try{
        const domain=validateDomain($('domain').value);customDomains=[...new Set([...customDomains,domain])];
        await chrome.storage.local.set({customDomains});$('domain').value='';$('message').textContent='Domain added.';list();
      }catch(error){$('message').textContent=error.message;}
    });list();
  }
}
start().catch(()=>{$('reason').textContent='Settings could not be loaded. Reload the extension and try again.';});
