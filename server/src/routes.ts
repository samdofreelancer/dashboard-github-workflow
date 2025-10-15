import { Router } from 'express';
import { db } from './db.js';

export const api = Router();

api.get('/runs', (req, res) => {
  const { branch, status, conclusion, repo, limit = '100' } = req.query as Record<string,string>;
  const where: string[] = [];
  const params: any = {};
  if (branch) { where.push('head_branch = @branch'); params.branch = branch; }
  if (status) { where.push('status = @status'); params.status = status; }
  if (conclusion) { where.push('conclusion = @conclusion'); params.conclusion = conclusion; }
  if (repo) {
    const [owner, name] = repo.split('/');
    where.push('repo_owner = @owner AND repo_name = @name');
    params.owner = owner; params.name = name;
  }
  const sql = `SELECT * FROM runs ${where.length? 'WHERE ' + where.join(' AND '): ''} ORDER BY updated_at DESC LIMIT @limit`;
  const stmt = db.prepare(sql);
  const data = stmt.all({ ...params, limit: Number(limit) });
  res.json({ data });
});

api.get('/stats/pass-rate', (req, res) => {
  const { days = '7' } = req.query as Record<string,string>;
  const stmt = db.prepare(`
    SELECT repo_owner||'/'||repo_name as repo,
           COUNT(1) as total,
           SUM(CASE WHEN conclusion = 'success' THEN 1 ELSE 0 END) as passed,
           ROUND(100.0 * SUM(CASE WHEN conclusion = 'success' THEN 1 ELSE 0 END) / COUNT(1), 2) as pass_rate
    FROM runs
    WHERE datetime(updated_at) >= datetime('now', ?)
    GROUP BY repo
    ORDER BY pass_rate DESC
  `);
  const data = stmt.all(`-${Number(days)} days`);
  res.json({ data });
});

api.get('/stats/slow-workflows', (req, res) => {
  const { top = '5' } = req.query as Record<string,string>;
  const stmt = db.prepare(`
    SELECT workflow_name, AVG(duration_seconds) as avg_sec, COUNT(1) as n
    FROM runs WHERE duration_seconds IS NOT NULL
    GROUP BY workflow_name HAVING n >= 3
    ORDER BY avg_sec DESC LIMIT ?
  `);
  const data = stmt.all(Number(top));
  res.json({ data });
});
