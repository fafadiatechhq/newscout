# DEVNOTES

These are general develop instructions

## Frontend

### Types

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
  id: string; // Unique comment identifier
  author: string; // Name of comment author
  avatar: string; // Avatar initials or identifier
  text: string; // Comment text content
  time: string; // Timestamp (e.g., "2 hours ago")
  likes: number; // Count of likes
  dislikes: number; // Count of dislikes
  liked: boolean; // Whether current user liked this
  disliked: boolean; // Whether current user disliked this
  replies: Comment[]; // Nested replies (recursive)
  showReplies: boolean; // UI state: show/hide replies
  showReplyInput: boolean; // UI state: show/hide reply input
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

#### 3. Property Documentation

```typescript
// ✅ Good - Clear field documentation
/**
 * Unique comment identifier
 */
id: string;

// ✅ Good - Inline comment with units/format
time: string; // Human-readable format (e.g., "2 hours ago")

// ❌ Avoid - No explanation
id: string;
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
showReplies: boolean; // UI state managed by component

// ❌ Avoid if state shouldn't be persisted
isLoading: boolean; // Use component state, not type prop
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

**Last Updated**: March 18, 2026

## Backend

1. Once the environment is setup ensure you setup pre-commit correctly `pip3 install pre-commit`
1. With virtualenv activiated do `pre-commit install` from project's root directory
