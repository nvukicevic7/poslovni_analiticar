# Priprema za odbranu — Marko (sve od nule)

Ovo je tvoj lični materijal za učenje. Piše sve prostim jezikom, bez pretpostavke da se
bilo čega sećaš. Pročitaj jednom celo, pa se vrati i vežbaj da naglas objasniš svaki deo
svojim rečima.

---

# DEO A — Osnovna priča (moraš znati napamet, u par rečenica)

**Šta je "Zrno Doma"?**
To je zamišljena internet prodavnica koja prodaje dve stvari: (1) specialty kafu —
to je kafa visokog kvaliteta, sa poznatim poreklom, iz malih pržionica (ne
komercijalna kafa iz marketa), i (2) opremu za pripremu te kafe kod kuće (mlin,
dripper, moka lonac).

**Zašto baš ta ideja?**
Zato što u Srbiji postoje specialty kafići, ali ako želiš tu istu kafu da spremiš kod
kuće, teško nalaziš jedno mesto gde možeš i zrna i opremu i uputstvo da kupiš/naučiš.
Zrno Doma to spaja na jednom sajtu.

**Ko su kupci?**
Ljudi koji vole kafu i žele da unaprede iskustvo pripreme kod kuće — bilo da su već
"kafeni entuzijasti" (znaju dosta o kafi) ili tek počinju (dobili aparat na poklon, ne
znaju kako se koristi).

**Šta je projekat obuhvatao (3 dela)?**
1. **Seminarski rad** — pisani plan (poslovna ideja + marketing plan + analiza tržišta)
2. **Zadatak 1** — kreiranje sadržaja (tekstovi, opisi, objave) uz pomoć veštačke
   inteligencije
3. **Zadatak 3** — pravljenje stvarnog sajta u WordPress-u (prodavnica, chatbot, itd.)

**Ko je radio šta?** Nikola je vodio liniju proizvoda "Kafa i zrna" i SEO deo. Ti si
vodio liniju "Oprema za pripremu" i chatbot/tehnički WordPress deo. Sajt i sav sadržaj
su rađeni zajedno kroz razgovor sa AI asistentom (Claude), uz Nikolino uživo
sprovođenje svih koraka na sajtu (instalacija, testiranje, ispravljanje grešaka).

---

# DEO B — Tvoj deo: proizvodna linija "Oprema za pripremu"

Ti si zadužen za ova 3 proizvoda:

| Proizvod | Opis | Cena |
|---|---|---|
| Ručni mlin za kafu | Keramički mehanizam, ručno mleveš zrna neposredno pre pripreme — sveže mleveno = bolji ukus | 3.490 RSD |
| Hario V60 dripper set | Dripper (levak za filter kafu) + filteri + digitalna vaga — za "pour-over" pripremu (polako sipanje vode preko mlevene kafe) | 4.290 RSD |
| Moka lonac 3 šolje | Klasični aluminijumski lonac za jaku, italijansku kafu — najjednostavniji za početnike | 2.190 RSD |

**Zašto baš ova 3 proizvoda?** Pokrivaju tri različita nivoa/stila pripreme: mlin je
"dodatak" koji poboljšava bilo koju metodu, V60 je za one koji žele čist, precizan
ukus (traži malo vežbe), moka lonac je najjednostavniji za savladavanje.

**Upsell primer:** Nemamo trenutno "bolju" verziju mlina u ponudi (moglo bi se dodati
premium mlin kasnije).
**Cross-sell primer:** Ko kupuje V60 set, nudimo mu Etiopija Yirgacheffe zrna (jer ta
zrna najbolje "rade" u V60 metodi) — to je povezan, drugačiji proizvod.

---

# DEO C — Tvoj deo: Chatbot (Zadatak 3, zahtev 4)

**Šta smo napravili?** Chatbot na sajtu koji odgovara na pitanja kupaca automatski,
24/7, bez da neko od nas mora ručno da odgovara.

