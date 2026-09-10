(() => {
  const COPY={
    en:{
      hero:'Slow down by the sea, enjoy wide views across the Vestfjord — from bright summer nights to northern lights in the darker season.',
      highlightTitle:'Northern lights & bright summer nights',
      highlightText:'Dark-season skies and the long, luminous evenings of northern summer.',
      title:'Northern lights in Nordland',
      text:'From late summer through early spring, dark evenings in Hamarøy can offer beautiful northern-light displays. Brennvika has open coastal views and little local light, so one of the best places to look is simply outside the cabin.',
      credit:'Northern lights in Bjerkvik, Nordland · Photo: Simo Räsänen · CC BY-SA 4.0'
    },
    no:{
      hero:'Nyt roen ved sjøen og utsikten over Vestfjorden — fra lyse sommernetter til nordlys i den mørke årstiden.',
      highlightTitle:'Nordlys & lyse sommernetter',
      highlightText:'Mørke høst- og vinterkvelder og lange, lyse nordnorske sommerkvelder.',
      title:'Nordlys i Nordland',
      text:'Fra sensommeren og gjennom den mørke delen av året kan Hamarøy by på flotte nordlysopplevelser. Brennvika har åpen kysthimmel og lite lokalt lys, så et av de beste stedene å se etter nordlyset er rett utenfor hytta.',
      credit:'Nordlys i Bjerkvik, Nordland · Foto: Simo Räsänen · CC BY-SA 4.0'
    },
    de:{
      hero:'Genießen Sie Ruhe am Meer und den Blick über den Vestfjord — von hellen Sommernächten bis zum Nordlicht in der dunklen Jahreszeit.',
      highlightTitle:'Nordlicht & helle Sommernächte',
      highlightText:'Dunkle Herbst- und Winterabende und lange, helle nordnorwegische Sommernächte.',
      title:'Nordlicht in Nordland',
      text:'Von Spätsommer bis in das Frühjahr hinein können die dunklen Abende auf Hamarøy eindrucksvolle Nordlichter bieten. Brennvika hat einen offenen Küstenhimmel und wenig lokales Licht; ein sehr guter Beobachtungsplatz ist direkt an der Hütte.',
      credit:'Nordlicht in Bjerkvik, Nordland · Foto: Simo Räsänen · CC BY-SA 4.0'
    }
  };
  const IMAGE='https://commons.wikimedia.org/wiki/Special:Redirect/file/Northern_lights_curtains_and_beams_over_Nordmo_in_Bjerkvik%2C_Narvik%2C_Nordland%2C_Norway%2C_2023_September_-_3.jpg?width=1400';
  const SOURCE='https://commons.wikimedia.org/wiki/File:Northern_lights_curtains_and_beams_over_Nordmo_in_Bjerkvik%2C_Narvik%2C_Nordland%2C_Norway%2C_2023_September_-_3.jpg';

  function language(){const l=(document.documentElement.lang||'en').toLowerCase();return l.startsWith('nb')||l.startsWith('no')?'no':l.startsWith('de')?'de':'en'}

  function apply(){
    const explore=document.querySelector('#explore');
    if(!explore)return false;
    const l=language(),c=COPY[l];
    if(explore.dataset.auroraStable===l)return true;

    const hero=document.querySelector('#heroLead');if(hero)hero.textContent=c.hero;
    const highlights=[...document.querySelectorAll('#highlightGrid .highlight-card')];
    if(highlights.length>=3){
      const card=highlights[2];
      const title=card.querySelector('strong');
      const desc=[...card.querySelectorAll('span')].find(x=>!x.classList.contains('highlight-no'));
      if(title)title.textContent=c.highlightTitle;if(desc)desc.textContent=c.highlightText;
    }

    explore.querySelector('.aurora-static')?.remove();
    const grid=explore.querySelector('.feature-grid');
    if(grid){
      const article=document.createElement('article');article.className='feature-place aurora-static';
      article.innerHTML=`<img loading="lazy" src="${IMAGE}" alt="${c.title}"><div class="feature-copy"><h3>${c.title}</h3><p>${c.text}</p><div class="photo-credit"><a href="${SOURCE}" target="_blank" rel="noopener">${c.credit}</a></div></div>`;
      grid.prepend(article);
    }

    [...explore.querySelectorAll('details.place')].forEach(d=>{
      const s=(d.querySelector('summary')?.textContent||'').toLowerCase();
      if(s.includes('northern lights')||s.includes('nordlys')||s.includes('nordlicht'))d.remove();
    });
    explore.dataset.auroraStable=l;
    return true;
  }

  function waitForGuide(){let tries=0;const timer=setInterval(()=>{tries++;if(apply()||tries>=40)clearInterval(timer)},125)}
  waitForGuide();
  document.querySelectorAll('.lang-switch button').forEach(btn=>btn.addEventListener('click',()=>setTimeout(waitForGuide,25)));
})();
