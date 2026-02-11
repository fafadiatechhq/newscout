# NewScout – Product Requirements Document (PRD)

## 1. Product Summary

**NewScout** is a web-based, multi-tenant news aggregation and discovery platform that consolidates articles from multiple trusted publishers into a single, searchable interface.

The platform enables users and organizations to quickly discover, filter, and personalize news content based on interests, industries, and regions.

### Key Differentiators

* Verified and curated sources only
* Advanced search and filtering
* Research- and professional-grade workflows
* Personalization via bookmarks and saved searches
* Multi-tenant SaaS with enterprise support
* Metered billing with Stripe integration

The first release prioritizes **fast discovery**, **reliable aggregation**, and **clean reading experience** before introducing advanced AI-driven automation.

---

## 2. Problem Statement

Modern news consumption suffers from:

* **Fragmentation** – News is scattered across hundreds of platforms.
* **Information overload** – Too much content, too little relevance.
* **Poor personalization** – Generic feeds miss user intent.
* **Inefficient search** – Finding specific information is slow and inconsistent.

This results in wasted time and missed critical updates.

**NewScout solves this** by providing a centralized, searchable, and customizable news experience for individuals and teams.

---

## 3. Objectives

* Aggregate news from **50+ verified publishers** at launch
* Deliver search and feed results in **<2s (p95 latency)**
* Provide advanced discovery via filters and search
* Enable personalization via bookmarks and preferences
* Support **multi-tenant organizations**
* Implement **metered billing via Stripe**
* Maintain **99.9% uptime**

---

## 4. Goals

* Single platform for multi-source news consumption
* Powerful discovery via search, filters, and categories
* Personalized experience for users and teams
* Horizontally scalable architecture
* Enterprise-ready access control and billing

---

## 5. Target Audience

### Individuals

* General News Consumers (18–45)
* Researchers & Analysts (22–50)
* Casual Readers (16–35)

### Organizations

* Research teams
* Media monitoring teams
* Enterprises needing curated news intelligence

---

## 6. Hypotheses

* **Engagement:** Centralized discovery increases session time (>5 min)
* **Acquisition:** Free tier drives 1,000+ monthly signups in 6 months
* **Retention:** Personalization yields ≥40% WAU/MAU
* **Performance:** Sub-2s search drives search-first behavior
* **Revenue:** Metered billing converts heavy users to paid plans

---

## 7. Multi-Tenancy Model

### Tenant Definition

A **Tenant** represents an organization or workspace with isolated data, users, and billing.

### Core Principles

* Strong logical data isolation
* One subscription per tenant
* Role-based access per tenant
* Custom branding and configuration

### Tenant Roles

| Role   | Permissions                        |
| ------ | ---------------------------------- |
| Owner  | Billing, user management, settings |
| Platform Admin  | User & content management          |
| Account Admin | Content review & approval          |
| Member | Read, bookmark, personalize        |

### Onboarding

* Self-serve tenant signup
* Email-based invitations
* Optional domain-based auto-assignment

---

## 8. Billing & Subscription

### Billing Model

* **Metered billing** (article views, API calls)
* Stripe Billing + Webhooks
* Monthly invoicing

### Supported Features

* Plan upgrades/downgrades
* Usage tracking & quota enforcement
* Invoice & payment history
* Free trials

---

## 9. Functional Requirements

### 9.1 News Aggregation

* Ingest via RSS, APIs, approved scrapers
* Normalize metadata
* De-duplicate articles
* Near real-time updates

### 9.2 Discovery & Feed

* Chronological & relevance-based feeds
* Keyword search
* Filters: category, source, date, region
* Article previews with attribution
* Redirect to original publisher

### 9.3 Authentication & Profiles

* Email/password authentication
* JWT-based sessions
* Profile management
* Password reset

### 9.4 Personalization

* Bookmarks
* Saved searches
* Preference-based feeds
* Notifications (future)

### 9.5 Account Adminial & Platform Admin

* Article review and approval
* Content creation & editing
* Audit logs & version history
* Source and category management

### 9.6 Sharing

* Share via WhatsApp, Twitter/X, Facebook, Telegram
* Copy link
* RSS & newsletters

---

## 10. User Stories by Role

### 1. Platform Admin (Global Super-Admin)

