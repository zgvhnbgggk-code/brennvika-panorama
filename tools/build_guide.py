"""Build static EN/NO/DE pages from the existing cabin instructions.
Run from the repository root: python tools/build_guide.py
Requires beautifulsoup4. No network access or runtime site dependencies.
"""
from pathlib import Path
from bs4 import BeautifulSoup
import html, json, re
ROOT=Path(__file__).resolve().parents[1]
DATA={
'en':{
 'language':'en','guide':'Your guide to Brennvika','skip':'Skip to the guide','menu':'All sections','help':'Contact us','explore':'Explore','practical':'Your stay','arrival':'Arrival','water':'Drinking water','wifi':'Wi-Fi','checkout':'Checkout',
 'title':'Closer to the sea.<br>Further from everyday.',
 'lead':'Welcome to Brennvika Panorama. A place for slow mornings, salt air and the kind of views you keep thinking about long after you leave.',
 'kicker':'Brennvika · Hamarøy · Northern Norway','herocta':'Start dreaming','secondcta':'Plan your arrival','credit':'Summer by the coast · A photograph from our own collection',
 'introtitle':'Leave a little room<br>for the unexpected.', 'intro':'Coffee with a view. A detour to a lighthouse. A fishing trip that becomes the story of your holiday. There is no need to fill every hour — some of the best moments here are the ones you never planned.',
 'pills':['Coast & quiet','Days at sea','Art & little detours','Light that changes everything'],
 'exploretitle':'Find your kind<br>of Hamarøy.', 'exploreintro':'A few favourite ways to spend your time. Follow your curiosity, the weather and your own pace.',
 'aurorakicker':'When the sky puts on a show', 'auroratitle':'Stay a little longer.<br>Look up.', 'auroratext':'On clear, dark evenings, step outside and give your eyes a little time. The northern lights are never a promise — but waiting beneath a wide northern sky can be part of the experience.', 'auroratip':'Bring a warm layer, reduce nearby lights and choose a safe spot away from roads and slippery shorelines.',
 'auroracredit':'Northern lights in Bjerkvik, Nordland — not a photograph from the cabin. Simo Räsänen · CC BY-SA 4.0.',
 'tranoykicker':'A small journey along the coast','tranoytitle':'Tranøy & the lighthouse','tranoytext':'Take your time among the coastal houses, the rocks and the art. When conditions allow, the walk out towards the lighthouse is a lovely reason to stop, breathe and enjoy the view. Check opening hours before planning a meal or a visit inside.', 'tranoylink':'Plan a visit to Tranøy Fyr',
 'fishkicker':'Salt air. A little patience. A story to tell.','fishtitle':'A day on the water.<br>A memory for years.',
 'fishtext':'For some, the perfect day means watching the sea. For others, it means a fishing rod in hand and the anticipation of the next bite. These photographs are from our own fishing trips — real moments, just as they happened.',
 'fishcaption1':'One of those moments you do not forget.','fishcaption2':'Back at the quay after a fishing trip.',
 'fishalt1':'A person on a boat holding a large halibut','fishalt2':'A catch of fish laid out on a table beside the marina',
 'fishtips':[('Make it your own','A quiet moment fishing from a suitable spot on shore, or a trip out by boat. Arrange any boat, equipment or guided trip in advance.'),('Let the weather decide','Check wind, waves and the marine forecast. Wear a life jacket and warm layers; turn back while conditions are still safe.'),('Enjoy the catch responsibly','Keep only what you can use. Check current minimum sizes, protected species, closed seasons and rules for taking fish out of Norway.')],
 'fishrules':'Before you go fishing','fishrulesbody':'Use permitted tackle and respect private quays, working boats and local restrictions. Keep more than 100 metres from fish farms while fishing. Freshwater fishing has separate rules and may require a permit. Check the official rules for your trip, including any export requirements; a cabin booking is not proof of entitlement to export fish.',
 'fishlink':'Official sea-fishing rules','fishnote':'Catch and conditions vary from day to day. Photos are memories from earlier trips, not a catch guarantee.',
 'beachkicker':'Take the slower route','beachtitle':'Bare feet. Clear water.<br>A whole afternoon.', 'beachtext':'Look for a little cove, stroll along the coast or sit on a rock and do nothing at all. Bring a warm layer even on sunny days, and leave the shore as lovely as you found it.', 'beachtip':'The sea can be cold and currents can change. Supervise children closely and choose a safe place to enter the water.',
 'artkicker':'Art, out in the open','arttitle':'A different kind of<br>coastal walk.','arttext':'Let the art give your stroll through Tranøy a direction. Stop at “Tanker for to”, look at it from another angle and let the landscape become part of what you see.', 'artlink':'“Tanker for to” at DigitaltMuseum','artcredit':'Photograph shown from DigitaltMuseum. Open the source for photographer and collection details.',
 'moretitle':'Mountains, stories<br>and further horizons.','moreintro':'For a longer outing, choose an experience that fits the season and your plans. Opening times, boats and conditions should always be checked before you leave.',
 'daytitle':'An unhurried day,<br>in three small chapters.','dayintro':'An idea, not an itinerary. Swap things around, linger longer or skip the plan entirely.',
 'day':[('A slow morning','Start with breakfast and the view. There is no hurry.'),('A little adventure','Choose a coastal walk, a visit to Tranøy or a fishing trip when conditions allow.'),('An evening to keep','Return to the cabin, make something good to eat and watch the light change outside.')],
 'practicaltitle':'Settle in.<br>We have the details.', 'practicalintro':'The useful part of the guide: getting here, connecting to Wi-Fi and making the cabin feel like home. You can jump directly to anything you need.',
 'quick':[('Check-in','From 15:00','arrival'),('Checkout','By 11:00','checkout'),('Guest Wi-Fi','Brennvika','wifi'),('Drinking water','Read before using the taps','water')],
 'wifititle':'You are welcome to connect.','wifinetwork':'Network name','wifipassword':'Password','wificopy':'Copy password','copied':'Copied','copyfail':'Select and copy the text instead.','wifiscan':'Scan with another phone’s camera, or copy the password on this phone and choose the network in Wi-Fi settings.', 'wifialt':'QR code to connect to the Brennvika guest network','wifitrouble':'Trouble connecting?','wifitroubletext':'Use the details shown here and try reconnecting. If an old password is saved, forget the network and connect again. Contact us if it still does not work. Please do not reset or unplug the network equipment.',
 'video':'Watch the water-alarm reset video','videonote':'Opens on Vimeo. Reset only when the sensor and surrounding floor are completely dry.',
 'speed':'Please keep your speed at or below <strong>30 km/h</strong> on the final stretch. Watch for residents, children and pedestrians.',
 'endtitle':'We are looking forward<br>to welcoming you.','endtext':'A question before you arrive, or something you need during your stay? Get in touch with Eva or Dan.',
 'foot':'A guest guide from Skoglund Heim AS.','top':'Back to the top','photofail':'View the original photograph','source':'Photo source','contents':'Quick navigation','sources':'Photos & sources','updated':'Guide updated 10 September 2026',
 'links':[('arrival','Arrival & directions'),('door','Door code'),('wifi','Wi-Fi'),('water','Drinking water & A2G'),('heating','Heating & lighting'),('house','Kitchen, laundry & waste'),('checkout','Checkout'),('leak','Water leak protection'),('safety','Safety'),('help','Contact & emergency')]
},
'no':{
 'language':'nb','guide':'Din guide til Brennvika','skip':'Hopp til guiden','menu':'Alle temaer','help':'Kontakt oss','explore':'Opplev','practical':'Oppholdet','arrival':'Ankomst','water':'Drikkevann','wifi':'Wi-Fi','checkout':'Utsjekk',
 'title':'Nærmere havet.<br>Lenger fra hverdagen.',
 'lead':'Velkommen til Brennvika Panorama. Til langsomme morgener, salt luft og utsikter som blir med deg lenge etter at du har reist hjem.',
 'kicker':'Brennvika · Hamarøy · Nord-Norge','herocta':'Begynn å glede deg','secondcta':'Planlegg ankomsten','credit':'Sommer ved kysten · Et bilde fra vår egen samling',
 'introtitle':'Gi litt plass<br>til det uplanlagte.', 'intro':'Kaffe med utsikt. En avstikker til et fyr. En fisketur som blir historien dere forteller når dere kommer hjem. Her trenger ikke hver time fylles — noen av de fineste øyeblikkene er de dere aldri planla.',
 'pills':['Kyst & ro','Dager på sjøen','Kunst & små avstikkere','Lyset som forandrer alt'],
 'exploretitle':'Finn ditt<br>Hamarøy.', 'exploreintro':'Noen fine måter å bruke dagene på. La nysgjerrigheten, været og deres eget tempo bestemme.',
 'aurorakicker':'Når himmelen byr på noe ekstra', 'auroratitle':'Bli litt til.<br>Se opp.', 'auroratext':'På klare, mørke kvelder: gå ut og gi øynene litt tid. Nordlyset kan aldri loves — men ventingen under en stor nordnorsk himmel kan være en opplevelse i seg selv.', 'auroratip':'Ta på et varmt lag, demp lysene rundt dere og finn et trygt sted unna vei og glatte svaberg.',
 'auroracredit':'Nordlys i Bjerkvik, Nordland — bildet er ikke tatt ved hytta. Simo Räsänen · CC BY-SA 4.0.',
 'tranoykicker':'En liten tur langs kysten','tranoytitle':'Tranøy & fyret','tranoytext':'Ta dere god tid mellom husene, svabergene og kunsten. Når forholdene tillater det, er turen ut mot fyret en fin anledning til å stoppe opp og nyte utsikten. Sjekk åpningstidene før dere planlegger et måltid eller et besøk inne.', 'tranoylink':'Planlegg et besøk på Tranøy fyr',
 'fishkicker':'Salt luft. Litt tålmodighet. En historie å fortelle.','fishtitle':'En dag på sjøen.<br>Et minne for livet.',
 'fishtext':'For noen er den perfekte dagen å se på havet. For andre er det å ha fiskestangen i hånden og kjenne forventningen før neste napp. Bildene er fra våre egne fisketurer — ekte øyeblikk, akkurat slik de var.',
 'fishcaption1':'Et av øyeblikkene man ikke glemmer.','fishcaption2':'Tilbake ved kaia etter en fisketur.',
 'fishalt1':'En person om bord i en båt holder frem en stor kveite','fishalt2':'Fiskefangst lagt utover et bord ved småbåthavnen',
 'fishtips':[('Finn deres fisketur','En rolig stund med stang fra et egnet sted på land, eller en tur ut i båt. Avklar eventuell båt, utstyr eller guidet tur på forhånd.'),('La været bestemme','Sjekk vind, bølger og sjøværmeldingen. Bruk redningsvest og varme klær, og snu mens forholdene fortsatt er trygge.'),('Ta vare på fangsten','Behold bare det dere kan bruke. Sjekk gjeldende minstemål, fredninger, sesongregler og regler for å ta fisk ut av Norge.')],
 'fishrules':'Før dere drar på fisketur','fishrulesbody':'Bruk tillatt redskap og respekter private brygger, arbeidsbåter og lokale begrensninger. Hold mer enn 100 meter avstand til oppdrettsanlegg under fiske. Ferskvannsfiske har egne regler og kan kreve fiskekort. Sjekk de offisielle reglene for turen, også eventuelle krav ved utførsel av fisk. En hyttebooking er ikke dokumentasjon på rett til å utføre fisk.',
 'fishlink':'Offisielle regler for sjøfiske','fishnote':'Fangst og forhold varierer fra dag til dag. Bildene er minner fra tidligere turer, ikke en fangstgaranti.',
 'beachkicker':'Velg det rolige tempoet','beachtitle':'Bare føtter. Klart vann.<br>En hel ettermiddag.', 'beachtext':'Finn en liten vik, rusle langs kysten eller sett dere på et svaberg og gjør ingenting. Ta med et varmt lag selv på soldager, og la fjæra være like fin når dere går.', 'beachtip':'Sjøen kan være kald, og strømforholdene kan endre seg. Følg godt med på barn og velg et trygt sted å gå uti.',
 'artkicker':'Kunst under åpen himmel','arttitle':'En kysttur<br>med noe mer.','arttext':'La kunsten gi spaserturen gjennom Tranøy en retning. Stopp ved «Tanker for to», se verket fra en ny vinkel og la landskapet bli en del av opplevelsen.', 'artlink':'«Tanker for to» hos DigitaltMuseum','artcredit':'Bildet vises fra DigitaltMuseum. Åpne kilden for fotograf og samlingsopplysninger.',
 'moretitle':'Fjell, fortellinger<br>og nye horisonter.','moreintro':'For en lengre tur: velg en opplevelse som passer årstiden og planene deres. Sjekk åpningstider, båtruter og forhold før dere drar.',
 'daytitle':'En rolig dag,<br>i tre små kapitler.','dayintro':'En idé, ikke en timeplan. Bytt om, bli litt lenger eller dropp planen helt.',
 'day':[('En langsom morgen','Start med frokost og utsikt. Det er ingen hast.'),('Et lite eventyr','Velg en kysttur, et besøk på Tranøy eller en fisketur når forholdene ligger til rette.'),('En kveld å ta vare på','Kom tilbake til hytta, lag noe godt å spise og se hvordan lyset forandrer seg utenfor.')],
 'practicaltitle':'Senk skuldrene.<br>Her er det praktiske.', 'practicalintro':'Slik finner dere frem, kobler dere til nettet og finner dere til rette i hytta. Hopp rett til det dere trenger.',
 'quick':[('Innsjekk','Fra kl. 15:00','arrival'),('Utsjekk','Innen kl. 11:00','checkout'),('Gjestenett','Brennvika','wifi'),('Drikkevann','Les før dere bruker springen','water')],
 'wifititle':'Her kan dere koble dere på.','wifinetwork':'Nettverksnavn','wifipassword':'Passord','wificopy':'Kopier passord','copied':'Kopiert','copyfail':'Marker og kopier teksten i stedet.','wifiscan':'Skann med kameraet på en annen mobil, eller kopier passordet på denne mobilen og velg nettverket i Wi-Fi-innstillingene.', 'wifialt':'QR-kode for å koble til gjestenettet Brennvika','wifitrouble':'Problemer med å koble til?','wifitroubletext':'Bruk opplysningene her og prøv å koble til på nytt. Er et gammelt passord lagret, glem nettverket og koble til igjen. Kontakt oss hvis det fortsatt ikke virker. Ikke nullstill eller trekk ut nettverksutstyret.',
 'video':'Se video: slik resetter du vannalarmen','videonote':'Åpnes på Vimeo. Nullstill først når sensoren og gulvet rundt er helt tørt.',
 'speed':'Hold maks <strong>30 km/t</strong> på den siste delen av Brennvikveien. Vis hensyn til beboere, barn og gående.',
 'endtitle':'Vi gleder oss<br>til å ønske dere velkommen.','endtext':'Lurer dere på noe før ankomst, eller trenger dere hjelp underveis? Ta kontakt med Eva eller Dan.',
 'foot':'En gjesteguide fra Skoglund Heim AS.','top':'Til toppen','photofail':'Se originalbildet','source':'Bildekilde','contents':'Hurtignavigasjon','sources':'Bilder & kilder','updated':'Guiden er oppdatert 10. september 2026',
 'links':[('arrival','Ankomst og veibeskrivelse'),('door','Dørkode'),('wifi','Wi-Fi'),('water','Drikkevann og A2G'),('heating','Varme og lys'),('house','Kjøkken, vask og avfall'),('checkout','Utsjekk'),('leak','Vannlekkasjesikring'),('safety','Sikkerhet'),('help','Kontakt og nødinfo')]
},
'de':{
 'language':'de','guide':'Ihr Guide für Brennvika','skip':'Zum Guide springen','menu':'Alle Themen','help':'Kontakt','explore':'Entdecken','practical':'Ihr Aufenthalt','arrival':'Anreise','water':'Trinkwasser','wifi':'WLAN','checkout':'Check-out',
 'title':'Näher am Meer.<br>Weiter weg vom Alltag.',
 'lead':'Willkommen in Brennvika Panorama. Ein Ort für ruhige Morgen, salzige Meeresluft und Ausblicke, die noch lange nach der Heimreise in Erinnerung bleiben.',
 'kicker':'Brennvika · Hamarøy · Nordnorwegen','herocta':'Vorfreude entdecken','secondcta':'Anreise planen','credit':'Sommer an der Küste · Ein Foto aus unserer eigenen Sammlung',
 'introtitle':'Lassen Sie Raum<br>für das Ungeplante.', 'intro':'Kaffee mit Aussicht. Ein Abstecher zum Leuchtturm. Ein Angelausflug, von dem Sie zu Hause noch erzählen. Nicht jede Stunde muss verplant sein — manche der schönsten Momente entstehen ganz von selbst.',
 'pills':['Küste & Ruhe','Tage auf dem Meer','Kunst & kleine Umwege','Licht, das alles verändert'],
 'exploretitle':'Entdecken Sie<br>Ihr Hamarøy.', 'exploreintro':'Ein paar schöne Möglichkeiten für Ihre Urlaubstage. Folgen Sie Ihrer Neugier, dem Wetter und Ihrem eigenen Tempo.',
 'aurorakicker':'Wenn der Himmel etwas Besonderes zeigt', 'auroratitle':'Bleiben Sie noch.<br>Schauen Sie hinauf.', 'auroratext':'Gehen Sie an klaren, dunklen Abenden nach draußen und geben Sie Ihren Augen etwas Zeit. Nordlichter lassen sich nie versprechen — doch schon das Warten unter dem weiten nordischen Himmel kann ein Erlebnis sein.', 'auroratip':'Ziehen Sie sich warm an, reduzieren Sie Licht in der Nähe und wählen Sie einen sicheren Platz abseits von Straßen und glatten Felsen.',
 'auroracredit':'Nordlicht in Bjerkvik, Nordland — nicht an der Hütte aufgenommen. Simo Räsänen · CC BY-SA 4.0.',
 'tranoykicker':'Ein kleiner Ausflug an der Küste','tranoytitle':'Tranøy & der Leuchtturm','tranoytext':'Nehmen Sie sich Zeit zwischen den Häusern, Felsen und Kunstwerken. Wenn die Bedingungen es erlauben, ist der Weg zum Leuchtturm ein schöner Anlass, innezuhalten und die Aussicht zu genießen. Prüfen Sie die Öffnungszeiten für Restaurant und Besichtigungen.', 'tranoylink':'Besuch am Leuchtturm planen',
 'fishkicker':'Meeresluft. Etwas Geduld. Eine Geschichte.','fishtitle':'Ein Tag auf dem Meer.<br>Eine bleibende Erinnerung.',
 'fishtext':'Für manche ist ein Blick aufs Meer der perfekte Urlaubstag. Für andere gehören eine Angel in der Hand und die Vorfreude auf den nächsten Biss dazu. Diese Fotos stammen von unseren eigenen Angelausflügen — echte Momente, genau so erlebt.',
 'fishcaption1':'Einer dieser unvergesslichen Momente.','fishcaption2':'Zurück am Kai nach einem Angelausflug.',
 'fishalt1':'Eine Person hält an Bord eines Bootes einen großen Heilbutt','fishalt2':'Fische auf einem Tisch neben dem kleinen Bootshafen',
 'fishtips':[('Ihr eigener Angeltag','Ein ruhiger Moment an einem geeigneten Uferplatz oder ein Ausflug mit dem Boot. Klären Sie Boot, Ausrüstung oder eine geführte Tour im Voraus.'),('Das Wetter entscheidet','Prüfen Sie Wind, Wellen und Seewetter. Tragen Sie Rettungsweste und warme Kleidung und kehren Sie rechtzeitig um.'),('Verantwortungsvoll genießen','Behalten Sie nur, was Sie verwenden können. Beachten Sie aktuelle Mindestmaße, geschützte Arten, Schonzeiten und Ausfuhrregeln.')],
 'fishrules':'Vor dem Angelausflug','fishrulesbody':'Benutzen Sie erlaubtes Gerät und respektieren Sie private Stege, Arbeitsboote und örtliche Einschränkungen. Halten Sie beim Angeln mehr als 100 Meter Abstand zu Fischfarmen. Für Süßwasser gelten eigene Regeln; häufig ist eine Angelkarte erforderlich. Prüfen Sie die offiziellen Vorschriften einschließlich möglicher Ausfuhranforderungen. Eine Hüttenbuchung belegt keine Berechtigung zur Fischausfuhr.',
 'fishlink':'Offizielle Regeln zum Meeresangeln','fishnote':'Fang und Bedingungen wechseln täglich. Die Fotos zeigen Erinnerungen an frühere Ausflüge, keine Fanggarantie.',
 'beachkicker':'Entscheiden Sie sich für die Ruhe','beachtitle':'Barfuß. Klares Wasser.<br>Ein ganzer Nachmittag.', 'beachtext':'Entdecken Sie eine kleine Bucht, spazieren Sie an der Küste oder sitzen Sie einfach auf einem Felsen. Nehmen Sie auch an sonnigen Tagen eine warme Schicht mit und hinterlassen Sie die Küste so schön, wie Sie sie vorgefunden haben.', 'beachtip':'Das Meer kann kalt sein und Strömungen können sich ändern. Beaufsichtigen Sie Kinder gut und wählen Sie einen sicheren Zugang zum Wasser.',
 'artkicker':'Kunst unter freiem Himmel','arttitle':'Ein Küstenspaziergang<br>mit neuen Blickwinkeln.','arttext':'Lassen Sie sich auf Ihrem Spaziergang durch Tranøy von der Kunst leiten. Halten Sie bei „Tanker for to“ an, wechseln Sie die Perspektive und erleben Sie, wie die Landschaft Teil des Werks wird.', 'artlink':'„Tanker for to“ bei DigitaltMuseum','artcredit':'Foto von DigitaltMuseum eingebunden. Angaben zu Fotograf und Sammlung finden Sie in der Quelle.',
 'moretitle':'Berge, Geschichten<br>und neue Horizonte.','moreintro':'Wählen Sie für einen längeren Ausflug ein Erlebnis, das zur Jahreszeit und Ihren Plänen passt. Prüfen Sie Öffnungszeiten, Bootsverbindungen und Bedingungen vor der Abfahrt.',
 'daytitle':'Ein ruhiger Tag,<br>in drei kleinen Kapiteln.','dayintro':'Eine Idee, kein Stundenplan. Tauschen Sie etwas aus, bleiben Sie länger oder lassen Sie den Plan einfach los.',
 'day':[('Ein langsamer Morgen','Beginnen Sie mit Frühstück und Aussicht. Sie haben Zeit.'),('Ein kleines Abenteuer','Wählen Sie einen Küstenspaziergang, Tranøy oder einen Angelausflug bei passenden Bedingungen.'),('Ein Abend zum Erinnern','Kehren Sie zur Hütte zurück, kochen Sie etwas Gutes und beobachten Sie das wechselnde Licht.')],
 'practicaltitle':'Entspannen Sie sich.<br>Hier sind die Details.', 'practicalintro':'Alles Praktische: die Anreise, das WLAN und das Ankommen in der Hütte. Springen Sie direkt zum gewünschten Thema.',
 'quick':[('Check-in','Ab 15:00 Uhr','arrival'),('Check-out','Bis 11:00 Uhr','checkout'),('Gäste-WLAN','Brennvika','wifi'),('Trinkwasser','Vor der Nutzung lesen','water')],
 'wifititle':'Hier können Sie sich verbinden.','wifinetwork':'Netzwerkname','wifipassword':'Passwort','wificopy':'Passwort kopieren','copied':'Kopiert','copyfail':'Bitte den Text markieren und kopieren.','wifiscan':'Scannen Sie den Code mit der Kamera eines anderen Handys. Auf diesem Handy können Sie das Passwort kopieren und das Netzwerk in den WLAN-Einstellungen auswählen.', 'wifialt':'QR-Code für das Gäste-WLAN Brennvika','wifitrouble':'Verbindungsprobleme?','wifitroubletext':'Versuchen Sie es erneut mit den Angaben auf dieser Seite. Ist ein altes Passwort gespeichert, entfernen Sie das Netzwerk und verbinden Sie sich neu. Kontaktieren Sie uns, wenn es weiterhin nicht klappt. Netzwerkgeräte bitte nicht zurücksetzen oder vom Strom trennen.',
 'video':'Video: Wasseralarm zurücksetzen','videonote':'Öffnet auf Vimeo. Nur zurücksetzen, wenn Sensor und umgebender Boden vollständig trocken sind.',
 'speed':'Auf dem letzten Abschnitt des Brennvikveien bitte höchstens <strong>30 km/h</strong> fahren. Achten Sie auf Anwohner, Kinder und Fußgänger.',
 'endtitle':'Wir freuen uns,<br>Sie willkommen zu heißen.','endtext':'Eine Frage vor der Anreise oder Hilfe während des Aufenthalts? Melden Sie sich bei Eva oder Dan.',
 'foot':'Ein Gästeguide von Skoglund Heim AS.','top':'Nach oben','photofail':'Originalfoto ansehen','source':'Bildquelle','contents':'Schnellnavigation','sources':'Fotos & Quellen','updated':'Guide aktualisiert am 10. September 2026',
 'links':[('arrival','Anreise & Wegbeschreibung'),('door','Türcode'),('wifi','WLAN'),('water','Trinkwasser & A2G'),('heating','Heizung & Licht'),('house','Küche, Wäsche & Abfall'),('checkout','Check-out'),('leak','Leckageschutz'),('safety','Sicherheit'),('help','Kontakt & Notfall')]
}}
E=html.escape
AURORA='https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Northern_lights_curtains_and_beams_over_Nordmo_in_Bjerkvik%2C_Narvik%2C_Nordland%2C_Norway%2C_2023_September_-_3.jpg/960px-Northern_lights_curtains_and_beams_over_Nordmo_in_Bjerkvik%2C_Narvik%2C_Nordland%2C_Norway%2C_2023_September_-_3.jpg'
AURORA_SOURCE='https://commons.wikimedia.org/wiki/File:Northern_lights_curtains_and_beams_over_Nordmo_in_Bjerkvik,_Narvik,_Nordland,_Norway,_2023_September_-_3.jpg'
ART='https://ems.dimu.org/image/012uN1buK4ge?dimension=800x800'
ART_SOURCE='https://digitaltmuseum.no/021085513195/fantastisk-steinskulptur-pa-tranoy-tanker-for-to/media?slide=0'

