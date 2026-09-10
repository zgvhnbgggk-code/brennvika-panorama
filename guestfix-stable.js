(() => {
  const COPY = {
    en: {
      speed: 'Keep your speed at or below <strong>30 km/h</strong> on the final stretch. The road is also used by residents, children, pedestrians and local traffic.',
      title: 'How to reset the water alarm',
      text: 'When the sensor and surrounding floor are completely dry: briefly press <strong>OFF</strong>, then briefly press <strong>RESET/ON</strong>.',
      watch: 'Watch the reset video',
      note: 'The video opens on Vimeo.'
    },
    no: {
      speed: 'Hold maks <strong>30 km/t</strong> på den siste delen av Brennvikveien. Veien brukes også av beboere, barn, gående og lokal trafikk.',
      title: 'Slik resetter du vannalarmen',
      text: 'Når sensoren og gulvet rundt er helt tørt: trykk kort på <strong>OFF</strong>, deretter kort på <strong>RESET/ON</strong>.',
      watch: 'Se video: slik resetter du vannalarmen',
      note: 'Videoen åpnes på Vimeo.'
    },
    de: {
      speed: 'Auf dem letzten Abschnitt des Brennvikveien bitte höchstens <strong>30 km/h</strong> fahren. Die Straße wird auch von Anwohnern, Kindern, Fußgängern und lokalem Verkehr genutzt.',
      title: 'So setzen Sie den Wasseralarm zurück',
      text: 'Wenn Sensor und Boden vollständig trocken sind: kurz <strong>OFF</strong> drücken, danach kurz <strong>RESET/ON</strong>.',
      watch: 'Video zum Zurücksetzen ansehen',
      note: 'Das Video wird auf Vimeo geöffnet.'
    }
  };

  function language(){
    const l=(document.documentElement.lang||'en').toLowerCase();
    return l.startsWith('nb')||l.startsWith('no') ? 'no' : l.startsWith('de') ? 'de' : 'en';
  }

  function apply(){
    const arrival=document.querySelector('#arrival');
    const leak=document.querySelector('#leak');
    if(!arrival || !leak) return false;
    const c=COPY[language()];

    const driveList=arrival.querySelector('.card ol.steps');
    if(driveList && driveList.children.length>1){
      driveList.children[1].innerHTML=c.speed;
    }

    const diagram=leak.querySelector('.aqualarm-diagram');
    if(diagram) diagram.remove();
    const aq=leak.querySelector('.aqualarm');
    if(aq) aq.style.gridTemplateColumns='1fr';

    let block=leak.querySelector('.aqualarm-video-block');
    if(!block){
      block=document.createElement('div');
      block.className='aqualarm-video-block';
      const warning=leak.querySelector('.card.wide.warning');
      if(warning) warning.appendChild(block);
    }
    block.innerHTML=`
      <div class="video-copy"><h3>${c.title}</h3><p>${c.text}</p></div>
      <a class="vimeo-watch-card" href="https://vimeo.com/725950724?fl=pl&fe=cm" target="_blank" rel="noopener">
        <span class="vimeo-play" aria-hidden="true">▶</span>
        <span class="vimeo-watch-copy"><strong>${c.watch}</strong><small>${c.note}</small></span>
        <span class="vimeo-arrow" aria-hidden="true">↗</span>
      </a>`;
    return true;
  }

  const style=document.createElement('style');
  style.textContent=`
    .aqualarm-video-block{margin-top:22px;padding-top:22px;border-top:1px solid rgba(14,43,53,.14)}
    .aqualarm-video-block .video-copy{max-width:760px;margin-bottom:14px}
    .aqualarm-video-block .video-copy p{margin:0;color:var(--muted)}
    .vimeo-watch-card{display:flex;align-items:center;gap:15px;width:100%;box-sizing:border-box;padding:18px 20px;border-radius:20px;background:linear-gradient(135deg,#0c2630,#164757);color:#fff;text-decoration:none;box-shadow:0 12px 34px rgba(12,37,46,.12);transition:transform .16s ease,box-shadow .16s ease}
    .vimeo-watch-card:hover{transform:translateY(-1px);box-shadow:0 16px 38px rgba(12,37,46,.16)}
    .vimeo-play{display:grid;place-items:center;flex:0 0 48px;width:48px;height:48px;border-radius:50%;background:#fff;color:#123844;font-size:18px;padding-left:3px;box-sizing:border-box}
    .vimeo-watch-copy{display:flex;flex-direction:column;gap:3px;min-width:0}.vimeo-watch-copy strong{font-size:16px}.vimeo-watch-copy small{font-size:12px;color:rgba(255,255,255,.72)}
    .vimeo-arrow{margin-left:auto;font-size:20px;opacity:.85}
    @media(max-width:720px){.aqualarm-video-block{margin-top:18px;padding-top:18px}.vimeo-watch-card{border-radius:16px;padding:16px}.vimeo-play{width:42px;height:42px;flex-basis:42px}}
  `;
  document.head.appendChild(style);

  function waitForGuide(){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(apply() || tries>=50) clearInterval(timer);
    },100);
  }

  waitForGuide();
  document.querySelectorAll('.lang-switch button').forEach(btn=>btn.addEventListener('click',()=>setTimeout(waitForGuide,30)));
})();
