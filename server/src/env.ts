import 'dotenv/config';

export const GH_TOKEN = process.env.GH_TOKEN ?? '';
export const PORT = Number(process.env.PORT ?? 4000);
export const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS ?? 120000);
export const REPOS = (process.env.REPOS ?? 'samdofreelancer/money-keeper')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

if (!GH_TOKEN) {
  console.warn('[WARN] GH_TOKEN is empty. Set server/.env before running.');
}
