# DEVNOTES

These are general develop instructions

## Code Review Checklist

### Functionality

- [ ] Does the code work as expected?

### Hygiene & Readability

- [ ] Is there a dead/commented-out code?
- [ ] Are variable/function names meaningful and unambiguous?
- [ ] Are things names consistently?
- [ ] Are we following the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)?
- [ ] Is Code Easily understood?

### Code Design

- [ ] Can Code be simplified further?
- [ ] Does the change we're making affect other parts of the system?
- [ ] Is the code modular as possible?
- [ ] Can we get rid of global variables?

### Optimizations

- [ ] Uses Next.js built-ins (Image, Link, dynamic imports) where appropriate
- [ ] Images optimized with next/image
- [ ] Can code be replaced by standard library function?
- [ ] Can we get rid of dependency?

## PR Submission Checklist

### Before Submitting PR

- [ ] Ensure we have triaged the issue and commented-out the findings on the issue
- [ ] Ensure we have add the issue in project and moved the card according to its status
- [ ] Ensure we've run Prettier
- [ ] Ensure the `npm run build` command has been run
- [ ] Ensure we have added migrations file as well if PR includes models changes.
- [ ] Ensure any merge conflicts are solve for PR
- [ ] Ensure you've referenced PR in Issue via comments
- [ ] If PR includes UI change/Workflow change please include `before` and `after` GIF inside the issue
- [ ] Did we update DEVNOTES.md file for any changes? (E.g. New Feature, Changes to existing workflow)

### After Submitting PR

- [ ] Merge the feature branch to `develop` branch
- [ ] Ensure the `npm run build` command has been run on `develop` branch
- [ ] Ensure the testing is done on `develop` branch

## Backend

1. Once the environment is setup ensure you setup pre-commit correctly `pip3 install pre-commit`
1. With virtualenv activiated do `pre-commit install` from project's root directory

### OpenSearch article search

Article discovery uses **OpenSearch** (not Postgres `icontains`). The dedicated
endpoint is `GET /api/v1/search/`. The existing `GET /api/v1/articles/?search=`
list filter remains Postgres-backed for CRUD listing.

| Piece | Detail |
|-------|--------|
| Packages | `opensearch-py==3.2.0`, `django-opensearch-dsl==0.8.0` |
| Index | `articles` (see `core/documents.py` → `ArticleDocument`) |
| Autosync | `OPENSEARCH_DSL_AUTOSYNC=True` + `RealTimeSignalProcessor` indexes on Article create/update/delete and related Category/Source/Tag changes |
| Env | `OPENSEARCH_HOST` (Compose DNS: `opensearch`; host: `localhost`), `OPENSEARCH_PORT` (default `9200`) |

#### Search API

`GET /api/v1/search/` (public)

Query params:

- `q` — full-text multi-match on title, summary, author
- Filters: `category_id`, `source_id`, `tag_id`, `is_breaking`, `trending`, `featured`, `editors_pick`, `published_after`, `published_before`
- Pagination: `limit` / `offset` (default limit 20, max 100)

Response includes `count`, `next`, `previous`, `results` (Article-shaped objects from the index), and `aggregations`:

- `categories` / `sources` / `tags` — `[{id, name, count}, ...]`
- `flags` — `{trending, featured, editors_pick, is_breaking}` counts

#### Reindex commands

Run inside the Django container (after OpenSearch is healthy):

```sh
docker compose -f docker-compose.dev.yml exec django \
  python manage.py opensearch index rebuild --force
docker compose -f docker-compose.dev.yml exec django \
  python manage.py opensearch document index --force --refresh
```

The Django `entrypoint.sh` waits for OpenSearch, then rebuilds the index and
reindexes documents after migrate/seed so a fresh Compose boot is searchable.

## Mobile (Flutter)

App path: `app/newscout/`

### Local Docker + `flutter run`

1. Start the API: `docker compose -f docker-compose.dev.yml up` (host port `8000`)
2. Ensure nothing else is bound to port `8000` on the host. The Android emulator reaches the host via `10.0.2.2`, which resolves to `127.0.0.1` on macOS. A local `manage.py runserver 8000` on `127.0.0.1` will intercept emulator traffic before Docker and cause `Could not load news`. Check with `lsof -nP -iTCP:8000 -sTCP:LISTEN` and stop any host Django process if Docker is running.
3. From `app/newscout/`: `flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8000/api/v1`

Debug/profile builds resolve `AppConfig.baseApiUrl` automatically:

