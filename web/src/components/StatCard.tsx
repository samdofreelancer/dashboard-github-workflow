import React from 'react';

export default function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  const card: React.CSSProperties = { borderRadius: 16, boxShadow: '0 1px 8px rgba(0,0,0,.06)', background: '#fff', padding: 16 };
  const titleStyle: React.CSSProperties = { fontSize: 12, color: '#64748b' };
  const valueStyle: React.CSSProperties = { fontSize: 28, fontWeight: 700, marginTop: 4 };
  const subStyle: React.CSSProperties = { fontSize: 12, color: '#94a3b8', marginTop: 4 };
  return (
    <div style={card}>
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>{value}</div>
      {subtitle && <div style={subStyle}>{subtitle}</div>}
    </div>
  );
}
