# DECISIONS.md — Tiny Path Change Log & Current Context

> This file is the living record of what has been decided.
> Brainstorming lives in conversation. Decisions live here.
> When in doubt about project direction, this file wins.

---

## 🎯 Current North Star

**Goal:** Maintain and evolve Tiny Path as a polished, intimate private social feed for a small trusted friend group.

**Vibe:** "Warm & Considered." Utility first, beauty close behind. Ship, learn, iterate.

**Current Version:** v4.3 · 2026-03-28

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

### [2026-03-27] — Radial FAB (v3.1)
- Replaced top-of-screen composer with Path's iconic radial floating action button
- FAB initially placed at bottom-center; fanned 3 radial options: text (pencil), photo (camera), location (pin)
- Icons only — no labels
- Backdrop tap closes the fan; haptic on open
- Post sheet slides up from bottom (Cancel / Post header, handle bar, char counter)
- Photo mode triggers file picker immediately on tap; caption optional
- Location mode auto-fetches via Nominatim on open
- Detail view hides FAB while open; FAB restored on close

### [2026-03-27] — Password Reset Flow (v4.1)
- Added "Forgot password?" link on sign-in screen (subtle, below submit button)
- Forgot password screen: email input → `supabase.auth.resetPasswordForEmail()` with `redirectTo: tiny-path.pages.dev`
- Success state shown inline on same card (no extra screen)
- Set new password screen: shown when user returns via reset link (`PASSWORD_RECOVERY` auth event)
- Fixed race condition: Supabase fires `SIGNED_IN` immediately after `PASSWORD_RECOVERY`, which was skipping the set-password screen. Fixed with `inPasswordRecovery` flag that blocks `SIGNED_IN` handler until password is submitted
- Friendly error message for Supabase's built-in email rate limit
- **Pending:** Custom SMTP via Resend to eliminate rate limits (see Next Session)

### [2026-03-27] — FAB to Bottom-Right + Fan Direction (v3.2)
- Moved FAB anchor to bottom-right corner (was centered)
- Radial buttons now fan toward upper-left — the axis from the FAB corner toward screen center
- Arc: Text (almost straight left) → Photo (upper-left diagonal) → Location (almost straight up)
- Stagger delay sweeps Text→Photo→Location so animation unfolds naturally across the arc

### [2026-03-27] — Per-User Votes + Emoji Reactions (v4.0)
- **Votes table** replaces `upvotes`/`downvotes` columns on posts (columns dropped)
  - Schema: `votes(id, post_id, user_id, display_name, vote_type, created_at)` UNIQUE(post_id, user_id)
  - One vote per user per post; toggling the same type removes it; switching type replaces it
  - Active vote highlighted (up = red, down = slate)
- **Reactions table** for emoji reactions
  - Schema: `reactions(id, post_id, user_id, display_name, emoji, created_at)` UNIQUE(post_id, user_id, emoji)
  - One row per user per emoji per post — multiple emoji per user allowed
  - `display_name` stored at reaction time so breakdowns work without profile join
- **Emoji picker** — 16-emoji curated grid (❤️🔥😂😮😢😡🎉👀😍🙌💯🫶✨💀🤣😭)
  - Floating above trigger button, positioned with clamp-to-viewport logic
  - Selected emoji highlighted; tapping again deselects
- **Reaction badges** on feed cards: `emoji count` pills, user's own reactions outlined in red
- **"See who reacted" breakdown** in post detail — tap to expand per-emoji/vote list with display names
- **Realtime** for votes and reactions via postgres_changes channels (REPLICA IDENTITY FULL on both tables)
- **Scroll lock** added to image modal and settings modal (detail view already had it)
- Both tables: RLS enabled, anyone can read, users manage only their own rows

---

## 🔜 Next Up (Prioritized Backlog)

These were discussed and ranked by the user. Build in this order:

1. ✅ Disable touch zoom (shipped v3.4)
2. ✅ Images tap to detail in feed (shipped v3.2)
3. ✅ Auto-hyperlink URLs (shipped v3.2)
4. ✅ Smaller feed images (shipped v3.2)
5. ✅ Multi-photo upload (shipped v3.2)
6. ✅ Clickable avatars → profile view (shipped v3.3)

