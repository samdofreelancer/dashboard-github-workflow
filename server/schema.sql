CREATE TABLE IF NOT EXISTS runs(
  id INTEGER PRIMARY KEY,
  repo_owner TEXT,
  repo_name TEXT,
  workflow_id INTEGER,
  workflow_name TEXT,
  run_number INTEGER,
  head_branch TEXT,
  event TEXT,
  status TEXT,
  conclusion TEXT,
  actor TEXT,
  created_at TEXT,
  updated_at TEXT,
  run_started_at TEXT,
  duration_seconds INTEGER,
  html_url TEXT
);

CREATE TABLE IF NOT EXISTS jobs(
  id INTEGER PRIMARY KEY,
  run_id INTEGER,
  name TEXT,
  status TEXT,
  conclusion TEXT,
  started_at TEXT,
  completed_at TEXT,
  runner_type TEXT
);

CREATE INDEX IF NOT EXISTS idx_runs_branch ON runs(head_branch);
CREATE INDEX IF NOT EXISTS idx_runs_updated ON runs(updated_at);
CREATE INDEX IF NOT EXISTS idx_runs_repo ON runs(repo_owner, repo_name);
