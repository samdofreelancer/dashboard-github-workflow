import { gh, parseRepo } from './github.js';
import { upsertRun, upsertJob } from './db.js';
import { REPOS } from './env.js';

export async function collectOnce() {
  for (const r of REPOS) {
    const { owner, repo } = parseRepo(r);
    const runsResp = await gh.request('GET /repos/{owner}/{repo}/actions/runs', {
      owner, repo, per_page: 50
    });

    for (const run of runsResp.data.workflow_runs) {
      const duration = run.run_started_at && run.updated_at
        ? Math.max(0, (new Date(run.updated_at).getTime() - new Date(run.run_started_at).getTime())/1000 | 0)
        : null;

      upsertRun.run({
        id: run.id,
        repo_owner: owner,
        repo_name: repo,
        workflow_id: run.workflow_id,
        workflow_name: run.name,
        run_number: run.run_number,
        head_branch: run.head_branch,
        event: run.event,
        status: run.status,
        conclusion: run.conclusion,
        actor: run.actor?.login,
        created_at: run.created_at,
        updated_at: run.updated_at,
        run_started_at: run.run_started_at,
        duration_seconds: duration,
        html_url: run.html_url
      });

      if (["queued","in_progress","waiting","completed"].includes(run.status ?? '')) {
        const jobsResp = await gh.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
          owner, repo, run_id: run.id, per_page: 100
        });
        for (const j of jobsResp.data.jobs) {
          upsertJob.run({
            id: j.id,
            run_id: run.id,
            name: j.name,
            status: j.status,
            conclusion: j.conclusion,
            started_at: j.started_at,
            completed_at: j.completed_at,
            runner_type: (j.runner_name ?? String(j.runner_group_id ?? ''))
          });
        }
      }
    }
  }
}
