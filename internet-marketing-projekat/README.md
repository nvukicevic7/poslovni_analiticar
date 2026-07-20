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
    ├── setup-wp-cli.sh                             <- automatizacija preko WP-CLI (opciono)
    └── child-tema-zrno-doma/
        ├── style.css
        └── functions.php
```

## Šta treba još da uradi tim (ne može se uraditi bez pristupa hostingu/nalozima)

Pokušao sam da u ovom razvojnom okruženju podignem pravi lokalni WordPress (preko
Dockera i direktnim preuzimanjem WordPress jezgra) da bih sve testirao i napravio
prave screenshotove, ali mrežna politika sandbox-a blokira i Docker Hub i
wordpress.org, pa to nije bilo izvodljivo odavde. Zato je pripremljena
`setup-wp-cli.sh` skripta koja automatizuje najveći deo ručnih koraka — pokrećete je
vi, na svom hostingu.

**Redosled koraka:**

1. **Podignuti hosting i osnovni WordPress.** Lokalno (LocalWP/XAMPP) za vežbu, ili
   pravi hosting za odbranu. Instalirati WooCommerce i temu **Storefront**.
2. **Uploadovati child temu.** Spakovati `child-tema-zrno-doma/` u ZIP i
   instalirati/aktivirati (Appearance → Themes → Add New → Upload Theme).
3. **(Opciono, ubrzava posao) Pokrenuti `setup-wp-cli.sh`** preko SSH-a/WP-CLI na
   hostingu — automatski aktivira temu, instalira plugin-ove, podešava WooCommerce
   (RSD, Srbija), kreira kategorije, 2 korisnika sa različitim ulogama, svih 7
   proizvoda sa upsell/cross-sell vezama i kupon. Pre pokretanja obavezno pročitati
   komentare na vrhu skripte (nije testirana na živom serveru, proverite
   `wp wc product create --help` na svom WP-CLI pre punog pokretanja).
   - Ako preskačete skriptu: proizvode ručno uneti ili uvesti kroz
     `katalog-proizvoda-woocommerce-import.csv` (WooCommerce → Products → Import).
4. **Chatbot:** registrovati Tidio nalog (zahteva browser/OAuth, ne može se
   skriptovati), instalirati Tidio plugin, uneti sadržaj iz
   `chatbot-skripta-baza-znanja.md`.
5. **Vizuali:** pokrenuti prompt-ove iz Zadatka 1 (poglavlje 5) u alatu za
   generisanje slika po izboru (Bing Image Creator / ChatGPT / Canva AI) i postaviti
   rezultate na proizvode/sajt/društvene mreže.
6. **SEO:** proći kroz `seo-checklist.md` (fokus ključne reči, sitemap, alt tekst).
7. **Test porudžbine:** generisati minimum 20 porudžbina radi WooCommerce analitike
   (zahtev 9, Zadatak 3) — ručno, kroz frontend ili WooCommerce → Orders → Add order.
8. **Screenshotovi:** za svaki zahtev u `vodic-izvrsenje-svih-zahteva.md` (Zadatak 3)
   uraditi screenshot označen kao "Dokaz" i ubaciti u `.docx` dokument.
9. **Popuniti podatke tima:** zameniti `[Ime i prezime drugog člana tima]` u sva tri
   .docx dokumenta stvarnim imenom.
10. **Priprema za odbranu:** proći kroz sve dokumente da možete samostalno da
    objasnite i uživo demonstrirate svaku odluku.

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
