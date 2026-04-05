# Tiny Path — Technical Memory

## Current State
**Version:** v3.5 · 2026-03-04
**Live URL:** https://tiny-path.pages.dev
**Repo:** github.com/Driver-cyber/tiny-path
**Deployment:** Cloudflare Pages, auto-deploys on push to main

## Key Files (all inside tiny-path/ subfolder)
- `index.html` — shell, PWA meta, all overlays (auth, detail, profile, settings, image modal)
- `app.js` — all JS logic (ES modules, no bundler)
- `style.css` — all styles (~1400 lines)
- `manifest.json` — PWA manifest
- `sw.js` — service worker (network-first shell, cache-first images)
- `robots.txt` — disallow all crawlers

## Supabase
- Project ID: czaztxqhkqwoviazqaeu
- Anon key: in app.js (public, safe)
- Tables: posts, comments, profiles, votes, reactions
- Auth: email + password, Email confirm is DISABLED (intentional for private app)
- profiles schema: id (PK = auth.uid()), display_name, bio, cover_photo_url, avatar_url, avatar_initials, created_at
- IMPORTANT: if new columns are added to profiles in code, run the ALTER TABLE in Supabase immediately — missing columns cause the auth listener to timeout and show "server isn't responding"

## Image Storage Pattern
image_url column holds either:
- Plain string → single image URL (legacy + new single uploads)
- JSON array string → multiple image URLs
Use parseImages(image_url) helper in app.js to normalize both cases.

## Version Bump Checklist (before every deploy)
1. Bump VERSION in app.js → "vX.Y · YYYY-MM-DD"
2. Bump CACHE_VERSION in sw.js → "tinypath-vX.Y"
3. Check settings modal footer shows correct version (auto-set from VERSION on open)

## Architecture Notes
- allPosts array holds all posts; renderFeed() re-renders from it (filter-aware)
- Comments: loaded fresh on detail open, realtime via channel subscription, unsubscribed on close
- Votes: direct Supabase update on upvotes/downvotes fields
- Profile: derived from allPosts (no separate users table) — member since = earliest post date
- Bio: stored in Supabase user_metadata, fetched via supabase.auth.getUser()
- Feed realtime: single postgres_changes channel, re-fetches all posts on any change
- Auth state: onAuthStateChange handles login, logout, and session restore on page load

## iOS Quirks Handled
- font-size: 16px on all inputs (prevents auto-zoom)
- user-scalable=no in viewport meta
- File input wrapped in <label> for reliable photo picker trigger
- touch-action: pan-y on body (no pinch zoom except in modal)
- Dynamic viewport meta manipulation REMOVED (was causing zoom glitches)

## CSS Architecture
- Base styles at top of style.css
- Component styles in section order matching the HTML
- Mobile-first — no desktop breakpoints needed (private mobile app)
- Color palette: #c0392b (red brand), #f4f1ee (warm white bg), #222 (primary text)
- All grays at WCAG AA or better: #666, #767676 for secondary text

## Known Limitations / Future Debt
- Member since derived from posts, not auth created_at (no user table)
- No vote deduplication (users can vote multiple times)
- Multi-photo remove-one not supported (clear all or nothing)
- Family Path still on Firebase (migration blocked by Supabase free tier)
