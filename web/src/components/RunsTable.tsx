import React from 'react';
import StatusBadge from './StatusBadge';
import type { Run } from '../lib/api';

function fmtSec(s?: number | null) {
  if (!s && s !== 0) return '-';
  const m = Math.floor(s / 60); const sec = s % 60;
  return `${m}m ${sec}s`;
}

export default function RunsTable({ rows }: { rows: Run[] }) {
  const table: React.CSSProperties = { width: '100%', fontSize: 14 };
  const th: React.CSSProperties = { textAlign: 'left', padding: 8, background: '#F1F5F9' };
  const td: React.CSSProperties = { padding: 8, borderTop: '1px solid #E2E8F0' };
  return (
    <div style={{ overflowX: 'auto', borderRadius: 16, background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Repo</th>
            <th style={th}>Workflow</th>
            <th style={th}>Branch</th>
            <th style={th}>Event</th>
            <th style={th}>Status</th>
            <th style={th}>Duration</th>
            <th style={th}>Actor</th>
            <th style={th}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td style={td}><a href={r.html_url} target="_blank">{r.repo_owner}/{r.repo_name} #{r.run_number}</a></td>
              <td style={td}>{r.workflow_name}</td>
              <td style={td}>{r.head_branch}</td>
              <td style={td}>{r.event}</td>
              <td style={td}><StatusBadge status={r.status} conclusion={r.conclusion} /></td>
              <td style={td}>{fmtSec(r.duration_seconds)}</td>
              <td style={td}>{r.actor ?? '-'}</td>
              <td style={td}>{new Date(r.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
