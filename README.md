# PharmaTrack

![CI](https://github.com/WoodyWoodster/pharmatrack/actions/workflows/CI/badge.svg)

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
# Start development environment
make dev

# View logs
make logs

# Stop environment
make stop
```

**Access your apps:**

- Frontend: <http://localhost:3000>
- API: <http://localhost:8000>
- API Docs: <http://localhost:8000/docs>

### Production

```bash
# Start production environment
make prod

# Stop production environment
make prod-stop
```

## Available Commands

Run `make help` to see all available commands:

```bash
make dev       # Start development environment
make logs      # View development logs
make stop      # Stop development environment
make prod      # Start production environment
make prod-stop # Stop production environment
make clean     # Clean up containers and volumes
make shell     # Access API container shell
```

## Environment Variables

Create these files for environment-specific settings:

**Development:**

```bash
cp env.dev.example .env.dev
# Edit .env.dev with your development settings
```

**Production:**

```bash
cp env.prod.example .env.prod
# Edit .env.prod with your production settings
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
