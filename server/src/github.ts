import { Octokit } from 'octokit';
import { GH_TOKEN } from './env.js';

export const gh = new Octokit({ auth: GH_TOKEN });

export function parseRepo(s: string): { owner: string; repo: string } {
  const [owner, repo] = s.split('/');
  if (!owner || !repo) throw new Error(`Invalid repo: ${s}`);
  return { owner, repo };
}
