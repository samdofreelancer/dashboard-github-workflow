import React from 'react';
import StatusBadge from './StatusBadge';
import type { Run } from '../lib/api';

function fmtSec(s?: number | null) {
  if (!s && s !== 0) return '-';
  const m = Math.floor(s / 60); const sec = s % 60;
  return `${m}m ${sec}s`;
}

export default function RunsTable({ rows }: { rows: Run[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Repo</th>
          <th>Workflow</th>
          <th>Branch</th>
          <th>Event</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Actor</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td>
              <a className="repoLink" href={r.html_url} target="_blank" rel="noreferrer">
                {r.repo_owner}/{r.repo_name} #{r.run_number}
              </a>
            </td>
            <td>{r.workflow_name}</td>
            <td>{r.head_branch}</td>
            <td>{r.event}</td>
            <td><StatusBadge status={r.status} conclusion={r.conclusion} /></td>
            <td>{fmtSec(r.duration_seconds)}</td>
            <td>{r.actor ?? '-'}</td>
            <td>{new Date(r.updated_at).toLocaleString()}</td>
          </tr>
        ))}
        {!rows.length && (
          <tr><td colSpan={8} style={{color:'var(--muted)',padding:24}}>No runs found. Thử Refresh hoặc đổi bộ lọc.</td></tr>
        )}
      </tbody>
    </table>
  );
}
