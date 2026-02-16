import { stringify } from 'csv-stringify/sync';
import fs from 'node:fs';
import path from 'node:path';

export function toCsvRows(kpis, lob) {
  // Optionally enrich with LOB
  return kpis.map(r => ({
    LOB: lob ?? '',
    skillId: r.skillId ?? '',
    skillName: r.skillName ?? '',
    serviceLevel: r.serviceLevel ?? '',
    serviceLevelGoal: r.serviceLevelGoal ?? '',
    queueCount: r.queueCount ?? '',
    agentsLoggedIn: r.agentsLoggedIn ?? '',
    agentsAvailable: r.agentsAvailable ?? '',
    agentsWorking: r.agentsWorking ?? '',
    agentsUnavailable: r.agentsUnavailable ?? '',
    earliestQueueTime: r.earliestQueueTime ?? '',
    mediaTypeId: r.mediaTypeId ?? '',
    mediaTypeName: r.mediaTypeName ?? ''
  }));
}

export function writeCsv(filename, rows) {
  const csv = stringify(rows, { header: true });
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, csv, 'utf8');
}