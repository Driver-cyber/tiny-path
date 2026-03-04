# DECISIONS.md — Tiny Path Change Log & Current Context

> This file is the living record of what has been decided. 
> Brainstorming lives in conversation. Decisions live here.
> When in doubt about project direction, this file wins.

---

## 🎯 Current North Star

**Goal:** Maintain and evolve two companion apps — Tiny Path (friends) and Family Path (family) — as polished, intimate private social feeds inspired by the original Path app.

**Vibe:** "Warm & Considered." Utility first, beauty close behind. Ship, learn, iterate.

**Current Status:** Both apps live and deployed on Cloudflare Pages.

| App | URL | Firebase Project |
|---|---|---|
| Tiny Path | `https://peaceful-speculoos-c9dc9a.netlify.app` | `tiny-path-b9bb4` |
| Family Path | `https://remarkable-lokum-9b186c.netlify.app` | `family-path` |

---

## 📁 Project Structure

```
tiny-path/                  ← project root
├── tiny-path/              ← Tiny Path deployable (friends group)
├── family-path/            ← Family Path deployable (family)
├── CLAUDE.md
└── DECISIONS.md
```

Both app subfolders are self-contained Netlify drops. Each has its own Firebase project, branding, and config. Shared codebase — changes to features typically need to be mirrored in both.

---

## 🛠 Active Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Vanilla HTML / CSS / JS (ES Modules) |
| Database | Firebase Firestore |
| Image Hosting | Cloudinary (`dqqml8dae` / `tiny-path-unsigned`) |
| Geocoding | OpenStreetMap Nominatim |
| Hosting | Cloudflare Pages |

**Stack is locked.** No new frameworks or services without a logged decision here.

---

## 📝 Decision Log

### [2026-02-23] — V1 Shipped
- Initialized project with HTML / CSS / Vanilla JS
- Firebase Firestore for realtime posts
- Cloudinary for image uploads
- OpenStreetMap for reverse geocoding
- Username persistence via `localStorage`
- Deployed to Cloudflare Pages

### [2026-02-26] — V2 Planning Complete

**Identity & Auth:**
- *Decision:* Keep the honor system. No login, no PIN, no auth layer.
- *Rationale:* The group is small and trusted. Friction is the enemy. localStorage username is sufficient.

**Reactions:**
- *Decision:* Add thumbs up 👍 and thumbs down 👎 counters to each post.
- *Rationale:* Simple, low-friction engagement. No identity attached to votes — just counts.
- *Implementation note:* Store vote counts as fields on the post Firestore document (`upvotes: number`, `downvotes: number`). No per-user vote tracking for now.

**Comments:**
- *Decision:* Tap a post to open a **post detail view**. Comments live there, not inline on the feed.
- *Rationale:* Keeps the main feed clean and scannable. Comments in a focused view feel more intentional.
- *Implementation note:* Comments stored as a Firestore subcollection under each post (`posts/{postId}/comments`). Flat list, no threading.

**User Filter / Profile View:**
- *Decision:* Add ability to filter the feed by username.
- *Rationale:* Lets users see their own posts and others' posts in isolation. Lightweight profile without building profiles.
- *Implementation note:* Client-side filter or Firestore query by `username` field. No separate profile documents needed yet.

**Day Grouping:**
- *Decision:* Group feed posts under date headers ("Today", "Yesterday", "Feb 23").
- *Rationale:* Core to the Path "journal" aesthetic. Makes the feed feel like a diary, not a ticker.
- *Implementation note:* Client-side grouping logic on the `createdAt` timestamp. No Firestore changes needed.

**Micro-animations:**
- *Decision:* Add subtle entrance animations and transition polish throughout.
- *Rationale:* Makes the app feel alive and tactile without being flashy.
- *Implementation note:* CSS keyframe animations. Fade + slight translate on card entrance. Smooth transitions on detail view open/close. Nothing that adds JS complexity.

**Visual Polish:**
- *Decision:* Improve overall visual crispness toward classic Path aesthetic.
- *Scope:* Typography refinement, spacing, card details, color consistency. Not a full redesign.

---

### [2026-02-26] — V2 Shipped

**Files created/modified:** `index.html`, `style.css`, `app.js` (new), `manifest.json` (new), `sw.js` (new), `icon.svg` (new)

