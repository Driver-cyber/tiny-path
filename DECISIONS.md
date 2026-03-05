# DECISIONS.md — Tiny Path Change Log & Current Context

> This file is the living record of what has been decided.
> Brainstorming lives in conversation. Decisions live here.
> When in doubt about project direction, this file wins.

---

## 🎯 Current North Star

**Goal:** Maintain and evolve Tiny Path as a polished, intimate private social feed for a small trusted friend group.

**Vibe:** "Warm & Considered." Utility first, beauty close behind. Ship, learn, iterate.

**Current Version:** v3.5 · 2026-03-04

| App | URL | Backend |
|---|---|---|
| Tiny Path | https://tiny-path.pages.dev | Supabase: czaztxqhkqwoviazqaeu |
| Family Path | pending migration | Firebase (legacy, not yet migrated) |

---

## 📁 Project Structure

```
tiny-path/                  ← repo root
├── tiny-path/              ← deployable app files
│   ├── index.html
│   ├── app.js              ← all JS logic
│   ├── style.css
│   ├── manifest.json
│   ├── sw.js               ← service worker
│   ├── robots.txt
│   └── [icons / assets]
├── family-path/            ← pending Supabase migration
├── CLAUDE.md
├── DECISIONS.md
└── memory/MEMORY.md
```

---

## 🛠 Active Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Vanilla HTML / CSS / JS (ES Modules) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + password) |
| Image Hosting | Cloudinary (dqqml8dae / tiny-path-unsigned) |
| Geocoding | OpenStreetMap Nominatim |
| Hosting | Cloudflare Pages (GitHub-connected) |

---

## 📝 Decision Log

### [2026-02-23] — V1 Shipped
- Vanilla JS, Firebase Firestore, Cloudinary, localStorage username
- Deployed to Netlify (drag and drop)

### [2026-02-26] — V2 Shipped
- Thumbs up/down vote counters
- Post detail view (slide-up overlay)
- Comments (flat, in detail view)
- User filter (tap username to filter feed)
- Day grouping (Today / Yesterday / date)
- Micro-animations and visual polish
- PWA: manifest.json + service worker
- Settings modal with install instructions
- Swipe right to close detail view
- Haptic feedback on votes
- Full timestamp in detail view
- Web Share API button
- Character counter (300 char limit)
- Image-only card layout

### [2026-02-26] — Family Path Fork
- Forked into family-path/ subfolder
- Separate Firebase project, earth-tone branding

### [2026-03-04] — Firebase → Supabase Migration
- Migrated from Firebase Firestore to Supabase PostgreSQL
- Schema: posts table + comments table (post_id FK)
- Realtime via Supabase postgres_changes channel
- Moved hosting from Netlify to Cloudflare Pages (GitHub push-to-deploy)
- Supabase project: czaztxqhkqwoviazqaeu

### [2026-03-04] — Auth (v3.0)
- Added Supabase Auth (email + password)
- Login required to view anything
- Full-screen auth overlay on load
- Display name stored in user_metadata.username
- Posting-as chip is now read-only (auth-driven)
- Logout button in settings modal
- Display name editable from settings modal
- onAuthStateChange handles session restore automatically

### [2026-03-04] — UI/UX Fixes (v3.1–v3.2)
- Posting-as chip redesign (avatar + name, read-only)
- Deterministic avatar color system (12-color palette, hashed from username)
- Vote button sizing and styling improvements
- Comment avatars added
- Feed image tap → opens detail view (not fullscreen modal)
- Auto-hyperlink URLs in post text (linkify function)
- Smaller feed images (max 260px height)
- Touch zoom disabled globally; re-enabled in modal and detail
- Multi-photo upload: parallel Cloudinary uploads, JSON array storage
- image_url column stores plain string (1 image) or JSON array (multiple) — backwards compatible
- Feed: first image shown + "+N more" badge
- Detail: first image full-width + thumbnail row below
- Composer image preview (thumbnails before posting)

### [2026-03-04] — Profile View (v3.3)
- Tapping avatar or username → profile overlay (slides from right, swipe to dismiss)
- Profile shows: large avatar, display name, post count, member since (from earliest post), bio
- Bio stored in user_metadata.bio via Supabase Auth
- Own profile shows bio edit inline
- Profile posts listed as compact cards (tap to open detail)
- Detail view header avatar/username also tappable → profile

### [2026-03-04] — Bug Fixes (v3.4)
- Fixed: logout → login button unclickable (showAuth now resets button + fields)
- Fixed: settings modal scroll bleeding into feed (body overflow lock added)
- Fixed: iOS viewport zoom/rearranging (user-scalable=no, removed dynamic viewport manipulation)
- Fixed: iOS photo picker unreliable (file input wrapped in label element)
- Fixed: all inputs at font-size 16px to prevent iOS auto-zoom
- Fixed: camera roll multi-select via label click on iOS

### [2026-03-04] — PWA & Lighthouse Polish (v3.5)
- Service worker rewritten: network-first for app shell, cache-first for images
- Cache version tied to app version (tinypath-v3.5) — busts on every deploy
- manifest.json: proper any/maskable icon split, added scope and categories
- index.html: Google Fonts now non-blocking (media="print" swap trick)
- All images have alt attributes (generated from poster username)
- ARIA roles, labels, aria-live on all interactive elements
- Added main landmark, header role="banner"
- Color contrast: all grays bumped to WCAG AA (#767676, #666)
- robots.txt added (disallow all — private app)
- meta description added
- Version comment in app.js reminds to also bump sw.js CACHE_VERSION

---

## 🔜 Next Up (Prioritized Backlog)

These were discussed and ranked by the user. Build in this order:

1. ✅ Disable touch zoom (shipped v3.4)
2. ✅ Images tap to detail in feed (shipped v3.2)
3. ✅ Auto-hyperlink URLs (shipped v3.2)
4. ✅ Smaller feed images (shipped v3.2)
5. ✅ Multi-photo upload (shipped v3.2)
6. ✅ Clickable avatars → profile view (shipped v3.3)

**Next features to consider (not yet started):**
- Post deletion (own posts only)
- Notification / unread indicator for new posts
- Family Path Supabase migration

---

## 💡 Parking Lot (Explicitly Deferred)

- Radial / fan-out post button
- Emotion reactions (❤️ 😄 😢)
- Avatar photo uploads
- Invite code gate
- Music sharing
- Dark mode
- Post editing
- Threaded comments
- Per-user vote tracking
- Family Path migration (needs new Supabase project — free tier limit)