Platform Admins manage the entire NewScout system, including tenants, users, billing, sources, and platform health.

| ID | User Story | Acceptance Criteria |
|:---|:-----------|:-------------------|
| PA-001 | As a Platform Admin, I want to view all tenants in the system with their subscription status and usage metrics | Dashboard shows tenant list with name, owner, plan, status, article views, and API calls used |
| PA-002 | As a Platform Admin, I want to manage tenant accounts (create, suspend, delete, reset) | Admin can perform CRUD operations on tenants with confirmation dialogs and audit logging |
| PA-003 | As a Platform Admin, I want to view and manage all users across all tenants | Admin can search users by email/tenant, view user roles, and perform actions (reset password, disable account) |
| PA-004 | As a Platform Admin, I want to manage subscription plans and pricing | Admin can create, edit, delete plans; set pricing, features, and limits |
| PA-005 | As a Platform Admin, I want to approve new news sources before they are available to users | Admin sees pending sources with metadata, can review and approve/reject with comments |
| PA-006 | As a Platform Admin, I want to manage content categories and their metadata | Admin can CRUD categories, assign icons, set descriptions, and reorder priority |
| PA-007 | As a Platform Admin, I want to view platform-wide analytics (DAU, MAU, search metrics, usage trends) | Dashboard shows charts for user growth, session metrics, search latency, and revenue trends |
| PA-008 | As a Platform Admin, I want to manage billing and handle disputes | Admin can view all invoices, subscription status, apply credits, cancel subscriptions, and export billing reports |
| PA-009 | As a Platform Admin, I want to view comprehensive audit logs for compliance and security | Audit logs show user actions, admin actions, data changes, with timestamp, actor, and action details |
| PA-010 | As a Platform Admin, I want to manage system-wide settings (branding, email templates, integrations) | Admin can update logo, email templates, Stripe keys, and feature flags |
| PA-011 | As a Platform Admin, I want to flag and handle spam, malicious content, or policy violations | Admin can review reported content, take action (remove, suppress), and communicate with tenants |
| PA-012 | As a Platform Admin, I want to view system health and performance metrics | Real-time dashboard showing API latency, error rates, database health, and uptime |
| PA-013 | As a Platform Admin, I want to manage API keys and rate limiting for external integrations | Admin can create/revoke API keys, set rate limits per tenant, and monitor API usage |
| PA-014 | As a Platform Admin, I want to send platform-wide announcements or maintenance notices | Admin can compose and schedule announcements that appear to all users with targeting options |

---

### 2. Account Admin (Tenant Organization Admin)

Account Admins manage their organization's team, billing, content, and settings within a single tenant.

| ID | User Story | Acceptance Criteria |
|:---|:-----------|:-------------------|
| AA-001 | As an Account Admin, I want to view all team members in my organization | Admin sees user list with name, email, role, join date, and last activity |
| AA-002 | As an Account Admin, I want to invite new team members and assign roles | Admin can send invite via email, set role (Admin/Editor/Member), and track invitation status |
| AA-003 | As an Account Admin, I want to manage user roles and permissions | Admin can change roles, revoke access, and view role-based permissions |
| AA-004 | As an Account Admin, I want to remove users from the organization | Admin can deactivate/remove users with option to remove their bookmarks and saved searches |
| AA-005 | As an Account Admin, I want to view and manage my organization's subscription and billing | Admin sees current plan, usage metrics, billing history, invoices, and can upgrade/downgrade plans |
| AA-006 | As an Account Admin, I want to manage billing contacts and payment methods | Admin can add/remove billing contacts, update payment method, and set billing preferences |
| AA-007 | As an Account Admin, I want to configure custom branding and organization settings | Admin can upload logo, set theme color, customize organization name, and configure regional settings |
| AA-008 | As an Account Admin, I want to view team activity and usage analytics | Dashboard shows team DAU/MAU, articles consumed per user, search trends, and bookmark patterns |
| AA-009 | As an Account Admin, I want to manage trusted news sources for my organization | Admin can add, remove, or block specific sources; set source preferences per team |
| AA-010 | As an Account Admin, I want to create and manage content categories specific to my organization | Admin can create custom categories, assign articles, and set category visibility |
| AA-011 | As an Account Admin, I want to view team audit logs and access history | Logs show user actions, admin actions, role changes, and content access patterns |
| AA-012 | As an Account Admin, I want to configure notification preferences for the team | Admin can set notification defaults, enable/disable features, and manage email digest frequency |
| AA-013 | As an Account Admin, I want to view team member roles and their activity | Dashboard shows editor content approvals, member reading patterns, and engagement metrics |
| AA-014 | As an Account Admin, I want to set content approval workflows | Admin can configure if content requires approval before publication, assign approvers, and track queue |
| AA-015 | As an Account Admin, I want to export team data and generate reports | Admin can export user data, usage reports, and reading analytics in CSV/PDF format |

