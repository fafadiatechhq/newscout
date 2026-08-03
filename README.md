# NewScout

![NewScout logo](docs/images/logo.png "NewScout logo")

**NewScout** is a modern news aggregator that goes beyond simply delivering headlines. Stay informed and ahead of the curve with NewScout — your personalized window to the world.

---

## What is NewScout?

NewScout collects, organizes, and surfaces news from across the web so you never have to hunt for what matters. Whether you follow breaking news, niche topics, or specific sources, NewScout delivers a tailored reading experience across web and mobile.

---

## Key Features

- **Personalized Feed** — articles ranked and filtered to your interests and reading history
- **Full-Text Search** — fast, relevance-ranked search powered by OpenSearch across titles, summaries, and authors
- **Faceted Filtering** — narrow results by category, source, tag, date range, and flags like Breaking or Trending
- **Bookmarks** — save articles to read later; synced when logged in, cached offline when not
- **Trending & Editors' Picks** — surface what's popular or curated by editors at a glance
- **Category & Source Discovery** — browse by topic or publisher with live aggregation counts
- **Mobile App** — native Flutter app for Android and iOS with the same full feature set

---

## Platforms

| Platform | Access |
|----------|--------|
| Web | `http://localhost:3000` (dev) / production URL |
| Mobile (Android) | Flutter app — Android emulator or physical device |
| Mobile (iOS) | Flutter app — iOS simulator or physical device |
| API | `https://api.newscout.in/api/v1` (production) |

---

## Getting Started

### Web

Visit the app in your browser. No account is required to browse and search. Sign up to unlock bookmarks and a personalized feed.

### Mobile

Download the NewScout app from the App Store or Google Play. Log in with the same account you use on the web — your bookmarks and preferences follow you.

### API

NewScout exposes a public REST API for developers who want to integrate news discovery into their own applications. See the [API Documentation](http://localhost:3000/api-docs) for available endpoints, filters, and response shapes.

---

## Screenshots

### Web (Desktop)

<table>
  <tr>
    <td align="center"><b>Home</b></td>
    <td align="center"><b>Browse Articles</b></td>
    <td align="center"><b>Search & Filters</b></td>
    <td align="center"><b>Bookmarks</b></td>
  </tr>
  <tr>
    <td><img src="backend/newscout/screenshots/01.png" width="220"/></td>
    <td><img src="backend/newscout/screenshots/02.png" width="220"/></td>
    <td><img src="backend/newscout/screenshots/03.png" width="220"/></td>
    <td><img src="backend/newscout/screenshots/04.png" width="220"/></td>
  </tr>
</table>

### Mobile (Android & iOS)

<table>
  <tr>
    <td align="center"><b>Home</b></td>
    <td align="center"><b>Article Detail</b></td>
    <td align="center"><b>More from Category</b></td>
    <td align="center"><b>Multi-Source View</b></td>
  </tr>
  <tr>
    <td><img src="app/newscout/screenshots/01.png" width="180"/></td>
    <td><img src="app/newscout/screenshots/02.png" width="180"/></td>
    <td><img src="app/newscout/screenshots/03.png" width="180"/></td>
    <td><img src="app/newscout/screenshots/04.png" width="180"/></td>
  </tr>
  <tr>
    <td align="center"><b>Categories</b></td>
    <td align="center"><b>Trending Now</b></td>
    <td align="center"><b>Search</b></td>
    <td></td>
  </tr>
  <tr>
    <td><img src="app/newscout/screenshots/05.png" width="180"/></td>
    <td><img src="app/newscout/screenshots/06.png" width="180"/></td>
    <td><img src="app/newscout/screenshots/07.png" width="180"/></td>
    <td></td>
  </tr>
</table>

---

## For Developers

Setup instructions, architecture notes, Docker/Dev Container configuration, OpenSearch indexing, and the mobile development workflow are documented in [DEVNOTES.md](DEVNOTES.md).
