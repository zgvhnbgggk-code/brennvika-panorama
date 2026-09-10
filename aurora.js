(() => {
  const COPY = {
    en: {
      hero: 'Slow down by the sea, enjoy wide views across the Vestfjord — from bright summer nights to the chance of northern lights in the darker season.',
      highlightTitle: 'Northern lights & midnight sun',
      highlightText: 'Dark autumn and winter skies can bring aurora; summer brings exceptionally bright nights.',
      title: 'Northern lights from Brennvika',
      text: 'From the darker part of the year — typically from late August/September into March and early April — clear nights can offer very good chances of seeing the northern lights. Brennvika has open coastal views and relatively little local light, so you may be able to watch the aurora without travelling anywhere.',
      tips: '<strong>Best chance:</strong> choose a clear, dark evening, reduce nearby lights and give your eyes a few minutes to adjust. Aurora can appear anywhere in the sky, not only to the north. Dress warmly and take care on wet, icy or dark ground near the shoreline.',
      note: 'Northern lights are a natural phenomenon and can never be guaranteed.'
    },
    no: {
      hero: 'Nyt roen ved sjøen og utsikten over Vestfjorden — fra lyse sommernetter til muligheten for nordlys i den mørke årstiden.',
      highlightTitle: 'Nordlys & midnattssol',
      highlightText: 'Mørke høst- og vinterkvelder kan by på nordlys, mens sommeren gir helt lyse netter.',
      title: 'Nordlys fra Brennvika',
      text: 'I den mørke delen av året — typisk fra slutten av august/september og inn i mars og tidlig april — kan klare kvelder gi svært gode muligheter for nordlys. Brennvika har åpen utsikt mot kysten og relativt lite lokal lysforurensning, så dere kan ofte oppleve nordlyset uten å reise noe sted.',
      tips: '<strong>Best sjanse:</strong> velg en klar og mørk kveld, demp nærliggende lys og gi øynene noen minutter til å venne seg til mørket. Nordlyset kan dukke opp over hele himmelen, ikke bare mot nord. Kle dere varmt og vær forsiktige på vått, glatt eller mørkt underlag ved sjøen.',
      note: 'Nordlys er et naturfenomen og kan aldri garanteres.'
    },
    de: {
      hero: 'Genießen Sie die Ruhe am Meer und den Blick über den Vestfjord — von hellen Sommernächten bis zur Chance auf Nordlichter in der dunklen Jahreszeit.',
      highlightTitle: 'Nordlicht & Mitternachtssonne',
      highlightText: 'Dunkle Herbst- und Winternächte können Nordlicht bringen; im Sommer bleiben die Nächte außergewöhnlich hell.',
      title: 'Nordlicht von Brennvika aus',
      text: 'In der dunklen Jahreszeit — typischerweise von Ende August/September bis März und Anfang April — können klare Nächte sehr gute Chancen auf Nordlicht bieten. Brennvika hat einen offenen Blick zur Küste und relativ wenig lokales Streulicht, sodass Sie die Aurora oft direkt an der Hütte erleben können.',
      tips: '<strong>Beste Chance:</strong> wählen Sie einen klaren, dunklen Abend, reduzieren Sie nahe Lichtquellen und geben Sie Ihren Augen einige Minuten Zeit, sich an die Dunkelheit zu gewöhnen. Nordlicht kann am gesamten Himmel erscheinen, nicht nur im Norden. Warm anziehen und auf nassem, eisigem oder dunklem Untergrund am Ufer vorsichtig sein.',
      note: 'Nordlicht ist ein Naturphänomen und kann nie garantiert werden.'
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
      const cards=[...grid.children];
      const target=cards[3];
      if(target && target.dataset.aurora!=='1'){
        target.dataset.aurora='1';
        target.innerHTML=`<span class="highlight-no">04</span><strong>${c.highlightTitle}</strong><span>${c.highlightText}</span>`;
      }
    }

    const explore=document.querySelector('#explore .wrap');
    if(explore && !explore.querySelector('.aurora-feature')){
      const head=explore.querySelector('.section-head');
      const card=document.createElement('div');
      card.className='aurora-feature';
      card.innerHTML=`<div class="aurora-kicker">${l==='no'?'Mørketidens høydepunkt':l==='de'?'Höhepunkt der dunklen Jahreszeit':'A highlight of the dark season'}</div><h3>${c.title}</h3><p>${c.text}</p><p>${c.tips}</p><small>${c.note}</small>`;
      if(head) head.insertAdjacentElement('afterend',card); else explore.prepend(card);

      const labels=l==='no'?['Nordlys']:l==='de'?['Nordlicht']:['Northern lights'];
      [...explore.querySelectorAll('details.place')].forEach(d=>{
        const s=d.querySelector('summary');
        if(s && labels.some(x=>s.textContent.includes(x))) d.remove();
      });
    }
  }

  const style=document.createElement('style');
  style.textContent=`
    .aurora-feature{margin:0 0 22px;padding:30px 32px;border-radius:26px;color:#eef9fb;background:radial-gradient(circle at 88% 15%,rgba(95,213,167,.22),transparent 26%),radial-gradient(circle at 22% 0%,rgba(79,166,204,.22),transparent 30%),linear-gradient(135deg,#071d29,#0d3d4c 58%,#163a3c);box-shadow:0 20px 55px rgba(7,29,41,.16)}
    .aurora-feature .aurora-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:900;color:#9fe0ca;margin-bottom:7px}
    .aurora-feature h3{font-size:clamp(28px,4vw,43px);line-height:1.02;letter-spacing:-.035em;margin:0 0 13px;color:#fff}
    .aurora-feature p{max-width:900px;margin:0;color:#dcebee}.aurora-feature p+p{margin-top:13px}.aurora-feature small{display:block;margin-top:16px;color:#a9c3ca}
    @media(max-width:720px){.aurora-feature{padding:23px 20px;border-radius:21px}.aurora-feature h3{font-size:31px}}
  `;
  document.head.appendChild(style);

  const obs=new MutationObserver(apply);
  obs.observe(document.body,{childList:true,subtree:true,characterData:true});
  apply();
})();