---

### 3. Team Member (Authenticated User - Member/Editor Role)

Team Members consume, discover, and personalize news content. Editors additionally manage content approval workflows.

| ID | User Story | Acceptance Criteria |
|:---|:-----------|:-------------------|
| TM-001 | As a Team Member, I want to view a personalized feed of news articles | Feed shows articles from trusted sources, can be filtered by category/date/region |
| TM-002 | As a Team Member, I want to search for news articles using keywords | Search returns relevant results in <2s, with filters for source, date range, and category |
| TM-003 | As a Team Member, I want to filter articles by category, source, date, and region | Multiple filters can be combined, results update in real-time, filters persist across sessions |
| TM-004 | As a Team Member, I want to bookmark articles for later reading | Bookmarked articles appear in dedicated section, can be organized in collections |
| TM-005 | As a Team Member, I want to create and save custom searches | Saved searches can be named, edited, and converted into custom feeds with auto-updates |
| TM-006 | As a Team Member, I want to view shared bookmarks from other team members | Can access team bookmarks collection with visibility settings (private/team/public) |
| TM-007 | As a Team Member, I want to share articles with teammates via email, chat, or social media | Share modal shows options for WhatsApp, Twitter, Facebook, Telegram, and direct email |
| TM-008 | As a Team Member, I want to copy an article link and share it | One-click copy to clipboard, generates shareable URL with open graph metadata |
| TM-009 | As a Team Member, I want to subscribe to RSS feeds for specific searches or categories | Can generate RSS feed URLs for custom searches, categories, or saved searches |
| TM-010 | As a Team Member, I want to view article details and source attribution | Article page shows title, author, source logo, publish date, summary, and link to original |
| TM-011 | As a Team Member, I want to manage my profile and preferences | Can update name, profile picture, email, and set content preferences |
| TM-012 | As a Team Member, I want to set notification preferences | Can enable/disable email notifications, set frequency (real-time, daily digest, weekly), and choose categories |
| TM-013 | As a Team Member, I want to view my reading history | Timeline of viewed articles with ability to filter and re-access |
| TM-014 | As a Team Member, I want to view trending articles in my organization | See most-read articles by team, trending categories, and popular sources |
| TM-015 | As a Team Member, I want to export my bookmarks and saved searches | Can export as CSV, PDF, or generate RSS feed for external tools |
| TM-016 | As a Team Member, I want to receive email digests of curated news | Configurable digest with selected categories, frequency, and format (HTML/PDF) |
| TM-017 | As a Team Member, I want to see recommended articles based on my reading history | Recommendation engine suggests articles based on interests and past reads |
| TM-018 | As a Team Member, I want to organize bookmarks into custom collections | Can create collections, move articles between collections, and set collection visibility |
| TM-019 | As a Team Member, I want to tag articles for better organization | Can add custom tags to bookmarked articles and filter by tags |
| TM-020 | As a Team Member (Editor), I want to review and approve submitted articles | Editorial dashboard shows pending articles, can preview, approve, reject, or request changes |
| TM-021 | As a Team Member (Editor), I want to add editorial notes to articles | Can add internal notes, highlight sections, and tag articles for team review |

---

### 4. Guest User (Unauthenticated User)

Guest Users can browse and search news without logging in. Their activity is tracked locally and transferred when they sign up.

