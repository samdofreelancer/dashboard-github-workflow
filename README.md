# GitHub Actions Dashboard

A comprehensive dashboard for monitoring GitHub Actions workflows across multiple repositories. This application fetches data from GitHub's API, stores it locally in SQLite, and provides a clean web interface to visualize workflow performance, success rates, and detailed run information.

## Features

- **Real-time Data Collection**: Automatically polls GitHub API for workflow runs at configurable intervals.
- **Interactive Dashboard**: View key metrics like pass rates, run counts, and slowest workflows.
- **Advanced Filtering**: Filter runs by repository, branch, status, and more.
- **Detailed Run Views**: Table displaying runs with status badges, durations, actors, and direct GitHub links.
- **Statistics API**: Endpoints for analyzing pass rates and workflow performance.
- **Local Persistence**: SQLite database for storing runs and jobs data with efficient indexing.

## Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- GitHub Personal Access Token with `repo` and `actions` permissions

## Quick Start

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd dashboard-github-workflow
   ```

2. **Configure the server**:
   - Navigate to the `server` directory and copy the environment template:
     ```
     cd server
     cp .env.example .env
     ```
   - Edit `.env` with your GitHub token and target repositories:
     ```
     GH_TOKEN=ghp_your_personal_access_token
     REPOS=your-org/repo1,your-org/repo2
     POLL_INTERVAL_MS=120000  # 2 minutes
     PORT=4000
     ```

3. **Install server dependencies and start**:
   ```
   npm install
   npm run dev
   ```

4. **In a new terminal, set up the web app**:
   ```
   cd ../web
   npm install
   npm run dev
   ```

5. **Access the dashboard** at `http://localhost:5173`.

**Note**: If no data appears initially, wait for the polling cycle (~2 minutes) or manually trigger data collection with `npm run collect-once` in the server directory.

## How It Works

### Data Collection Process

The backend continuously gathers workflow data:

1. **Scheduled Polling**: Runs every 2 minutes (configurable) to fetch latest runs from GitHub.
2. **Repository Iteration**: Processes each configured repository, retrieving the most recent 50 workflow runs.
3. **Comprehensive Data**: Captures run metadata (status, conclusion, duration) and associated job details.
4. **Database Upserts**: Inserts new data or updates existing records to maintain accuracy.
5. **On-Demand Collection**: Use `npm run collect-once` for immediate data refresh.

### Dashboard Interface

The React-based frontend offers:

1. **Metrics Overview**:
   - **7-Day Pass Rate**: Success percentage for the selected repository.
   - **Loaded Runs**: Count of currently displayed runs (up to 50 per repo).
   - **Slowest Workflow**: Identifies the most time-consuming workflow (requires ≥3 runs).

2. **Dynamic Filtering**:
   - Repository input (format: `owner/repo`)
   - Branch filtering
   - Status selection (any, completed, in_progress, queued)
   - Manual refresh button

3. **Runs Table**:
   - Columns: Repository, Workflow, Branch, Event, Status, Duration, Actor, Last Updated
   - Clickable repository links to GitHub Actions
   - Color-coded status indicators
   - Empty state messaging with refresh prompts

## Project Structure

```
dashboard-github-workflow/
├── server/                    # Backend API server
│   ├── src/
│   │   ├── index.ts          # Express server setup
│   │   ├── routes.ts         # API endpoints
│   │   ├── collector.ts      # GitHub data fetching
│   │   ├── db.ts             # SQLite operations
│   │   ├── github.ts         # GitHub API utilities
│   │   └── env.ts            # Environment config
│   ├── schema.sql            # Database schema
│   ├── package.json          # Server dependencies
│   └── .env.example          # Environment template
├── web/                      # Frontend React app
│   ├── src/
│   │   ├── App.tsx           # Main dashboard component
│   │   ├── main.tsx          # App entry point
│   │   ├── style.css         # Global styles
│   │   ├── lib/api.ts        # API client
│   │   └── components/       # UI components
│   │       ├── RunsTable.tsx # Runs display table
│   │       ├── StatusBadge.tsx # Status indicators
│   │       └── StatCard.tsx  # Metric cards
│   ├── index.html            # HTML template
│   └── package.json          # Web dependencies
└── README.md                 # This file
```

## API Reference

### Endpoints

- `GET /api/runs` - Retrieve workflow runs
  - Query params: `repo`, `branch`, `status`, `conclusion`, `limit`
- `GET /api/stats/pass-rate` - Get pass rate stats
  - Query params: `days` (default: 7)
- `GET /api/stats/slow-workflows` - Get slowest workflows
  - Query params: `top` (default: 5)
- `GET /health` - Server health check

### Data Types

```typescript
type Run = {
  id: number;
  repo_owner: string;
  repo_name: string;
  workflow_name: string;
  run_number: number;
  head_branch: string;
  event: string;
  status: string;
  conclusion: string | null;
  actor: string | null;
  updated_at: string;
  duration_seconds: number | null;
  html_url: string;
};
```

## Database Schema

SQLite tables with indexes for performance:

- **runs**: Workflow run data (id, repo, workflow, status, timestamps, etc.)
- **jobs**: Job details linked to runs (id, run_id, name, status, etc.)

Indexes on: branch, updated_at, repo_owner/repo_name.

## Development

### Server Development
```
cd server
npm run dev          # Start with hot reload
npm run collect-once # Manual data collection
npm run build        # TypeScript compilation
npm start            # Production server
```

### Web Development
```
cd web
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview built app
```

### Environment Variables

**Server (.env)**:
- `GH_TOKEN`: GitHub Personal Access Token
- `REPOS`: Comma-separated list of `owner/repo`
- `POLL_INTERVAL_MS`: Polling interval (default: 120000ms)
- `PORT`: Server port (default: 4000)

**Web**:
- `VITE_API_BASE`: API base URL (default: http://localhost:4000/api)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

- **Empty dashboard**: Ensure GH_TOKEN has correct permissions and REPOS are valid
- **Connection errors**: Check if server is running on port 4000
- **No data after refresh**: Run `npm run collect-once` in server directory
- **Build issues**: Ensure Node.js ≥16 and run `npm install` in both directories

## License

This project is provided as-is for educational and personal use. Ensure compliance with GitHub's API terms of service when using this application.
