# DEVNOTES

These are general develop instructions


## Backend

1. Once the environment is setup ensure you setup pre-commit correctly `pip3 install pre-commit`
1. With virtualenv activiated do `pre-commit install` from project's root directory


#Docker

These are general development instructions for setting up the project.

---

# Option 1: Docker Setup (Without Dev Container)

## Prerequisites

Make sure you have:

- Docker installed
- Docker Compose installed

---

## Steps

1. Clone the repository

   git clone <repo-url>
   cd <repo-name>

2. Create environment file

   cp .env.template .env

3. Build Docker images

   docker compose build

4. Start the containers

   docker compose up -d

5. Check running containers

   docker compose ps

The application should now be running.

To stop:

   docker compose down

---

# DevConatiner

# Option 2: VS Code Dev Container Setup

We use VS Code Dev Containers for local development.

Official reference:
https://code.visualstudio.com/docs/devcontainers/containers

---

## Prerequisites

Make sure the following are installed:

- Docker
- Docker Compose
- VS Code
- Dev Containers extension (Microsoft)

---

## Steps

1. Clone the repository

   git clone <repo-url>
   cd <repo-name>

2. Create environment file

   cp .env.template .env

3. Open project in VS Code

   cd <repo-name>
   code .

4. Inside VS Code:

   Press:
   Ctrl + Shift + P  
   or  
   F1

5. Select:

   Dev Containers: Reopen in Container

6. Wait for Docker to build the dev container.

VS Code will automatically:
- Use `.devcontainer/devcontainer.json`
- Run `docker-compose.dev.yml`
- Attach to the `django` service

After build completes, you are inside the development container.
