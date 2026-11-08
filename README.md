# Glød – nettside

En statisk nettside for Glød: ren HTML, CSS og JavaScript. Ingen rammeverk, ingen byggesteg, ingen sporing og ingen informasjonskapsler.

## Slik åpner du siden

Dobbeltklikk på `index.html`. Siden åpner seg i nettleseren, og alt virker uten internett.

Den kan publiseres som den er hos en hvilken som helst statisk vert (for eksempel Netlify, Vercel, Cloudflare Pages eller GitHub Pages). Last opp hele mappen `glod-nettside/`.

## Filer

```
index.html          forsiden
personvern.html     UTKAST til personvernerklæring (må gjennomgås)
vilkar.html         «Kommer», for deg å fylle ut (noindex inntil videre)
css/style.css       all styling
js/main.js          meny, animasjoner, galleri og skjema
assets/             logo (lys/mørk), symbol, favicon, apple-touch-icon, OG-bilde, font
sitemap.xml         robots.txt
eksempler/          fire eksempelsider for fiktive firmaer (se under)
```

## Plassholdere som må fylles ut

Søk etter `[` i filene. Alle står synlig på siden med stiplet understrek, så de er lette å finne.

| Plassholder | Hvor |
|---|---|
| `[NAVN 1]`, `[NAVN 2]` | index.html (Om oss, også i alt-tekst på bildeplassene) |
| `[KORT OM NAVN 1]`, `[KORT OM NAVN 2]` | index.html (Om oss) |
| `[ORGANISASJONSFORM]`, `[ORGNR]` | bunnen på alle sider, personvern.html |
| `[E-POST]` | kontaktseksjonen, bunnen, skjemaets `data-epost`, personvern.html, vilkar.html |
| `[TELEFON]` | kontaktseksjonen (også i `tel:`-lenken), bunnen, personvern.html |
| `[ANTALL]` | pakken Enkel (antall sider) |
| `[LEVERINGSTID]` | spørsmål: Hvor lang tid tar det? |
| `[FYLL INN FOR SIDEN]` | spørsmål: Hvem eier siden og domenet? |
| `[FYLL INN]` (2 stk.) | spørsmål: Hva om jeg vil si opp? / Kan jeg endre selv? |
| `[TIMEPRIS]` | spørsmål: Hva koster endringer utenom pakken? |
| `[SKJEMA-URL]` | `action` på kontaktskjemaet (se under) |
| `[DOMENE]` | canonical, Open Graph, sitemap.xml, robots.txt (alle tre sider) |
| `[SKJEMATJENESTE]`, `[E-POSTLEVERANDØR]`, `[ANTALL MÅNEDER]`, `[DATO]`, overføringsgrunnlag | personvern.html |
| `[VILKÅR – FYLL INN]` | vilkar.html |

Bilder av dere: bytt `div.person__photo` i Om oss med et `<img>` (eksempel står i en kommentar i koden).

## Koble kontaktskjemaet til en skjematjeneste

Siden har ingen backend. Slik virker skjemaet nå:

- Så lenge `action="[SKJEMA-URL]"` ikke er byttet ut, er skjemaet ikke aktivert og viser en feilmelding.
- Når en skjematjeneste er konfigurert med en ekte `https://`-adresse, sender skjemaet med `fetch`. Feiler sendingen, vises en feilmelding.

Slik kobler du til, for eksempel med Formspree (Basin, Getform og liknende virker på samme måte):

1. Lag en konto og et nytt skjema hos tjenesten. Du får en adresse som `https://formspree.io/f/abcdwxyz`.
2. Åpne `index.html` og bytt `action="[SKJEMA-URL]"` med den adressen.
3. Send en testmelding fra siden og sjekk at den kommer fram.
4. Skriv tjenestens navn i personvern.html (`[SKJEMATJENESTE]`), og sjekk hvor den lagrer data (helst EU/EØS) og at dere har databehandleravtale.

Bruker dere Netlify, kan du i stedet legge `data-netlify="true"` på `<form>` og sette `action` til en takkeside.

Feltet `nettsted` er en skjult felle for spam-roboter. Er det fylt ut, sendes ingenting.

## Eksempelsidene

