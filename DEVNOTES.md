# DEVNOTES

General development instructions and reference for contributors.

---

## Docker

### Option 1: Docker without Dev Container

**Prerequisites:** Docker and Docker Compose installed.

```sh
git clone <repo-url>
cd newscout
cp example.env .env
docker compose build
docker compose up -d
docker compose ps
```

To stop: `docker compose down`

#### Running Management Commands

`POSTGRES_HOST=newscout-db` only resolves inside the Compose network. Run management commands inside the Django container:

```sh
docker compose -f docker-compose.dev.yml exec django python manage.py seed_test_data
```

Alternatively, override the DB host if running on the host directly (Postgres is published on `localhost:5432`):

```sh
cd backend/newscout
POSTGRES_HOST=localhost python manage.py seed_test_data
```

### Option 2: VS Code Dev Container

**Prerequisites:**

- Docker and Docker Compose installed
- VS Code with the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension

**Steps:**

1. Clone the repository and open the project root in VS Code: `code .`
2. Press `Ctrl+Shift+P` and select **Dev Containers: Reopen in Container**
3. Wait for the build (~5–10 minutes on first run). Docker will build images, start containers, and install dependencies automatically.

**Service URLs:**

| Service | URL |
|---------|-----|
| Backend (Django) | http://localhost:8000 |
| Frontend (Next.js) | http://localhost:3000 |
| OpenSearch | http://localhost:9200 |

**Default Django admin credentials** (set in `.env`):

```
DJANGO_SUPERUSER_USERNAME=newscout
DJANGO_SUPERUSER_PASSWORD=newscout
```

### Notes

- Migrations and superuser creation are handled automatically by the entrypoint script
- OpenSearch is required for `/api/v1/search/`; the entrypoint rebuilds the `articles` index and reindexes after seed
- The env template is at `backend/newscout/example.env` (includes `OPENSEARCH_HOST` / `OPENSEARCH_PORT`)
- With `DEBUG=True`, Django allows all hosts (`ALLOWED_HOSTS=["*"]`) so LAN IPs and `10.0.2.2` work without per-developer config

### Troubleshooting

**Containers not starting:**

```sh
docker ps -a
docker logs <container-name>
```

**Rebuild from scratch:**

```sh
docker compose down -v
docker compose up --build
```

---

## Backend

### Setup

1. Install pre-commit: `pip3 install pre-commit`
2. With the virtualenv activated, run `pre-commit install` from the project root

### OpenSearch Article Search

Article discovery uses **OpenSearch** (not Postgres `icontains`). The dedicated endpoint is `GET /api/v1/search/`. The existing `GET /api/v1/articles/?search=` list filter remains Postgres-backed for CRUD listing.

| Item | Detail |
|------|--------|
| Packages | `opensearch-py==3.2.0`, `django-opensearch-dsl==0.8.0` |
| Index | `articles` (see `core/documents.py` → `ArticleDocument`) |
| Autosync | `OPENSEARCH_DSL_AUTOSYNC=True` + `RealTimeSignalProcessor` — indexes on Article create/update/delete and related Category/Source/Tag changes |
| Env vars | `OPENSEARCH_HOST` (Compose DNS: `opensearch`; host: `localhost`), `OPENSEARCH_PORT` (default `9200`) |

#### Search API

`GET /api/v1/search/` (public)

Query parameters:

- `q` — full-text multi-match on title, summary, author
- Filters: `category_id`, `source_id`, `tag_id`, `is_breaking`, `trending`, `featured`, `editors_pick`, `published_after`, `published_before`
- Pagination: `limit` / `offset` (default limit 20, max 100)

Response shape:

```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": [],
  "aggregations": {
    "categories": [{"id": 1, "name": "Tech", "count": 5}],
    "sources": [],
    "tags": [],
    "flags": {"trending": 0, "featured": 0, "editors_pick": 0, "is_breaking": 0}
  }
}
```

#### Reindex Commands

Run inside the Django container after OpenSearch is healthy:

```sh
docker compose -f docker-compose.dev.yml exec django \
  python manage.py opensearch index rebuild --force

docker compose -f docker-compose.dev.yml exec django \
  python manage.py opensearch document index --force --refresh
```

The Django `entrypoint.sh` waits for OpenSearch, then rebuilds the index and reindexes documents after migrate/seed, so a fresh Compose boot is fully searchable.

---

## Frontend

### TypeScript Types

Type definitions live in `frontend/newscout/types/`. Each file should contain only interface/type definitions — no mock data, no utility functions, no component code.

#### `Comment` Interface

File: `frontend/newscout/types/comment-types.ts`

```typescript
export interface Comment {
  id: string           // Unique comment identifier
  author: string       // Name of comment author
  avatar: string       // Avatar initials or identifier
  text: string         // Comment text content
  time: string         // Human-readable timestamp (e.g. "2 hours ago")
  likes: number
  dislikes: number
  liked: boolean       // Whether the current user liked this
  disliked: boolean    // Whether the current user disliked this
  replies: Comment[]   // Nested replies (recursive)
  showReplies: boolean      // UI state: show/hide replies
  showReplyInput: boolean   // UI state: show/hide reply input
}
```

Import pattern:

```typescript
// Preferred
import type { Comment } from '@/types/comment-types'
```

Used by `components/articles/CommentSection.tsx` and `utils/comment-mock-data.ts`.

#### Type File Conventions

