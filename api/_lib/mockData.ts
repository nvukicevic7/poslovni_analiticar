import type { CalendarEvent, Instrument, NewsItem } from "./types.ts";

const MOCK_NEWS: NewsItem[] = [
  {
    id: "mock-1",
    title: "Fed Holds Rates Steady, Signals Caution on Future Cuts",
    source: "Reuters",
    url: null,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    summary:
      "Federalne rezerve su zadržale kamatne stope nepromenjenim, uz upozorenje da su inflatorni rizici i dalje prisutni. Predsednik Fed-a je naglasio da će buduće odluke zavisiti od narednih podataka o inflaciji i tržištu rada. Ovo je ojačalo dolar jer tržište sada očekuje sporije snižavanje stopa.",
    impacts: [
      { instrument: "EUR/USD", sentiment: "bearish", reasoning: "Jači dolar usled odloženih očekivanja za rezanje stopa pritiska euro naniže." },
      { instrument: "GBP/USD", sentiment: "bearish", reasoning: "Dolar jača u odnosu na sve glavne valute nakon jastrebastog tona Fed-a." },
      { instrument: "XAU/USD", sentiment: "bearish", reasoning: "Više kamatne stope duže vremena smanjuju atraktivnost zlata koje ne nosi prinos." },
    ],
  },
  {
    id: "mock-2",
    title: "Core PCE Inflation Comes in Hotter Than Expected",
    source: "Bloomberg",
    url: null,
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    summary:
      "Osnovni PCE indeks, omiljeni pokazatelj inflacije Fed-a, porastao je više od očekivanog na mesečnom nivou. Ovo sugeriše da je put ka cilju od 2% inflacije sporiji nego što se mislilo. Investitori su smanjili očekivanja za rezanje kamatnih stopa na narednim sastancima.",
    impacts: [
      { instrument: "XAU/USD", sentiment: "bearish", reasoning: "Uporna inflacija odlaže rezanje stopa, što je negativno za zlato." },
      { instrument: "EUR/USD", sentiment: "bearish", reasoning: "Podatak podržava dolar i pritiska euro naniže." },
    ],
  },
  {
    id: "mock-3",
    title: "Bank of England Governor Hints at Gradual Easing Path",
    source: "Financial Times",
    url: null,
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    summary:
      "Guverner Bank of England izjavio je da centralna banka razmatra postepeno labavljenje monetarne politike ukoliko se inflacija nastavi smirivati. Izjava je protumačena kao blago golubija, što je oslabilo funtu prema glavnim valutama. Tržišta sada preciznije procenjuju vreme prvog sledećeg rezanja stopa.",
    impacts: [
      { instrument: "GBP/USD", sentiment: "bearish", reasoning: "Golubiji ton BoE-a slabi funtu naspram dolara." },
      { instrument: "GBP/JPY", sentiment: "bearish", reasoning: "Očekivanje nižih stopa u Britaniji smanjuje atraktivnost funte i naspram jena." },
    ],
  },
  {
    id: "mock-4",
    title: "Geopolitical Tensions in Middle East Escalate, Safe-Haven Demand Rises",
    source: "Associated Press",
    url: null,
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    summary:
      "Eskalacija sukoba na Bliskom istoku podigla je globalnu averziju prema riziku, pa investitori beže ka sigurnim instrumentima. Zlato i japanski jen beleže rast dok se cene nafte takođe podižu. Analitičari upozoravaju da bi dalja eskalacija mogla dodatno da poveća volatilnost na tržištima.",
    impacts: [
      { instrument: "XAU/USD", sentiment: "bullish", reasoning: "Zlato tradicionalno raste kao sigurno utočište u periodima geopolitičke neizvesnosti." },
      { instrument: "GBP/JPY", sentiment: "bearish", reasoning: "Jen jača kao sigurno utočište, pritiskajući ovaj par naniže." },
    ],
  },
  {
    id: "mock-5",
    title: "US GDP Growth Beats Forecasts in Latest Quarter",
    source: "CNBC",
    url: null,
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    summary:
      "Rast američkog bruto domaćeg proizvoda nadmašio je očekivanja analitičara, potvrđujući otpornost potrošnje i tržišta rada. Snažni podaci smanjuju pritisak na Fed da hitno snižava kamatne stope. Dolar je ojačao nakon objave, dok su prinosi na obveznice porasli.",
    impacts: [
      { instrument: "EUR/USD", sentiment: "bearish", reasoning: "Snažna američka ekonomija podržava dolar naspram evra." },
      { instrument: "XAU/USD", sentiment: "neutral", reasoning: "Mešoviti signali - jači dolar pritiska zlato, ali dugoročna neizvesnost i dalje pruža podršku." },
    ],
  },
  {
    id: "mock-6",
    title: "ECB Officials Split on Timing of Next Rate Move",
    source: "Reuters",
    url: null,
    publishedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    summary:
      "Članovi Evropske centralne banke iskazali su podeljena mišljenja oko vremena sledeće promene kamatnih stopa. Deo tvrdolinijaša zagovara oprez zbog uporne inflacije usluga, dok drugi ističu slabljenje privredne aktivnosti u evrozoni. Ova neizvesnost drži evro u uskom rasponu prema dolaru.",
    impacts: [
      { instrument: "EUR/USD", sentiment: "neutral", reasoning: "Podeljeni signali iz ECB-a drže evro bez jasnog pravca do sledećih podataka." },
    ],
  },
];

