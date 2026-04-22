# Memo: Tiny Path iOS Strategy
**Date:** 2026-04-22
**Subject:** Web App vs. Native iOS — Options, Plan, and Considerations

---

## Context

Tiny Path is currently a vanilla JS/HTML/CSS PWA hosted on Cloudflare Pages, backed by Supabase. The question at hand: should we move to a native iOS app to improve accessibility for friends and unlock native iOS features? If so, what's the right path and what does it cost?

---

## Options Evaluated

### 1. Improve the Existing PWA
Tiny Path already has a manifest and service worker. The main gap on iOS is push notifications and install friction. iOS 16.4+ supports Web Push for installed PWAs.

- **Pros:** Zero new tooling, preserves the 30-second Cloudflare Pages deploy cycle, no Apple account needed
- **Cons:** "Add to Home Screen" is buried in Safari, no notifications unless installed, older iOS deletes PWA after non-use
- **Verdict:** The right first step — specifically adding Web Push notifications

### 2. Capacitor (Recommended Path)
Wraps the existing web app in a native `WKWebView` shell. No rewrite required. Produces a real `.ipa` that can be distributed via TestFlight or the App Store.

- **Pros:** Existing HTML/JS/CSS runs unchanged, access to native APIs (push notifications, haptics, camera), real home screen app, TestFlight distribution for friends
- **Cons:** Requires Mac + Xcode, $99/yr Apple Developer account, two deployment pipelines to manage, annual certificate renewal
- **Verdict:** Best fit for this project given the locked vanilla JS stack

### 3. Full Native Rewrite (SwiftUI or React Native / Expo)
Rebuild the app from scratch in a native framework.

- **Pros:** Best performance and iOS-native feel
- **Cons:** Complete rewrite, no alignment with the current tech stack, massive ongoing maintenance divergence
- **Verdict:** Not worth it for a private app serving 10–20 people

---

## The Plan: TestFlight First

**Phase 1 — Web Push on PWA (immediate, no new toolchain)**
Add Web Push notifications to the existing PWA for iOS 16.4+ users. Closes the biggest functional gap with zero tooling overhead.

**Phase 2 — Capacitor + TestFlight (when install friction needs solving)**
Wrap Tiny Path in Capacitor and ship to friends via TestFlight. No App Store listing required. Friends install via invite link.

**Phase 3 — App Store (only if needed)**
If the 90-day TestFlight expiry becomes burdensome, or if we want to open the app to more people, submit the same Capacitor build to the App Store with a proper listing. This is ~90% done once Phase 2 is complete.

---

## TestFlight: What's Involved

**Prerequisites:**
- Apple Developer account — $99/yr, takes 24–48 hrs to activate
- Mac with Xcode (~15GB install)

**Setup steps (one-time, ~2–4 hours):**
1. Init Capacitor, point web dir at `tiny-path/`
2. `npx cap add ios` → sync files → open in Xcode
3. Configure bundle ID and automatic code signing
4. Archive → upload to App Store Connect
5. Create TestFlight group → invite friends by email

**Ongoing:**
- Web-layer changes: deploy via Capawesome Live Updates (fast, like Cloudflare Pages)
- Native/plugin changes: Xcode archive → re-upload → App Store review (1–3 days)
- TestFlight builds expire every 90 days — re-upload required (~20 min once familiar)

---

## Cost / Benefit Summary

| Factor | PWA (current) | TestFlight via Capacitor | App Store |
|---|---|---|---|
| Cost | Free | $99/yr Apple Dev | $99/yr (same account) |
| Deploy speed | ~30 seconds | Fast (web layer via live updates) / 1–3 days (native changes) | Same as TestFlight + review |
| Push notifications | iOS 16.4+ only, PWA must be installed | Full APNs support | Full APNs support |
| Install friction | High (Safari → Share → Add to Home) | Low (email invite → TestFlight link) | Very low (App Store search) |
| Mac + Xcode required | No | Yes | Yes |
| App Store review | No | Light (automated scan) | Full review |
| Privacy policy required | No | No | Yes |
| App Store listing work | None | None | Screenshots, description, labels |
| Future App Store transition | N/A | 90% done | — |

---

## What You'd Lose Going Native

- The instant, friction-free deploy cycle (for any native-layer change)
- Platform independence — Mac + Xcode become a hard dependency
- The simplicity of a single artifact (web app = deployed app)
- Freedom from Apple's review process and annual churn (iOS releases, plugin updates)

## What You'd Gain

- Push notifications that work when the app is closed — the single biggest UX improvement for a social feed
- A real home screen app icon with no user instruction needed
- Better haptics (Taptic Engine)
- No dependence on Safari PWA behavior quirks
- A path to the App Store if the audience ever grows

---

## Key Gotchas to Remember

- **Demo account required:** Apple reviewers must be able to log in. Provide a `test@...` Supabase account in the TestFlight submission notes.
- **Camera and location permission strings:** Both must be declared in `Info.plist` with plain-English explanations. Capacitor generates the file; you fill in the strings. Missing these = rejection.
- **App icon:** Requires a 1024×1024 PNG with no alpha channel (transparency will be rejected). Current icons will need a clean export.
- **`npx cap copy`:** Must be run every time web files change during local development to sync into the Xcode project.
- **90-day expiry:** Each TestFlight build expires. Set a calendar reminder; re-upload takes ~20 minutes.
- **Versioning:** iOS requires a separate build number (sequential integer) alongside the app version. The current version bump rule in CLAUDE.md will need to account for both.

---

## Recommendation

Start with Web Push on the existing PWA — it closes the biggest gap (notifications) with zero new tooling. If friends still struggle with install friction after that, move to Capacitor + TestFlight. The App Store is available later with minimal additional work once the Capacitor shell exists.

The current Cloudflare Pages workflow is genuinely one of the best parts of this project. Don't give it up until the benefit is clearly worth it.
