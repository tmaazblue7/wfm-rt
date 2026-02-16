import 'dotenv/config';

/**
 * Get a Bearer token for CXone.
 * Strategy:
 *  1) Regional Access Key endpoint (JSON body).
 *  2) If USE_OIDC_DISCOVERY=true, use OIDC discovery → token_endpoint (x-www-form-urlencoded).
 * Docs: Regional access-key token API; global OIDC discovery. 
 * (See README references.)
 */
export async function getBearerToken() {
  const region = process.env.CXONE_REGION || 'na1';
  const accessKeyId = process.env.CXONE_ACCESS_KEY_ID;
  const accessKeySecret = process.env.CXONE_ACCESS_KEY_SECRET;
  const useDiscovery = String(process.env.USE_OIDC_DISCOVERY || 'false').toLowerCase() === 'true';

  if (!accessKeyId || !accessKeySecret) {
    throw new Error('Missing CXONE_ACCESS_KEY_ID or CXONE_ACCESS_KEY_SECRET');
  }

  if (!useDiscovery) {
    // Regional JSON token endpoint
    const url = `https://${region}.nice-incontact.com/authentication/v1/token/access-key`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessKeyId, accessKeySecret })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`AccessKey token failed: ${res.status} ${txt}`);
    }
    const json = await res.json();
    return { tokenType: json.token_type || 'Bearer', accessToken: json.access_token };
  }

  // Global OIDC discovery -> token_endpoint (password grant with access keys)
  const issuer = 'https://cxone.niceincontact.com';
  const did = await fetch(`${issuer}/.well-known/openid-configuration`);
  if (!did.ok) {
    throw new Error(`OIDC discovery failed: ${did.status} ${await did.text()}`);
  }
  const { token_endpoint } = await did.json();

  const form = new URLSearchParams();
  form.set('grant_type', 'password');
  form.set('username', accessKeyId);
  form.set('password', accessKeySecret);
  // If you have client_id/secret, include:
  // form.set('client_id', process.env.CLIENT_ID);
  // form.set('client_secret', process.env.CLIENT_SECRET);

  const tok = await fetch(token_endpoint, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form
  });
  if (!tok.ok) {
    throw new Error(`OIDC token failed: ${tok.status} ${await tok.text()}`);
  }
  const tjson = await tok.json();
  return { tokenType: tjson.token_type || 'Bearer', accessToken: tjson.access_token };
}