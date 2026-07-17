# SEO optimizacija — checklist i podešavanja (zahtev 3)

Zahtev: "Izvršiti SEO optimizaciju sajta. Optimizaciju izvršiti kroz plugin-ove i
dodatne opcije WordPress-a i prikazati rezultate optimizacije."

## 1. Plugin

Preporučeni plugin: **Yoast SEO** (besplatna verzija je dovoljna) ili **Rank Math**
kao alternativa. Instalirati preko Plugins → Add New → pretraga "Yoast SEO" → Install
→ Activate.

## 2. Podešavanja po tipu sadržaja

### Fokus ključne reči po stranici/proizvodu

| Stranica/proizvod | Fokus ključna reč | SEO naslov (title) | Meta opis |
|---|---|---|---|
| Početna strana | specialty kafa Srbija | Zrno Doma \| Specialty kafa i oprema za pripremu kod kuće | Otkrijte specialty kafu iz malih domaćih pržionica i opremu za savršenu pripremu kod kuće. Besplatna dostava preko 3.000 RSD. |
| Kategorija: Kafa i zrna | specialty kafa zrna | Specialty kafa - sveže pržena zrna \| Zrno Doma | Birana zrna specialty kafe, svetlog, srednjeg i tamnog pečenja, direktno od domaćih pržionica. |
| Kategorija: Oprema za pripremu | oprema za pripremu kafe | Oprema za pripremu kafe kod kuće \| Zrno Doma | V60 dripperi, mlinovi i moka lonci - sve za pripremu kafe kao u kafiću, kod kuće. |
| Proizvod: Etiopija Yirgacheffe | etiopija kafa | Etiopija Yirgacheffe 250g - svetlo pečenje \| Zrno Doma | Specialty kafa iz Yirgacheffe regiona, note citrusa i cveta. Idealna za V60 pripremu. |
| Blog: Kako pripremiti kafu u V60 dripperu | priprema kafe v60 | Kako pripremiti savršenu kafu u V60 dripperu \| Zrno Doma blog | Korak po korak vodič za pripremu filter kafe u V60 dripperu, za početnike. |

### Tehnički SEO

- [ ] Podesiti **permalinks** strukturu na "naziv objave" (Settings → Permalinks →
      Post name) radi čitljivih URL-ova (npr. `/kafa-i-zrna/etiopija-yirgacheffe/`).
- [ ] Generisati **XML sitemap** (automatski kroz Yoast SEO → General → Features →
      XML sitemaps → On) i proveriti na `/sitemap_index.xml`.
- [ ] Popuniti **alt tekst** za sve slike proizvoda i bloga (opisno, sa ključnom reči
      gde je prirodno, npr. "kesa specialty kafe Etiopija Yirgacheffe 250g").
- [ ] Postaviti **glavnu sliku (featured image)** za svaku objavu bloga i proizvod.
- [ ] Proveriti **brzinu učitavanja** (npr. preko PageSpeed Insights ili plugina kao
      što je "WP Super Cache") i uključiti keširanje.
- [ ] Povezati Google Search Console i predati sitemap radi indeksiranja (opciono, ako
      sajt ima javno dostupan domen).

### Interno povezivanje

- [ ] Iz svakog blog teksta linkovati ka relevantnim proizvodima (npr. iz teksta o
      V60 pripremi linkovati ka V60 dripper setu).
- [ ] Iz opisa proizvoda linkovati ka relevantnom blog tekstu (npr. iz opisa V60 seta
      linkovati ka uputstvu za pripremu).

## 3. Prikaz rezultata optimizacije (za dokumentaciju/odbranu)

Za svaku stranicu/proizvod, u Yoast SEO analizi (ispod uređivača stranice) uslikati:

1. **"SEO analysis"** rezultat pre unosa fokus ključne reči (obično crveno/žuto).
2. **"SEO analysis"** rezultat nakon optimizacije (zeleno - "Good").
3. Isto za **"Readability analysis"**.

Ove parove screenshotova (pre/posle) priložiti u glavnu dokumentaciju
(`vodic-izvrsenje-svih-zahteva.md`, zahtev 3) kao dokaz sprovedene optimizacije.
