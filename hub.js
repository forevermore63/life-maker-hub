const $ = (s, el=document) => el.querySelector(s);
const money = n => new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(n);
const SHOP = 'https://life-maker-cash-now.vercel.app';

const APPS = [
  {id:'inkledger',name:'InkLedger',color:'#7dd3c0',tag:'SaaS',pitch:'Invoices that get paid',price:99,action:'Create invoice'},
  {id:'clipforge',name:'ClipForge',color:'#a78bfa',tag:'Creator',pitch:'Hooks for short-form',price:49,action:'Generate hooks'},
  {id:'nestyield',name:'NestYield',color:'#fbbf24',tag:'Commerce',pitch:'Digital storefront kit',price:79,action:'Open store'},
  {id:'linkgrove',name:'LinkGrove',color:'#34d399',tag:'Links',pitch:'Bio link that sells',price:29,action:'Add link'},
  {id:'formafit',name:'FormaFit',color:'#fb7185',tag:'Forms',pitch:'Lead forms that convert',price:39,action:'Add field'},
  {id:'pulseseo',name:'PulseSEO',color:'#60a5fa',tag:'SEO',pitch:'Keyword gaps to content',price:59,action:'Research'},
  {id:'coursenest',name:'CourseNest',color:'#c084fc',tag:'Course',pitch:'Mini-course shipping',price:89,action:'Add module'},
  {id:'printmint',name:'PrintMint',color:'#f472b6',tag:'Merch',pitch:'Print-on-demand designs',price:35,action:'Design'},
  {id:'resumelift',name:'ResumeLift',color:'#2dd4bf',tag:'Career',pitch:'ATS-ready resumes',price:19,action:'Polish resume'},
  {id:'rentradar',name:'RentRadar',color:'#f59e0b',tag:'Property',pitch:'Yield calculator',price:45,action:'Score deal'},
];

const PRODUCTS = [
  {id:'life-maker-starter-bundle',name:'Starter Bundle',price:79,hot:1,desc:'Therapy + landing + founder OS'},
  {id:'sausage-therapy-starter',name:'Sausage Therapy Starter',price:39,desc:'Session structure + templates'},
  {id:'calm-landing-kit',name:'Calm Landing Kit',price:29,desc:'Honest wellness landing'},
  {id:'founder-notion-os',name:'Founder Notion OS',price:49,desc:'Cash + offers OS'},
  {id:'resumelift-ats',name:'ResumeLift ATS',price:19,desc:'ATS resume guide'},
  {id:'clipforge-hooks',name:'ClipForge Hooks',price:49,desc:'Short-form hook pack'},
  {id:'inkledger-pro',name:'InkLedger Pro',price:99,desc:'Invoice system pack'},
];

const TABS = [
  {id:'home',label:'Home'},
  {id:'apps',label:'10 Apps'},
  {id:'shop',label:'Shop'},
  {id:'daily',label:'Daily'},
  {id:'profit',label:'Profit'},
  {id:'pay',label:'PayID'},
];

const state = load();

function load(){
  try{return Object.assign(defaults(), JSON.parse(localStorage.getItem('lm-hub-v1')||'{}'));}
  catch{return defaults();}
}
function defaults(){
  return {
    payId:'', payName:'Emily Blue Richards', bsb:'', acc:'', accName:'Emily Blue Richards',
    email:'emilybluerichards@gmail.com', phone:'0499938590', stripe:'',
    sales:[], outreach:0, tasks:[
      {id:'t1',t:'Send 10 pitches',done:false,m:25},
      {id:'t2',t:'Fill PayID',done:false,m:2},
      {id:'t3',t:'Share shop link',done:false,m:5},
      {id:'t4',t:'Deliver paid packs',done:false,m:10},
      {id:'t5',t:'Boost best offer',done:false,m:5},
    ],
    appBoost: Object.fromEntries(APPS.map(a=>[a.id,0])),
    simMrr: 1240,
  };
}
function save(){ localStorage.setItem('lm-hub-v1', JSON.stringify(state)); }

function route(){ return (location.hash.replace('#','')||'home').split('/')[0]; }
function go(id){ location.hash = '#'+id; }

function paidTotal(){ return state.sales.filter(s=>s.status==='paid').reduce((a,s)=>a+s.amount,0); }

function paintTabs(){
  const r = route();
  $('#tabs').innerHTML = TABS.map(t=>`<button class="tab ${t.id===r?'on':''}" data-tab="${t.id}">${t.label}</button>`).join('');
  $('#tabs').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>go(b.dataset.tab));
}

