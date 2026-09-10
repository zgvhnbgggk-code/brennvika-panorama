(() => {
  const COPY = {
    en: {
      speed: 'Keep your speed at or below <strong>30 km/h</strong> on the final stretch. The road is also used by residents, children, pedestrians and local traffic.',
      title: 'How to reset the water alarm',
      text: 'When the sensor and surrounding floor are completely dry: briefly press <strong>OFF</strong>, then briefly press <strong>RESET/ON</strong>. The video below shows the reset procedure.',
      link: 'Open video on Vimeo ↗'
    },
    no: {
      speed: 'Hold maks <strong>30 km/t</strong> på den siste delen av Brennvikveien. Veien brukes også av beboere, barn, gående og lokal trafikk.',
      title: 'Slik resetter du vannalarmen',
      text: 'Når sensoren og gulvet rundt er helt tørt: trykk kort på <strong>OFF</strong>, deretter kort på <strong>RESET/ON</strong>. Videoen under viser hvordan dette gjøres.',
      link: 'Åpne videoen på Vimeo ↗'
    },
    de: {
      speed: 'Auf dem letzten Abschnitt des Brennvikveien bitte höchstens <strong>30 km/h</strong> fahren. Die Straße wird auch von Anwohnern, Kindern, Fußgängern und lokalem Verkehr genutzt.',
      title: 'So setzen Sie den Wasseralarm zurück',
      text: 'Wenn Sensor und Boden vollständig trocken sind: kurz <strong>OFF</strong> drücken, danach kurz <strong>RESET/ON</strong>. Das Video unten zeigt den Ablauf.',
      link: 'Video auf Vimeo öffnen ↗'
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
      <div class="video-frame">
        <iframe src="https://player.vimeo.com/video/725950724?dnt=1" title="${c.title}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
      </div>
      <a class="manual-link" href="https://vimeo.com/725950724" target="_blank" rel="noopener">${c.link}</a>`;
    return true;
  }

  const style=document.createElement('style');
  style.textContent=`
    .aqualarm-video-block{margin-top:22px;padding-top:22px;border-top:1px solid rgba(14,43,53,.14)}
    .aqualarm-video-block .video-copy{max-width:760px;margin-bottom:14px}
    .aqualarm-video-block .video-copy p{margin:0;color:var(--muted)}
    .video-frame{position:relative;width:100%;aspect-ratio:16/9;border-radius:20px;overflow:hidden;background:#0c2630;box-shadow:0 12px 34px rgba(12,37,46,.12)}
    .video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
    @media(max-width:720px){.video-frame{border-radius:16px}.aqualarm-video-block{margin-top:18px;padding-top:18px}}
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