Fire komplette eksempelsider for fiktive firmaer, i mappen `eksempler/`. Hver side har sitt eget utseende og minst én ting man kan prøve selv. Ingenting sendes noe sted: skjemaer og bestillinger viser bare en vennlig bekreftelse som sier at det er et eksempel.

| Fil | Firma (fiktivt) | Stil | Det man kan prøve |
|---|---|---|---|
| `bakeri.html` | Morgengry Bakeri | Morgenlys: krem, sjokoladebrun, fet serif og skrivemaskin | **Fra ovnen i dag**: tidslinje som følger klokka og viser hva som nettopp kom ut og hva som kommer om hvor lenge. **Dagens utvalg** med filtre, **kurv** som ser ut som en kvittering, og forhåndsbestilling med hentetid. Viser «Åpent nå» eller «Stengt» ut fra klokka. |
| `blomster.html` | Kvist & Kløver | Redaksjonell: papirfarge, dyp grønn, kursiv Didot-serif | **Bukettbygger**: velg blomster, farger, papir og hilsen. Buketten tegnes opp mens du velger, og du får en eksempelpris. **Årshjul**: trykk på en måned og se hva som er i sesong (åpner på denne måneden). |
| `snekker.html` | Nordvegg Snekkerservice | Byggetegning: kullsvart, treverk, signaloransje, store versaler | **Før/etter-felt** med dra-bryter (også piltaster). **Terrassekalkulator**: skyvere for størrelse og rekkverk, valg av materiale, trapp og riving. Tegner terrassen ovenfra og gir et eksempelanslag. «Få et ekte tilbud» fyller ut skjemaet med valgene. |
| `fysio.html` | Rolig Fysio | Ro og luft: lys grønnhvit, blågrønn, lette store overskrifter | **Kroppskart**: trykk der det gjør vondt, og få forslag til time. **Timebestiller**: behandling, dag (de neste ti hverdagene), ledig tid og navn, med oppsummering. **Pusteøvelse**: en sirkel som puster med deg. |

Alle sidene har `noindex, nofollow`, et tydelig EKSEMPEL-merke øverst og nederst, og teksten «Eksempelside laget av Glød for et fiktivt firma». Telefonnummer er 000 00 000 og adressene er «Eksempelveien». Ring- og kartknapper viser en forklaring i stedet for å ringe. Alle priser er merket som eksempelpriser. Personene som nevnes (Ingrid, Ola og Marte, Sara, Jonas) er merket som fiktive. Ingen sider har omtaler eller sitater fra kunder.

### Slik åpner du dem

- Dobbeltklikk på en fil i `eksempler/`, for eksempel `eksempler/bakeri.html`. Mappen `eksempler/felles/` må ligge ved siden av.
- Fra forsiden: under «Eksempler» viser hvert kort en levende, nedskalert utgave av siden. Trykk på kortet eller «Åpne siden» for å åpne den i ny fane. «Åpne som mobil» viser siden i en telefonramme over forsiden, med lukkeknapp (Esc lukker også).
- Når nettsiden er publisert, kan dere sende lenker som `https://[DOMENE]/eksempler/bakeri.html` på SMS.

### Felles kode (til senere sider for ekte firmaer)

- `eksempler/felles/felles.css`: nullstilling, EKSEMPEL-linjen, bekreftelsesdialog, innglidning ved scrolling og redusert bevegelse. Sidene styrer farger og font med variabler (`--side-bg`, `--side-ink`, `--side-focus`, `--side-font`, `--dlg-*`).
- `eksempler/felles/felles.js`: `Eks.reveal()` (innglidning), `Eks.meny()` (mobilmeny), `Eks.bekreft()` (bekreftelse), `Eks.skjema()` (enkel skjemasjekk), `Eks.kr()` (kroneformat) og `Eks.demoKnapper()`.
- Resten av designet ligger i `<style>` og `<script>` øverst og nederst i hver side, med vilje: hver side skal se ut som sin egen. For et ekte firma kan dere kopiere den siden som ligner mest, bytte tekst og farger i `:root`, og fjerne EKSEMPEL-linjen og `noindex`.

### Valg jeg tok for eksemplene

