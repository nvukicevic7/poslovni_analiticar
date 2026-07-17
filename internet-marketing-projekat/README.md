# Internet marketing — projekat "Zrno Doma"

Materijali za predmet **Internet marketing** (FON, Katedra za elektronsko poslovanje,
školska 2025/2026): Domaći zadatak 1, Domaći zadatak 3 i seminarski rad, izrađeni za
zajednički projekat **"Zrno Doma"** — internet prodavnica specialty kafe i opreme za
domaću pripremu kafe (tim od dva studenta).

## Struktura

```
internet-marketing-projekat/
├── seminarski-rad/
│   ├── seminarski-rad.md
│   └── Seminarski_rad_Zrno_Doma.docx          <- za predaju
├── domaci-zadatak-1-digital-content/
│   ├── dokumentacija-gvi-sadrzaja.md
│   ├── Domaci_zadatak_1_GVI_dokumentacija.docx <- za predaju
│   └── sadrzaj/
│       ├── opisi-proizvoda.md                  <- copy-paste u WooCommerce
│       └── objave-drustvene-mreze.md           <- copy-paste na Instagram/Facebook
└── domaci-zadatak-3-wordpress/
    ├── vodic-izvrsenje-svih-zahteva.md
    ├── Domaci_zadatak_3_WordPress_dokumentacija.docx <- za predaju (dopuniti screenshotovima)
    ├── seo-checklist.md
    ├── chatbot-skripta-baza-znanja.md              <- unos u Tidio
    ├── katalog-proizvoda-woocommerce-import.csv    <- uvoz u WooCommerce (Products → Import)
    └── child-tema-zrno-doma/
        ├── style.css
        └── functions.php
```

## Šta treba još da uradi tim (ne može se uraditi bez pristupa hostingu/nalozima)

1. **WordPress + WooCommerce:** postaviti hosting (ili lokalno okruženje za vežbu),
   instalirati Storefront temu, uploadovati `child-tema-zrno-doma/` kao ZIP.
2. **Uvoz proizvoda:** WooCommerce → Products → Import →
   `katalog-proizvoda-woocommerce-import.csv`.
3. **Chatbot:** registrovati Tidio nalog, uneti sadržaj iz
   `chatbot-skripta-baza-znanja.md`.
4. **Vizuali:** pokrenuti prompt-ove iz Zadatka 1 (poglavlje 5) u alatu za
   generisanje slika po izboru i postaviti rezultate na proizvode/sajt.
5. **Screenshotovi:** za svaki zahtev u `vodic-izvrsenje-svih-zahteva.md` (Zadatak 3)
   uraditi screenshot označen kao "Dokaz" i ubaciti u dokument pre predaje.
6. **Popuniti podatke tima:** zameniti `[Ime i prezime drugog člana tima]` u sva tri
   .docx dokumenta stvarnim imenom.
7. **Test porudžbine:** generisati minimum 20 porudžbina radi WooCommerce analitike
   (zahtev 9, Zadatak 3).

## Napomena o akademskom integritetu

Tekstualni sadržaj u ovim dokumentima je nacrt generisan uz pomoć alata Claude
(Anthropic), u skladu sa Opštim smernicama FON-a za korišćenje generativne veštačke
inteligencije (transparentnost, obavezna revizija od strane studenata). Pre predaje,
tim treba da:

- pročita i po potrebi prilagodi sav generisani tekst,
- popuni polja označena uglastim zagradama (imena, cene, kontakt podaci),
- izvrši sve tehničke korake u WordPress-u koji zahtevaju stvaran pristup hostingu i
  nalozima (chatbot, uvoz proizvoda, screenshotovi, test porudžbine) — ovi koraci
  nisu i ne mogu biti automatski izvršeni od strane AI alata,
- na odbrani bude spreman/na da objasni i samostalno demonstrira svaki deo projekta.
