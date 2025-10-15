import React from 'react';
export default function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="stat">{value}</div>
      {subtitle && <div style={{color:'var(--muted)',fontSize:12,marginTop:8}}>{subtitle}</div>}
    </div>
  );
}
