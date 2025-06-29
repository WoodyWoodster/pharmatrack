.DEFAULT_GOAL := help

COMPOSE_DEV = docker compose -f docker-compose.yml -f docker-compose.dev.yml
COMPOSE_PROD = docker compose -f docker-compose.yml -f docker-compose.prod.yml

.PHONY: help
help:
	@echo "PharmaTrack Commands"
	@echo "==================="
	@echo ""
	@echo "Development:"
	@echo "  make dev       - Start development environment"
	@echo "  make logs      - View development logs"
	@echo "  make stop      - Stop development environment"
	@echo "  make seed      - Seed the database"
	@echo ""
	@echo "Production:"
	@echo "  make prod      - Start production environment"
	@echo "  make prod-stop - Stop production environment"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean     - Clean up containers and volumes"
	@echo "  make shell     - Access API container shell"

# Development
.PHONY: dev logs stop
dev:
	$(COMPOSE_DEV) up --build -d

logs:
	$(COMPOSE_DEV) logs -f

stop:
	$(COMPOSE_DEV) down

seed:
	docker exec -it pharmatrack-api python seed_database.py

# Production
.PHONY: prod prod-stop
prod:
	$(COMPOSE_PROD) up --build -d

prod-stop:
	$(COMPOSE_PROD) down

# Utilities
.PHONY: clean shell
clean:
	$(COMPOSE_DEV) down -v --remove-orphans
	$(COMPOSE_PROD) down -v --remove-orphans

shell:
	$(COMPOSE_DEV) exec api bash