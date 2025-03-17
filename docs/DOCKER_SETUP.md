# TMA - Docker Setup Guide

## Overview
This guide explains how to set up and run the **Test Management App** using Docker and `docker-compose`. It includes configurations for different development scenarios.

## Prerequisites
Before running the application, ensure you have installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Docker Compose Configuration
The project uses a single `docker-compose.yml` file with **Docker Compose profiles** to control which services start.

### Available Profiles
| Profile  | Services Started           |
|----------|----------------------------|
| (default) | PostgreSQL only              |
| `frontend` | PostgreSQL + Frontend       |
| `backend`  | PostgreSQL + Backend        |
| `*` (no profile) | PostgreSQL + Backend + Frontend |

### Example Commands for dev environment

#### 1. Full Development Environment (All Services: Backend, Frontend, DB)
```sh
docker-compose --env-file .env.dev --profile * up -d
```

#### 2. Backend Developer Mode (Backend + DB)
```sh
docker-compose --env-file .env.dev --profile backend up -d
```

#### 3. Frontend Developer Mode (Frontend + DB)
```sh
docker-compose --env-file .env.dev --profile frontend up -d
```

#### 4. Database Only Mode (Default, Only DB)
```sh
docker-compose --env-file .env.dev up -d
```

## Stopping and Cleaning Up
To stop the running containers:
```sh
docker-compose down
```

To remove all containers, volumes, and networks:
```sh
docker-compose down -v
```

## Debugging and Logs
To check logs for a specific service, use:
```sh
docker logs -f <container_name>
```
For example, to view backend logs:
```sh
docker logs -f dev_backend
```

## Additional Notes
- Developers should use **Docker Compose profiles** instead of manually commenting out services.
- If you encounter port conflicts, update the ports section in `docker-compose.yml`.
- You can modify environment variables directly in the `docker-compose.yml` file.

---
This guide should help you quickly set up and run your development environment using Docker. 🚀

