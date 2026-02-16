import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { getBearerToken } from './cxone/auth.js';
import { getSkillKpis } from './cxone/rtdata.js';
import { toCsvRows, writeCsv } from './utils/csv.js';
import { timestampNowTz } from './utils/time.js';

const groups = JSON.parse(fs.readFileSync(path.resolve('src/config/groups.json'), 'utf8'));

async function main() {
  const { tokenType, accessToken } = await getBearerToken();

  const region = process.env.CXONE_REGION || 'na1';
  const routeMode = (process.env.ROUTE_MODE || 'post').toLowerCase();

  let allRows = [];

  for (const group of groups.groups) {
    const skillIds = group.skills.map(Number);
    // Use the same function; it handles POST->fallback to GET on 405.
    const kpis = await getSkillKpis({ region, tokenType, accessToken, skillIds, routeMode });
    const rows = toCsvRows(kpis, group.LOB);
    allRows = allRows.concat(rows);
  }

  const ts = timestampNowTz(); // UTC stamp; adjust if needed
  const outfile = path.resolve(`output/kpi_${ts}.csv`);
  writeCsv(outfile, allRows);
  console.log(`Wrote ${allRows.length} KPI rows → ${outfile}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});