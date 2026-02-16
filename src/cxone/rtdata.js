import { v4 as uuid } from 'uuid';

/**
 * Call Real-Time Data API to get skill KPIs for one group.
 * Tries POST /skills/activities/search, then POST /skills/activity/search,
 * and finally falls back to GET /skills/activities?filters.skillIds=... when 405/GET-only.
 */
export async function getSkillKpis({ region = 'na1', tokenType, accessToken, skillIds }) {
  const base = `https://api-${region}.niceincontact.com/real-time-data/v1`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `${tokenType} ${accessToken}`,
    'x-Correlation-ID': uuid()
  };

  const postBody = JSON.stringify({
    filters: { skillIds },
    timeRange: { type: 'CURRENT' }
  });

  // Try POST (plural)
  let res = await fetch(`${base}/skills/activities/search`, { method: 'POST', headers, body: postBody });
  if (res.status === 405) {
    // Try POST (singular)
    res = await fetch(`${base}/skills/activity/search`, { method: 'POST', headers, body: postBody });
  }
  if (res.status === 405) {
    // Fallback to GET with query string
    const params = new URLSearchParams();
    params.set('timeRange.type', 'CURRENT');
    for (const s of skillIds) params.append('filters.skillIds', String(s));
    const getRes = await fetch(`${base}/skills/activities?${params.toString()}`, {
      method: 'GET',
      headers: { ...headers, 'Content-Type': undefined } // GET has no body
    });
    if (!getRes.ok) throw new Error(`GET KPIs failed: ${getRes.status} ${await getRes.text()}`);
    return await getRes.json();
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST KPIs failed: ${res.status} ${txt}`);
  }
  return await res.json();
}