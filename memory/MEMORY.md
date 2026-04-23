# Tiny Path — Technical Memory

## Current State
**Version:** v5.1 · 2026-04-16
**Live URL:** https://tiny-path.pages.dev
**Repo:** github.com/Driver-cyber/tiny-path
**Deployment:** Cloudflare Pages, auto-deploys on push to main
**Active branch:** main (dev branch kept in sync via reverse-merge PRs)

## Key Files (all inside tiny-path/ subfolder)
- `index.html` — shell, PWA meta, all overlays (auth, detail, profile, settings, image modal, crop modal)
- `app.js` — all JS logic (ES modules, no bundler)
- `style.css` — all styles
- `manifest.json` — PWA manifest
- `sw.js` — service worker (network-first shell, cache-first images)
- `robots.txt` — disallow all crawlers

## Supabase
- Project ID: czaztxqhkqwoviazqaeu
- Anon key: in app.js (public, safe)
- Tables: posts, comments, profiles, votes, reactions
- Auth: email + password, Email confirm is DISABLED (intentional for private app)
- profiles schema: id (PK = auth.uid()), display_name, bio, cover_photo_url, avatar_url, avatar_initials, created_at
- posts schema includes: video_url text (added v4.5)
- IMPORTANT: if new columns are added to profiles in code, run the ALTER TABLE in Supabase immediately — missing columns cause the auth listener to timeout and show "server isn't responding"

## Image & Video Storage Pattern
- `image_url` column: plain string → single image URL (legacy + new single uploads)
- `video_url` column: single video URL (Cloudinary /video/upload endpoint)
- Use parseImages(image_url) helper in app.js to normalize both cases for images.
- Videos are always a single URL — no multi-video support.

## Version Bump Checklist (before every deploy)
1. Bump version string in index.html settings footer → "Tiny Path vX.Y · YYYY-MM-DD"
2. Bump CACHE_VERSION in sw.js → "tinypath-vX.Y"
3. (No VERSION constant in app.js — version lives in index.html only)

## Architecture Notes
- allPosts array holds all posts; renderFeed() re-renders from it (filter-aware)
- allProfiles map (userId → profile row) cached in loadPosts() for avatar rendering
- Comments: loaded fresh on detail open, realtime via channel subscription, unsubscribed on close
- Votes: votes table with UNIQUE(post_id, user_id), toggling same type removes it
- Reactions: reactions table with UNIQUE(post_id, user_id, emoji), multiple emoji per user allowed
- Feed realtime: single postgres_changes channel, re-fetches all posts on any change
- Auth state: onAuthStateChange handles login, logout, and session restore on page load
- TOKEN_REFRESHED / re-SIGNED_IN mid-session: guarded by appInitialized flag — does NOT re-run profile fetch or risk kicking user to login screen
- Session storage: custom `idbStorage` adapter backed by IndexedDB (`tinypath-auth` DB, `kv` object store) — NOT localStorage. iOS PWA clears localStorage aggressively between launches; IndexedDB is durable. Falls back to localStorage if IDB errors. One-time migration from localStorage runs on first getItem call.
- Loading screen (`#loadingScreen`) is shown by default on page load; `authScreen` starts with `hidden` class. Logged-in users see the spinner briefly then go straight to the app — they never see the login form.

## Radial FAB
- 4 buttons fan from bottom-right corner toward upper-left at r=130px
- Order (nth-child): Location(1,5°), Video(2,31.7°), Photo(3,58.3°), Text(4,85°)
- Stagger delays: Text(0s) → Photo(0.04s) → Video(0.08s) → Location(0.12s)
- Video button triggers file picker immediately; 50MB client-side size guard

## iOS Quirks Handled
- font-size: 16px on all inputs (prevents auto-zoom)
- user-scalable=no in viewport meta
- File input wrapped in <label> for reliable photo picker trigger
- touch-action: pan-y on body (no pinch zoom except in crop tool)
- gesturestart/gesturechange blocked at document level

## CSS Architecture
- Mobile-first — no desktop breakpoints needed (private mobile app)
- Color palette: #c0392b (red brand), #f4f1ee (warm white bg), #222 (primary text)
- All grays at WCAG AA or better: #666, #767676 for secondary text

## Error Handling Patterns (as of v4.7)
- All Cloudinary uploads validate data.secure_url exists before proceeding (throws on failure)
- deletePost, submitComment, castVote, toggleReaction all surface errors via showToast()
- No alert() calls remain — all errors use showToast() or inline error text
- submitComment restores input value if insert fails so user doesn't lose their text
- Object URLs (photo/video previews) are revoked in closeSheet() and on file swap
- Crop tool mouse listeners (mousemove/mouseup) added per-drag and removed in closeCropModal()
- Location submit button disabled when geolocation fails or is denied

## Known Limitations / Future Debt
- Feed rebuilds full DOM on every realtime update (renderFeed clears innerHTML)
- Member since derived from posts, not auth created_at
- No vote deduplication beyond the UNIQUE constraint
- Multi-photo remove-one not supported (clear all or nothing)
- Family Path still on Firebase (migration blocked by Supabase free tier)

## iOS / Native Strategy
- Decision: start with Web Push notifications on existing PWA (iOS 16.4+) before native toolchain
- If install friction remains, next step is Capacitor + TestFlight — vanilla JS codebase ports unchanged
- Full strategy memo: `memory/iOS-strategy-memo.md`
- App Store is ~10% additional work once a Capacitor + TestFlight build exists

## Project Tooling
- Build tracker: `tiny-path-tracker.html` — visual priority board + `#tracker-data` JSON block
- Feeds cross-project dashboard at project-dashboard-6a7.pages.dev
- Update tracker at end of every session that changes priorities — bump `updated` date in both header and JSON block