const MOCK_CALENDAR: CalendarEvent[] = [
  {
    id: "cal-1",
    title: "Odluka Fed-a o kamatnoj stopi (FOMC)",
    date: addDays(1),
    time: "20:00",
    importance: "high",
    instruments: ["XAU/USD", "EUR/USD", "GBP/USD", "GBP/JPY"],
    description: "Objava odluke o kamatnoj stopi i konferencija za štampu predsednika Fed-a. Očekuje se visoka volatilnost na svim glavnim parovima.",
  },
  {
    id: "cal-2",
    title: "Core PCE indeks inflacije (SAD)",
    date: addDays(2),
    time: "14:30",
    importance: "high",
    instruments: ["EUR/USD", "GBP/USD", "XAU/USD"],
    description: "Omiljeni pokazatelj inflacije Fed-a. Iznenađenje naviše obično jača dolar i pritiska zlato.",
  },
  {
    id: "cal-3",
    title: "Izveštaj o nezaposlenosti van poljoprivrede (NFP)",
    date: addDays(3),
    time: "14:30",
    importance: "high",
    instruments: ["EUR/USD", "GBP/USD", "XAU/USD", "GBP/JPY"],
    description: "Ključni mesečni podatak o tržištu rada u SAD. Jak podatak podržava dolar, slab podatak povećava očekivanja rezanja stopa.",
  },
  {
    id: "cal-4",
    title: "Odluka Bank of England o kamatnoj stopi",
    date: addDays(4),
    time: "13:00",
    importance: "medium",
    instruments: ["GBP/USD", "GBP/JPY"],
    description: "Objava odluke o stopama i glasanje Monetarnog odbora. Direktno utiče na sve parove sa funtom.",
  },
  {
    id: "cal-5",
    title: "Preliminarni BDP evrozone",
    date: addDays(5),
    time: "11:00",
    importance: "medium",
    instruments: ["EUR/USD"],
    description: "Prvi kvartalni pokazatelj rasta evrozone. Slabiji rast pojačava pritisak na ECB da razmotri labaviju politiku.",
  },
  {
    id: "cal-6",
    title: "Izveštaj o inflaciji potrošačkih cena u Japanu (CPI)",
    date: addDays(6),
    time: "01:30",
    importance: "low",
    instruments: ["GBP/JPY"],
    description: "Podaci o inflaciji u Japanu utiču na očekivanja o politici Bank of Japan i kretanje jena.",
  },
];

function addDays(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getMockNews(instruments: Instrument[]): NewsItem[] {
  const set = new Set(instruments);
  const filtered = MOCK_NEWS.filter((item) => item.impacts.some((i) => set.has(i.instrument)));
  return (filtered.length > 0 ? filtered : MOCK_NEWS).map((item) => ({
    ...item,
    impacts: item.impacts.filter((i) => set.size === 0 || set.has(i.instrument)),
  }));
}

export function getMockCalendar(instruments: Instrument[]): CalendarEvent[] {
  const set = new Set(instruments);
  const filtered = MOCK_CALENDAR.filter((ev) => ev.instruments.some((i) => set.has(i)));
  return filtered.length > 0 ? filtered : MOCK_CALENDAR;
}
