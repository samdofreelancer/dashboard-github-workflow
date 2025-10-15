import React, { useEffect, useMemo, useState } from 'react';
import { fetchRuns, fetchPassRate, fetchSlowWorkflows, type Run } from './lib/api';
import RunsTable from './components/RunsTable';
import StatCard from './components/StatCard';

export default function App() {
  const [rows, setRows] = useState<Run[]>([]);
  const [repo, setRepo] = useState('samdofreelancer/money-keeper');
  const [branch, setBranch] = useState('');
  const [passRate, setPassRate] = useState<{repo: string; pass_rate: number}[]>([]);
  const [slow, setSlow] = useState<{workflow_name: string; avg_sec: number; n: number}[]>([]);

  async function load() {
    const [r, pr, sl] = await Promise.all([
      fetchRuns({ repo, branch }),
      fetchPassRate(7),
      fetchSlowWorkflows(5)
    ]);
    setRows(r);
    setPassRate(pr.map(x => ({ repo: x.repo, pass_rate: x.pass_rate })));
    setSlow(sl);
  }

  useEffect(() => { load(); }, [repo, branch]);

  const pass = useMemo(() => passRate.find(x => x.repo === repo)?.pass_rate ?? 0, [passRate, repo]);

  const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16 };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>GitHub Actions Dashboard</h1>

      <div style={grid}>
        <StatCard title="Pass rate (7d)" value={`${pass.toFixed(1)}%`} />
        <StatCard title="Runs loaded" value={`${rows.length}`} />
        <StatCard title="Slowest workflow" value={slow[0] ? `${slow[0].workflow_name}` : '-'} subtitle={slow[0] ? `~ ${Math.round(slow[0].avg_sec/60)}m (n≥3)` : ''} />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'end', marginTop: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: 12, color: '#64748b' }}>Repo</label>
          <input style={{ border: '1px solid #CBD5E1', borderRadius: 6, padding: '6px 8px' }} value={repo} onChange={e => setRepo(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: 12, color: '#64748b' }}>Branch</label>
          <input style={{ border: '1px solid #CBD5E1', borderRadius: 6, padding: '6px 8px' }} value={branch} onChange={e => setBranch(e.target.value)} placeholder="develop | main" />
        </div>
        <button onClick={load} style={{ padding: '8px 12px', borderRadius: 8, background: '#0f172a', color: '#fff' }}>Refresh</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <RunsTable rows={rows} />
      </div>
    </div>
  );
}