- **Fire sider, ikke seks.** Du ba om heller fire gode enn seks middels. Jeg valgte bakeriet som den fjerde, siden det allerede vises øverst på forsiden.
- **Felles filer i stedet for helt selvstendige filer.** Hver side virker ved dobbeltklikk så lenge `felles/` ligger i samme mappe. Det gjør det lettere å lage nye sider senere. Ulempen: sender du bare én .html-fil som vedlegg, mangler den felles stilen. Send lenker, ikke filer.
- **Bare systemfonter.** Ingen nedlastede fonter. Sidene bruker fonter som finnes på iPhone og Mac (Didot, Futura, Avenir Next, Hoefler Text, American Typewriter). På Windows og Android faller de tilbake til lignende fonter (Georgia, Century Gothic, Segoe UI, Courier). Sidene vil derfor se litt ulike ut på ulike telefoner.
- **Forhåndsvisningene på forsiden er ekte sider i en iframe**, skalert ned. På mobil vises mobilversjonen av siden, på større skjermer desktopversjonen. Det betyr at forsiden laster fire ekstra sider (med `loading="lazy"`, så de lastes først når man nærmer seg galleriet).
- **Mobil først på de interaktive delene.** På mobil blir buketten og terrassetegningen stående øverst mens du justerer, så du ser at noe skjer. Bakeriet får en kurvlinje nederst på skjermen når kurven ikke er tom.
- **Bakeplan og ledige timer** regnes ut fra dagens dato og klokkeslett, men er oppdiktet. Ledige timer hos fysio er «tilfeldige», men alltid like for samme dato.

### Tre ting du bør sjekke selv

1. **Åpne hver side på din egen iPhone** (og gjerne en Android) og prøv det interaktive: bygg en bukett, dra i før/etter-feltet, bestill en fysiotime og legg noe i bakerikurven. Kjenn etter om det føles raskt og naturlig med tommelen.
2. **Les tekstene høyt.** Høres de ut som et ekte lite norsk firma? Jeg har skrevet alt selv, og noen formuleringer bør nok justeres til slik dere og broren din snakker.
3. **Test «Åpne som mobil» på forsiden på en PC**, og sjekk at forhåndsvisningene i galleriet ser skarpe ut. Sjekk også bakeri-siden på ulike tider av døgnet (morgen, ettermiddag, kveld, søndag). Teksten endrer seg etter klokka.

## Valg jeg har tatt

- **Font:** Plus Jakarta Sans ligger lokalt i `assets/fonts/` (SIL Open Font License, lisensen ligger ved siden av). Jeg bruker **ikke** Google Fonts, så ingen data sendes til Google, og fonten virker også uten nett. Faller tilbake til systemfont.
- **Rosa knapper:** Knappene bruker en litt dypere rosa (`#C22F87`) enn merkefargen `#D83995`. Med hvit tekst på `#D83995` er kontrasten bare ca. 4,2:1, under kravet på 4,5:1. Den rene merkefargen brukes til glød, prikker og detaljer.
- **Blå tekst:** På lys bakgrunn brukes `#02709A` til blå tekst, fordi `#0593C6` er for lys til liten tekst.
- **Eksempelfirmaer:** Morgengry Bakeri, Kvist & Kløver, Nordvegg Snekkerservice og Rolig Fysio er fiktive. Jeg har ikke sjekket om noen faktisk heter det. Adressen i mockupen slutter på `.eksempel`, som ikke er et ekte domene.
- **«Mest valgt»:** Står på Standard fordi du ba om det. Hvis dere ikke har kunder ennå, er det strengt tatt ikke sant. Vurder «Anbefalt» til dere har tall å stå på.
- **vilkar.html** har `noindex` og står ikke i sitemap.xml til vilkårene er skrevet.
- **Pakkeknappene** hopper til kontaktskjemaet.

### Designvalg i fem linjer

1. «Varm teknologi»: myke lysgradienter i blått og rosa er gjennomgående motiv, med kornstruktur over så de ikke blir flate.
2. Lys hero med svakt rutenett og pustende glød, så mørke felt (steg, pakker, eksempler, kontakt) gir dybde og rytme.
3. Store, tette overskrifter (Plus Jakarta Sans, negativ bokstavavstand) og mye luft gir tydelig hierarki.
4. Rosa brukes bare på hovedknapper, logoprikken og den anbefalte pakken, så øyet vet hvor det skal.
5. Mockupene er bygd i ren CSS: ingen stockbilder, og de viser hva dere leverer i stedet for å love det.

