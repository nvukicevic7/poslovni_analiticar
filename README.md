# AI Poslovni Analitičar

Web aplikacija za analizu poslovnih podataka namenjena malim i srednjim firmama.
Korisnik otpremi Excel ili CSV fajl sa podacima o prodaji i troškovima, a aplikacija
automatski izračunava ključne pokazatelje, prikazuje grafikone i upozorava na
neobične promene u poslovanju. Sva obrada se dešava lokalno u pregledaču — podaci se
nigde ne šalju.

## Funkcionalnost

- Otpremanje `.csv`, `.xlsx` i `.xls` fajlova (drag & drop ili izbor fajla)
- Pregled: ukupan prihod, ukupni troškovi, profit, broj transakcija
- Top 5 proizvoda/usluga po prihodu (grafikon i tabela)
- Trend prodaje i troškova kroz vreme (grafikon po mesecima)
- Automatska upozorenja na neobične promene (nagli pad prihoda, rast troškova, pad marže)
- Pitanja prirodnim jezikom o učitanim podacima (npr. „Koliko sam zaradio u martu?”)
- Dugme „Isprobaj sa test podacima” za trenutni demo

## Pokretanje

```bash
npm install
npm run dev
```

## Build za produkciju

```bash
npm run build
npm run preview
```

Izlaz builda (`dist/`) je statički sajt spreman za deploy na bilo koji hosting za
statičke fajlove (Vercel, Netlify, Cloudflare Pages, GitHub Pages, itd.).

## Format ulaznog fajla

Aplikacija prepoznaje kolone po nazivu (srpski i engleski nazivi su podržani):

| Podatak | Prepoznati nazivi kolona |
|---|---|
| Datum | Datum, Date |
| Proizvod/usluga | Proizvod, Usluga, Artikal, Product, Item |
| Kupac | Kupac, Klijent, Customer |
| Prihod | Prihod, Prodaja, Cena, Iznos, Revenue, Amount |
| Trošak | Trošak, Troškovi, Cost, Expense |
| Kategorija (opciono) | Kategorija, Category |

Primer test fajla se nalazi u `public/test-podaci.csv`.

## Tehnologije

React, TypeScript, Vite, Tailwind CSS, Recharts, PapaParse, SheetJS (xlsx).
