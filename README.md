# PharmaTrack

[![CI](https://github.com/WoodyWoodster/pharmatrack/actions/workflows/ci.yml/badge.svg)](https://github.com/WoodyWoodster/pharmatrack/actions/workflows/ci.yml)

A pharmaceutical tracking application built with FastAPI and Next.js 15.

## Tech Stack

- **API**: FastAPI (Python 3.13)
- **Frontend**: Next.js 15 with TypeScript
- **Database**: PostgreSQL 15
- **Docker**: Multi-environment setup

## Quick Start

### Prerequisites

- Docker
- Make

### Development

```bash
# Create .env.dev
cp env.dev.example .env.dev

# Start development environment
make dev

# Seed development database
make seed

# View logs
make logs

# Stop environment
make stop
```

**Access your apps:**

- Frontend: <http://localhost:3000>
- API: <http://localhost:8000>
- API Docs: <http://localhost:8000/docs>

## Production Readiness

Three key steps for real-world deployment:

### 1. **Secure CI/CD Pipeline**

- Replace `.env.prod` files with GitHub Actions + GitHub Secrets
- Inject environment variables during deployment
- Extend existing CI workflow to include deployment stages

```yaml
# .github/workflows/deploy.yml
env:
  DATABASE_PASSWORD: ${{ secrets.DATABASE_PASSWORD }}
  POSTGRES_URL: ${{ secrets.POSTGRES_URL }}
  NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
```

### 2. **Authentication & Authorization**

- Add JWT-based authentication to secure API endpoints
- Implement role-based access control (pharmacist, technician, admin roles)
- Protect drug modification endpoints (currently open to all)
- Add user session management to frontend

### 3. **Enhanced Error Handling & Monitoring**

- Add API request/response logging for production debugging
- Implement centralized error tracking (Sentry, LogRocket)
- Enhance frontend error boundaries beyond basic API connection errors
- Add performance monitoring for batch import operations

## Available Commands

Run `make help` to see all available commands:

```bash
make dev       # Start development environment
make logs      # View development logs
make stop      # Stop development environment
make seed      # Seed development database
make prod      # Start production environment
make prod-stop # Stop production environment
make clean     # Clean up containers and volumes
make shell     # Access API container shell
```

## Project Structure

```bash
pharmatrack/
├── api/                    # FastAPI backend
├── web/                    # Next.js frontend
├── docker-compose.yml      # Base configuration
├── docker-compose.dev.yml  # Development overrides
├── docker-compose.prod.yml # Production overrides
├── Makefile
└── README.md
```