function viewHome(){
  const paid = paidTotal();
  return `<div class="stack">
  <div class="row"><span class="badge ok">Live hub</span><span class="badge hot">10 apps deployed</span></div>
  <h1>Endless money pool — ship, sell, withdraw</h1>
  <p class="m">All ten Life Maker apps + shop + daily engine in one public hub. Real cash via PayID / bank / Stripe.</p>
  <div class="grid g4">
    <div class="card"><div class="s">Real sales</div><div class="price">${money(paid)}</div></div>
    <div class="card"><div class="s">Outreach</div><div class="price">${state.outreach}/10</div></div>
    <div class="card"><div class="s">Model MRR</div><div class="price">${money(state.simMrr)}</div></div>
    <div class="card"><div class="s">Tasks done</div><div class="price">${state.tasks.filter(t=>t.done).length}/${state.tasks.length}</div></div>
  </div>
  <div class="row">
    <button class="btn ba" onclick="go('shop')">Open shop</button>
    <button class="btn" onclick="go('daily')">Daily engine</button>
    <a class="btn bg" href="${SHOP}" target="_blank" rel="noreferrer">Cash-now storefront</a>
  </div>
  <div class="card stack">
    <strong>Pitch (copy)</strong>
    <div class="s" id="pitch">${pitch()}</div>
    <div class="row">
      <button class="btn ba" id="copyPitch">Copy pitch</button>
      <button class="btn" id="sentOne">I sent one</button>
    </div>
  </div>
  </div>`;
}

function pitch(){
  const pay = state.payId ? ` PayID ${state.payId}.` : '';
  return `Hey — calm digital pack (Sausage Therapy Starter). $39 AUD same-day file.${pay} Shop: ${SHOP}`;
}

function viewApps(){
  return `<div class="stack"><h1>10 Masterpieces</h1>
  <p class="m">Each app is a sellable product surface. Boost allocation increases model MRR weight.</p>
  <div class="grid g2">${APPS.map(a=>`
    <div class="card stack">
      <div class="row"><span class="dot" style="background:${a.color}"></span><strong>${a.name}</strong><span class="badge">${a.tag}</span></div>
      <div class="m">${a.pitch}</div>
      <div class="row"><span class="price">${money(a.price)}</span>
        <button class="btn ba" data-sell="${a.id}">Sell pack</button>
        <button class="btn" data-boost="${a.id}">Boost +</button>
      </div>
      <div class="s">Boost ${state.appBoost[a.id]||0} · ${a.action}</div>
    </div>`).join('')}</div></div>`;
}

function viewShop(){
  return `<div class="stack"><h1>Passive Shop</h1>
  <p class="m">Buyers pay → you deliver → mark paid. No fake balances.</p>
  <div class="grid g2">${PRODUCTS.map(p=>`
    <div class="card stack">
      ${p.hot?'<span class="badge hot">Best value</span>':''}
      <strong>${p.name}</strong>
      <div class="m">${p.desc}</div>
      <div class="price">${money(p.price)}</div>
      <div class="row">
        <button class="btn ba" data-order="${p.id}">Order / PayID</button>
        <button class="btn" data-mark="${p.id}">Mark paid</button>
      </div>
    </div>`).join('')}</div></div>`;
}

function viewDaily(){
  const done = state.tasks.filter(t=>t.done).length;
  const pct = Math.round(done/state.tasks.length*100);
  return `<div class="stack"><h1>Daily engine</h1>
  <p class="m">Productivity board for cash week. Tick → progress.</p>
  <div class="card stack">
    <div class="row" style="justify-content:space-between"><span>${done}/${state.tasks.length} done</span><span class="mono">${pct}%</span></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
  </div>
  <div class="stack">${state.tasks.map(t=>`
    <button class="btn" style="justify-content:flex-start;text-align:left;${t.done?'opacity:.7':''}" data-task="${t.id}">
      ${t.done?'✓':'○'} ${t.t} · ${t.m}m
    </button>`).join('')}</div>
  <div class="row">
    <button class="btn ba" id="profitPush">One-tap profit push</button>
    <button class="btn" id="resetTasks">Reset day</button>
  </div>
  </div>`;
}

function viewProfit(){
  const paid = paidTotal();
  const pending = state.sales.filter(s=>s.status==='pending');
  return `<div class="stack"><h1>Profit & withdraw</h1>
  <div class="grid g2">
    <div class="card"><div class="s">Available (ledger)</div><div class="price">${money(paid)}</div><div class="s">PayID/bank land in your bank — that is withdraw</div></div>
    <div class="card"><div class="s">Pending orders</div><div class="price">${pending.length}</div></div>
  </div>
  <div class="card stack">
    <strong>Sales</strong>
    ${state.sales.length? state.sales.slice(0,20).map(s=>`<div class="row" style="justify-content:space-between;border-top:1px solid var(--b);padding:.45rem 0">
      <span>${s.name} · <span class="s">${s.status}</span></span>
      <span class="mono">${money(s.amount)}</span>
    </div>`).join('') : '<div class="s">No sales yet — open Shop and take a PayID order.</div>'}
  </div>
  <button class="btn ba" onclick="go('shop')">Take an order</button>
  </div>`;
}

