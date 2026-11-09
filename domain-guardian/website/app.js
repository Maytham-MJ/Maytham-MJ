import{analyze}from'./detector.js';
const form=document.getElementById('checker-form');
const input=document.getElementById('address-input');
const output=document.getElementById('check-result');
function check(){
  const result=analyze(input.value.trim());output.hidden=false;output.dataset.status=result.status;
  const label=document.createElement('span');label.className='result-label';
  label.textContent={warning:'LOOKALIKE SIGNAL DETECTED',matched:'PROTECTED DOMAIN MATCH',unknown:'UNKNOWN — NOT VERIFIED',unsupported:'ADDRESS COULD NOT BE CHECKED'}[result.status];
  const heading=document.createElement('h3');heading.textContent=result.host||'Enter a valid HTTP or HTTPS address.';
  const reason=document.createElement('p');reason.textContent=result.reason;
  output.replaceChildren(label,heading,reason);
  if(result.target){const target=document.createElement('p');target.textContent=`Protected domain: ${result.target}`;output.append(target);}
}
form.addEventListener('submit',e=>{e.preventDefault();check();});
document.querySelectorAll('[data-example]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.example;check();}));

