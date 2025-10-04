# -------------------------------
# Colors
# -------------------------------
pink:=$(shell tput setaf 200)
blue:=$(shell tput setaf 27)
green:=$(shell tput setaf 118)
violet:=$(shell tput setaf 057)
reset:=$(shell tput sgr0)

# -------------------------------
# OS detection
# -------------------------------
ifeq ($(shell uname),Darwin)
  os=darwin
else
  os=linux
endif

# -------------------------------
# Default environment
# -------------------------------
ENV ?= development
BACKEND_ENV_FILE=backend/.env.${ENV}
FRONTEND_ENV_FILE=frontend/.env.${ENV}

# -------------------------------
# Commands
# -------------------------------

install:
	$(info $(pink)------------------------------------------------------)
	$(info $(pink)Make ($(os)): Installing Airwave airtime Project ($(ENV))...)
	$(info $(pink)------------------------------------------------------$(reset))
	# Build and start containers
	@docker compose --env-file $(BACKEND_ENV_FILE) build
	@docker compose --env-file $(BACKEND_ENV_FILE) up --build -d
	# Backend setup'
	@docker exec -it airwave_api cp $(BACKEND_ENV_FILE) .env
# 	@docker exec -it airwave_api pnpm migrate
# 	@docker exec -it airwave_api pnpm seed
	# Frontend setup
	@docker exec -it airwave_web cp $(FRONTEND_ENV_FILE) .env

	# Restart everything
	@docker compose down
	@make -s start

start:
	$(info $(pink) Make ($(os)): Starting Airwave airtime Project ($(ENV))...)
	@docker compose --env-file $(BACKEND_ENV_FILE) up -d

stop:
	$(info $(pink) Make ($(os)): Stopping Airwave airtime Project ($(ENV))...)
	@docker compose down 

restart:
	$(info $(pink) Make ($(os)): Restarting Airwave airtime Project ($(ENV))...)
	@make -s stop
	@make -s start

logs:
	$(info $(pink) Make ($(os)): Showing logs ($(ENV))...)
	@docker compose --env-file $(BACKEND_ENV_FILE) logs -f

migrate:
	$(info $(pink) Make ($(os)): Running backend migrations ($(ENV))...)
	@docker compose --env-file $(BACKEND_ENV_FILE) run --rm backend pnpm migrate

seed:
	$(info $(pink) Make ($(os)): Running backend seeders ($(ENV))...)
	@docker compose --env-file $(BACKEND_ENV_FILE) run --rm pnpm seed
delete:
	$(info $(pink) Make ($(os)): Running backend seeders ($(ENV))...)
	@docker compose down -v 

