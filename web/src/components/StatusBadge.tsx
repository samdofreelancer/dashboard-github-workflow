import React from 'react';

export default function StatusBadge({ status, conclusion }: { status: string; conclusion: string | null }) {
  const style: React.CSSProperties = {
    padding: '2px 8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
    background: status === 'completed'
      ? (conclusion === 'success' ? '#DCFCE7' : '#FEE2E2')
      : '#FEF9C3',
    color: status === 'completed'
      ? (conclusion === 'success' ? '#166534' : '#991B1B')
      : '#854D0E'
  };
  const text = status === 'completed' ? (conclusion ?? 'unknown') : status;
  return <span style={style}>{text}</span>;
}
