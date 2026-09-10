(() => {
  const copy = {
    en: {
      intro: 'Heating is provided by the heat pump and underfloor heating. The cabin normally controls the temperature automatically during the day and night.',
      pumpTitle: 'Heat pump',
      pump: 'During the day, use the <strong>heat-pump remote control</strong> in the living room/kitchen if you want to make it warmer or cooler.',
      floorTitle: 'Underfloor heating',
      floor: 'During the day, use the <strong>wall thermostat in each room</strong> if you want to adjust the floor heating.',
      slow: 'Underfloor heating responds slowly, so allow some time for changes to take effect.',
      checkoutTitle: 'At checkout',
      checkout: 'Please leave the heat pump and underfloor heating switched on. The cabin adjusts the heating automatically after departure.',
      lightTitle: 'Lighting · Plejd wall panels',
      on: 'Press upper part', onSub: 'Light on', off: 'Press lower part', offSub: 'Light off', dim: 'Press and hold', dimSub: 'Dim or brighten'
    },
    no: {
      intro: 'Oppvarmingen skjer med varmepumpe og gulvvarme. Hytta styrer temperaturen automatisk gjennom dag og natt.',
      pumpTitle: 'Varmepumpe',
      pump: 'På dagtid kan dere bruke <strong>fjernkontrollen til varmepumpen</strong> i stue/kjøkken dersom dere ønsker det varmere eller kjøligere.',
      floorTitle: 'Gulvvarme',
      floor: 'På dagtid kan dere bruke <strong>veggtermostaten i det enkelte rommet</strong> dersom dere ønsker å justere gulvvarmen.',
      slow: 'Gulvvarme reagerer tregt, så gi temperaturendringer litt tid.',
      checkoutTitle: 'Ved utsjekk',
      checkout: 'La varmepumpe og gulvvarme stå på. Hytta justerer varmen automatisk etter avreise.',
      lightTitle: 'Lys · Plejd veggpanel',
      on: 'Trykk øverst', onSub: 'Lyset på', off: 'Trykk nederst', offSub: 'Lyset av', dim: 'Hold inne', dimSub: 'Dim opp eller ned'
    },
    de: {
      intro: 'Die Hütte wird mit Wärmepumpe und Fußbodenheizung beheizt. Die Temperatur wird tagsüber und nachts normalerweise automatisch geregelt.',
      pumpTitle: 'Wärmepumpe',
      pump: 'Tagsüber können Sie mit der <strong>Fernbedienung der Wärmepumpe</strong> im Wohn-/Küchenbereich die Temperatur nach Wunsch anpassen.',
      floorTitle: 'Fußbodenheizung',
      floor: 'Tagsüber können Sie die Fußbodenheizung mit dem <strong>Wandthermostat im jeweiligen Raum</strong> nach Wunsch anpassen.',
      slow: 'Fußbodenheizung reagiert langsam; Temperaturänderungen brauchen etwas Zeit.',
      checkoutTitle: 'Beim Check-out',
      checkout: 'Wärmepumpe und Fußbodenheizung bitte eingeschaltet lassen. Die Hütte passt die Heizung nach der Abreise automatisch an.',
      lightTitle: 'Licht · Plejd-Wandtaster',
      on: 'Oben drücken', onSub: 'Licht an', off: 'Unten drücken', offSub: 'Licht aus', dim: 'Gedrückt halten', dimSub: 'Dimmen'
    }
  };

  function currentLang() {
    const l = document.documentElement.lang || 'en';
    return l.startsWith('nb') || l.startsWith('no') ? 'no' : l.startsWith('de') ? 'de' : 'en';
  }

  function patchHeating() {
    const section = document.querySelector('#heating');
    if (!section) return;
    const lang = currentLang();
    if (section.dataset.simpleHeating === lang) return;
    const c = copy[lang];
    section.innerHTML = `<div class="wrap">
      <div class="section-head"><div><div class="section-no">06 · ${lang === 'no' ? 'Komfort' : lang === 'de' ? 'Komfort' : 'Comfort'}</div><h2>${lang === 'no' ? 'Varme og lys' : lang === 'de' ? 'Heizung &amp; Licht' : 'Heating &amp; lighting'}</h2></div><p class="section-intro">${c.intro}</p></div>
      <div class="grid">
        <div class="card"><h3>${c.pumpTitle}</h3><p>${c.pump}</p></div>
        <div class="card"><h3>${c.floorTitle}</h3><p>${c.floor}</p><p class="note">${c.slow}</p></div>
        <div class="card warning"><h3>${c.checkoutTitle}</h3><p>${c.checkout}</p></div>
        <div class="card wide"><h3>${c.lightTitle}</h3><div class="lighting-demo"><div><strong>${c.on}</strong><span>${c.onSub}</span></div><div><strong>${c.off}</strong><span>${c.offSub}</span></div><div><strong>${c.dim}</strong><span>${c.dimSub}</span></div></div></div>
      </div>
    </div>`;
    section.dataset.simpleHeating = lang;
  }

  const style = document.createElement('style');
  style.textContent = '.card.dark .address-box,.card.dark .address-box span{color:var(--ink)!important}.card.dark .address-box .map-btn{color:#fff}.footer img,.brand img{background:transparent!important}';
  document.head.appendChild(style);

  const content = document.querySelector('#content');
  if (content) {
    const observer = new MutationObserver(patchHeating);
    observer.observe(content, {childList:true, subtree:true});
  }
  patchHeating();
})();