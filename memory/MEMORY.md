# Tiny Path — Project Memory

## Status
V2 shipped 2026-02-26. V1 was at https://peaceful-speculoos-c9dc9a.netlify.app/ (drag-and-drop Netlify, no CLI).

## Key Files
- `index.html` — shell, PWA meta, modals
- `app.js` — all JS logic (ES modules, no bundler)
- `style.css` — all styles
- `manifest.json` — PWA manifest
- `sw.js` — service worker (caches shell only)
- `icon.svg` — SVG icon (browser favicon); PNG icons needed for iOS
- `apptxtfilejs.txt` — old V1 JS backup, no longer used

## Stack (locked)
Firebase Firestore (project: tiny-path-b9bb4) · Cloudinary (dqqml8dae / tiny-path-unsigned) · OpenStreetMap Nominatim · Netlify drag-and-drop

## V2 Architecture Notes
- `allPosts` array holds all Firestore docs; `renderFeed()` re-renders from it (filter-aware)
- Comments: `posts/{id}/comments` subcollection, `onSnapshot` subscribed on detail open, unsubscribed on close
- Votes: Firestore `increment(1)` on `upvotes`/`downvotes` fields directly on post doc
- User filter: client-side on `allPosts`, no extra Firestore query
- iOS install prompt: auto-shows once per session via `sessionStorage`, also via settings gear ⚙️

## V2.1 Features (added after initial V2 deploy)
- **SVG icons** — all emoji replaced with inline Feather-style SVGs. ICON constants in app.js for dynamic buttons. SVG in HTML for static (mode bar, settings gear).
- **Char counter** — `#charCounter` div, 300 char soft limit, turns orange at 270, red at 300
- **Image-only cards** — `.post--image-only` class when `imageUrl && !text`, image fills edge-to-edge
- **Haptic feedback** — `navigator.vibrate(12)` on all vote buttons (Android; graceful no-op on iOS)
- **Full timestamp in detail** — `fullTimestamp()` shows "Feb 26, 2026, 3:45 PM"
- **Web Share API** — share button in detail-votes, hidden if `navigator.share` not supported
- **Swipe-to-close** — touch events on `#detailHeader` (not body), 90px threshold, snaps back below
- **Drag pill** — `::before` pseudo-element on `.detail-header` as visual affordance

## Icon TODO
User needs to provide `icon-180.png` (180×180), `icon-192.png`, `icon-512.png` for full iOS PWA icon support. Recommend favicon.io or pwabuilder.com to generate from the SVG.

## User Preferences
- Measure twice, propose before multi-file changes
- No new deps/frameworks without DECISIONS.md update
- Prefer targeted edits (str_replace) over full rewrites
- Ask "Are we pivoting or extending?" on contradictory requests