**Comments:** Stored as Firestore subcollection `posts/{id}/comments`. Realtime via `onSnapshot`. Shown in post detail overlay. Flat list, no threading. Submit on Enter or Send button.

**Upvotes / Downvotes:** `upvotes` and `downvotes` fields on post doc. `increment(1)` via `updateDoc`. No per-user tracking. Counters shown on feed cards and in detail view.

**Post Detail View:** Full-screen overlay slides up from bottom. Back button to close. Unsubscribes from comments `onSnapshot` on close.

**User Filter:** Tap any username in the feed to filter. Yellow banner shows active filter with "✕ All posts" clear button. Client-side filter on `allPosts` array.

**Day Grouping:** Client-side on `createdAt` timestamp. "Today", "Yesterday", or "Feb 23" format. Header divs inserted between groups.

**PWA:** `manifest.json` + `sw.js` service worker. Caches shell files only; all Firebase/Cloudinary/font requests pass through. `display: standalone` for full-screen mode. iOS meta tags included. Service worker auto-registered from `app.js`.

**Settings Gear / Install Prompt:** ⚙️ button in top-right of header. Opens bottom-sheet modal with 4-step iPhone add-to-homescreen instructions. On iOS Safari (non-standalone), auto-shows once per session after 1.8s delay via `sessionStorage`.

**Icon:** `icon.svg` created (red rounded square with italic P). PNG icons (`icon-180.png`, `icon-192.png`, `icon-512.png`) must be provided separately — SVG works as browser favicon and in manifest for non-iOS devices.

**Security:** `esc()` helper sanitizes all user-generated content before innerHTML injection.

---

### [2026-02-26] — V2 Post-Ship Polish

**Icons & Favicon:**
- Updated app icons for PWA homescreen (iOS/Android)
- Updated favicon

**Fonts:**
- Font refinements applied (details in code)

**Swipe to Close Detail View:**
- *Shipped and confirmed working.* Swipe-right gesture dismisses the post detail overlay.
- *Implementation note:* Touch event listeners on the detail panel; tracking deltaX to trigger close.

**iOS Comment Input Zoom Fix:**
- Comment input `font-size` bumped from `14px` → `16px`. Fixed in PWA mode.
- Safari browser still zoomed despite the font-size fix; added JS that temporarily sets `maximum-scale=1` on the viewport meta on input focus, restoring it on blur. This prevents auto-zoom without permanently disabling user pinch-zoom.

**Other small improvements:** Various minor UI/UX tweaks applied this session.

---

### [2026-03-04] — Firebase → Supabase Migration & Cloudflare Hosting

**Database:**
- *Decision:* Migrated from Firebase Firestore to Supabase (PostgreSQL)
- *Rationale:* Simpler SQL data model, better dashboard, open source
- *Two separate Supabase projects* — one per app, matching the previous Firebase setup
- Tiny Path Supabase project: `czaztxqhkqwoviazqaeu`
- Schema: `posts` table + `comments` table with `post_id` foreign key
- Realtime via Supabase `postgres_changes` channel subscriptions
- All existing Firebase data wiped; fresh start on Supabase

**Hosting:**
- *Decision:* Moved from Netlify to Cloudflare Pages
- *Deployment:* Connected to GitHub repo — push to deploy

---

### [2026-02-26] — Family Path Fork & Folder Reorganization

**Family Path created:**
- Forked from Tiny Path V2 into `family-path/` subfolder
- Separate Firebase project: `family-path` (projectId)
- Shared Cloudinary account (same upload preset)
- Branding: "Family Path", earth-tone palette (`#8b6f52` / `#7a6047`)
- Deployed as a separate Netlify project

**Folder reorganization:**
- Tiny Path deployable files moved into `tiny-path/` subfolder
- Root now contains only project-level files (CLAUDE.md, DECISIONS.md, assets)
- Both apps are now symmetric: `tiny-path/` and `family-path/` side by side

---

## 💡 Parking Lot (Explicitly Deferred)

These are good ideas. They are not forgotten. They are not V2.

- Radial / fan-out post button
- Emotion reactions (❤️ 😄 😢 etc.)
- Avatar photo uploads  
- Firebase Authentication / invite code gate
- Music sharing
- Dark mode
- PWA / installable app support (shipped in V2)
- Post deletion / editing
- Threaded comments
- Per-user vote tracking (preventing double votes)