function viewPay(){
  return `<div class="stack"><h1>Money rails</h1>
  <div class="card stack">
    <label>PayID</label><input id="payId" value="${esc(state.payId)}" placeholder="email or 04…"/>
    <label>PayID name</label><input id="payName" value="${esc(state.payName)}"/>
    <label>BSB</label><input id="bsb" value="${esc(state.bsb)}"/>
    <label>Account</label><input id="acc" value="${esc(state.acc)}"/>
    <label>Account name</label><input id="accName" value="${esc(state.accName)}"/>
    <label>Email</label><input id="email" value="${esc(state.email)}"/>
    <label>Phone</label><input id="phone" value="${esc(state.phone)}"/>
    <label>Stripe Payment Link</label><input id="stripe" value="${esc(state.stripe)}" placeholder="https://buy.stripe.com/…"/>
    <button class="btn ba" id="savePay">Save rails</button>
  </div></div>`;
}

function esc(s){return String(s||'').replace(/"/g,'"');}

function render(){
  paintTabs();
  const r = route();
  const map = {home:viewHome, apps:viewApps, shop:viewShop, daily:viewDaily, profit:viewProfit, pay:viewPay};
  $('#app').innerHTML = (map[r]||viewHome)();
  bind();
}

function bind(){
  const cp = $('#copyPitch');
  if(cp) cp.onclick = async ()=>{
    try{await navigator.clipboard.writeText(pitch()); alert('Pitch copied');}
    catch{alert(pitch());}
  };
  const so = $('#sentOne');
  if(so) so.onclick = ()=>{ state.outreach=Math.min(10,state.outreach+1); save(); render(); };
  document.querySelectorAll('[data-boost]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.boost; state.appBoost[id]=(state.appBoost[id]||0)+1; state.simMrr=Math.round(state.simMrr*1.03); save(); render();
  });
  document.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{ go('shop'); });
  document.querySelectorAll('[data-order]').forEach(b=>b.onclick=()=>{
    const p = PRODUCTS.find(x=>x.id===b.dataset.order); if(!p) return;
    const ref = 'LM-'+Date.now().toString(36).toUpperCase();
    state.sales.unshift({id:ref,name:p.name,amount:p.price,status:'pending',at:Date.now()});
    save();
    const lines = [`Pay ${money(p.price)} for ${p.name}`,`Ref ${ref}`];
    if(state.payId) lines.push(`PayID: ${state.payId} (${state.payName})`);
    if(state.bsb&&state.acc) lines.push(`BSB ${state.bsb} Acc ${state.acc} ${state.accName}`);
    lines.push(SHOP);
    const text = lines.join('\n');
    const subject = encodeURIComponent(`Order ${ref} — ${p.name}`);
    const body = encodeURIComponent(text);
    location.href = `mailto:${state.email||'emilybluerichards@gmail.com'}?subject=${subject}&body=${body}`;
    render();
  });
  document.querySelectorAll('[data-mark]').forEach(b=>b.onclick=()=>{
    const p = PRODUCTS.find(x=>x.id===b.dataset.mark); if(!p) return;
    const pending = state.sales.find(s=>s.name===p.name && s.status==='pending');
    if(pending) pending.status='paid';
    else state.sales.unshift({id:'LM-'+Date.now().toString(36),name:p.name,amount:p.price,status:'paid',at:Date.now()});
    save(); render();
  });
  document.querySelectorAll('[data-task]').forEach(b=>b.onclick=()=>{
    const t=state.tasks.find(x=>x.id===b.dataset.task); if(t) t.done=!t.done; save(); render();
  });
  const pp=$('#profitPush');
  if(pp) pp.onclick=()=>{
    state.tasks.forEach(t=>t.done=true);
    state.simMrr=Math.round(state.simMrr*1.08);
    save(); render();
  };
  const rt=$('#resetTasks');
  if(rt) rt.onclick=()=>{ state.tasks.forEach(t=>t.done=false); save(); render(); };
  const sp=$('#savePay');
  if(sp) sp.onclick=()=>{
    ['payId','payName','bsb','acc','accName','email','phone','stripe'].forEach(k=>{const el=$('#'+k); if(el) state[k]=el.value.trim();});
    save(); alert('Rails saved'); render();
  };
}

$('#goShop').onclick=()=>go('shop');
$('#goDaily').onclick=()=>go('daily');
$('#goProfit').onclick=()=>go('profit');
window.addEventListener('hashchange', render);
render();