| ID | User Story | Acceptance Criteria |
|:---|:-----------|:-------------------|
| GU-001 | As a Guest User, I want to browse news articles without logging in | Public feed shows articles from verified sources with category and date filters |
| GU-002 | As a Guest User, I want to search for news articles | Search results appear in <2s with basic filters (category, date, source) |
| GU-003 | As a Guest User, I want to view article details and read summaries | Article page shows full content or summary, links to original source |
| GU-004 | As a Guest User, I want to filter articles by category, source, date, and region | Filters are available and work without requiring login |
| GU-005 | As a Guest User, I want to share articles on social media | Share buttons for WhatsApp, Twitter, Facebook, Telegram without login required |
| GU-006 | As a Guest User, I want to copy article links to share | One-click copy to clipboard, shareable URL works for non-logged-in users |
| GU-007 | As a Guest User, I want to create an account to save my preferences | Sign-up flow is simple (email/password or social login), preserves previous activity after login |
| GU-008 | As a Guest User, I want my preferences to be saved after I sign up | Bookmarks, searches, and reading history from guest session are transferred to account |
| GU-009 | As a Guest User, I want to view trending articles in the platform | Trending section shows most-read articles across all users/regions |
| GU-010 | As a Guest User, I want to view source information and verification status | Source logos, descriptions, and verification badges visible on all articles |
| GU-011 | As a Guest User, I want to view popular categories and topics | Landing page highlights trending categories with article counts |
| GU-012 | As a Guest User, I want to subscribe to RSS feeds without login | RSS feed URLs available for categories and searches, work without authentication |

---

## 11. Page Inventory

Complete list of all pages required for NewScout with URLs, access levels, and purposes.

### Overview

**Total Pages:** 83

| Section | Count | Description |
|---------|-------|-------------|
| Public / Guest Pages | 8 | Browsable by anyone without authentication |
| Authentication Pages | 5 | Login, signup, and password recovery flows |
| Team Member / User Pages | 13 | Personalized user dashboard and profile management |
| Editor Pages | 4 | Content review and editorial workflows |
| Account Admin Pages | 21 | Organization-level administration and settings |
| Platform Admin Pages | 27 | Global platform management and analytics |
| Utility Pages | 12 | Legal, help, API docs, error pages |

---

### Public / Guest Pages (8 pages)

| Page Name | URL | Access | Purpose |
|-----------|-----|--------|---------|
| Home / Landing Page | `/` | Public (Guest + Authenticated) | Main landing page showcasing platform features, trending articles, and CTA for signup |
| Browse Articles (Feed) | `/feed` | Public (Guest + Authenticated) | Main news feed with chronological articles, filters, search, trending section |
| Search Results | `/search?q={query}` | Public (Guest + Authenticated) | Search results page with advanced filters and sorting options |
| Article Detail Page | `/articles/{article-id}` | Public (Guest + Authenticated) | Full article view with title, content, source info, share options, bookmarking |
| Category Page | `/categories/{category-slug}` | Public (Guest + Authenticated) | Articles filtered by specific category with sub-filters |
| Source / Publisher Page | `/sources/{source-id}` | Public (Guest + Authenticated) | Publisher profile, latest articles, verification badge, subscription option |
| Trending Page | `/trending` | Public (Guest + Authenticated) | Most-read articles, trending categories, trending sources across platform |
| Regional News Hub | `/regions/{region-code}` | Public (Guest + Authenticated) | Articles filtered by geographic region with local news focus |

---

### Authentication Pages (5 pages)

| Page Name | URL | Access | Purpose |
|-----------|-----|--------|---------|
| Sign Up | `/auth/signup` | Public (Anonymous) | New user registration with email/password or social login options |
| Login | `/auth/login` | Public (Anonymous) | User login with email/password or social login |
| Forgot Password | `/auth/forgot-password` | Public (Anonymous) | Password recovery flow via email verification |
| Password Reset | `/auth/reset-password?token={reset-token}` | Public (Anonymous) | Password reset form after email verification |
| Email Verification | `/auth/verify-email?token={verify-token}` | Public (Anonymous) | Email confirmation page for new registrations |

---

### Team Member / User Pages (13 pages)

