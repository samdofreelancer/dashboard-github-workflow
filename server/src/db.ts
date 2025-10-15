import Database from 'better-sqlite3';
import fs from 'fs';

export const db = new Database('actions.db');
const schema = fs.readFileSync(new URL('../schema.sql', import.meta.url), 'utf8');
db.exec(schema);

export const upsertRun = db.prepare(`
INSERT INTO runs(id, repo_owner, repo_name, workflow_id, workflow_name, run_number,
  head_branch, event, status, conclusion, actor,
  created_at, updated_at, run_started_at, duration_seconds, html_url)
VALUES(@id,@repo_owner,@repo_name,@workflow_id,@workflow_name,@run_number,
  @head_branch,@event,@status,@conclusion,@actor,
  @created_at,@updated_at,@run_started_at,@duration_seconds,@html_url)
ON CONFLICT(id) DO UPDATE SET
  status=excluded.status,
  conclusion=excluded.conclusion,
  updated_at=excluded.updated_at,
  duration_seconds=excluded.duration_seconds;
`);

export const upsertJob = db.prepare(`
INSERT INTO jobs(id, run_id, name, status, conclusion, started_at, completed_at, runner_type)
VALUES(@id,@run_id,@name,@status,@conclusion,@started_at,@completed_at,@runner_type)
ON CONFLICT(id) DO UPDATE SET
  status=excluded.status,
  conclusion=excluded.conclusion,
  completed_at=excluded.completed_at;
`);
