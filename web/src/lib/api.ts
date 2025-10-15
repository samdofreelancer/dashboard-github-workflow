const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export type Run = {
  id: number; repo_owner: string; repo_name: string; workflow_name: string; run_number: number;
  head_branch: string; event: string; status: string; conclusion: string | null;
  actor: string | null; updated_at: string; duration_seconds: number | null; html_url: string;
};

export async function fetchRuns(params: Record<string,string> = {}) {
  const qs = new URLSearchParams({ limit: '100', ...params }).toString();
  const r = await fetch(`${BASE}/runs?${qs}`);
  const j = await r.json();
  return j.data as Run[];
}

export async function fetchPassRate(days = 7) {
  const r = await fetch(`${BASE}/stats/pass-rate?days=${days}`);
  const j = await r.json();
  return j.data as { repo: string; total: number; passed: number; pass_rate: number }[];
}

export async function fetchSlowWorkflows(top = 5) {
  const r = await fetch(`${BASE}/stats/slow-workflows?top=${top}`);
  const j = await r.json();
  return j.data as { workflow_name: string; avg_sec: number; n: number }[];
}