| Page Name | URL | Access | Purpose |
|-----------|-----|--------|---------|
| My Dashboard | `/dashboard` | Authenticated (Team Member +) | Personalized dashboard with quick stats, recent articles, shortcuts |
| My Bookmarks | `/bookmarks` | Authenticated (Team Member +) | User's saved articles with collections, tags, search within bookmarks |
| Bookmark Collections | `/bookmarks/collections/{collection-id}` | Authenticated (Team Member +) | View specific bookmark collection with articles and sharing options |
| Team Bookmarks | `/bookmarks/team` | Authenticated (Team Member +) | Shared bookmarks from team members with visibility filters |
| Saved Searches | `/saved-searches` | Authenticated (Team Member +) | Manage saved searches, create feeds from searches, track search history |
| My Reading History | `/history` | Authenticated (Team Member +) | Timeline of all viewed articles with filters and re-access |
| My Profile | `/profile` | Authenticated (Team Member +) | User profile settings, avatar, name, email, content preferences |
| Notification Preferences | `/settings/notifications` | Authenticated (Team Member +) | Email digest settings, notification frequency, category preferences |
| Account Settings | `/settings/account` | Authenticated (Team Member +) | Change password, enable 2FA, manage sessions, delete account |
| My Organization / Workspace | `/workspace` | Authenticated (Team Member +) | Organization info, current plan, team members list |
| Trending for My Organization | `/trends/organization` | Authenticated (Team Member +) | Most-read articles within organization, team engagement metrics |
| My Recommendations | `/recommendations` | Authenticated (Team Member +) | Personalized article recommendations based on reading history |

---

### Editor Pages (4 pages)

*For Team Members with Editor role*

| Page Name | URL | Access | Purpose |
|-----------|-----|--------|---------|
| Editorial Dashboard | `/editorial/dashboard` | Authenticated (Editor +) | Pending articles queue, approval status, editor notes |
| Article Approval Queue | `/editorial/queue` | Authenticated (Editor +) | List of articles awaiting approval with filtering and sorting |
| Article Review Page | `/editorial/review/{article-id}` | Authenticated (Editor +) | Article preview, editing interface, approval/rejection workflow |
| Editorial Notes | `/editorial/notes/{article-id}` | Authenticated (Editor +) | Add and manage editorial notes, highlights, team comments |

---

### Account Admin Pages (21 pages)

| Page Name | URL | Access | Purpose |
|-----------|-----|--------|---------|
| Admin Dashboard | `/admin/dashboard` | Authenticated (Account Admin +) | Organization overview, key metrics, team stats, quick actions |
| Team Members Management | `/admin/team-members` | Authenticated (Account Admin +) | List, invite, edit roles, remove members with bulk actions |
| User Invite / Invite Details | `/admin/team-members/invite` | Authenticated (Account Admin +) | Create and send invitations with role assignment |
| Edit Team Member | `/admin/team-members/{user-id}` | Authenticated (Account Admin +) | Edit member role, permissions, deactivate, remove |
| Subscription & Billing | `/admin/billing` | Authenticated (Account Admin +) | Current plan details, usage metrics, billing history, upgrade/downgrade |
| Invoices | `/admin/billing/invoices` | Authenticated (Account Admin +) | Invoice history, download, payment status |
| Manage Payment Method | `/admin/billing/payment-method` | Authenticated (Account Admin +) | Add/update credit card, billing address, payment preferences |
| Billing Contacts | `/admin/billing/contacts` | Authenticated (Account Admin +) | Manage billing contact emails, notifications recipients |
| Plan Selection / Upgrade | `/admin/billing/plans` | Authenticated (Account Admin +) | View available plans with features/pricing, upgrade/downgrade UI |
| Usage Analytics | `/admin/analytics` | Authenticated (Account Admin +) | Team DAU/MAU, articles consumed, search trends, bookmark patterns |
| Organization Settings | `/admin/settings` | Authenticated (Account Admin +) | Organization name, logo, theme color, regional settings |
| Trusted Sources Management | `/admin/sources` | Authenticated (Account Admin +) | Add/remove/block sources, set source preferences, bulk actions |
| Custom Categories | `/admin/categories` | Authenticated (Account Admin +) | Create, edit, delete organization-specific categories |
| Audit Logs | `/admin/audit-logs` | Authenticated (Account Admin +) | Team activity, admin actions, role changes, export options |
| Email Preferences | `/admin/email-preferences` | Authenticated (Account Admin +) | Team notification defaults, digest frequency, email templates |
| Content Approval Workflow | `/admin/workflow` | Authenticated (Account Admin +) | Configure approval requirements, assign approvers, track queue |
| Reports & Export | `/admin/reports` | Authenticated (Account Admin +) | Generate and download user data, usage reports, reading analytics |
| Team Activity Dashboard | `/admin/team-activity` | Authenticated (Account Admin +) | Editor approvals, member reading patterns, engagement metrics |

