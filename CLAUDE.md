# CLAUDE.md — Tiny Path Project Constitution

> *"Ordo ab chao"* — Order from chaos. We build things that are useful, simple, and satisfying to use.
> We don't let perfect be the enemy of good. We ship, we learn, we iterate.

---

## 🧠 Memory & Strategy

- **Read First:** Always check `DECISIONS.md` before starting any task. It tells you the current state of the project, what has been decided, and what is still open.
- **Measure Twice:** For any change touching more than one file, propose a brief plan and wait for an explicit "go" or "y" before writing code.
- **Ask Before Pivoting:** If a new request seems to contradict existing code or decisions, pause and ask: *"Are we pivoting, or extending?"* Don't refactor without confirmation.
- **Don't Assume File Contents:** Do not read entire directories speculatively. Ask for specific file paths if context is needed. Only read what is necessary for the task at hand.

---

## 📁 Project Structure

This repository contains **two independent apps**, each deployable as a standalone Netlify site:

```
tiny-path/                  ← project root (you are here)
├── tiny-path/              ← Tiny Path app (friends) — drag to Netlify
├── family-path/            ← Family Path app (family) — drag to Netlify
├── CLAUDE.md               ← this file (project-wide constitution)
├── DECISIONS.md            ← project-wide decision log
└── favicon_io (1)/         ← source icon assets
```

Each app subfolder is self-contained: its own `index.html`, `app.js`, `style.css`, Firebase config, `manifest.json`, and `sw.js`. **When editing one app, only touch files inside its subfolder.**

---

## 🌱 Project Identity

**Tiny Path** (`tiny-path/`) is a private, mobile-first micro social network for a small trusted friend group (10–20 people). It is inspired by the warmth and intimacy of the original Path app (circa 2012).

**Family Path** (`family-path/`) is a fork of Tiny Path for family use — same codebase, separate Firebase project, earth-tone color palette, and "Family Path" branding.

The shared emotional design goal is: *a digital journal you share with your closest people.* It should feel personal, light, and a little nostalgic — not like a social media platform.

---

## 🛠 Tech Stack (Locked Unless Explicitly Pivoted)

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Vanilla HTML / CSS / JS (ES Modules) | No framework. Keep it simple. |
| Database | Firebase Firestore | Realtime sync via `onSnapshot` |
| Image Hosting | Cloudinary | Unsigned upload preset |
| Geocoding | OpenStreetMap Nominatim | Free, no key required |
| Hosting | Netlify | Drag-and-drop deploy, no CLI needed |

**Live URLs:**
- Tiny Path: `https://peaceful-speculoos-c9dc9a.netlify.app`
- Family Path: `https://remarkable-lokum-9b186c.netlify.app`

**Do not introduce new dependencies, frameworks, or services without explicit discussion and a DECISIONS.md update.**

---

## 🎨 Design Principles

1. **Mobile-first, always.** Every UI decision should be evaluated on a phone screen first.
2. **Focused elegance.** Prefer one well-crafted element over three mediocre ones. Clean typography, soft shadows, rounded cards.
3. **Subtle motion, not spectacle.** Micro-animations should feel natural and alive — not performative. Fade-ins, gentle slides, soft transitions. Never flashy.
4. **Emotional warmth.** This is a personal space. UI copy, icons, and interactions should feel human and intimate, not clinical.
5. **Path aesthetic reference points:**
   - Moment grouping by day (date headers: "Today", "Yesterday", "Feb 23")
   - Rounded cards with soft shadows
   - Warm off-white backgrounds
   - Red primary brand color (`#c0392b`)
   - Pacifico for logo, Inter for body

---

## ⚙️ Feature Philosophy

- **No login, no friction.** Username is stored in `localStorage`. Honor system is intentional for this trust group.
- **Keep the feed clean.** The main feed is for scanning. Details (comments, reactions) live in a post detail view.
- **Flat over complex.** No threading, no algorithms, no feeds within feeds. Chronological, grouped by day.
- **Small footprint.** Every feature added should justify its weight. When in doubt, leave it out until someone asks for it twice.

---

## 💡 Interaction Patterns (Shipped)

- **Post Detail View:** Tapping a post opens a focused detail view. Comments and vote counts live here.
- **Upvote / Downvote:** Simple 👍 / 👎 counters on each post. No identity attached. Counts stored in Firestore.
- **Comments:** Flat list. No threading. Shown in post detail view. Stored as a subcollection under each post document.
- **User Filter / Profile View:** Ability to filter the feed by username. Shows only that user's posts. Acts as a lightweight profile.
- **Day Grouping:** Feed is visually grouped under date headers. Posts are still ordered newest-first within each group.
- **Micro-animations:** Cards fade and slide in on load. Detail view transitions smoothly. Buttons have tactile feedback states.

---

## 🪙 Token & Compute Etiquette

- **Don't read speculatively.** Only open files when directly needed for the task.
- **Propose before acting** on multi-file changes.
- **Prefer targeted edits** (`str_replace`) over full file rewrites when only a section is changing.
- **Ask for clarification** rather than making assumptions that require re-work.
- These aren't hard blocks — they're a default posture. Efficiency is a form of respect.

---

## 📝 Maintenance

- After any meaningful decision or pivot, ask: *"Should I update DECISIONS.md?"*
- After V2 features are shipped, propose a changelog entry.
- If conversation history is getting long (20+ messages), suggest a `/clear` and context reset.

---

## 🚫 Parking Lot (Do Not Build Yet)

These are good ideas that are explicitly deferred. Do not implement without a new planning conversation:

- Radial / fan-out post button (Path's iconic UI)
- Emotion reactions (❤️ 😄 😢 etc.)
- Avatar photo uploads
- Firebase Authentication
- Invite code gate
- Music sharing
- Dark mode
- PWA / installable app (shipped in V2)
- Post deletion
- Post editing