def link(url,label,cls='text-link'):
 return f'<a class="{cls}" href="{E(url,quote=True)}" target="_blank" rel="noopener noreferrer">{label} <span aria-hidden="true">↗</span></a>'

def picture(src,alt,cls='',w=640,h=853,eager=False):
 return f'<img class="{cls}" src="{E(src,quote=True)}" alt="{E(alt,quote=True)}" width="{w}" height="{h}" loading="{"eager" if eager else "lazy"}" decoding="async"'+(' fetchpriority="high"' if eager else '')+'>'

def heading(kicker,title,intro='',id=''):
 return f'<div class="editorial-head"'+(f' id="{id}"' if id else '')+f'><div><p class="eyebrow">{kicker}</p><h2>{title}</h2></div>'+ (f'<p class="section-intro">{intro}</p>' if intro else '')+'</div>'

def build(lang,c):
 src=''.join((ROOT/f'sections/{lang}-{i}.html').read_text() for i in (1,2))
 soup=BeautifulSoup(src,'html.parser')
 original_explore=soup.select_one('#explore')
 oldcards=original_explore.select('.feature-place')
 tranoyimg=oldcards[0].img['src']
 tranoycredit=str(oldcards[0].select_one('.photo-credit'))
 for a in oldcards[1:]:
  for img in a.select('img'): img['width']='960';img['height']='540';img['decoding']='async';img['loading']='lazy'
 morecards=''.join(map(str,oldcards[1:]))
 remaining=[]
 for d in original_explore.select('details.place'):
  name=d.summary.get_text().lower()
  if any(x in name for x in ('fish','fiske','angeln','beach','strender','strände','northern lights','nordlys','nordlicht','art in tranøy','kunst på tranøy','kunst in tranøy')):continue
  if d.has_attr('open'):del d['open']
  remaining.append(str(d))
 fishphotos=f'<div class="fishing-photos"><figure>{picture("assets/photos/fishing-halibut.avif",c["fishalt1"])}<figcaption>{c["fishcaption1"]}</figcaption></figure><figure>{picture("assets/photos/fishing-catch.avif",c["fishalt2"])}<figcaption>{c["fishcaption2"]}</figcaption></figure></div>'
 fishing=f'''<article class="fishing-story" id="fishing"><div class="fishing-top"><div class="story-copy"><p class="eyebrow">{c['fishkicker']}</p><h3>{c['fishtitle']}</h3><p>{c['fishtext']}</p><a class="text-link" href="#fishing-advice">{c['fishrules']} ↓</a></div>{fishphotos}</div><div class="mini-grid">'''+''.join(f'<div><h4>{t}</h4><p>{p}</p></div>' for t,p in c['fishtips'])+f'''</div><details class="place" id="fishing-advice"><summary>{c['fishrules']}</summary><div class="detail-body"><p>{c['fishrulesbody']}</p>{link('https://www.fiskeridir.no/english/sea-angling-in-norway',c['fishlink'])}</div></details><p class="quiet-note">{c['fishnote']}</p></article>'''
 experiences=f'''<section class="experience-section section" id="explore"><div class="wrap">{heading(c['explore'],c['exploretitle'],c['exploreintro'])}<article class="aurora-story" id="northern-lights"><div class="aurora-picture photo-frame">{picture(AURORA,c['auroratitle'].replace('<br>',' '),w=960,h=640)}<span class="photo-fallback">{link(AURORA_SOURCE,c['photofail'])}</span></div><div class="story-copy"><p class="eyebrow">{c['aurorakicker']}</p><h3>{c['auroratitle']}</h3><p>{c['auroratext']}</p><p class="quiet-note">{c['auroratip']}</p><div class="photo-credit">{link(AURORA_SOURCE,c['auroracredit'])} {link('https://creativecommons.org/licenses/by-sa/4.0/','CC BY-SA 4.0')}</div></div></article>
<article class="coastal-story" id="tranoy"><div class="story-copy"><p class="eyebrow">{c['tranoykicker']}</p><h3>{c['tranoytitle']}</h3><p>{c['tranoytext']}</p>{link('https://tranoyfyr.no/',c['tranoylink'])}{tranoycredit}</div><div class="photo-frame">{picture(tranoyimg,c['tranoytitle'],w=960,h=640)}<span class="photo-fallback">{link('https://commons.wikimedia.org/wiki/File:Hamaroy_fyr,_Norge_(1).jpg',c['photofail'])}</span></div></article>
{fishing}
<div class="two-stories"><article class="image-story" id="beaches"><div class="photo-frame">{picture('assets/photos/coast-summer.avif',c['credit'],w=1000,h=786)}</div><div class="story-copy"><p class="eyebrow">{c['beachkicker']}</p><h3>{c['beachtitle']}</h3><p>{c['beachtext']}</p><p class="quiet-note">{c['beachtip']}</p></div></article><article class="image-story" id="tranoy-art"><div class="photo-frame">{picture(ART,'Tanker for to · Tranøy',w=800,h=600)}<span class="photo-fallback">{link(ART_SOURCE,c['photofail'])}</span></div><div class="story-copy"><p class="eyebrow">{c['artkicker']}</p><h3>{c['arttitle']}</h3><p>{c['arttext']}</p>{link(ART_SOURCE,c['artlink'])}<p class="photo-credit">{c['artcredit']}</p></div></article></div>
<div class="more-experiences">{heading(c['explore'],c['moretitle'],c['moreintro'])}<div class="feature-grid">{morecards}</div><div class="other-ideas">{''.join(remaining)}</div></div>
<div class="day-story">{heading(c['guide'],c['daytitle'],c['dayintro'])}<div class="day-grid">'''+''.join(f'<article><span class="day-number" aria-hidden="true">0{i+1}</span><h3>{t}</h3><p>{p}</p></article>' for i,(t,p) in enumerate(c['day']))+'</div></div></div></section>'
 # Preserve the existing technical instructions, with the actual published additions.
 sections={s['id']:s for s in soup.select('section[id]') if s['id']!='explore'}
 for s in sections.values():
  no=s.select_one('.section-no')
  if no:no.decompose()
 for li in sections['arrival'].select('.steps li')[1:2]:
  li.clear();li.append(BeautifulSoup(c['speed'],'html.parser'))
 for d in sections['leak'].select('.aqualarm-diagram'):d.decompose()
 aq=sections['leak'].select_one('.aqualarm')
 if aq:aq['class']=['aqualarm','no-diagram']
 warning=sections['leak'].select_one('.card.wide.warning')
 if warning: warning.append(BeautifulSoup(f'<div class="video-link">{link("https://vimeo.com/725950724?fl=pl&fe=cm",c["video"])}<p>{c["videonote"]}</p></div>','html.parser'))
 qr=picture('assets/wifi-qr.png',c['wifialt'],w=296,h=296)
 sections['wifi']=BeautifulSoup(f'''<section class="section" id="wifi"><div class="wrap"><div class="section-head"><h2>Wi-Fi</h2><p class="section-intro">{c['wifititle']}</p></div><div class="wifi-card"><div><div class="credential"><span>{c['wifinetwork']}</span><strong>Brennvika</strong></div><div class="credential"><span>{c['wifipassword']}</span><strong id="wifi-password">Halibut2026!</strong></div><button class="button dark copy-button" type="button" data-copy="wifi-password" data-done="{c['copied']}" data-fail="{c['copyfail']}">{c['wificopy']}</button><p class="copy-status" role="status" aria-live="polite"></p></div><figure>{qr}<figcaption>{c['wifiscan']}</figcaption></figure></div><details class="place wifi-trouble"><summary>{c['wifitrouble']}</summary><div class="detail-body"><p>{c['wifitroubletext']}</p></div></details></div></section>''','html.parser').section
 practical=''.join(str(sections[i]) for i in ['arrival','door','wifi','water','heating','house','checkout','leak','safety','help'])
 menu=''.join(f'<a href="#{i}">{t}</a>' for i,t in c['links'])
 nav=''.join(f'<a href="#{i}">{c[key]}</a>' for i,key in [('explore','explore'),('practical','practical'),('arrival','arrival'),('wifi','wifi'),('water','water'),('help','help')])
 languages=''.join(f'<a href="{file}" lang="{lc}" hreflang="{lc}" data-language="{l}"'+(' aria-current="page"' if l==lang else '')+f'>{label}</a>' for l,lc,file,label in [('en','en','index.html','EN'),('no','nb','no.html','NO'),('de','de','de.html','DE')])
 quick=''.join(f'<a class="quick-item" href="#{i}"><small>{t}</small><strong>{v}</strong><span aria-hidden="true">↗</span></a>' for t,v,i in c['quick'])
 doc=f'''<!doctype html><html lang="{c['language']}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#f6f2e9"><meta name="description" content="{E(c['lead'],quote=True)}"><meta name="robots" content="noindex,follow"><title>Brennvika Panorama · {c['guide']}</title><link rel="stylesheet" href="guide-v3.css"><link rel="preload" as="image" href="assets/photos/coast-summer.avif"><link rel="alternate" hreflang="en" href="index.html"><link rel="alternate" hreflang="nb" href="no.html"><link rel="alternate" hreflang="de" href="de.html"><script src="guide-v3.js" defer></script></head><body><a class="skip-link" href="#main">{c['skip']}</a>
<header class="site-header"><div class="wrap header-row"><a class="wordmark" href="#welcome" aria-label="Brennvika Panorama"><span>Brennvika<span class="brand-dot">.</span></span><small>PANORAMA · HAMARØY</small></a><div class="header-actions"><nav class="lang-switch" aria-label="Language">{languages}</nav><details class="guide-menu"><summary>{c['menu']}</summary><nav aria-label="{c['contents']}">{menu}</nav></details></div></div><nav class="quick-nav wrap" aria-label="{c['contents']}">{nav}</nav></header>
<main id="main"><section class="hero" id="welcome">{picture('assets/photos/coast-summer.avif','',cls='hero-photo',w=1000,h=786,eager=True)}<div class="hero-shade"></div><div class="hero-inner"><p class="eyebrow">{c['kicker']}</p><h1>{c['title']}</h1><p class="hero-lead">{c['lead']}</p><div class="hero-actions"><a class="button light" href="#explore">{c['herocta']} <span aria-hidden="true">↗</span></a><a class="button outline" href="#arrival">{c['secondcta']}</a></div></div><p class="hero-credit">{c['credit']}</p></section>
<section class="intro-section"><div class="wrap">{heading(c['guide'],c['introtitle'],c['intro'])}<div class="experience-pills">'''+''.join(f'<span>{p}</span>' for p in c['pills'])+f'''</div><div class="quick-grid">{quick}</div></div></section>
{experiences}<section class="practical-intro section" id="practical"><div class="wrap">{heading(c['practical'],c['practicaltitle'],c['practicalintro'])}<nav class="topic-grid" aria-label="{c['contents']}">{menu}</nav></div></section>{practical}
<section class="closing-section"><div class="wrap"><p class="eyebrow">Brennvika Panorama</p><h2>{c['endtitle']}</h2><p>{c['endtext']}</p><a class="button dark" href="#help">{c['help']} ↗</a></div></section></main><footer class="footer"><div class="wrap footer-grid"><div><img src="assets/logo.webp" alt="Skoglund Heim AS" width="360" height="120" loading="lazy"><h3>Brennvika Panorama</h3><p>Brennvikveien 37 · 8294 Hamarøy · Norway</p><p>{c['foot']}</p></div><div><p>{c['updated']}</p><a href="#welcome">{c['top']} ↑</a><p><a href="#help">{c['help']}</a> · <a href="#safety">110 / 112 / 113</a></p></div></div></footer></body></html>'''
 # HTML whitespace only, never minify content or touch instructions.
 doc=re.sub(r'>\s+<','><',doc)
 out=ROOT/({'en':'index.html','no':'no.html','de':'de.html'}[lang]);out.write_text(doc)
 return out
if __name__=='__main__':
 for l,c in DATA.items():
  p=build(l,c);print(p.name,len(p.read_bytes()))