---

### Platform Admin Pages (27 pages)

| Page Name | URL | Access | Purpose |
|-----------|-----|--------|---------|
| Platform Admin Dashboard | `/platform-admin/dashboard` | Platform Admin Only | System-wide overview, tenant stats, revenue metrics, alerts |
| Tenant Management | `/platform-admin/tenants` | Platform Admin Only | List all tenants with subscription status, usage, bulk actions |
| Tenant Details | `/platform-admin/tenants/{tenant-id}` | Platform Admin Only | View tenant info, users, subscription, usage, edit, suspend, delete |
| Create Tenant | `/platform-admin/tenants/create` | Platform Admin Only | Create new tenant organization manually |
| User Management (Global) | `/platform-admin/users` | Platform Admin Only | Search/filter users across all tenants, manage access, reset passwords |
| User Details (Global) | `/platform-admin/users/{user-id}` | Platform Admin Only | View user profile, tenant info, activity, perform actions |
| Subscription Plans Manager | `/platform-admin/plans` | Platform Admin Only | Create/edit/delete pricing plans, manage features and limits |
| Plan Editor | `/platform-admin/plans/{plan-id}` | Platform Admin Only | Edit plan details, pricing, features, article limits, API calls |
| News Sources Approval | `/platform-admin/sources/pending` | Platform Admin Only | Review pending news sources, approve/reject, manage verified sources |
| All News Sources | `/platform-admin/sources` | Platform Admin Only | List all sources, edit metadata, verification status, priority |
| Source Editor | `/platform-admin/sources/{source-id}` | Platform Admin Only | Edit source details, logo, URL, category, verification status |
| Categories Management | `/platform-admin/categories` | Platform Admin Only | Manage global categories, assign icons, reorder priority |
| Platform Analytics | `/platform-admin/analytics` | Platform Admin Only | DAU/MAU, session metrics, search latency, revenue trends, charts |
| Usage Trends | `/platform-admin/analytics/usage` | Platform Admin Only | Article views, API calls, active tenants, regional breakdown |
| Revenue & Billing Dashboard | `/platform-admin/billing` | Platform Admin Only | Total revenue, MRR, invoices, Stripe integration status, disputes |
| Invoices & Payments (Platform) | `/platform-admin/billing/invoices` | Platform Admin Only | All tenant invoices, payment status, apply credits, export reports |
| Audit Logs (Platform) | `/platform-admin/audit-logs` | Platform Admin Only | All system activity, admin actions, data changes with filters |
| System Settings | `/platform-admin/settings` | Platform Admin Only | Global settings, logo, branding, email templates, feature flags |
| Email Templates | `/platform-admin/email-templates` | Platform Admin Only | Manage welcome, password reset, digest email templates |
| API Integration Settings | `/platform-admin/integrations` | Platform Admin Only | Stripe keys, RSS feed settings, external API configurations |
| API Keys Management | `/platform-admin/api-keys` | Platform Admin Only | Create/revoke API keys, set rate limits per tenant, monitor usage |
| System Health Monitor | `/platform-admin/health` | Platform Admin Only | Real-time API latency, error rates, database health, uptime metrics |
| Content Moderation | `/platform-admin/moderation` | Platform Admin Only | Flagged content, spam, policy violations, take action or communicate |
| Announcements | `/platform-admin/announcements` | Platform Admin Only | Create, schedule, send platform-wide announcements with targeting |
| Support Tickets | `/platform-admin/support` | Platform Admin Only | Manage customer support tickets, respond, resolve |

---

### Utility Pages (12 pages)

| Page Name | URL | Access | Purpose |
|-----------|-----|--------|---------|
| 404 - Not Found | `/404` | Public | Page not found error page |
| 500 - Server Error | `/500` | Public | Server error page |
| Pricing Page | `/pricing` | Public (Anonymous + Authenticated) | Display pricing tiers with features comparison |
| FAQ / Help Center | `/help` | Public | Frequently asked questions, troubleshooting guides |
| Terms of Service | `/terms` | Public | Legal terms and conditions |
| Privacy Policy | `/privacy` | Public | Data privacy and GDPR compliance |
| Contact Us | `/contact` | Public | Contact form for general inquiries |
| Blog / News | `/blog` | Public | Platform blog, updates, tutorials |
| Blog Post | `/blog/{post-slug}` | Public | Individual blog post with comments |
| API Documentation | `/docs/api` | Public (with auth) | OpenAPI docs, endpoint references, SDK guides |
| Maintenance Page | `/maintenance` | Public | System maintenance notice |