- Android emulator: `http://10.0.2.2:8000/api/v1`
- iOS simulator / desktop: `http://127.0.0.1:8000/api/v1`

Release builds use production: `https://api.newscout.in/api/v1`.

Override any build (e.g. physical device on LAN):

```bash
flutter run --dart-define=API_BASE_URL=http://192.168.x.x:8000/api/v1
```

### API integration

The app talks to Django at `AppConfig.baseApiUrl` (local Docker in debug; production in release).

| Area | Service | Endpoints |
|------|---------|-----------|
| Auth | `ApiAuthService` | `/auth/login/`, `/auth/signup/`, `/auth/me/`, `/auth/logout/` |
| JWT refresh | `ApiClient` | `/auth/token/refresh/` on 401, then one retry |
| News | `ApiNewsService` | `/articles/`, `/articles/{id}/`, `/categories/` |
| Search | (OpenSearch) | `/search/` (`q`, facet filters, aggregations) |
| Bookmarks | `ApiBookmarkService` + `BookmarksProvider` | `/bookmarks/` (sync when logged in; SharedPreferences offline cache) |

Deep links to `/article/:id` without route `extra` load via `ArticleDetailLoader` → `GET /articles/{id}/`.

## Frontend

### `Types` Documentation

This document provides comprehensive documentation for **properly implemented and structured** TypeScript type definitions in the NewScout frontend application.

#### Overview

The `frontend/newscout/types/` directory contains shared TypeScript interfaces that define data structures used across the application. These types ensure consistent data handling and provide type safety throughout the codebase.

#### Current Structure

```markdown
frontend/newscout/types/
└── comment-types.ts # Comment interface definitions
```

---

### Implemented Type Files

#### 1. Comment Types

**File**: `frontend/newscout/types/comment-types.ts`

#### `Comment` Interface

Represents a single comment with nested replies support.

```typescript
export interface Comment {
  id: string // Unique comment identifier
  author: string // Name of comment author
  avatar: string // Avatar initials or identifier
  text: string // Comment text content
  time: string // Timestamp (e.g., "2 hours ago")
  likes: number // Count of likes
  dislikes: number // Count of dislikes
  liked: boolean // Whether current user liked this
  disliked: boolean // Whether current user disliked this
  replies: Comment[] // Nested replies (recursive)
  showReplies: boolean // UI state: show/hide replies
  showReplyInput: boolean // UI state: show/hide reply input
}
```

**Usage Example**:

```typescript
import type { Comment } from '@/types/comment-types'

const handleComment = (comment: Comment) => {
  console.log(`${comment.author} commented: ${comment.text}`)
}
```

**Used By Following Components**:

- `components/articles/CommentSection.tsx`
- `utils/comment-mock-data.ts`

**Relationships**:

- ↳ **Recursive structure**: replies are also `Comment` objects

**Notes**:

- UI state fields (`showReplies`, `showReplyInput`) are managed at component level, not persisted
- Supports nested replies via recursive `Comment[]` array for infinite reply chains
- `time` field uses human-readable format (e.g., "2 hours ago") for display consistency
- Separate `liked`/`disliked` booleans prevent conflicting states

---

### Import Path

**Correct Import**:

```typescript
import type { Comment } from '@/types/comment-types'
```

**Mock Data Import**:

```typescript
import { dummyComments } from '@/utils/comment-mock-data'
```

---

### Proper `Type File` Structure Example

The `comment-types.ts` file demonstrates the **recommended pattern** for all type files:

#### What's Included ✅

1. **Type/Interface definitions only** — no mock data
2. **JSDoc or inline comments** — explaining each property
3. **Exported interfaces** — ready for import across the app

#### What's NOT Included ✅

- ❌ Mock data or test fixtures
- ❌ Utility functions
- ❌ Component implementations

---

### Best Practices for Implemented Types

#### 1. File Organization

```markdown
✅ GOOD:
types/comment-types.ts ← Only interfaces
utils/comment-mock-data.ts ← Only mock data

❌ BAD:
utils/comment-data.ts ← Mixed types & mock data
```

#### 2. Type Import Pattern

```typescript
// ✅ Best - Explicit type-only import (preferred)
import type { Comment } from '@/types/comment-types'

// ✅ Acceptable - Mixed import with type keyword
import { type Comment } from '@/types/comment-types'

// ❌ Avoid - Runtime import when only types needed
import { Comment } from '@/types/comment-types'
```

#### 3. Property Documentation

```typescript
// ✅ Good - Clear field documentation
/**
 * Unique comment identifier
 */
id: string

// ✅ Good - Inline comment with units/format
time: string // Human-readable format (e.g., "2 hours ago")

// ❌ Avoid - No explanation
id: string
```