**Koji alat smo koristili i zašto?** **Tidio** (tačnije njegov AI deo zvani "Lyro") —
besplatan, lako se ugrađuje u WordPress preko plugina, i može da "razume" pitanja
kupca čak i ako nisu formulisana identično kao u našoj bazi (npr. razume i "Koja je
najbolja kafa za espreso?" i "Šta mi preporučujete za espreso?").

**Šta smo uneli u chatbot?** Bazu od **6 glavnih tema, svaka sa po 3 podpitanja**
(ukupno 24 para pitanje-odgovor):
1. Koje vrste kafe nudite? (+ pitanja o espresu, kofeinu, svežini)
2. Koja oprema mi je potrebna? (+ pitanja o V60, mlinu, opremi za početnike)
3. Kako se vrši dostava? (+ pitanja o trajanju, ceni, dostavi van Srbije)
4. Kako mogu da platim? (+ pitanja o pouzeću, kartici, sigurnosti)
5. Kako da vratim/zamenim proizvod? (+ pitanja o roku, troškovima, postupku)
6. Da li nudite poklon pakete? (+ pitanja o poruci, ceni pakovanja, pretplati)

**Kako smo uneli bazu?** Preko CSV fajla (tabela sa pitanjima i odgovorima) koju smo
uvezli direktno u Tidio — brže nego da smo ručno kucali svih 24 para.

**Ako te pitaju da demonstriraš:** Otvori chat widget na sajtu (donji desni ugao) i
postavi bilo koje pitanje iz liste iznad — bot bi trebalo odmah da odgovori.

---

# DEO D — Tvoj deo: WordPress tehnički deo (child tema, instalacija)

**Šta je "child tema" i zašto je obavezna?** Kad instaliraš gotovu WordPress temu
(mi smo koristili **Storefront**, besplatnu temu napravljenu baš za online
prodavnice), ne smeš direktno da je menjaš — ako se ta tema ikad ažurira, sve tvoje
izmene bi nestale. Zato praviš "child" (dete) temu, koja nasleđuje sve od
roditeljske teme, ali čuva tvoje izmene (boje, dodatne funkcije) trajno.

**Šta smo konkretno stavili u child temu?**
- Boje brenda (braon/bež paleta koja odgovara temi kafe)
- Prilagođavanje da sajt lepo izgleda i na telefonu (responsive)
- Kod koji dodaje posebnu korisničku ulogu "Urednik sadržaja"

**Kako je sajt postavljen (osnovni koraci koje bi trebalo da znaš da nabrojiš)?**
1. Instaliran WordPress (lokalno, preko programa "Local")
2. Instaliran WooCommerce (plugin koji pretvara WordPress u online prodavnicu)
3. Instalirana Storefront tema, pa naša child tema preko nje
4. Uvezeni proizvodi, napravljeni korisnici, chatbot, itd.

---

# DEO E — Tvoj deo: CJM persona "Miloš Ilić"

**Ko je Miloš?** Zamišljeni kupac — 34 godine, dobio moka lonac na poklon, ne zna
kako da ga koristi (naš "početnik" tip kupca).

**Njegovo putovanje kroz 5 faza:**
1. **Svesnost** — traži na Google-u "kako spremiti kafu u moka loncu" i nalazi naš
   blog tekst (SEO ga dovodi do nas) → oseća nesigurnost
2. **Razmatranje** — čita uputstvo na blogu, vidi predlog zrna → olakšanje
3. **Odluka** — pita chatbot koja je oprema najbolja za početnike → podrška (ali ima
   "bolnu tačku": strah da će "pokvariti" kafu → **rešenje: jednostavna uputstva
   korak po korak na blogu**)
4. **Kupovina** — kupuje Brazil Santos zrna, uz predlog (cross-sell) da doda mlin →
   samopouzdanje
5. **Post-kupovina** — prati recept, uspešno sprema prvu šolju → ponos, zadovoljstvo

**Zašto pravimo ovakvu mapu?** Da razumemo kroz šta prolazi kupac-početnik i gde mu
možemo pomoći (npr. jasnim uputstvima) da ne odustane usput.

---

# DEO F — Zajedničko znanje (i ti i Nikola morate ovo da znate podjednako)

## Poslovna ideja i ciljna grupa (Nikolin deo, ali osnovno moraš znati)
- 3 tipa kupaca: "kafeni entuzijasta", "kućni baristA početnik", "poklon kupac"
- Konkurenti: fizički specialty kafići (uska ponuda), veliki marketplace-i (nema
  kuracije), maloprodajni lanci (loš kvalitet) — mi kombinujemo kvalitet + opremu +
  edukaciju

## WooCommerce prodavnica — opšte
- Sajt ima 7 proizvoda ukupno (4 Nikolina "Kafa i zrna" + 3 tvoja "Oprema za
  pripremu"), podeljenih u 2 kategorije.
- Svaki proizvod ima **upsell** (bolja/veća verzija istog tipa proizvoda) i
  **cross-sell** (povezan, drugačiji proizvod) — ovo je čest deo pitanja, upamti
  razliku!

## SEO (Nikolin deo, ali osnovno moraš znati)
- Koristili smo plugin **Yoast SEO** da optimizujemo tekst za Google pretragu —
  birali smo ključne reči (npr. "specialty kafa Srbija") i pisali meta opise.

## Zadatak 1 — GVI (veštačka inteligencija) sadržaj
- Koristili smo **Claude** (AI alat) da napišemo blog tekstove, opise proizvoda,
  objave za društvene mreže.
- Za slike smo koristili poseban alat za generisanje slika (Bing/Gemini).
- **Zašto je to dozvoljeno?** Zato što zadatak to eksplicitno traži, i zato što smo
  transparentni — dokumentovali smo koji alat, koji prompt (upit), i pregledali
  rezultat pre korišćenja. FON-ove smernice dozvoljavaju AI ako se to jasno navede.

## Društvene mreže, analitika, mobilni prikaz
- Sajt ima dugmad za deljenje na Facebook/Instagram (plugin AddToAny), i imamo
  pravu Facebook stranicu sa objavama.
- WooCommerce Analytics pokazuje 20 test porudžbina koje smo napravili, da se vidi
  kako izgleda izveštaj o prodaji.
- Sajt se automatski prilagođava telefonu (responsive) — testirano u Chrome
  DevTools.

---

# DEO G — Praktični saveti za samu odbranu

1. **Ne pamti tekst napamet** — razumi logiku (zašto smo nešto uradili), pa ćeš moći
   svojim rečima da objasniš čak i ako zaboraviš tačnu formulaciju.
2. **Ako te pitaju nešto iz Nikolinog dela** (npr. detalji SEO-a ili konkurencije),
   možeš reći "Detaljnije o tome zna moj kolega, ali generalno..." i dati osnovni
   odgovor iz DEO F iznad.
3. **Uvek imaj otvoren sajt** da možeš uživo da pokažeš o čemu pričaš (posebno
   chatbot, pošto je to tvoj deo).
4. **Ako ne znaš odgovor** — ne izmišljaj. Reci "Nisam siguran u tačan detalj, ali
   logika iza toga je..." i daj najbolju procenu.

---

# Kratak "brzi test" — probaj da odgovoriš pre odbrane

1. Zašto smo izabrali baš specialty kafu kao ideju?
2. Koja su tvoja tri proizvoda i čemu služi svaki?
3. Koji alat smo koristili za chatbot i kako "razume" različito formulisana pitanja?
4. Nabroj bar 3 od 6 glavnih tema koje chatbot pokriva.
5. Šta je child tema i zašto je moramo koristiti umesto direktne izmene glavne teme?
6. Ko je Miloš Ilić i kroz koje faze prolazi?
7. Koji AI alat smo koristili za sadržaj i zašto je to dozvoljeno?

Ako na sva ova pitanja možeš da odgovoriš svojim rečima bez gledanja — spreman si.