---

## 12. Non-Functional Requirements

| Category      | Requirement                               |
| ------------- | ----------------------------------------- |
| Performance   | <2s response (p95)                        |
| Scalability   | Millions of users & articles              |
| Availability  | 99.9% uptime                              |
| Security      | OWASP compliant, TLS, encrypted passwords |
| Platform      | Responsive web (mobile-first)             |
| Observability | Logs, metrics, alerts                     |

---

## 13. Core Entities & Data Model

### Tenant

```text
id (UUID)
name
owner_id
plan_id
logo_url
theme_color
created_at
updated_at
```

### User

```text
id
tenant_id
name
email
password_hash
role
preferences (JSON)
created_at
updated_at
```

### Subscription

```text
id
tenant_id
plan_id
status
usage (JSON)
stripe_subscription_id
created_at
updated_at
```

### Plan

```text
id
name
price
included_article_views
included_api_calls
team_seats
features (JSON)
```

### Article

```text
id
title
summary
content_url
source_id
category_id
author
published_at
image_url
tags
```

### Source

```text
id
name
url
logo_url
is_verified
```

### Category

```text
id
name
description
```

### Bookmark

```text
id
user_id
article_id
created_at
```

### Notification

```text
id
user_id
type
message
is_read
created_at
```

---

## 14. Pricing Tiers

### Free

* $0/month
* Limited daily article views
* Single user
* Basic search & filters

### Pro – Individual

* $10/month
* Higher article limits
* Unlimited bookmarks
* Advanced filters

### Pro – Team

* $50/month (up to 5 users)
* Shared bookmarks
* Team analytics
* Priority support

### Enterprise

* Custom pricing
* Unlimited usage
* SSO
* Custom branding
* Dedicated support
* SLAs

---

## 15. OpenAPI v1 (Draft)

> **Note:** Full OpenAPI YAML already generated in previous step and should live in `/docs/openapi-v1.yaml`.

### Core Endpoint Groups

* Auth (`/auth/*`)
* Users (`/users/*`)
* Articles (`/articles/*`)
* Bookmarks (`/bookmarks/*`)
* Tenants (`/tenants/*`)
* Billing (`/billing/*`)
* Platform Admin & Account Adminial (`/Platform admin/*`)

### Bookmarks API Endpoints

The Bookmarks API (`/api/v1/bookmarks/`) provides full CRUD operations for managing user bookmarks:

* **GET `/api/v1/bookmarks/`** - List all bookmarks for the authenticated user (paginated)
* **POST `/api/v1/bookmarks/`** - Create a new bookmark (requires `article_id`)
* **GET `/api/v1/bookmarks/{id}/`** - Retrieve a specific bookmark
* **PUT `/api/v1/bookmarks/{id}/`** - Update a bookmark (full update)
* **PATCH `/api/v1/bookmarks/{id}/`** - Partially update a bookmark
* **DELETE `/api/v1/bookmarks/{id}/`** - Delete a bookmark

**Security & Access:**
* All endpoints require authentication (`IsAuthenticated` permission)
* Users can only access their own bookmarks (queryset filtered by `user`)
* The `user` field is automatically set from the authenticated user context
* Bookmark responses include nested `article` and `user` objects

**Request/Response Format:**
* Create/Update: Use `article_id` to reference the article
* Read: Returns full `article` object with nested sources, category, and tags
* All timestamps (`created_at`, `updated_at`) are read-only and automatically managed

### Plans API Endpoints

The Plans API (`/api/v1/plans/`) provides full CRUD operations for managing subscription plans:

