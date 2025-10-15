import React from 'react';

export default function StatusBadge({ status, conclusion }: { status: string; conclusion: string | null }) {
  const cls =
    status === 'completed'
      ? (conclusion === 'success' ? 'badge success' : 'badge fail')
      : 'badge warn';
  const text = status === 'completed' ? (conclusion ?? 'unknown') : status;
  const dot = (
    <span style={{
      display:'inline-block',width:6,height:6,borderRadius:'50%',
      background: conclusion === 'success' ? 'var(--success)'
        : status === 'completed' ? 'var(--danger)' : 'var(--warn)'}}/>
  );
  return <span className={cls}>{dot}{text}</span>;
}