### Logoen

Streken i ø-en fortsetter ut av bokstaven og ender i en glødende prikk: øyeblikket noe begynner å lyse. Ordmerket er tegnet av runde strøk som SVG, uten font. Filer: `logo-lys.svg` (til lys bakgrunn), `logo-mork.svg` (til mørk bakgrunn), `symbol.svg` / `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, og `og-bilde.png` (1200 × 630) til deling i sosiale medier.

## Bevegelse og tilgjengelighet

- Animasjoner bruker bare `transform` og `opacity`. Glødens musebevegelse og tilten på pakkekortene er bare på enheter med mus.
- Med `prefers-reduced-motion: reduce` slås alle animasjoner av, og alt innhold vises med en gang.
- Uten JavaScript vises alt innhold (animasjonene skjuler bare ting når JS kjører).
- `lang="nb"`, én H1 per side, «Hopp til innholdet»-lenke, synlig fokusmarkering, beskrivende alt-tekst og `aria-label` på illustrasjonene.

## Hva jeg har testet

- Layout i Chromium (headless) ved 375, 768 og 1440 px bredde: ingen horisontal scrolling, ingen JavaScript-feil.
- Skjemaet: feilmeldinger på tomme felt og ugyldig e-post, fokus flyttes til første feil, pakkeknappene velger pakke, og mailto-reserven åpnes med utfylt melding.
- Med redusert bevegelse er alle seksjoner synlige.

### Eksempelsidene: dette er testet

- Hver eksempelside og forsidegalleriet i Chromium (headless, med Playwright) ved 375, 768 og 1440 px: ingen horisontal scrolling og ingen feil i konsollen. Jeg har sett gjennom skjermbilder og rettet det som så dårlig ut.
- De interaktive delene med automatiske klikk: bukettbygger (sum og beskrivelse), årshjul med piltaster, før/etter-feltet med mus, terrassekalkulator og overføring til skjema, kroppskart → timebestilling → bekreftelse, pusteøvelsen, bakeriets kurv, filtre, kvittering og bestilling (med klokka satt til en torsdag kl. 10.20).
- «Åpne som mobil»: åpner, passer i skjermen og lukker med Esc, og fokus går tilbake til knappen.
- HTML-en er sjekket med html-validate (anbefalte regler, unntatt noen stilregler som inline-stil). Ingen feil.
- Med «redusert bevegelse» vises alt innhold med en gang.

## Hva som ikke er testet

Merk: Skymiljøet hadde en nettleser uten skjerm (headless Chromium), så jeg har kunnet åpne sidene, klikke og ta skjermbilder. Men det er ikke det samme som en ekte telefon.

- Dra med fingeren på en ekte berøringsskjerm (før/etter-feltet, skyverne). Det er bare testet med mus og tastatur.
- Hvordan forsiden oppfører seg med fire forhåndsvisninger (iframes) på en eldre, treg telefon.
- Safari og Firefox, og ekte iPhone/Android. Det gjelder også eksempelsidene: fontene der er valgt for iPhone, men jeg har bare sett dem med Linux-fonter i testene. Uskarp bakgrunn (`backdrop-filter`) og `:has()` er nyere CSS. Siden virker uten dem, men ser litt enklere ut.
- Skjermleser (VoiceOver/NVDA) og full tastaturgjennomgang er ikke testet.
- Innsending til en ekte skjematjeneste (det finnes ingen ennå).
- Ytelse på eldre, svake mobiler, og at bevegelsen holder 60 fps der.
- Kontrasten er regnet ut for hovedfargene, men ikke målt i et eget verktøy for hver eneste tekst.
- Hvordan delingsbildet faktisk ser ut på Facebook/LinkedIn (krever at siden ligger på et ekte domene).

## Før publisering

1. Fyll inn alle plassholdere (søk etter `[`).
2. Få **personvern.html** gjennomgått. Den er et utkast, ikke juridisk rådgivning.
3. Koble til skjemaet og send en testmelding.
4. Bytt de fiktive eksemplene med ekte (med kundens tillatelse) når dere har dem. Det står en kommentar i koden der de ligger.