**Shipped this session (move these to done):**
- ✅ Radial FAB (v3.1)
- ✅ FAB to bottom-right, fan toward center (v3.2)
- ✅ Per-user votes (v4.0)
- ✅ Emoji reactions + picker (v4.0)
- ✅ Reaction breakdown / "see who reacted" (v4.0)
- ✅ Scroll lock on all modals (v4.0)
- ✅ Password reset flow (v4.1)

### [2026-03-28] — Profile overlays, native emoji keyboard, vote fixes (v4.2)
- **Profile overlay** — tapping any username/avatar opens a full-screen profile view (slides from right, swipe to close). Shows cover photo, big avatar, bio, post count, and scrollable post list. Tapping a post opens detail view.
- **Profile editing** — own profile: tap cover photo area to change (Cloudinary upload), tap bio text to edit inline. Settings gains "Edit profile" button that opens own profile.
- **DB change:** `ALTER TABLE profiles ADD COLUMN bio text; ALTER TABLE profiles ADD COLUMN cover_photo_url text;`
- **Native emoji keyboard** — replaced 16-emoji custom picker with a floating input bubble. User types/pastes any emoji; Intl.Segmenter extracts the first grapheme cluster and adds it as a reaction. Full access to all Apple/Android emoji.
- **Line-art emoji trigger icon** — replaced the 😊 emoji literal with an SVG smiley face outline (consistent with the other action icons).
- **Vote/reaction error handling** — `castVote` and `toggleReaction` now surface errors via a toast notification instead of silently failing.
- **Version bump:** `tinypath-v4.2` in sw.js

### [2026-03-28] — Avatar photos, circular crop, pan fix, zoom lock (v4.3)
- **Avatar photo upload** — own profile gains a red camera badge on the big avatar circle. Tapping opens a circular crop tool (260px circle preview). Output: 400×400 JPEG uploaded to Cloudinary, saved to `profiles.avatar_url`.
- **Initials editing** — own profile shows an "Initials" row (1–3 chars, text input + Save). Saved to `profiles.avatar_initials`. Falls back to first letter of display name.
- **"Use initials" button** — appears when a photo is set; clears `avatar_url` and reverts to text.
- **Feed + detail avatars** — `loadPosts()` now fetches profiles for all posters in parallel. Feed cards and detail view render photo avatars when set, initials otherwise. `allProfiles` map caches this data.
- **Crop tool: pan when zoomed out** — `clampCropOffset` changed from `Math.max(0, ...)` to `Math.abs(...)` so the image can be dragged in any direction even when smaller than the crop window.
- **Crop tool: avatar mode** — `openCropModal(file, onConfirm, mode)` accepts `'cover'` or `'avatar'`. Avatar mode adds `.crop-modal--avatar` class: square circular window, 400×400 canvas output.
- **Viewport zoom lock** — viewport meta `maximum-scale=1, user-scalable=no`; CSS `overflow-x: hidden` + `touch-action: pan-y` on body; JS blocks `gesturestart`/`gesturechange` and multi-touch `touchmove` at document level.
- **iOS input zoom fix** — global `input, textarea, select { font-size: 16px }` rule prevents iOS auto-zoom on input focus.
- **DB change:** `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text; ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_initials text;`
- **Version bump:** `tinypath-v4.3` in sw.js

**Status:** All changes on `dev` branch, tested on preview URL. Merge dev → main when ready.

### [2026-03-28] — Resend SMTP + Auth hardening
- **Resend SMTP configured** — auth emails now route through `hello@chadstewartcpa.com` via Resend (smtp.resend.com, port 465). Domain verified. DNS records in Cloudflare (note: domain registered on Porkbun but nameservers point to Cloudflare — always edit DNS in Cloudflare).
- **Auth flow hardened:**
  - Display name form: replaced `alert()` with inline error, added 30s timeout on `profiles.insert()`
  - Signup: added 30s timeout on `signUp()` call
  - `onAuthStateChange` profile fetch: added 20s timeout with fallback error on auth screen
  - Check email screen: added spam folder hint + "Resend verification email" button (`supabase.auth.resend`)
  - Tracked `pendingSignupEmail` state for resend functionality

**Next features to consider:**
- Notification / unread indicator for new posts
- Family Path Supabase migration
- Post deletion confirmation UI improvement (replace `confirm()` dialog)

---

## 💡 Parking Lot (Explicitly Deferred)

- Invite code gate
- Music sharing
- Dark mode
- Threaded comments
- Family Path migration (needs separate Supabase project)
