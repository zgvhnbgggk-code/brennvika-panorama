(() => {
  const TEXT = {
    en: {
      speed: 'Keep your speed at or below <strong>30 km/h</strong> on the final stretch. The road is also used by residents, children, pedestrians and local traffic.',
      videoTitle: 'Resetting the water alarm',
      videoText: 'If the sensor and floor are completely dry, use the video below together with the written steps: briefly press <strong>OFF</strong>, then briefly press <strong>RESET/ON</strong>.',
      videoLink: 'Open the video on Vimeo ↗'
    },
    no: {
      speed: 'Hold maks <strong>30 km/t</strong> på den siste delen av Brennvikveien. Veien brukes også av beboere, barn, gående og lokal trafikk.',
      videoTitle: 'Slik resetter du vannalarmen',
      videoText: 'Når sensor og gulv er helt tørre, bruk videoen under sammen med trinnene over: trykk kort på <strong>OFF</strong>, deretter kort på <strong>RESET/ON</strong>.',
      videoLink: 'Åpne videoen på Vimeo ↗'
    },
    de: {
      speed: 'Auf dem letzten Abschnitt des Brennvikveien bitte höchstens <strong>30 km/h</strong> fahren. Die Straße wird auch von Anwohnern, Kindern, Fußgängern und lokalem Verkehr genutzt.',
      videoTitle: 'Wasseralarm zurücksetzen',
      videoText: 'Wenn Sensor und Boden vollständig trocken sind, nutzen Sie das Video zusammen mit den Schritten oben: kurz <strong>OFF</strong> drücken, danach kurz <strong>RESET/ON</strong>.',
      videoLink: 'Video auf Vimeo öffnen ↗'
    }
  };

  function lang(){
    const l=(document.documentElement.lang||'en').toLowerCase();
    return l.startsWith('nb')||l.startsWith('no') ? 'no' : l.startsWith('de') ? 'de' : 'en';
  }

  function patchArrival(){
    const section=document.querySelector('#arrival');
    if(!section) return;
    const lists=[...section.querySelectorAll('.card ol.steps')];
    if(!lists.length) return;
    const driveList=lists[0];
    const items=driveList.querySelectorAll('li');
    if(items.length>1) items[1].innerHTML=TEXT[lang()].speed;
  }

  function patchLeak(){
    const section=document.querySelector('#leak');
    if(!section) return;
    const c=TEXT[lang()];
    const oldDiagram=section.querySelector('.aqualarm-diagram');
    if(oldDiagram) oldDiagram.remove();
    const aqualarm=section.querySelector('.aqualarm');
    if(aqualarm) aqualarm.style.gridTemplateColumns='1fr';
    let block=section.querySelector('.aqualarm-video-block');
    if(!block){
      block=document.createElement('div');
      block.className='aqualarm-video-block';
      const warning=section.querySelector('.card.wide.warning');
      if(warning) warning.appendChild(block);
    }
    block.innerHTML=`
      <div class="video-copy"><h3>${c.videoTitle}</h3><p>${c.videoText}</p></div>
      <div class="video-frame"><iframe src="https://player.vimeo.com/video/725950724" title="${c.videoTitle}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
      <a class="manual-link" href="https://vimeo.com/725950724" target="_blank" rel="noopener">${c.videoLink}</a>`;
  }

  function apply(){ patchArrival(); patchLeak(); }

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

  const content=document.querySelector('#content');
  if(content){
    const observer=new MutationObserver(()=>requestAnimationFrame(apply));
    observer.observe(content,{childList:true,subtree:true});
  }
  apply();
})();
