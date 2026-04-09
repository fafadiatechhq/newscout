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
