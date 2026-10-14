// Meridian — company country of origin.
//
// A company's headquarters country comes from Yahoo's company profile
// (assetProfile.country), the same field shown on a ticker's Profile tab. It is
// stored with the date it was read, so the figure keeps working when Yahoo is
// unreachable and shows its age. A company Yahoo gives no country for (funds
// and ETFs, mostly) is stored as "no country" and retried later, never filled
// in from a guess.

import { all, run } from '../db.js';
import * as yahoo from '../sources/yahoo.js';
import { listCompositions } from './rebuild/exposure.js';

import { db } from '../db.js';
db.exec(`
CREATE TABLE IF NOT EXISTS company_profile (
  symbol     TEXT PRIMARY KEY,
  country    TEXT,
  fetched_at INTEGER NOT NULL
);
`);

const DAY = 86_400_000;
const RETRY_EMPTY_AFTER = 7 * DAY;     // nothing came back: try again within a week
const REFRESH_AFTER = 180 * DAY;       // a head office rarely moves

/** { SYMBOL: country | null } for every symbol on file. */
export function storedCountries(symbols) {
  const want = new Set(symbols.map(s => String(s).toUpperCase()));
  const out = {};
  for (const r of all('SELECT symbol, country FROM company_profile')) if (want.has(r.symbol)) out[r.symbol] = r.country;
  return out;
}

export const countryOfSymbol = symbol => storedCountries([symbol])[String(symbol).toUpperCase()] ?? null;

const skip = s => /^0P[0-9A-Z]{8}/.test(s) || /^\^/.test(s) || /[=]/.test(s) || /-USD$/.test(s);
let inFlight = false;

/** Fetch missing or stale countries one at a time. Safe to call repeatedly. */
export async function ensureProfiles(symbols, { fetchSummary = yahoo.fetchSummary, now = Date.now() } = {}) {
  if (inFlight) return { started: false };
  const rows = Object.fromEntries(all('SELECT symbol, country, fetched_at FROM company_profile').map(r => [r.symbol, r]));
  const todo = [...new Set(symbols.map(s => String(s).toUpperCase()))].filter(s => {
    if (skip(s)) return false;
    const r = rows[s];
    if (!r) return true;
    return now - r.fetched_at > (r.country ? REFRESH_AFTER : RETRY_EMPTY_AFTER);
  });
  if (!todo.length) return { started: false };
  inFlight = true;
  try {
    for (const symbol of todo) {
      try {
        const s = await fetchSummary(symbol);
        if (!s || s.error) continue;                  // a failed fetch is not "no country"; leave it for next time
        run('INSERT OR REPLACE INTO company_profile (symbol, country, fetched_at) VALUES (?, ?, ?)', symbol, s.country || null, Date.now());
      } catch { /* network down: try again on the next call */ }
    }
  } finally { inFlight = false; }
  return { started: true, count: todo.length };
}

/** Every symbol worth a profile: the positions and the holdings inside their stored funds. */
export function symbolsToProfile(positionSymbols) {
  const out = new Set(positionSymbols);
  for (const c of Object.values(listCompositions(positionSymbols))) for (const h of c?.holdings ?? []) if (h.symbol) out.add(h.symbol);
  return [...out];
}
