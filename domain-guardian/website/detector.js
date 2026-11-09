export const DEFAULT_DOMAINS=['google.com','github.com','microsoft.com','apple.com','amazon.com','paypal.com','facebook.com','instagram.com','linkedin.com','netflix.com','outlook.com','yahoo.com','wikipedia.org','dropbox.com','chase.com'];
export function hostname(input){
  const url=new URL(input.includes('://')?input:`https://${input}`);
  if(!['http:','https:'].includes(url.protocol))throw Error('Use an HTTP or HTTPS address.');
  return url.hostname.toLowerCase().replace(/\.$/,'');
}
export function validateDomain(input){
  const raw=input.trim();
  if(!raw||/[\s/:@?#]/.test(raw))throw Error('Enter only a domain, such as example.com.');
  const host=hostname(raw);
  if(host.length>253||!host.includes('.')||!host.split('.').every(x=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(x)))throw Error('Invalid domain.');
  return host;
}
export function distance(a,b){
  const d=Array.from({length:a.length+1},(_,i)=>Array.from({length:b.length+1},(_,j)=>i?(j?0:i):j));
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
    d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+Number(a[i-1]!==b[j-1]));
    if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);
  }
  return d[a.length][b.length];
}
const skeleton=x=>x.replace(/rn/g,'m').replace(/0/g,'o').replace(/1/g,'l');
export function analyze(input,domains=DEFAULT_DOMAINS){
  let host;try{host=hostname(input);}catch{return{status:'unsupported',host:'',reason:'This address cannot be checked.'};}
  domains=[...new Set(domains.map(validateDomain))];
  const exact=domains.find(d=>host===d||host.endsWith(`.${d}`));
  if(exact)return{status:'matched',host,target:exact,reason:'Matches a protected domain or subdomain. Page content is not verified.'};
  const labels=host.split('.');
  for(const target of domains){
    const candidate=labels.slice(-target.split('.').length).join('.');
    const brand=target.split('.')[0];let reason;
    if(host.includes(`${target}.`))reason='A protected domain is embedded inside another domain.';
    else if(skeleton(candidate)===skeleton(target))reason='Characters visually resemble a protected domain.';
    else if(distance(candidate,target)<=1)reason='One edit or adjacent letter swap from a protected domain.';
    else if(labels.slice(0,-1).some(x=>x===brand||x.startsWith(`${brand}-`)||x.endsWith(`-${brand}`)))reason='A protected brand appears on an unrecognized domain.';
    if(reason)return{status:'warning',host,target,reason};
  }
  if(labels.some(x=>x.startsWith('xn--')))return{status:'warning',host,reason:'Internationalized domain (Punycode). It may be legitimate; inspect it carefully.'};
  return{status:'unknown',host,reason:'No protected match or lookalike found. Safety is unknown.'};
}
