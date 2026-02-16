# wfm-rt

Delivers real time statistics from NICE CXone to Teams at scheduled intervals.

# CXone Real-Time Skill KPIs (GitHub Runner) 

Pulls **Skills Activity** KPIs from NICE CXone's Real-Time Data API by LOB groups and writes a timestamped CSV.

## Why this project?

- Uses **Access Keys** to obtain a **Bearer** token (regional endpoint) or global OIDC discovery to obtain the `token_endpoint` and exchange access keys for a token. CXone REST APIs must be called over HTTPS with this Bearer token.
  [2](https://developer.niceincontact.com/Documentation/UserHubGettingStarted)
  [3](https://www.postman.com/nice-cxone-sc/cxone-authentication-examples/documentation/cpdtjly/cxone-authentication)

[1](https://developer.niceincontact.com/API)

Calls the **Real-Time Data API** skills activity route. In some stacks the search route is:

  `POST /real-time-data/v1/skills/activities/search` (plural), while others expose `POST /real-time-data/v1/skills/activity/search` (singular).
  If you receive **405 MethodNotAllowed** with `Allow: GET,…` on a search route, use `GET /real-time-data/v1/skills/activities` and pass `filters.skillIds` via query string.

## Prerequisites

- Node.js 18+ (uses native `fetch`).
- A CXone tenant with **Access Keys** and permissions for Real-Time Data. (See NICE docs for managing Access Keys and API auth.) [4](https://help.nicecxone.com/content/admin/security/manageaccesskeys.htm)[5](https://developer.niceincontact.com/Documentation/APIAuthenticationAndAuthorization)

## Setup

```bash
git clone https://github.com/your-org/cxone-kpi-github.git
cd cxone-kpi-github
cp .env.example .env
npm i
'''
