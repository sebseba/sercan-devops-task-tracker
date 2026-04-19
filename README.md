# DevOps final project with CI/CD, Jenkins and Azure Boards
##devops-task-tracker

A small **Node.js + Express** task tracker built for a DevOps final project. It is intentionally simple so you can demo it live, while the repository layout supports **Azure DevOps Boards**, **Git branching**, **Jenkins pipelines**, and **SonarQube** analysis the way many college rubrics expect.

## Purpose

- Show a working web app with a minimal UI and REST API.
- Practice work item tracking (Azure Boards or GitHub Issues), branches, and pull requests.
- Run automated **install → analysis → build → test → deliver → mock deploy** stages in Jenkins.
- Run static analysis and coverage reporting with SonarQube.

## Features

- **Health check** — `GET /health` for monitoring and smoke tests.
- **List tasks** — `GET /api/tasks` returns all in-memory tasks.
- **Add task** — `POST /api/tasks` with JSON `{ "title": "..." }`.
- **Update status** — `PATCH /api/tasks/:id/status` with JSON `{ "status": "pending" | "in-progress" | "done" }`.
- **Simple demo UI** — open the app in a browser; static files are served from `public/`.

## Validation (good for “bugfix” PR stories)

- Empty or whitespace-only titles are **rejected** (`400`).
- Duplicate titles (case-insensitive, trimmed) are **rejected** (`409`).
- Unknown task id on status update → `404`.
- Invalid status values → `400`.

## Install

Requires **Node.js 18+** (for `node --watch` in the `dev` script). If you use an older Node version, run `npm start` only, or change `dev` to a tool you prefer.

```bash
cd devops-task-tracker
npm install
```

## Run locally

```bash
npm start
```

Then visit:

- **UI:** [http://localhost:3000](http://localhost:3000)
- **Health:** [http://localhost:3000/health](http://localhost:3000/health)

For auto-restart on file changes (Node 18+):

```bash
npm run dev
```

## Tests and coverage

```bash
npm test
npm run test:coverage
```

Coverage reports are written to the `coverage/` folder (HTML + `lcov.info` for SonarQube).

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | JSON `{ status, service }` — liveness check |
| `GET` | `/api/tasks` | Array of tasks |
| `POST` | `/api/tasks` | Body: `{ "title": string }` — creates `pending` task |
| `PATCH` | `/api/tasks/:id/status` | Body: `{ "status": "pending" \| "in-progress" \| "done" }` |

## Jenkins pipeline summary

The `Jenkinsfile` is **declarative** and uses **`pollSCM`** so Jenkins can check your repo on a schedule.

Stages (in order):

1. **Checkout** — get source from SCM.
2. **Install** — `npm ci` (fallback to `npm install`).
3. **SonarQube Analysis** — placeholder + commented `withSonarQubeEnv` / `sonar-scanner` (enable after Jenkins is configured).
4. **Build** — sanity check with `node -c` (no TypeScript compile step).
5. **Test** — `npm run test:coverage`.
6. **Deliver** — zip project into `deliverables/` (excludes `node_modules`, `coverage`, `.git`).
7. **Deploy to Dev** — mock: copy key folders into `deploy/dev` and echo a simulated `npm start`.
8. **Deploy to QAT / Staging / Production** — mock: promote copies between `deploy/...` folders with echo messages.

**Note:** The pipeline uses **Unix shell** (`sh`) and `zip`, which matches a typical **Linux Jenkins agent**. If your agent is Windows-only, adapt those steps to `bat` or use a Linux label.

## SonarQube

Configuration lives in `sonar-project.properties`. After tests run, point SonarQube at `coverage/lcov.info` (already wired in the properties file). `node_modules`, `coverage`, and generated deploy folders are excluded from analysis.

## Suggested GitHub / Azure Boards workflow

Use **two feature** issues and **two bugfix** issues to practice boards, branches, and PRs. Even if the code on `main` already includes the behavior below, you can still **tell the story** in your report: each branch represents the kind of change you would merge in a real sprint.

### Example issues (copy into GitHub Issues or Azure DevOps work items)

| Type | Title | Description |
|------|-------|-------------|
| Feature | Add task creation endpoint | Implement `POST /api/tasks` with validation and tests. |
| Feature | Add task listing and status update | Implement `GET /api/tasks` and `PATCH /api/tasks/:id/status` plus UI wiring. |
| Bug | Fix empty task validation | Reject blank titles; return `400` with a clear JSON message. |
| Bug | Fix duplicate title validation | Prevent duplicate task names (trim + case-insensitive compare); return `409`. |

### Suggested branch names

- `1-feature-add-task-creation`
- `2-feature-list-and-status-update`
- `3-bugfix-empty-title-validation`
- `4-bugfix-duplicate-title-validation`

Typical flow: create issue → create branch from `main` → implement → open PR → squash/merge → link work item in Azure Boards or “Closes #n” in GitHub.

## Manual setup after copying the project (Jenkins + SonarQube)

### Jenkins

1. Create a **Multibranch Pipeline** or **Pipeline** job pointing at this repository.
2. Ensure the agent has **Node.js** and **npm** on `PATH` (or use the NodeJS tool plugin).
3. For **Deliver**, ensure `zip` is installed (common on Linux agents).
4. **SonarQube Scanner:** Install the [SonarQube Scanner](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/) on the agent and register it in Jenkins as a tool named `sonar-scanner` (or change the `Jenkinsfile` tool name to match yours).
5. Install the **SonarQube Server** Jenkins plugin; add your SonarQube server under **Manage Jenkins → Configure System**.
6. Uncomment the `withSonarQubeEnv('SonarQube') { sh 'sonar-scanner' }` block in the `Jenkinsfile` and set the **credentials/configuration name** to match your Jenkins SonarQube installation (often `SonarQube` or a custom name).
7. Add a **`SONAR_TOKEN`** (or use the plugin’s token injection) if your SonarQube server requires authentication for analysis.

### SonarQube (server UI)

1. Create a project; use **`devops-task-tracker`** as the project key (must match `sonar.projectKey` in `sonar-project.properties`) or update the properties file to match your server project.
2. Generate a **token** for the scanner user and store it in Jenkins (Secret text / SonarQube server config).
3. Run `npm run test:coverage` before analysis (your Jenkins **Test** stage already does this) so `coverage/lcov.info` exists for the **SonarQube** stage.

---

This project is **in-memory only** (no database), **no Docker required**, and **no React** — optimized for clarity and a short live demo.
