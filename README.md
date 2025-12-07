2# Food Wizard

A simple app to help you find the best food for you.

## Tech Stack

- Postgres
- Express.js
- React.js
- Node.js
- Tailwind CSS
- Vite
- Sequelize
- Axios
- Dotenv

## API: Spoonacular for Nutrition Data & Recipes

Spoonacular API for Nutrition Data & Recipes:

- Main docs: https://spoonacular.com/food-api/docs
- Search endpoint: https://spoonacular.com/food-api/docs#Search-Ingredients
- Details endpoint: https://spoonacular.com/food-api/docs#Get-Ingredient-Information
- Dashboard: https://spoonacular.com/food-api/console

## Server Setup & Environment Variables

### Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create the Database**:
   ```
   psql -U postgres
   CREATE DATABASE food_wizard_db;
   \q
   ```
3. Tables will be automatically created when server starts

### Environment Variables

Copy `.env.example` to `.env` at the repo root and fill in values. The server loads from the root `.env`.

```
PORT=5000
DB_NAME=food_wizard_db
DB_USERNAME=postgres_username
DB_PASSWORD=postgres_password
DB_HOST=localhost
DB_PORT=5432
SPOONACULAR_API_KEY=your_api_key_here
```

## Installing Dependencies

From the Root Folder run:

```
npm install
```

## Running the Application

This app uses a separate frontend & backend architecture:

1. **Backend (Express Server)**

   ```
   cd server
   npm start
   ```

2. **Frontend (React/Vite)**
   ```
   npm run dev
   ```

Epic: Dockerize Food-Wizard Codebase

Goal: Containerize the Food-Wizard PERN application so it can run consistently across environments, with separate configurations for development and production.

---

Phase 1 – Environment Setup & Discovery

Epic Description: Prepare local and cloud environments, confirm dependencies, and standardize configuration files.

Stories:

1. Audit Current Repo Structure

Review client (Vite + Tailwind) and server (Express + Sequelize) folder structure.

Identify required environment variables (DB, API keys, ports).

Confirm package.json scripts for both client and server.

2. Standardize Environment Files

Create server/.env and server/.env.docker.

Add client/.env with VITE_API_URL variable.

Document environment usage in README.md.

3. Install Docker Desktop

Confirm local Docker version (docker --version).

Enable Compose v2.

Verify system can run Node + Postgres containers.

---

Phase 2 – Backend Dockerization

Epic Description: Build and verify the backend (Express + Sequelize) container.

Stories:

1. Create Backend Dockerfile

Write server/Dockerfile with node:20-alpine base.

Copy dependencies, install packages, expose port 5000.

Set CMD to npm start.

2. Add .dockerignore File

Exclude node_modules, dist, .env, and local cache files.

3. Validate Local Backend Container

Build and run:

docker build -t food-wizard-server ./server
docker run -p 5000:5000 food-wizard-server

Confirm Express API responds on http://localhost:5000.

---

Phase 3 – Frontend Dockerization

Epic Description: Build, test, and serve the client (Vite + Tailwind) via nginx in production and via hot-reload in dev.

Stories:

1. Create Frontend Dockerfile

Write Dockerfile.client at root.

Build static Vite assets.

Serve via nginx in the final stage.

2. Add Client .dockerignore

Exclude node_modules, .env, dist.

3. Verify Build & Serve

Build:

docker build -f Dockerfile.client -t food-wizard-client .
docker run -p 8080:80 food-wizard-client

Confirm frontend accessible at http://localhost:8080.

---

Phase 4 – Docker Compose Integration

Epic Description: Connect all services (frontend, backend, Postgres) into a unified Compose setup.

Stories:

1. Create docker-compose.dev.yml for Hot Reload

Link client → server → Postgres.

Mount volumes for live code updates.

Verify API & UI sync properly.

2. Create docker-compose.yml for Production

Remove volumes, use built images.

Serve frontend via nginx.

Include database volume persistence.

3. Run Integration Tests

docker compose up --build

Validate network links between containers.

Confirm Sequelize connects to postgres host internally.

---

Phase 5 – QA, Documentation & Delivery

Epic Description: Final validation, documentation, and PR submission.

Stories:

1. Add Docker Instructions to README

Include environment setup, build, and run commands.

Provide clear dev vs prod usage examples.

2. Implement Health Check

Add /health endpoint on server.

Use for container health monitoring.

3. Peer Review & Merge

Open PR titled “Dockerization Completed”.

Include screenshots or logs of successful builds.

4. Tag Release

Tag as v1.0.0-dockerized.

Push to GitHub main branch

---

## Docker Deployment Guide

The app now ships with just the essentials for containers:

- `Dockerfile` – a multi-stage build that exposes `server` and `web` targets so the API and frontend images can be produced from the same source without extra files.
- `docker-compose.yml` – orchestrates Postgres, the API, and the frontend with healthchecks and persistent volumes.
- `docker/nginx.conf` – nginx config that adds the `/healthz` endpoint and forces SPA fallbacks; no other helper scripts are needed.

### 1. Configure Environment

1. Copy `.env.example` to `.env` and update at least `SPOONACULAR_API_KEY`.  
   Keep `DB_HOST=db` so the API talks to the Compose Postgres service.  
   Adjust `VITE_API_BASE_URL` if you expose the API on something other than `http://localhost:5000`.
2. For other environments, point Compose at a different env file: `docker compose --env-file .env.prod up -d`.
3. Long-term secrets should live in a vault (AWS Secrets Manager, Doppler, etc.); mount them as env vars or files instead of baking them into container images.

### 2. Build & Run Locally

```bash
docker compose up --build
```

This builds the server + client images and starts all three services. Ports exposed to the host:

- Frontend → http://localhost:4173
- API → http://localhost:5000 (`/api/health` is used for the container healthcheck)

The Postgres container is only reachable inside the Compose network by default to reduce host surface area. If you need `psql` locally, temporarily add a `ports` block for the `db` service.

### 3. Verify Health & Data

- Frontend: `curl -f http://localhost:4173/healthz`
- API: `curl -f http://localhost:5000/api/health`
- Database readiness is managed entirely by Compose: the API service waits until the Postgres healthcheck passes before it starts.
- Persistent storage:
  - `db-data` volume stores Postgres data files.
  - `search-backups` volume stores JSON search history files created by `server/utils/searchHelpers.js`.

### 4. Useful Commands

```bash
# Follow logs from a single service
docker compose logs -f server

# Inspect the Postgres DB interactively
docker compose exec db psql -U "$POSTGRES_USER" "$POSTGRES_DB"

# Drop everything (containers + volumes)
docker compose down -v
```

### 5. Overrides

- Override one-off values inline: `VITE_API_BASE_URL=https://api.example.com docker compose up --build`.
- Pass a different env file per environment with `--env-file`.
- Build args are forwarded through Compose, so CI/CD can bake prod URLs into the frontend image without editing files.

Containers run as non-root users where possible, expose only the needed ports, and include Docker healthchecks so Compose can restart unhealthy services automatically. Following these steps keeps local dev parity with production-style builds while keeping the Docker surface area minimal.
