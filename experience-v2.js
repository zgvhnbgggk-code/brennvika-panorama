(() => {
  const HERO_IMAGE='https://commons.wikimedia.org/wiki/Special:Redirect/file/Hamaroy_fyr%2C_Norge_%281%29.jpg?width=2200';
  const HERO_SOURCE='https://commons.wikimedia.org/wiki/File:Hamaroy_fyr,_Norge_(1).jpg';
  const ART_IMAGE='https://images.squarespace-cdn.com/content/v1/6274ef1a02d9a77f64596fc8/c1662e55-3d94-4a33-a3b1-630164bee0d0/Tran%C3%B8y%2Bskulpturpark%2BHamar%C3%B8y%2B-%2BTina%2BKrey%2BJacobsen.jpg';
  const ART_SOURCE='https://www.bodo2024.no/nyhetsarkiv/24-reasons-to-visit-bodo-and-nordland-in-2024';
  const GLIMMA_MAP='https://www.google.com/maps/search/?api=1&query=Hamsunsenteret%2C+Vestfjordveien+1464%2C+8294+Hamar%C3%B8y';
  const GLIMMA_GUIDE='https://visitbodo.com/guide/turmal/glimma-rundt/';
  const TRANOY='https://tranoyfyr.no/';
  const TRANOY_RESTAURANT='https://tranoyfyr.no/restaurant/';
  const TRANOY_ART='https://tranoyfyr.no/project/guidet-skulpturvandring-pa-tranoy/';

  const COPY={
    en:{
      heroCredit:'Tranøy Lighthouse, Hamarøy · Photo: Karin Beate Nøsterud / norden.org · CC BY 2.5 DK',
      dinnerTitle:'Dinner at Tranøy Lighthouse',
      dinnerText:'During the summer season (May–October), Naustet Mat & Drikke serves dinner daily. It is an especially nice evening trip from Brennvika — check current opening hours and reserve a table before you go.',
      visit:'Visit Tranøy Lighthouse',book:'Restaurant & table booking',
      artTitle:'Art in the landscape · Kystkvinner',
      artText:'Tranøy Art Park places outdoor artworks directly in the coastal landscape. “Kystkvinner” by Ingun Dahlin is one of the best-known works and a natural stop on a walk through Tranøy.',
      artLink:'Sculpture walk at Tranøy',artCredit:'Photo: Tina Krey Jacobsen / Bodø2024',
      glimmaTitle:'Glimma rundt',
      glimmaExtra:'A scenic circular walk around Glimma. A practical starting point is the parking area at the Hamsun Centre.',
      parking:'Parking / start in Google Maps',route:'Route description'
    },
    no:{
      heroCredit:'Tranøy fyr, Hamarøy · Foto: Karin Beate Nøsterud / norden.org · CC BY 2.5 DK',
      dinnerTitle:'Middag på Tranøy fyr',
      dinnerText:'I sommersesongen (mai–oktober) serverer Naustet Mat & Drikke middag hver dag. Det er en svært fin kveldstur fra Brennvika — sjekk aktuelle åpningstider og bestill gjerne bord før dere drar.',
      visit:'Tranøy fyr',book:'Restaurant og bordbestilling',
      artTitle:'Kunst i landskapet · Kystkvinner',
      artText:'Kunstpark Tranøy har utekunst plassert direkte i kystlandskapet. «Kystkvinner» av Ingun Dahlin er et av de mest kjente verkene og et naturlig stopp på en rusletur gjennom Tranøy.',
      artLink:'Skulpturvandring på Tranøy',artCredit:'Foto: Tina Krey Jacobsen / Bodø2024',
      glimmaTitle:'Glimma rundt',
      glimmaExtra:'En flott rundtur rundt Glimma. Et praktisk startsted er parkeringsplassen ved Hamsunsenteret.',
      parking:'Parkering / start i Google Maps',route:'Turbeskrivelse'
    },
    de:{
      heroCredit:'Tranøy Leuchtturm, Hamarøy · Foto: Karin Beate Nøsterud / norden.org · CC BY 2.5 DK',
      dinnerTitle:'Abendessen am Tranøy-Leuchtturm',
      dinnerText:'In der Sommersaison (Mai–Oktober) serviert Naustet Mat & Drikke täglich Abendessen. Ein besonders schöner Abendausflug von Brennvika — aktuelle Öffnungszeiten prüfen und am besten vorher einen Tisch reservieren.',
      visit:'Tranøy Leuchtturm',book:'Restaurant & Tischreservierung',
      artTitle:'Kunst in der Landschaft · Kystkvinner',
      artText:'Im Kunstpark Tranøy stehen Kunstwerke direkt in der Küstenlandschaft. „Kystkvinner“ von Ingun Dahlin gehört zu den bekanntesten Werken und ist ein schöner Stopp bei einem Spaziergang durch Tranøy.',
      artLink:'Skulpturenweg auf Tranøy',artCredit:'Foto: Tina Krey Jacobsen / Bodø2024',
      glimmaTitle:'Glimma-Rundweg',
      glimmaExtra:'Ein schöner Rundweg um Glimma. Ein praktischer Startpunkt ist der Parkplatz beim Hamsun-Zentrum.',
      parking:'Parkplatz / Start in Google Maps',route:'Routenbeschreibung'
    }
  };

  function lang(){const l=(document.documentElement.lang||'en').toLowerCase();return l.startsWith('nb')||l.startsWith('no')?'no':l.startsWith('de')?'de':'en'}

  function setupHero(){
    const hero=document.querySelector('.hero'); if(!hero)return;
    hero.style.backgroundImage=`linear-gradient(180deg,rgba(5,20,27,.10) 0%,rgba(5,20,27,.20) 42%,rgba(5,20,27,.78) 100%),url("${HERO_IMAGE}")`;
    hero.style.backgroundSize='cover';hero.style.backgroundPosition='center 48%';
    const art=hero.querySelector('.hero-art');if(art)art.style.display='none';
    let cr=hero.querySelector('.hero-photo-credit');if(!cr){cr=document.createElement('a');cr.className='hero-photo-credit';cr.href=HERO_SOURCE;cr.target='_blank';cr.rel='noopener';hero.appendChild(cr)}
    cr.textContent=COPY[lang()].heroCredit;
  }

  function enhanceTranoy(explore,c){
    const tranoy=[...explore.querySelectorAll('.feature-place')].find(x=>/Tranøy|Tranoy/i.test(x.querySelector('h3')?.textContent||''));
    if(tranoy){
      let extra=tranoy.querySelector('.tranoy-dinner');
      if(!extra){extra=document.createElement('div');extra.className='tranoy-dinner';tranoy.querySelector('.feature-copy')?.appendChild(extra)}
      extra.innerHTML=`<h4>${c.dinnerTitle}</h4><p>${c.dinnerText}</p><div class="experience-links"><a href="${TRANOY}" target="_blank" rel="noopener">${c.visit} ↗</a><a href="${TRANOY_RESTAURANT}" target="_blank" rel="noopener">${c.book} ↗</a></div>`;
    }
  }

  function enhanceGlimma(explore,c){
    const details=[...explore.querySelectorAll('details.place')].find(d=>/Glimma/i.test(d.querySelector('summary')?.textContent||''));
    if(!details)return;
    const body=details.querySelector('.detail-body');if(!body)return;
    let box=body.querySelector('.glimma-location');if(!box){box=document.createElement('div');box.className='glimma-location';body.appendChild(box)}
    box.innerHTML=`<p><strong>${c.glimmaTitle}.</strong> ${c.glimmaExtra}</p><div class="experience-links"><a href="${GLIMMA_MAP}" target="_blank" rel="noopener">${c.parking} ↗</a><a href="${GLIMMA_GUIDE}" target="_blank" rel="noopener">${c.route} ↗</a></div>`;
  }

  function addArt(explore,c){
    const grid=explore.querySelector('.feature-grid');if(!grid)return;
    let art=grid.querySelector('.tranoy-art-feature');
    if(!art){art=document.createElement('article');art.className='feature-place tranoy-art-feature';grid.appendChild(art)}
    art.innerHTML=`<img loading="lazy" src="${ART_IMAGE}" alt="Kystkvinner by Ingun Dahlin at Tranøy Art Park"><div class="feature-copy"><h3>${c.artTitle}</h3><p>${c.artText}</p><div class="experience-links"><a href="${TRANOY_ART}" target="_blank" rel="noopener">${c.artLink} ↗</a></div><div class="photo-credit"><a href="${ART_SOURCE}" target="_blank" rel="noopener">${c.artCredit}</a></div></div>`;
  }

  function apply(){
    setupHero();
    const explore=document.querySelector('#explore .wrap');if(!explore)return;
    const c=COPY[lang()];
    enhanceTranoy(explore,c);enhanceGlimma(explore,c);addArt(explore,c);
  }

  const style=document.createElement('style');style.textContent=`
    .hero-photo-credit{position:absolute;right:14px;bottom:12px;z-index:4;color:rgba(255,255,255,.86);font-size:10px;text-decoration:none;background:rgba(5,20,27,.48);backdrop-filter:blur(8px);padding:6px 9px;border-radius:999px}
    .tranoy-dinner{margin-top:16px;padding-top:15px;border-top:1px solid var(--line)}.tranoy-dinner h4{margin:0 0 7px;font-size:16px}.tranoy-dinner p{margin:0;color:var(--muted)}
    .experience-links{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.experience-links a{display:inline-flex;text-decoration:none;padding:9px 12px;border-radius:999px;background:var(--ink);color:#fff;font-size:12px;font-weight:850}.experience-links a+ a{background:var(--sea)}
    .glimma-location{margin-top:16px;padding:16px;border-radius:16px;background:var(--bluewash);border:1px solid var(--line)}.glimma-location p{margin:0}
    .tranoy-art-feature img{object-position:center 40%}.tranoy-art-feature .photo-credit a{color:inherit}
    @media(max-width:720px){.hero-photo-credit{left:16px;right:auto;bottom:10px;max-width:calc(100% - 32px);white-space:normal}.experience-links a{width:100%;justify-content:center}}
  `;document.head.appendChild(style);

  const obs=new MutationObserver(apply);obs.observe(document.body,{childList:true,subtree:true,characterData:true});apply();
})();