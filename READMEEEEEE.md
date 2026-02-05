# LMWN Frontend Assignment

A full-stack application with API Gateway and Web frontend, demonstrating guides and restaurants data management.

## 🚀 Quick Start

### Option 1: Docker

**Prerequisites:**
- Docker Desktop installed and running

**1. Build the application:**

```bash
docker compose build --no-cache
```

Wait for all services to start, then:

**2. Start the application:**

```bash
docker compose up -d
```

**🌐 Web Application: http://localhost:3000**

**Services Running:**
- Web App: http://localhost:3000
- API Gateway: http://localhost:3001
- Backend Services: Ports 7777, 8888, 9999

**Stop the application:**

```bash
docker compose down
```

---

### Option 2: Development Mode (pnpm)

**Prerequisites:**
- Node.js
- pnpm

**1. Install dependencies:**

```bash
pnpm install
```

**2. Start all the services**

```bash
pnpm dev
```

**3. Configure environment variables**

Copy the `.env.example` file into the `api-gateway/` and `web/` directories.

API Gateway will run on http://localhost:3001

Web app will run on http://localhost:3000

---

## 📋 API Gateway Endpoints

### Health Check
```
GET http://localhost:3001/api/health
```

### Guides
```
GET http://localhost:3001/api/v1/guides
GET http://localhost:3001/api/v1/guide/:guideId/items
```

---

## 🏗️ Project Structure

```
.
├── api-gateway/                # Express.js (TS) API Gateway
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── web/                        # React (TS) Frontend
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── shared/                     # Shared packages
│   ├── schemas/                # Zod validation
│   ├── types/                  # Basic types
│   └── tests/                  # Shared test fixtures
├── data-services.Dockerfile    # Backend mock services
├── docker-compose.yml          # Docker orchestration
└── pnpm-workspace.yaml
```

- Tests are marked with `*.test.{ts,tsx}` and will always be in a `__tests__` directory.

---

## 🧪 Running Tests

**Run all tests:**
```bash
pnpm test
```

**API Gateway tests:**
```bash
cd api-gateway
pnpm test
```

**Web tests:**
```bash
cd web
pnpm test
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- TanStack Query
- Material UI
- TailwindCSS

**Backend:**
- Express.js
- TypeScript
- Axios

**DevOps:**
- Docker & Docker Compose

**Testing:**
- vitest
- supertest

---

## 📝 Environment Variables

### API Gateway
- `PORT` - Server port (default: 3001)
- `CORS_ALLOWED_ORIGINS` - Allowed origins (default: http://localhost:3000)
- `CORS_CREDENTIAL` - Whether to allow credentials in CORS requests. (default: true)
- `GUIDE_SERVICE_URL` - Guide service URL
- `RESTAURANT_SERVICE_URL` - Restaurant service URL

### Web
- `VITE_API_URL` - API base URL (default: http://localhost:3001/api/v1)
- `VITE_API_TIMEOUT` - API timeout in ms (default: 10000)
- `VITE_DEFAULT_QUERY_STALE_TIME` - Duration before query data is considered stale. (default: 30000)

---

## 🐛 Troubleshooting

**Port conflicts:**
- Make sure ports 3000, 3001, 7777, 8888, and 9999 are available
- Stop other services using these ports

---

## 👨‍💻 Author

**Tung Dude**
- GitHub: [@TungDude](https://github.com/TungDude)
- Project repository: [repo](https://github.com/TungDude/lmwn-2026-fullstack-assignment#)

---