# CLAUDE.md — Tiny Path Project Constitution

> *"Ordo ab chao"* — Order from chaos. We build things that are useful, simple, and satisfying to use.
> We don't let perfect be the enemy of good. We ship, we learn, we iterate.

---

## 🧠 Memory & Strategy

- **Read First:** Always check `DECISIONS.md` before starting any task. It tells you the current state of the project, what has been decided, and what is still open.
- **Measure Twice:** For any change touching more than one file, propose a brief plan and wait for an explicit "go" before writing code.
- **Ask Before Pivoting:** If a new request seems to contradict existing code or decisions, pause and ask: *"Are we pivoting, or extending?"*
- **Don't Assume File Contents:** Read the relevant files before editing. Only read what is necessary.
- **Version bump rule:** Every time `app.js` is edited and output for deployment, auto-bump the `VERSION` constant at the top. Format: `"vX.Y · YYYY-MM-DD"`. Increment minor version (Y) for each set of changes. Also bump `CACHE_VERSION` in `sw.js` to match (e.g. `"tinypath-v3.5"`).

---

## 📁 Project Structure

```
tiny-path/                  ← repo root (GitHub → Cloudflare Pages)
├── tiny-path/              ← Tiny Path app (friends) — ACTIVE
├── family-path/            ← Family Path app (family) — PENDING MIGRATION
├── CLAUDE.md               ← this file
├── DECISIONS.md            ← decision log and current state
├── memory/
│   └── MEMORY.md           ← quick-reference technical notes
└── favicon_io (1)/         ← source icon assets
```

**Cloudflare Pages** serves the `tiny-path/` subfolder as root. All deployable files live there.

---

## 🌱 Project Identity

**Tiny Path** (`tiny-path/`) is a private, mobile-first micro social network for a small trusted friend group (10–20 people). Inspired by the warmth and intimacy of the original Path app (circa 2012).

**Family Path** (`family-path/`) is a sibling app for family use — same architecture, separate Supabase project, earth-tone palette. Migration from Firebase to Supabase is pending (free tier limit reached during Tiny Path migration).

The shared emotional design goal: *a digital journal you share with your closest people.* Personal, light, a little nostalgic. Not a social media platform.

---

## 🛠 Tech Stack (Locked)

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Vanilla HTML / CSS / JS (ES Modules) | No framework |
| Database | Supabase (PostgreSQL) | Realtime via postgres_changes |
| Auth | Supabase Auth | Email + password; display name in user_metadata.username; bio in user_metadata.bio |
| Image Hosting | Cloudinary | dqqml8dae / tiny-path-unsigned |
| Geocoding | OpenStreetMap Nominatim | Free, no key required |
| Hosting | Cloudflare Pages | Connected to GitHub, push to deploy |

**Stack is locked.** No new frameworks or services without a logged decision in DECISIONS.md.

---

## 🎨 Design Principles

1. **Mobile-first, always.** Every UI decision evaluated on iPhone first. Test in Safari PWA mode.
2. **Focused elegance.** One well-crafted element over three mediocre ones. Clean typography, soft shadows, rounded cards.
3. **Subtle motion, not spectacle.** Micro-animations should feel natural — not performative.
4. **Emotional warmth.** UI copy, icons, and interactions should feel human and intimate.
5. **Path aesthetic:** Day grouping, rounded cards, warm off-white (#f4f1ee), red brand color (#c0392b), Gentium/Nunito for logo, Inter for body.

---

## ⚙️ Feature Philosophy

- **Auth required.** Login with email + password via Supabase Auth. No anonymous posting.
- **Keep the feed clean.** Main feed is for scanning. Details live in post detail view.
- **Flat over complex.** No threading, no algorithms. Chronological, grouped by day.
- **Small footprint.** Every feature added should justify its weight.

---

## 💡 Interaction Patterns (Shipped as of v4.0)

- **Auth:** Full-screen login/signup overlay. Email + password, email verification required. "Forgot password?" link → reset email → set new password screen. Display name stored in `profiles` table (Supabase), frozen at post time. `user_id` UUID is immutable identity.
- **Post Detail View:** Slides in from right. Swipe right to dismiss. Body scroll locked while open.
- **Radial FAB:** Bottom-right corner. Red floating button fans out 3 options (Text/pencil, Photo/camera, Location/pin) in an arc toward screen center (upper-left). Backdrop tap closes. Haptic on open.
- **Post Sheet:** Bottom sheet with Cancel/Post header, handle bar, char counter (300). Text mode focuses textarea. Photo mode triggers file picker immediately. Location mode auto-fetches via Nominatim.
- **Votes:** Per-user, one vote per post, mutual exclusivity (up cancels down and vice versa). Toggle same type to remove. Active vote highlighted (up=red, down=slate). Stored in `votes` table.
- **Emoji Reactions:** Native emoji keyboard — floating input bubble, Intl.Segmenter extracts first grapheme. Per user per emoji per post. Badge display on feed cards. Tap own badge to remove reaction.
- **Reaction Breakdown:** "See who reacted ▾" in post detail. Expands to show each reaction/vote with the display names of users who did it.
- **Video Posts:** 4th radial FAB button (film icon). Triggers file picker, 50MB client-side guard, uploads to Cloudinary /video/upload. Stored in posts.video_url. Rendered as native `<video controls playsinline>` in feed and detail.
- **Post Edit:** Owner-only. Text field only (images and location not editable). Accessed from detail view.
- **Post Delete:** Owner or moderator (`cstewch@gmail.com`). Accessed from detail view. Confirmation dialog.
- **Comments:** Flat list in post detail. Posted under logged-in display name. Realtime via postgres_changes.
- **User Filter:** Tap username → filter feed to that user's posts. Banner with "✕ All posts" to clear.
- **Image Modal:** Fullscreen on tap. Body scroll locked while open.
- **Settings modal:** Display name edit, logout, PWA install instructions. Body scroll locked while open.
- **PWA:** manifest.json + service worker. Installable on iOS via Safari Share → Add to Home Screen.
- **Realtime:** posts, votes, reactions channels via Supabase postgres_changes. Comments subscribed per-post while detail is open.

---

## 🪙 Token & Compute Etiquette

- Don't read speculatively. Only open files when directly needed.
- Propose before acting on multi-file changes.
- Prefer targeted edits over full file rewrites.
- Ask for clarification rather than making assumptions.

---

## 🚫 Parking Lot (Do Not Build Yet)

- Notification / unread indicator for new posts
- Post deletion confirmation UI improvement (replace browser confirm())
- Invite code gate
- Music sharing
- Dark mode
- Threaded comments
- Family Path Supabase migration (needs separate project)
