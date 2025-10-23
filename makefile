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
	$(info $(pink)Make ($(os)): Installing Airwave airtime  ($(ENV))...)
	$(info $(pink)------------------------------------------------------$(reset))
	# Build and start containers
# 	@docker compose --env-file $(BACKEND_ENV_FILE) build
	@docker compose build
# 	@docker compose --env-file $(BACKEND_ENV_FILE) up --build -d
	@docker compose up --build -d

start:
	$(info $(pink) Make ($(os)): Starting Airwave airtime  ($(ENV))...)
	@docker compose up --build -d

stop:
	$(info $(pink) Make ($(os)): Stopping Airwave airtime  ($(ENV))...)
	@docker compose down 

restart:
	$(info $(pink) Make ($(os)): Restarting Airwave airtime ($(ENV))...)
	@make -s stop
	@make -s start

logs:
	$(info $(pink) Make ($(os)): Showing logs ($(ENV))...)
	@docker compose logs -f

delete:
	$(info $(pink) Make ($(os)): Terminating docker containers ($(ENV))...)
	@docker compose down -v 

