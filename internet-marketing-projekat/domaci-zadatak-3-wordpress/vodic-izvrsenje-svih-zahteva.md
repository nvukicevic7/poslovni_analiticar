---
title: "Domaći zadatak 3 — WordPress"
subtitle: "Dokumentacija implementacije internet prodavnice \"Zrno Doma\" — vodič kroz svih 12 zahteva"
author:
  - "Nikola Vukičević"
  - "[Ime i prezime drugog člana tima]"
date: "Jul 2026."
---

\newpage

# Uvod

Ovaj dokument prati izvršenje svih 12 zahteva Domaćeg zadatka 3 (WordPress), u
kontekstu seminarskog rada "Zrno Doma" (poglavlje 5 seminarskog rada). Za svaki
zahtev su navedeni: šta je pripremljeno u ovom paketu materijala, tačni koraci koje
tim izvodi u WordPress admin panelu, i mesto gde se prilaže dokaz izvršenja
(screenshot). Ovaj dokument sam po sebi predstavlja odgovor na **zahtev 12**
("dokumentacija koja postupno prati izvršavanje i demonstraciju svih zahteva").

**Preduslov:** aktivan WordPress hosting (npr. lokalno okruženje kao LocalWP/XAMPP za
vežbu, ili pravi hosting za odbranu) sa instaliranim WooCommerce plugin-om i
roditeljskom temom **Storefront**.

**Automatizacija:** skripta `setup-wp-cli.sh` (u ovom folderu) automatski odrađuje
najveći deo ručnih koraka za zahteve 2, 3 (delimično), 5, 6, 7 i 8 (kupon), ukoliko
imate WP-CLI pristup hostingu. Videti komentare na vrhu skripte za uputstvo
pokretanja. Koraci ispod i dalje važe kao referenca i za ono što skripta ne pokriva
(chatbot, slike, screenshotovi, test porudžbine).

---

# Zahtev 1 — Sajt u kontekstu teme seminarskog rada

**Status:** Pripremljeno — poslovna ideja, proizvodi, sadržaj i vizuelni identitet
(boje u child temi) direktno odgovaraju temi seminarskog rada "Zrno Doma" (specialty
kafa i oprema za pripremu).

**Koraci:**
1. Instalirati WordPress i WooCommerce.
2. Podesiti naziv sajta (Settings → General → Site Title: "Zrno Doma").
3. Kreirati stranice: Početna, Prodavnica, Blog, O nama, Kontakt (sadržaj za "O nama"
   preuzeti iz seminarskog rada, poglavlje 2 — Poslovna ideja).

**Dokaz:** screenshot početne strane sa vidljivim nazivom "Zrno Doma" i meni
navigacijom.

---

# Zahtev 2 — Child tema

**Status:** Gotovo — kompletna child tema nalazi se u folderu `child-tema-zrno-doma/`
(`style.css` + `functions.php`), bazirana na roditeljskoj temi Storefront.

**Koraci:**
1. Instalirati i aktivirati roditeljsku temu **Storefront** (Appearance → Themes →
   Add New → pretraga "Storefront").
2. Kompresovati folder `child-tema-zrno-doma` u ZIP (`zrno-doma-child.zip`).
3. Appearance → Themes → Add New → Upload Theme → izabrati ZIP → Install → Activate.
4. Proveriti da je child tema aktivna (Appearance → Themes — "Zrno Doma Child" treba
   da bude označena kao aktivna, sa naznakom "Storefront Child Theme").

**Napomena:** ako tim odluči da koristi drugu roditeljsku temu (npr. Astra), potrebno
je u `style.css` promeniti liniju `Template: storefront` na tačan slug te teme.

**Dokaz:** screenshot Appearance → Themes sa aktivnom child temom.

---

# Zahtev 3 — SEO optimizacija

**Status:** Pripremljeno — kompletan checklist i fokus ključne reči po
stranici/proizvodu nalaze se u `seo-checklist.md`.

**Koraci:** videti `seo-checklist.md` za pun postupak (instalacija Yoast SEO,
podešavanje fokus ključnih reči, sitemap, permalinks, alt tekstovi).

**Dokaz:** parovi screenshotova "pre/posle" Yoast SEO analize za minimum 3
stranice/proizvoda (videti `seo-checklist.md`, poglavlje 3).

