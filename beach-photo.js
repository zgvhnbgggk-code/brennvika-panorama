(()=>{
  const PHOTO='assets/hamaroy-beach.webp';
  const copy={
    en:{summaries:['Beaches & coastal walks'],alt:'Clear shallow water on the Hamarøy coast with mountains across the fjord',caption:'A summer day on the Hamarøy coast.'},
    no:{summaries:['Strender og kystturer'],alt:'Klart, grunt vann ved Hamarøy-kysten med fjell på andre siden av fjorden',caption:'Sommer ved kysten på Hamarøy.'},
    de:{summaries:['Strände & Küstenwege'],alt:'Klares, flaches Wasser an der Küste Hamarøys mit Bergen auf der anderen Seite des Fjords',caption:'Ein Sommertag an der Küste Hamarøys.'}
  };

  function language(){
    const l=document.documentElement.lang;
    return l==='nb'?'no':l==='de'?'de':'en';
  }

  function addStyles(){
    if(document.getElementById('local-beach-photo-style'))return;
    const style=document.createElement('style');
    style.id='local-beach-photo-style';
    style.textContent=`
      .local-beach-photo{margin:16px 0 2px;max-width:520px}
      .local-beach-photo img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;object-position:50% 72%;border-radius:16px;background:#d9dedc}
      .local-beach-photo figcaption{margin-top:7px;font-size:12px;line-height:1.4;color:var(--muted)}
    `;
    document.head.appendChild(style);
  }

  function addPhoto(){
    addStyles();
    const explore=document.querySelector('#explore');
    if(!explore)return;
    const allNames=Object.values(copy).flatMap(x=>x.summaries);
    const target=[...explore.querySelectorAll('details.place')].find(d=>allNames.includes((d.querySelector('summary')?.textContent||'').trim()));
    if(!target||target.querySelector('.local-beach-photo'))return;
    const body=target.querySelector('.detail-body');
    if(!body)return;
    const c=copy[language()];
    const figure=document.createElement('figure');
    figure.className='local-beach-photo';
    const img=document.createElement('img');
    img.src=PHOTO;
    img.loading='lazy';
    img.alt=c.alt;
    const caption=document.createElement('figcaption');
    caption.textContent=c.caption;
    figure.append(img,caption);
    body.appendChild(figure);
  }

  const content=document.getElementById('content');
  if(content)new MutationObserver(addPhoto).observe(content,{childList:true,subtree:true});
  addPhoto();
})();
