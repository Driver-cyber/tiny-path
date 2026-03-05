# CLAUDE.md — Tiny Path Project Constitution

> *"Ordo ab chao"* — Order from chaos. We build things that are useful, simple, and satisfying to use.
> We don't let perfect be the enemy of good. We ship, we learn, we iterate.

---

## 🧠 Memory & Strategy

- **Read First:** Always check `DECISIONS.md` before starting any task. It tells you the current state of the project, what has been decided, and what is still open.
- **Read the transcript** if referenced — full conversation history is at `/mnt/transcripts/`. Check `journal.txt` there for a catalog of past sessions.
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

## 💡 Interaction Patterns (Shipped as of v3.5)

- **Auth:** Full-screen login/signup overlay. Email + password. Display name in user_metadata.username.
- **Posting-as chip:** Read-only, shows logged-in user.
- **Post Detail View:** Slides in from right. Swipe right to dismiss.
- **Upvote / Downvote:** Simple counters. Haptic feedback on mobile.
- **Comments:** Flat list. Posted under logged-in display name.
- **Multi-photo upload:** Unlimited photos per post. Parallel Cloudinary uploads. Feed shows first image + "+N more" badge. Detail shows first big + thumbnail row.
- **Composer image preview:** Thumbnails shown before posting.
- **Auto-hyperlinks:** URLs in post text auto-linked. Open in new tab.
- **Profile view:** Tap avatar/username → profile overlay. Shows post count, member since, bio. Own profile has bio edit.
- **Settings modal:** Display name edit, logout, install instructions. Locks body scroll.
- **PWA:** Network-first service worker. Cache versioned to match app version.
- **Touch zoom:** Disabled globally. Re-enabled in image modal. All inputs at font-size 16px.
- **iOS photo picker:** File input wrapped in label for reliable iOS trigger.
- **Accessibility:** ARIA roles, labels, alt text on all images, WCAG AA color contrast, main landmark, non-blocking fonts.
- **robots.txt:** Disallows all crawlers (private app).

---

## 🪙 Token & Compute Etiquette

- Don't read speculatively. Only open files when directly needed.
- Propose before acting on multi-file changes.
- Prefer targeted edits over full file rewrites.
- Ask for clarification rather than making assumptions.

---

## 🚫 Parking Lot (Do Not Build Yet)

- Radial / fan-out post button
- Emotion reactions (❤️ 😄 😢)
- Avatar photo uploads
- Invite code gate
- Music sharing
- Dark mode
- Post deletion / editing
- Threaded comments
- Per-user vote tracking
- Family Path Supabase migration (blocked by free tier)
