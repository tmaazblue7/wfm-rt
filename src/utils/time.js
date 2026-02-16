export function timestampNowTz(tz = 'US Mountain Standard Time') {
  // Simple UTC-based stamp; adjust if you need exact Windows TZ conversions.
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}_${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
}