* **GET `/api/v1/plans/`** - List all available subscription plans (paginated)
* **POST `/api/v1/plans/`** - Create a new subscription plan (typically restricted to platform administrators)
* **GET `/api/v1/plans/{id}/`** - Retrieve a specific plan
* **PUT `/api/v1/plans/{id}/`** - Update a plan (full update, typically restricted to platform administrators)
* **PATCH `/api/v1/plans/{id}/`** - Partially update a plan (typically restricted to platform administrators)
* **DELETE `/api/v1/plans/{id}/`** - Delete a plan (typically restricted to platform administrators)

**Security & Access:**
* All endpoints require authentication (`IsAuthenticated` permission)
* Plan viewing is available to all authenticated users
* Plan creation, update, and deletion are typically restricted to platform administrators (permission checks should be implemented)

**Request/Response Format:**
* Fields: `id`, `name`, `description`, `price`, `created_at`, `updated_at`
* `id`, `created_at`, `updated_at` are read-only
* `price` is a decimal field (max 10 digits, 2 decimal places)

### Subscriptions API Endpoints

The Subscriptions API (`/api/v1/subscriptions/`) provides full CRUD operations for managing tenant subscriptions:

* **GET `/api/v1/subscriptions/`** - List all subscriptions for the authenticated user's tenant (paginated)
* **POST `/api/v1/subscriptions/`** - Create a new subscription (requires `tenant_id` and `plan_id`)
* **GET `/api/v1/subscriptions/{id}/`** - Retrieve a specific subscription
* **PUT `/api/v1/subscriptions/{id}/`** - Update a subscription (full update)
* **PATCH `/api/v1/subscriptions/{id}/`** - Partially update a subscription (e.g., status, dates)
* **DELETE `/api/v1/subscriptions/{id}/`** - Delete a subscription

**Security & Access:**
* All endpoints require authentication (`IsAuthenticated` permission)
* Users can only access subscriptions for their tenant (queryset filtered by tenant)
* The tenant is determined from the authenticated user's tenant association
* Subscription responses include nested `tenant` and `plan` objects

**Request/Response Format:**
* Create/Update: Use `tenant_id` to reference the tenant, `plan_id` to reference the plan
* Use `status` to set subscription status (choices: `active`, `inactive`, `cancelled`, `expired`, `pending`, `failed`, `refunded`, `other`)
* Read: Returns full `tenant` and `plan` objects with nested details
* Fields: `id`, `tenant`, `tenant_id`, `plan`, `plan_id`, `status`, `start_date`, `end_date`, `created_at`, `updated_at`
* `id`, `created_at`, `updated_at` are read-only
* `start_date` and `end_date` are DateTime fields

### Tenants API Endpoints

The Tenants API (`/api/v1/tenants/`) provides full CRUD operations for managing tenant organizations:

* **GET `/api/v1/tenants/`** - List all tenants owned by the authenticated user (paginated)
* **POST `/api/v1/tenants/`** - Create a new tenant organization (self-serve signup)
* **GET `/api/v1/tenants/{id}/`** - Retrieve a specific tenant
* **PUT `/api/v1/tenants/{id}/`** - Update a tenant (full update)
* **PATCH `/api/v1/tenants/{id}/`** - Partially update a tenant (e.g., name)
* **DELETE `/api/v1/tenants/{id}/`** - Delete a tenant

**Security & Access:**
* All endpoints require authentication (`IsAuthenticated` permission)
* Users can only access tenants they own (queryset filtered by `owner`)
* The `owner` field is automatically set from the authenticated user context when creating
* Tenant responses include nested `owner` object
* Deleting a tenant will cascade delete related subscriptions

**Request/Response Format:**
* Create/Update: Use `owner_id` to reference the owner (optional - defaults to authenticated user)
* Read: Returns full `owner` object with nested user details
* Fields: `id`, `name`, `owner`, `owner_id`, `created_at`, `updated_at`
* `id`, `created_at`, `updated_at` are read-only
* `name` is a required CharField (max 255 characters)
* Supports self-serve tenant signup as per PRD requirements

---

## 16. KPIs

* Avg session duration
* Articles read per session
* DAU / MAU
* Tenant churn
* Conversion to paid plans
* Search latency

---

## 17. Conclusion

NewScout is designed as a **scalable, enterprise-ready news intelligence platform** combining strong aggregation, search, personalization, and billing foundations.

The architecture supports:

* Individual users
* Teams and enterprises
* Future AI-powered insights
* Sustainable monetization