- IDs: always `string`
- Dates: ISO 8601 as `string` (not `Date` objects)
- Booleans: descriptive names (`liked`, `is_verified`, not `flag` or `status`)
- UI-only state (e.g. `showReplies`) belongs in the type only if shared across components; otherwise use local component state

### API Documentation Page

The `/api-docs` page is built with Next.js App Router + MDX. It fetches the live OpenAPI schema from Django and renders it dynamically.

#### Structure

```
components/api-docs/
  ApiDocsContainer.tsx   — fetches schema, renders endpoint list
  ApiDocsLayout.mdx      — MDX layout wrapper
  MDXClientWrapper.tsx   — 'use client' boundary for MDX

app/api-docs/
  page.tsx               — exports metadata, renders MDXClientWrapper
```

#### Key Notes

- MDX requires a `'use client'` boundary because it uses React context internally
- `export const metadata` must live in `page.tsx`, not inside MDX
- The schema is fetched from `GET /api/schema/?format=json` (requires `CORS_ALLOW_ALL_ORIGINS = True` in Django settings for local dev)
- Avoid Turbopack when using `@mdx-js/loader`; if you see `Cannot find module '@mdx-js/loader'`, run `npm install @mdx-js/loader`

---

## Frontend API (Next.js)

App path: `frontend/newscout/`

The web client resolves the Django API URL in `lib/api/config.ts` via `getApiBaseUrl()`:

| How you open the site | API base URL used |
|-----------------------|-------------------|
| `http://localhost:3000` | `http://localhost:8000/api/v1` |
| `http://192.168.x.x:3000` | `http://192.168.x.x:8000/api/v1` (same hostname) |

No `.env.local` is required for local Docker. Copy `frontend/newscout/.env.local.example` to `.env.local` only when you need a custom override (`NEXT_PUBLIC_API_BASE_URL`).

---

## Mobile (Flutter)

App path: `app/newscout/`

### Local Docker + `flutter run`

1. Start the API: `docker compose -f docker-compose.dev.yml up` (host port `8000`)
2. Ensure nothing else is bound to port `8000`. The Android emulator reaches the host via `10.0.2.2`. A local `manage.py runserver 8000` on `127.0.0.1` will intercept emulator traffic before Docker and cause "Could not load news". Check with `lsof -nP -iTCP:8000 -sTCP:LISTEN` and stop any host Django process if Docker is running.
3. From `app/newscout/`: `flutter run`

`ConfigProvider` initializes from `AppConfig.resolveBaseApiUrl()` (emulator detection via `device_info_plus`):

| Target | Default base URL |
|--------|------------------|
| Android emulator | `http://10.0.2.2:8000/api/v1` |
| iOS simulator / desktop | `http://127.0.0.1:8000/api/v1` |
| Flutter web (`flutter run -d chrome`) | `http://<page-hostname>:8000/api/v1` (e.g. `localhost`) |
| Physical Android device | First-launch prompt for your LAN IP (Profile → Server URL to change later) |
| Release | `https://api.newscout.in/api/v1` |

Override any build:

```bash
flutter run --dart-define=API_BASE_URL=http://192.168.x.x:8000/api/v1
```

### API Integration

The app talks to Django through `ConfigProvider` → `ApiClient` (local Docker in debug; production in release).

| Area | Service | Endpoints |
|------|---------|-----------|
| Auth | `ApiAuthService` | `/auth/login/`, `/auth/signup/`, `/auth/me/`, `/auth/logout/` |
| JWT refresh | `ApiClient` | `/auth/token/refresh/` on 401, then one retry |
| News | `ApiNewsService` | `/articles/`, `/articles/{id}/`, `/categories/` |
| Search | (OpenSearch) | `/search/` (`q`, facet filters, aggregations) |
| Bookmarks | `ApiBookmarkService` + `BookmarksProvider` | `/bookmarks/` (sync when logged in; SharedPreferences offline cache) |

Deep links to `/article/:id` without route `extra` load via `ArticleDetailLoader` → `GET /articles/{id}/`.

---

## Code Review Checklist

### Functionality

- [ ] Does the code work as expected?

### Hygiene & Readability

- [ ] Is there dead or commented-out code?
- [ ] Are variable and function names meaningful and unambiguous?
- [ ] Are things named consistently?
- [ ] Are we following the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)?
- [ ] Is the code easy to understand?

### Code Design

- [ ] Can the code be simplified further?
- [ ] Does the change affect other parts of the system?
- [ ] Is the code as modular as possible?
- [ ] Can global variables be eliminated?

### Optimizations

- [ ] Uses Next.js built-ins (`Image`, `Link`, dynamic imports) where appropriate
- [ ] Images optimized with `next/image`
- [ ] Can code be replaced by a standard library function?
- [ ] Can a dependency be removed?

---

## PR Submission Checklist

### Before Submitting

- [ ] Triage the issue and comment findings on the issue thread
- [ ] Add the issue to the project board and move the card to the correct status
- [ ] Run Prettier
- [ ] Run `npm run build` and confirm it passes
- [ ] Include migration files if the PR changes any models
- [ ] Resolve any merge conflicts
- [ ] Reference the PR in the issue via a comment
- [ ] If the PR includes a UI or workflow change, attach before/after GIFs to the issue
- [ ] Update DEVNOTES.md if the PR introduces a new feature or changes an existing workflow

### After Submitting

- [ ] Merge the feature branch into `develop`
- [ ] Run `npm run build` on `develop` and confirm it passes
- [ ] Complete testing on `develop`