#### 4. Recursive Types

```typescript
// ✅ Good - Recursive structure for nested data
replies: Comment[];  // Nested replies, can be infinitely deep

// ❌ Avoid - Creating separate interface for same structure
replies: CommentReply[];  // Unnecessary duplication
```

#### 5. UI State in Types

```typescript
// ✅ Consider if state is component-specific
showReplies: boolean // UI state managed by component

// ❌ Avoid if state shouldn't be persisted
isLoading: boolean // Use component state, not type prop
```

#### 6. Consistency Standards

- **IDs**: Always `string` type
- **Dates**: ISO 8601 format as `string` (not `Date` objects)
- **Booleans**: Use descriptive names (`liked`, `is_verified`, not `flag`, `status`)
- **Numbers**: Use appropriate precision (avoid floating-point for money)

---

### Folder Structure

#### Current Structure ✅

```markdown
frontend/newscout/
├── types/
│ └── comment-types.ts ✅ Properly implemented
├── utils/
│ ├── comment-mock-data.ts ✅ Correct pattern
```

---

### Summary Table

| Type      | File                     | Status         | Import                                                 |
| --------- | ------------------------ | -------------- | ------------------------------------------------------ |
| `Comment` | `types/comment-types.ts` | ✅ Implemented | `import type { Comment } from "@/types/comment-types"` |

---

### API Documentation (MDX)

API Documentation Setup using Next.js + MDX + OpenAPI

#### Overview

This document explains how we implemented a **dynamic API documentation page** using **Next.js (App Router), MDX,** and **OpenAPI schema** from Django backend.

#### Objective

- Create a **single dynamic API documentation page**
- Keep everything inside the existing Next.js project
- Allow writing content in **Markdown + React (MDX)**
- Ensure **fast performance and hybrid rendering (SSG + CSR)**
- Fetch **atest API endpoints dynamically from backend (OpenAPI schema)**
- Avoid manual endpoint duplication
- Keep full **custom UI control with reusable components**

---

#### Why Next.js + MDX?

| Feature            | Benefit                                         |
| ------------------ | ----------------------------------------------- |
| MDX                | Write docs in Markdown + use React components   |
| Next.js App Router | Supports static + dynamic rendering             |
| No extra project   | Keeps docs inside main codebase                 |
| Flexibility        | Full control over UI and dynamic data rendering |

---

#### Project Structure

```
components
  /api-docs
    ApiDocsContainer.tsx   (logic)
    ApiDocsLayout.mdx      (layout)
    MDXClientWrapper.tsx   (wrapper)

app
  /api-docs
    page.tsx
```

---

### Setup Steps

#### 1. Install Dependencies

```bash
npm install @next/mdx @mdx-js/react @mdx-js/loader
```

---

#### 2. Configure Next.js

Update `next.config.ts`:

```ts
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.mdx?$/,
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
}

export default withMDX(nextConfig)
```

---

#### 3. Create MDX Layout Page

```markdown
/app/api-docs/ApiDocsLayout.mdx
```

```mdx
import ApiDocsContainer from '@/components/api-docs/ApiDocsContainer'

<ApiDocsContainer />
```

---

#### 4. Create Page Wrapper & Rendering in app

```markdown
/app/api-docs/page.tsx
```

```tsx
import MDXClientWrapper from '@/components/api-docs/MDXClientWrapper'

export const metadata = {
  title: 'API Documentation',
  description: "Integrate NewScout's aggregated news into your applications.",
}

export default function ApiDocsPage() {
  return (
      <MDXClientWrapper />
  )
}
}
```

```markdown
/components/api-docs/MDXClientWrapper.tsx
```

```tsx
'use client'
import Content from '../../components/api-docs/ApiDocsLayout.mdx'

export default function MDXClientWrapper() {
  return <Content />
}
```

---

#### 5. Dynamic API Docs Component