---

# Zahtev 4 — Chatbot

**Status:** Pripremljeno — kompletna baza od 6 pitanja × 3 podpitanja (18 parova) u
kontekstu teme nalazi se u `chatbot-skripta-baza-znanja.md`.

**Koraci:**
1. Registrovati besplatan nalog na [tidio.com](https://www.tidio.com).
2. Instalirati zvanični **Tidio – Live Chat & AI Chatbots** plugin za WordPress
   (Plugins → Add New → pretraga "Tidio").
3. Povezati Tidio nalog sa sajtom (plugin nudi čarobnjak za povezivanje preko API
   ključa).
4. U Tidio panelu (Flows / Lyro Knowledge sources) uneti sva pitanja i odgovore iz
   `chatbot-skripta-baza-znanja.md`.
5. Testirati chatbot na sajtu postavljanjem svakog od 6 glavnih pitanja i barem
   jednog podpitanja po temi.

**Dokaz:** screenshot razgovora sa chatbotom za svih 6 glavnih pitanja (barem jedan
odgovor po temi vidljiv u chat prozoru).

---

# Zahtev 5 — Najmanje 3 korisnika sa različitim ulogama

**Status:** Definisano — child tema (`functions.php`) registruje dodatnu prilagođenu
ulogu "Urednik sadržaja".

**Predloženi korisnici:**

| Korisničko ime | Uloga | Zadužen |
|---|---|---|
| admin_zrnodoma | Administrator | Vlasnik/nosilac projekta (oba člana tima imaju admin pristup) |
| prodavnica_menadzer | Shop Manager (ugrađena WooCommerce uloga) | Član tima 1 — upravljanje proizvodima i porudžbinama |
| urednik_sadrzaja | Urednik sadržaja (prilagođena uloga iz child teme) | Član tima 2 — objavljivanje bloga i sadržaja (Zadatak 1) |

**Koraci:** Users → Add New za svakog korisnika, dodeliti odgovarajuću ulogu iz
padajućeg menija (uloga "Urednik sadržaja" postaje dostupna nakon aktivacije child
teme).

**Dokaz:** screenshot Users → All Users sa vidljive tri različite uloge.

---

# Zahtev 6 — Internet prodavnica (WooCommerce), min. 3 proizvoda po članu tima

**Status:** Gotovo — kompletan katalog od 7 proizvoda (4 linija "Kafa i zrna" + 3
linija "Oprema za pripremu") pripremljen je u `katalog-proizvoda-woocommerce-import.csv`,
spreman za uvoz.

**Koraci:**
1. WooCommerce → Settings — osnovna podešavanja (valuta RSD, adresa prodavnice).
2. Kreirati kategorije proizvoda: Products → Categories → "Kafa i zrna" i "Oprema za
   pripremu".
3. Products → Import → Upload `katalog-proizvoda-woocommerce-import.csv` → mapirati
   kolone (automatski prepoznaje standardne nazive kolona) → Run the importer.
4. Za svaki proizvod dodati sliku (koristiti vizuale generisane po prompt-ovima iz
   Zadatka 1, poglavlje 5) i proveriti/prilagoditi cenu.
5. Kastomizovati izgled prodavnice (Storefront/Customizer): logo, boje (već podešeno
   kroz child temu), raspored prikaza proizvoda.

**Dokaz:** screenshot stranice prodavnice sa svih 7 proizvoda i podelom po kategoriji;
screenshot sa najmanje 3 proizvoda jasno "pripisanih" svakom članu tima (može se
navesti u opisu ko je zadužen, kao u seminarskom radu poglavlje 8).

---

# Zahtev 7 — Upsell i cross-sell za svaki proizvod

**Status:** Gotovo — mapa upsell/cross-sell veza je uključena direktno u CSV (kolone
`Upsells` i `Cross-sells`) i detaljno objašnjena u
`domaci-zadatak-1-digital-content/sadrzaj/opisi-proizvoda.md` (tabela na kraju
dokumenta).

**Koraci:** Ako se uvoz CSV-a ne mapira automatski, ručno podesiti u
Products → [proizvod] → Product data → Linked Products → Upsells / Cross-sells prema
tabeli iz `opisi-proizvoda.md`.

**Dokaz:** screenshot stranice proizvoda (frontend) sa vidljivom sekcijom "Related
products" (cross-sell se prikazuje u korpi, upsell na stranici proizvoda).

---

# Zahtev 8 — Poboljšanje korisničkog iskustva (dodatni plugin-ovi)

**Status:** Preporuke pripremljene, instalacija se vrši u WordPress adminu.

| Funkcionalnost | Preporučeni plugin |
|---|---|
| Kuponi i popusti | Ugrađeno u WooCommerce (Marketing → Coupons) — kreirati kod `PRVOZRNO10` iz objave u Zadatku 1 |
| Različiti načini plaćanja | WooCommerce Payments ili Stripe/PayPal zvanični plugin |
| Napredna pretraga proizvoda | "WooCommerce Product Search" ili "SearchWP" |
| Kategorizacija i filtriranje | "WooCommerce Product Filters" (zvanični WooCommerce blok) |

**Koraci:**
1. Marketing → Coupons → Add coupon → kod `PRVOZRNO10`, popust 10%.
2. Instalirati i podesiti barem jedan plugin za napredno filtriranje/pretragu.
3. Dodati filter blok (cena, kategorija) na stranicu prodavnice preko Site
   Editor/Elementor (u zavisnosti od korišćenog page builder-a).

**Dokaz:** screenshot funkcionalne pretrage/filtera na frontend-u i screenshot
primenjenog kupona u korpi.

---

# Zahtev 9 — Analitika prodaje (min. 20 porudžbina)

**Status:** Plan definisan — potrebno je generisati test porudžbine radi
demonstracije.

**Koraci:**
1. Kreirati 20 test porudžbina (WooCommerce → Orders → Add order, ili kroz test
   kupovine na frontend-u sa test/cash-on-delivery plaćanjem) sa različitim
   proizvodima, datumima i kupcima, kako bi izveštaji imali smisleno variranje.
2. WooCommerce → Analytics → Overview / Products / Revenue — pregledati generisane
   izveštaje.

**Dokaz:** screenshot WooCommerce Analytics dashboard-a sa ukupnim brojem porudžbina
(≥20), prihodom i top proizvodima.

---

# Zahtev 10 — Povezivanje sa društvenim mrežama

**Status:** Sadržaj za objave pripremljen u Zadatku 1 (`sadrzaj/objave-drustvene-mreze.md`).

**Koraci:**
1. Kreirati Instagram i Facebook stranice za "Zrno Doma" (ako ne postoje).
2. Instalirati plugin za prikaz feed-a (npr. "Smash Balloon Social Photo Feed" za
   Instagram) i/ili dodati dugmad za deljenje (npr. "AddToAny Share Buttons").
3. Postaviti feed/dugmad na početnu stranu i blog objave.

**Dokaz:** screenshot sajta sa vidljivim social feed widget-om/dugmadima za deljenje.

---

# Zahtev 11 — Responsive prikaz na mobilnim uređajima

**Status:** Dodatna CSS pravila za manje ekrane uključena u child temu
(`style.css`, sekcija `@media (max-width: 768px)`); Storefront tema je već izvorno
responzivna.

**Koraci:**
1. Proveriti prikaz sajta u Chrome DevTools (F12 → Toggle device toolbar) za profile
   telefona i tableta.
2. Proveriti da je meni čitljiv (hamburger meni), da se proizvodi lepo ređaju u jednu
   kolonu na malim ekranima, i da je chatbot dugme dostupno i ne prekriva sadržaj.
3. Po potrebi doraditi dodatna pravila u `style.css` child teme.

**Dokaz:** screenshot sajta u mobilnom prikazu (naslovna, stranica proizvoda,
korpa).

---

# Zahtev 12 — Dokumentacija koja prati izvršenje

**Status:** Ovaj dokument, zajedno sa `seo-checklist.md`,
`chatbot-skripta-baza-znanja.md`, `katalog-proizvoda-woocommerce-import.csv` i child
temom, čini kompletnu dokumentaciju Zadatka 3. Nakon što tim sprovede korake i
prikupi screenshotove navedene u svakom poglavlju iznad, dokument je spreman za
predaju i odbranu.

**Preostalo za tim:** ubaciti prikupljene screenshotove na odgovarajuća mesta
(označena "**Dokaz:**" u svakom poglavlju) pre finalne predaje.
