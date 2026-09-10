const fragments=['sections/01-arrival-door.html','sections/02-wifi-water.html','sections/03-leak-heating.html','sections/04-house-safety-checkout.html','sections/05-explore-help.html'];
const menuBtn=document.querySelector('#menuBtn'),menuPanel=document.querySelector('#menuPanel');
function setup(){
 if(menuBtn)menuBtn.addEventListener('click',()=>{const open=menuPanel.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
 document.querySelectorAll('#menuPanel a').forEach(a=>a.addEventListener('click',()=>menuPanel.classList.remove('open')));
 const navLinks=[...document.querySelectorAll('[data-nav]')],sections=[...document.querySelectorAll('main section[id]')];
 const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)navLinks.forEach(a=>a.classList.toggle('active',a.dataset.nav===e.target.id));},{rootMargin:'-28% 0px -62% 0px',threshold:.01});
 sections.forEach(s=>io.observe(s));
 const copy=document.querySelector('#copyAddress');if(copy)copy.addEventListener('click',async()=>{const text='Brennvika Panorama, Brennvikveien 37, 8294 Hamarøy, Norway';try{await navigator.clipboard.writeText(text);const old=copy.textContent;copy.textContent=copy.dataset.done||'Copied';setTimeout(()=>copy.textContent=old,1500)}catch{}});
}
Promise.all(fragments.map(f=>fetch(f).then(r=>{if(!r.ok)throw new Error(f);return r.text()}))).then(parts=>{document.querySelector('#content').innerHTML=parts.join('');setup();if(location.hash)setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView(),60)}).catch(()=>{document.querySelector('#content').innerHTML='<section class="section"><div class="wrap"><div class="card danger wide"><h3>Guide could not load</h3><p>Please refresh the page or contact Eva or Dan.</p></div></div></section>';setup()});