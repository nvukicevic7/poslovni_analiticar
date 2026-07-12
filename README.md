# AI Trading Vesti Sažetak

Web aplikacija za praćenje makro vesti relevantnih za trgovanje na forexu i indeksima. Dashboard prikazuje
najnovije vesti (Fed odluke, PCE/CPI/GDP podaci, kamatne stope, izjave centralnih banaka, geopolitički
događaji) sa AI sažetkom na srpskom, oznakom pogođenih instrumenata i procenom da li je vest bullish,
bearish ili neutralna — uz ekonomski kalendar predstojećih događaja.

## Funkcionalnost

- Izbor praćenih instrumenata: XAU/USD, GBP/USD, EUR/USD, GBP/JPY
- Dugme „Osveži vesti" koje pokreće pretragu najnovijih vesti preko Claude API-ja (web pretraga uživo)
- Za svaku vest: naslov, izvor, AI sažetak na srpskom (2-3 rečenice), pogođeni instrumenti i
  bullish/bearish/neutralna oznaka sa obrazloženjem
- Sekcija „Ekonomski kalendar" sa najvažnijim predstojećim makro događajima
- Tamna tema, dizajn u stilu pravog trading dashboarda
- Demo režim sa realističnim primerima vesti kada `ANTHROPIC_API_KEY` nije podešen — aplikacija je odmah
  upotrebljiva za testiranje UI-ja bez API ključa

## Arhitektura

- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Backend**: Vercel serverless funkcije u `api/` folderu (`api/news.ts`, `api/calendar.ts`) koje pozivaju
  Claude API sa `web_search` alatom i strukturiranim JSON izlazom. `ANTHROPIC_API_KEY` se koristi
  isključivo na serveru i nikada se ne šalje u pregledač.

## Pokretanje lokalno

Pošto aplikacija koristi Vercel serverless funkcije, za potpuno lokalno testiranje (uključujući API
pozive) koristi se Vercel CLI:

```bash
npm install
npm install -g vercel   # ako već nije instaliran
vercel dev
```

Kopiraj `.env.example` u `.env` i podesi `ANTHROPIC_API_KEY` da bi vesti i kalendar dolazili sa uživo
Claude web pretragom. Bez ključa, aplikacija radi u demo režimu sa mock podacima.

Za rad samo na frontend delu (bez API poziva) dovoljno je:

```bash
npm run dev
```

u tom slučaju pozivi ka `/api/*` neće raditi (404) — koristi `vercel dev` kada testiraš pravu funkcionalnost.

## Build za produkciju

```bash
npm run build
npm run preview
```

## Deploy

Aplikacija je spremna za deploy na [Vercel](https://vercel.com):

```bash
vercel
```

Podesi environment varijablu `ANTHROPIC_API_KEY` u Vercel projekat settings-ima (Project → Settings →
Environment Variables) da bi vesti dolazile uživo umesto demo podataka.

## Tehnologije

React, TypeScript, Vite, Tailwind CSS, Anthropic Claude API (`@anthropic-ai/sdk`) sa `web_search` alatom i
strukturiranim JSON izlazom, Vercel serverless funkcije.
