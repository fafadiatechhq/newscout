# DEVNOTES

These are general develop instructions


## Backend

1. Once the environment is setup ensure you setup pre-commit correctly `pip3 install pre-commit`
1. With virtualenv activiated do `pre-commit install` from project's root directory

## Docker Instructions

These are general development instructions for setting up the project.

1. Option 1: Docker Setup (Without Dev Container) 
1. Option 2: VS Code Dev Container Setup

**Note:** Devcontainers have a good IDE integration as opposed to running `docker compose up`

### Option 1: Docker Setup (Without Dev Container)

Prerequisites:

1. Docker installed
1. Docker Compose installed

#### Steps

1. Clone the repository
   ```sh
   git clone <repo-url>
   cd <repo-name>
   ```
1. Create environment file `cp .env.template .env`
1. Build Docker images `docker compose build`
1. Start the containers `docker compose up -d`
1. Check running containers `docker compose ps`

The application should now be running.

To stop `docker compose down`

### Option 2: VS Code Dev Container Setup

We use VS Code Dev Containers for local development. [Official reference](https://code.visualstudio.com/docs/devcontainers/containers)


Prerequisites

Make sure the following are installed:

1. Docker
1. Docker Compose
1. VS Code
1. Dev Containers extension (Microsoft)

#### Steps

1. Clone the repository
   ```sh
   git clone <repo-url>
   cd <repo-name>
   ```
1. Create environment file `cp .env.template .env`
1. Open project in VS Code
   ```sh
   cd <repo-name>
   code .
   ```
1. Inside VS Code: Press: `Ctrl + Shift + P ` or `F1`
1. Select: `Dev Containers: Reopen in Container`
1. Wait for Docker to build the dev container.


VS Code will automatically:

1. Use `.devcontainer/devcontainer.json`
1. Run `docker-compose.dev.yml`
1.  Attach to the `django` service

After build completes, you are inside the development container.
