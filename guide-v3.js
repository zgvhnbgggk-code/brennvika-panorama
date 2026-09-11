/* Progressive enhancement only. Content, menus and language pages work without JS.
   No DOM observer loops, polling, content fetches, framework, analytics or autoplay. */
(()=>{'use strict';
 const menu=document.querySelector('.guide-menu');
 document.addEventListener('click',async event=>{
  const copy=event.target.closest('[data-copy],#copyAddress');
  if(copy){
   const target=copy.dataset.copy?document.getElementById(copy.dataset.copy):null;
   const text=target?target.textContent:'Brennvika Panorama, Brennvikveien 37, 8294 Hamarøy, Norway';
   const status=copy.parentElement.querySelector('[role="status"]');
   try{
    if(!navigator.clipboard)throw new Error('clipboard unavailable');
    await navigator.clipboard.writeText(text);
    const old=copy.textContent;copy.textContent=copy.dataset.done||'Copied';
    if(status)status.textContent=copy.dataset.done||'Copied';
    setTimeout(()=>{copy.textContent=old},1800);
   }catch{
    if(target){const range=document.createRange();range.selectNodeContents(target);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)}
    if(status)status.textContent=copy.dataset.fail||text;
   }
  }
  const language=event.target.closest('[data-language]');
  if(language){
   const url=new URL(language.getAttribute('href'),document.baseURI);url.hash=location.hash;
   language.href=url.href;
   try{localStorage.setItem('bp-lang',language.dataset.language)}catch{}
  }
  if(menu&&menu.open&&(event.target.closest('.guide-menu a')||!menu.contains(event.target)))menu.open=false;
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu&&menu.open){menu.open=false;menu.querySelector('summary').focus()}});
 // Images from public collections must never block the practical guide.
 document.querySelectorAll('.photo-frame img').forEach(img=>{
  const fail=()=>{if(img.closest('.photo-frame').querySelector('.photo-fallback'))img.closest('.photo-frame').classList.add('failed')};
  img.addEventListener('error',fail,{once:true});
  if(img.complete&&!img.naturalWidth)fail();
 });
 // Open any collapsed ancestor when following an existing deep link.
 function reveal(){let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}if(!id)return;const node=document.getElementById(id);if(!node)return;let p=node.parentElement;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement}}
 window.addEventListener('hashchange',reveal);reveal();
})();
