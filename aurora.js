(() => {
  const AURORA_IMAGE = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Northern_lights_curtains_and_beams_over_Nordmo_in_Bjerkvik%2C_Narvik%2C_Nordland%2C_Norway%2C_2023_September_-_3.jpg?width=1600';
  const AURORA_SOURCE = 'https://commons.wikimedia.org/wiki/File:Northern_lights_curtains_and_beams_over_Nordmo_in_Bjerkvik,_Narvik,_Nordland,_Norway,_2023_September_-_3.jpg';
  const COPY = {
    en: {
      hero: 'Slow down by the sea, enjoy wide views across the Vestfjord — from bright summer nights to northern lights in the darker season.',
      highlightTitle: 'Northern lights & midnight sun',
      highlightText: 'Dark autumn and winter skies bring northern-light experiences; summer brings exceptionally bright nights.',
      title: 'Northern lights from Brennvika',
      text: 'From late August/September through March and early April, clear dark evenings can offer excellent northern-light viewing. Brennvika has an open coastal horizon and little nearby artificial light, so one of the best places to watch is often right outside the cabin.',
      tips: '<strong>For a good view:</strong> turn down nearby lights, step outside and give your eyes a few minutes to adjust. The aurora can appear across the whole sky, not only to the north. Dress warmly and take care on wet, icy or dark ground near the shoreline.',
      kicker: 'A highlight of the dark season',
      caption: 'Northern lights in Nordland · Bjerkvik, Narvik',
      credit: 'Photo: Simo Räsänen · CC BY-SA 4.0'
    },
    no: {
      hero: 'Nyt roen ved sjøen og utsikten over Vestfjorden — fra lyse sommernetter til nordlys i den mørke årstiden.',
      highlightTitle: 'Nordlys & midnattssol',
      highlightText: 'Mørke høst- og vinterkvelder byr på nordlysopplevelser, mens sommeren gir helt lyse netter.',
      title: 'Nordlys fra Brennvika',
      text: 'Fra slutten av august/september og gjennom mars og tidlig april kan klare, mørke kvelder gi svært gode nordlysopplevelser. Brennvika har åpen horisont mot kysten og lite kunstig lys i nærheten, så et av de beste stedene å se nordlyset er ofte rett utenfor hytta.',
      tips: '<strong>For best utsikt:</strong> demp nærliggende lys, gå ut og gi øynene noen minutter til å venne seg til mørket. Nordlyset kan dukke opp over hele himmelen, ikke bare mot nord. Kle dere varmt og vær forsiktige på vått, glatt eller mørkt underlag ved sjøen.',
      kicker: 'Et høydepunkt i mørketiden',
      caption: 'Nordlys i Nordland · Bjerkvik, Narvik',
      credit: 'Foto: Simo Räsänen · CC BY-SA 4.0'
    },
    de: {
      hero: 'Genießen Sie die Ruhe am Meer und den Blick über den Vestfjord — von hellen Sommernächten bis zu Nordlichtern in der dunklen Jahreszeit.',
      highlightTitle: 'Nordlicht & Mitternachtssonne',
      highlightText: 'Dunkle Herbst- und Winternächte bieten Nordlichterlebnisse; im Sommer bleiben die Nächte außergewöhnlich hell.',
      title: 'Nordlicht von Brennvika aus',
      text: 'Von Ende August/September bis März und Anfang April können klare, dunkle Abende sehr gute Bedingungen für Nordlicht bieten. Brennvika hat einen offenen Küstenhorizont und wenig künstliches Licht in der Nähe – oft ist der Platz direkt vor der Hütte bereits ausgezeichnet.',
      tips: '<strong>Für eine gute Sicht:</strong> nahe Lichtquellen reduzieren, nach draußen gehen und den Augen einige Minuten Zeit geben. Nordlicht kann am gesamten Himmel erscheinen, nicht nur im Norden. Warm anziehen und auf nassem, eisigem oder dunklem Untergrund am Ufer vorsichtig sein.',
      kicker: 'Ein Höhepunkt der dunklen Jahreszeit',
      caption: 'Nordlicht in Nordland · Bjerkvik, Narvik',
      credit: 'Foto: Simo Räsänen · CC BY-SA 4.0'
    }
  };

  function lang(){
    const l=(document.documentElement.lang||'en').toLowerCase();
    return l.startsWith('nb')||l.startsWith('no')?'no':l.startsWith('de')?'de':'en';
  }

  function apply(){
    const l=lang(), c=COPY[l];
    const hero=document.querySelector('#heroLead');
    if(hero && hero.textContent!==c.hero) hero.textContent=c.hero;

    const grid=document.querySelector('#highlightGrid');
    if(grid && grid.children.length>=5){
      const target=[...grid.children][3];
      if(target){
        target.dataset.aurora='1';
        target.innerHTML=`<span class="highlight-no">04</span><strong>${c.highlightTitle}</strong><span>${c.highlightText}</span>`;
      }
    }

    const explore=document.querySelector('#explore .wrap');
    if(explore){
      let card=explore.querySelector('.aurora-feature');
      if(!card){
        card=document.createElement('div');
        card.className='aurora-feature';
        const head=explore.querySelector('.section-head');
        if(head) head.insertAdjacentElement('afterend',card); else explore.prepend(card);
      }
      if(card.dataset.lang!==l){
        card.dataset.lang=l;
        card.innerHTML=`<div class="aurora-photo"><img loading="lazy" src="${AURORA_IMAGE}" alt="${c.caption}"><div class="aurora-photo-credit"><a href="${AURORA_SOURCE}" target="_blank" rel="noopener">${c.credit}</a></div></div><div class="aurora-copy"><div class="aurora-kicker">${c.kicker}</div><h3>${c.title}</h3><p>${c.text}</p><p>${c.tips}</p></div>`;
      }

      const labels=l==='no'?['Nordlys']:l==='de'?['Nordlicht']:['Northern lights'];
      [...explore.querySelectorAll('details.place')].forEach(d=>{
        const s=d.querySelector('summary');
        if(s && labels.some(x=>s.textContent.includes(x))) d.remove();
      });
    }
  }

  const style=document.createElement('style');
  style.textContent=`
    .aurora-feature{margin:0 0 24px;border-radius:26px;overflow:hidden;color:#eef9fb;background:#071d29;display:grid;grid-template-columns:1.08fr .92fr;box-shadow:0 20px 55px rgba(7,29,41,.16)}
    .aurora-photo{position:relative;min-height:370px;background:#071d29}.aurora-photo img{width:100%;height:100%;min-height:370px;display:block;object-fit:cover}
    .aurora-photo-credit{position:absolute;left:12px;bottom:12px;background:rgba(4,18,24,.72);backdrop-filter:blur(8px);padding:7px 9px;border-radius:999px;font-size:10px;color:#eef9fb}.aurora-photo-credit a{color:inherit;text-decoration:none}
    .aurora-copy{padding:34px 34px 32px;background:radial-gradient(circle at 88% 15%,rgba(95,213,167,.18),transparent 28%),linear-gradient(135deg,#071d29,#0d3d4c 70%,#163a3c)}
    .aurora-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:900;color:#9fe0ca;margin-bottom:7px}
    .aurora-feature h3{font-size:clamp(28px,4vw,43px);line-height:1.02;letter-spacing:-.035em;margin:0 0 13px;color:#fff}
    .aurora-feature p{max-width:900px;margin:0;color:#dcebee}.aurora-feature p+p{margin-top:13px}
    @media(max-width:850px){.aurora-feature{grid-template-columns:1fr}.aurora-photo,.aurora-photo img{min-height:280px}.aurora-copy{padding:25px 22px}}
    @media(max-width:520px){.aurora-photo,.aurora-photo img{min-height:230px}.aurora-feature h3{font-size:31px}}
  `;
  document.head.appendChild(style);

  const obs=new MutationObserver(apply);
  obs.observe(document.body,{childList:true,subtree:true,characterData:true});
  apply();
})();