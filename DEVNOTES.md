# DEVNOTES

These are general develop instructions

## Backend

1. Once the environment is setup ensure you setup pre-commit correctly `pip3 install pre-commit`
1. With virtualenv activiated do `pre-commit install` from project's root directory

## Frontend

## API Documentation Setup using Next.js + MDX

### Overview

This document explains how we implemented a **static API documentation page** using **Next.js (App Router)** and **MDX**.

### Objective

- Create a **single static API documentation page**
- Keep everything inside the existing Next.js project
- Allow writing content in **Markdown + React (MDX)**
- Ensure **fast performance and static generation**

---

### Why Next.js + MDX?

| Feature            | Benefit                                       |
| ------------------ | --------------------------------------------- |
| MDX                | Write docs in Markdown + use React components |
| Next.js App Router | Built-in static generation                    |
| No extra project   | Keeps docs inside main codebase               |
| Flexibility        | Full control over UI                          |

---

### Project Structure

```text
/app
  /api-docs
    page.tsx        → Server component (metadata)
    content.mdx     → MDX documentation content
/components
  MDXWrapper.tsx    → Client wrapper (optional)
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

#### 3. Create MDX Page

```
/app/api-docs/content.mdx
```

````mdx
"use client";

# API Documentation

This page is written using MDX.

## Example

```bash
curl -H "Authorization: Bearer YOUR_API_KEY"
```
````

---

#### 4. Create Page Wrapper

```
/app/api-docs/page.tsx
```

```tsx
import type { Metadata } from 'next'
import Content from './content.mdx'

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'Integrate APIs easily',
}

export default function Page() {
  return <Content />
}
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

```
Cannot find module '@mdx-js/loader'
```

**Fix:**

```bash
npm install @mdx-js/loader
```

---

### Conclusion

Using **Next.js + MDX** allowed us to:

- Keep documentation inside our main app
- Maintain flexibility with React components
- Avoid complexity of external tools

This approach is ideal for:

- Small to medium documentation needs
- Internal API docs
- Static content pages

---

## Types

This document provides comprehensive documentation for **properly implemented and structured** TypeScript type definitions in the NewScout frontend application.

### Overview

The `frontend/newscout/types/` directory contains shared TypeScript interfaces that define data structures used across the application. These types ensure consistent data handling and provide type safety throughout the codebase.

### Current Structure

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
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}
```

**Usage Example**:

```typescript
import type { Comment } from "@/types/comment-types";

const handleComment = (comment: Comment) => {
  console.log(`${comment.author} commented: ${comment.text}`);
};
```

**Used By Following Components**:

- `components/articles/CommentSection.tsx`
- `utils/comment-mock-data.ts`

---

### Import Path

**Correct Import**:

```typescript
import type { Comment } from "@/types/comment-types";
```

**Mock Data Import**:

```typescript
import { dummyComments } from "@/utils/comment-mock-data";
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
import type { Comment } from "@/types/comment-types";

// ✅ Acceptable - Mixed import with type keyword
import { type Comment } from "@/types/comment-types";

// ❌ Avoid - Runtime import when only types needed
import { Comment } from "@/types/comment-types";
```

---

### Folder Structure

- This is the current folder structure

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