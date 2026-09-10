(()=>{
  const IMAGE='https://ems.dimu.org/image/012uN1buK4ge?dimension=1200x1200';
  const SOURCE='https://digitaltmuseum.no/021085513195/fantastisk-steinskulptur-pa-tranoy-tanker-for-to/media?slide=0';
  const copy={
    en:{summary:'Art in Tranøy',title:'Tanker for to',text:'A striking granite work from 2011 by Sámi artist Annelise Josefsen. The two figures — “Jente i tanker” and “Gutt i tanker” — are part of Tranøy’s sculpture park, where art is placed directly in the coastal landscape.',link:'See the original photo and source information at DigitaltMuseum',alt:'The granite sculpture Tanker for to by Annelise Josefsen at Tranøy'},
    no:{summary:'Kunst på Tranøy',title:'Tanker for to',text:'Et flott granittverk fra 2011 av den samiske kunstneren Annelise Josefsen. De to figurene — «Jente i tanker» og «Gutt i tanker» — er en del av skulpturparken på Tranøy, der kunsten er plassert ute i selve kystlandskapet.',link:'Se originalbildet og kildeopplysninger hos DigitaltMuseum',alt:'Granittskulpturen Tanker for to av Annelise Josefsen på Tranøy'},
    de:{summary:'Kunst in Tranøy',title:'Tanker for to',text:'Ein eindrucksvolles Granitwerk aus dem Jahr 2011 von der samischen Künstlerin Annelise Josefsen. Die beiden Figuren „Jente i tanker“ und „Gutt i tanker“ gehören zum Skulpturenpark von Tranøy, in dem Kunst direkt in die Küstenlandschaft eingebettet ist.',link:'Originalfoto und Quellenangaben bei DigitaltMuseum ansehen',alt:'Die Granitskulptur Tanker for to von Annelise Josefsen in Tranøy'}
  };

  function lang(){
    const l=document.documentElement.lang;
    return l==='nb'?'no':l==='de'?'de':'en';
  }

  function styles(){
    if(document.getElementById('tranoy-art-style'))return;
    const s=document.createElement('style');
    s.id='tranoy-art-style';
    s.textContent=`
      .tranoy-art-card{margin:18px 0 2px;max-width:620px;border:1px solid var(--line);border-radius:18px;overflow:hidden;background:var(--white)}
      .tranoy-art-card img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:#d9dedc}
      .tranoy-art-copy{padding:16px 17px 18px}
      .tranoy-art-copy h4{font-size:20px;margin:0 0 7px}
      .tranoy-art-copy p{margin:0 0 11px;color:var(--muted)}
      .tranoy-art-copy a{font-weight:650}
    `;
    document.head.appendChild(s);
  }

  function insert(){
    styles();
    const explore=document.querySelector('#explore');
    if(!explore)return;
    const names=Object.values(copy).map(x=>x.summary);
    const target=[...explore.querySelectorAll('details.place')].find(d=>names.includes((d.querySelector('summary')?.textContent||'').trim()));
    if(!target)return;
    const body=target.querySelector('.detail-body');
    if(!body)return;
    const c=copy[lang()];
    let card=body.querySelector('.tranoy-art-card');
    if(!card){
      card=document.createElement('div');
      card.className='tranoy-art-card';
      body.appendChild(card);
    }
    if(card.dataset.lang===lang())return;
    card.dataset.lang=lang();
    card.innerHTML=`<img loading="lazy" src="${IMAGE}" alt="${c.alt}"><div class="tranoy-art-copy"><h4>${c.title}</h4><p>${c.text}</p><a class="external" href="${SOURCE}" target="_blank" rel="noopener">${c.link} ↗</a></div>`;
  }

  const content=document.getElementById('content');
  if(content)new MutationObserver(insert).observe(content,{childList:true,subtree:true});
  insert();
})();
