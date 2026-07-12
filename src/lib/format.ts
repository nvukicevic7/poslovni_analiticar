export function formatRelativeTime(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "upravo sada";
  if (diffMin < 60) return `pre ${diffMin} min`;

  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `pre ${diffH} ${diffH === 1 ? "sat" : diffH < 5 ? "sata" : "sati"}`;

  const diffD = Math.round(diffH / 24);
  return `pre ${diffD} ${diffD === 1 ? "dan" : "dana"}`;
}

const WEEKDAYS = ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"];
const MONTHS = [
  "januar",
  "februar",
  "mart",
  "april",
  "maj",
  "jun",
  "jul",
  "avgust",
  "septembar",
  "oktobar",
  "novembar",
  "decembar",
];

export function formatEventDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  const weekday = WEEKDAYS[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  return `${weekday}, ${day}. ${month}`;
}