```markdown
/components/api-docs/ApiDocsContainer.tsx
```

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function ApiDocs() {
  const [endpoints, setEndpoints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/schema/?format=json')
      .then((res) => res.json())
      .then((data) => {
        const extracted = []

        Object.entries(data.paths || {}).forEach(([path, methods]) => {
          Object.entries(methods).forEach(([method, details]) => {
            extracted.push({
              method: method.toUpperCase(),
              path,
              description:
                details.summary ||
                details.description ||
                'No description available',
            })
          })
        })

        setEndpoints(extracted)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return <div>{/* UI rendering */}</div>
}
```

---

### Backend Requirements (Django)

#### OpenAPI Schema Endpoint

```python
path("api/schema/", SpectacularAPIView.as_view(), name="schema")
```

---

#### IMPORTANT: JSON Format

```ts
/api/schema/?format=json
```

---

#### Enable CORS

```python
CORS_ALLOW_ALL_ORIGINS = True
```

---

### Important Learnings / Issues Faced

#### 1. MDX runs as Client Component

- MDX internally uses React context
- Requires:

```mdx
"use client";
```

---

#### 2. Cannot use `metadata` inside MDX

**Correct:**

```tsx
// page.tsx
export const metadata = {}
```

---

#### 3. MDX syntax must be valid

Example issue:

```json
{
  "data": []
}
```

**This caused runtime errors because the block was not closed.**

---

#### 4. JSX rules apply inside MDX

```jsx
<div className="hero"></div>
```

---

#### 5. Turbopack issues

```markdown
Cannot find module '@mdx-js/loader'
```

**Fix:**

```bash
npm install @mdx-js/loader
```

---


## Docker Instructions

These are general development instructions for setting up the project.

1. Option 1: Docker Setup (Without Dev Container) 
1. Option 2: VS Code Dev Container Setup

**Note:** Devcontainers have a good IDE integration as opposed to running `docker compose up.`

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
1. Create environment file `cp example.env .env.`
1. Build Docker images `docker compose build.`
1. Start the containers `docker compose up -d.'
1. Check running containers `docker compose ps`

The application should now be running.

To stop `docker compose down.`

#### Management commands (e.g. `seed_test_data`)

`POSTGRES_HOST=newscout-db` only resolves on the Compose network. Run management
commands inside the Django container (or a Dev Container terminal):

```sh
docker compose -f docker-compose.dev.yml exec django python manage.py seed_test_data
```

If you run `manage.py` on the host instead, override the DB host (Postgres is
published on `localhost:5432`):

```sh
cd backend/newscout
POSTGRES_HOST=localhost python manage.py seed_test_data
```

### Option 2: Docker Setup (Using Dev Container)

This guide will help you set up the Newscout project using **Docker + VS
Code Dev Containers**.



##  Prerequisites

### 1. Install Docker & Docker Compose

####  Install Docker (Ubuntu/Linux)

``` bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

####  Add your user to Docker group (avoid sudo)

``` bash
sudo usermod -aG docker $USER
newgrp docker
```

####  Verify installation

``` bash
docker --version
docker compose version
```



### 2. Install VS Code

Download and install from: https://code.visualstudio.com/



### 3. Install Required VS Code Extension

Open VS Code → Extensions → install:

-   **Dev Containers** (by Microsoft)



##  Project Setup

### 1. Create a working directory

``` bash
mkdir ~/Code
cd ~/Code
```



### 2. Clone the repository

``` bash
git clone <your-repo-url>
cd newscout
```



### 3. Setup environment variables

Go to backend directory:

``` bash
cd backend/newscout
```

Copy example env file:

``` bash
cp example.env .env
```



## 🐳 Running the Project

### 1. Open project in VS Code

From project root:

``` bash
code .
```



### 2. Reopen in Dev Container

-   Press: `Ctrl + Shift + P`
-   Search: **Dev Containers: Reopen in Container**
-   Click it

 It will take \~5--10 minutes to: - Build Docker images - Start
containers - Install dependencies



## Verify Containers

To check running containers:

``` bash
docker ps
```

You should see: - Backend (Django) - Frontend - PostgreSQL - OpenSearch



##  Access the Application
  Service    URL
  ---------- -----------------------
  Backend    http://localhost:8000
  Frontend   http://localhost:3000
  OpenSearch http://localhost:9200



##  Django Admin Credentials

Check your `.env` file:

``` env
DJANGO_SUPERUSER_USERNAME=newscout
DJANGO_SUPERUSER_PASSWORD=newscout
```

Use these credentials to log in.



##  Notes

-   Containers start automatically via Dev Container setup
-   No need to manually run migrations or create superuser
-   Everything is handled via Docker + entrypoint script
-   OpenSearch is required for `/api/v1/search/`; entrypoint rebuilds the
    `articles` index and reindexes after seed
-   Env template: `backend/newscout/example.env` (includes `OPENSEARCH_HOST` /
    `OPENSEARCH_PORT`)



##  Troubleshooting

### Containers not running?

``` bash
docker ps -a
docker logs <container-name>
```



### Rebuild containers

``` bash
docker compose down -v
docker compose up --build
```


