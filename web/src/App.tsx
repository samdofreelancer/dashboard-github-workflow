import React, { useEffect, useMemo, useState } from 'react';
import { fetchRuns, fetchPassRate, fetchSlowWorkflows, type Run } from './lib/api';
import RunsTable from './components/RunsTable';
import StatCard from './components/StatCard';
import './style.css';

export default function App() {
  const [rows, setRows] = useState<Run[]>([]);
  const [repo, setRepo] = useState('samdofreelancer/money-keeper');
  const [branch, setBranch] = useState('');
  const [status, setStatus] = useState('');
  const [passRate, setPassRate] = useState<{repo: string; pass_rate: number}[]>([]);
  const [slow, setSlow] = useState<{workflow_name: string; avg_sec: number; n: number}[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [r, pr, sl] = await Promise.all([
        fetchRuns({ repo, branch, status }),
        fetchPassRate(7),
        fetchSlowWorkflows(5)
      ]);
      setRows(r);
      setPassRate(pr.map(x => ({ repo: x.repo, pass_rate: x.pass_rate })));
      setSlow(sl);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [repo, branch, status]);

  const pass = useMemo(
    () => passRate.find(x => x.repo === repo)?.pass_rate ?? 0,
    [passRate, repo]
  );

  return (
    <div className="container">
      <div className="row" style={{justifyContent:'space-between', marginBottom:8}}>
        <h1 style={{margin:0, fontSize:24, fontWeight:800}}>GitHub Actions Dashboard</h1>
      </div>

      <div className="grid-3">
        <div className="card">
          <h2>Pass rate (7d)</h2>
          <div className="stat">{pass.toFixed(1)}%</div>
          <div className="kpiRow" style={{marginTop:8}}>
            <span className="kpiDot" style={{background:'var(--success)'}}/>
            <span>Higher is better</span>
          </div>
        </div>
        <div className="card">
          <h2>Runs loaded</h2>
          <div className="stat">{rows.length}</div>
          <div className="kpiRow" style={{marginTop:8}}>
            <span className="kpiDot" style={{background:'var(--primary)'}}/>
            <span>Latest 50 per repo</span>
          </div>
        </div>
        <div className="card">
          <h2>Slowest workflow</h2>
          <div className="stat" style={{fontSize:22}}>
            {slow[0] ? slow[0].workflow_name : '-'}
          </div>
          <div className="kpiRow" style={{marginTop:8}}>
            <span className="kpiDot" style={{background:'var(--warn)'}}/>
            <span>{slow[0] ? `~ ${Math.round(slow[0].avg_sec/60)}m (n≥3)` : 'No data'}</span>
          </div>
        </div>
      </div>

      <div className="row toolbar">
        <input className="input" value={repo} onChange={e => setRepo(e.target.value)} placeholder="owner/repo"/>
        <input className="input" value={branch} onChange={e => setBranch(e.target.value)} placeholder="develop | main"/>
        <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">status: any</option>
          <option value="completed">completed</option>
          <option value="in_progress">in_progress</option>
          <option value="queued">queued</option>
        </select>
        <button className="btn" onClick={load}>{loading ? 'Loading…' : 'Refresh'}</button>
      </div>

      <div className="tableWrap">
        <RunsTable rows={rows} />
      </div>
    </div>
  );
}
