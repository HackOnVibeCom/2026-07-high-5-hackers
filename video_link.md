# Demo Video — LaunchPilot AI 🚀

**Watch the demo:**

- ▶️ **YouTube:** https://youtu.be/dw9twuG-xrY
- 📹 **Committed in this repo:** [`video.mp4`](./video.mp4) — full walkthrough recording (~62 MB)

> The recording below walks the **actual user journey**: what you click, what
> the app expects you to do at each step (per its own logic), and the result you get.

---

## Walkthrough — the real user journey

### 1. Landing (`/`)
The user arrives at an animated 3D landing board.
- **They click:** the primary **"Get started"** call-to-action.
- **App logic:** until onboarding is complete, the app routes new users into setup rather than the dashboard.
- **Result:** they land on the staged onboarding flow.

### 2. Onboarding (`/onboarding`)
A staged "Launch plan" runs down the left rail; each stage unlocks the next only when the previous one is completed (later stages stay **locked** until you finish the current one).
- **They click:** each stage in order — **app info → audience → competitors → assets → launch plan → campaign → growth** — answering the guided prompts (e.g. *"Who is your ideal user?"*, *"What problem does your app solve?"*, *"Who are your main competitors?"*).
- **App logic:** completing a stage marks it done and advances `activeStage`; the workspace is updated as they go and the user is flagged as onboarded at the end.
- **Result:** the workspace is populated and the dashboard unlocks.

### 3. Dashboard (`/`)
Now that onboarding is done, the landing route shows the real cockpit.
- **They see:** live KPIs, the **Launch Health Score**, and a ranked **Growth Advisor** feed.
- **App logic:** the score and recommendations are derived from the workspace data captured during onboarding.
- **Result:** a real-time read on launch readiness plus the next actions to take.

### 4. Studio (`/studio`)
- **They click:** **"Generate Brand Launch Package."**
- **App logic:** one call produces ASO metadata plus Reddit / LinkedIn / Twitter drafts (via OpenRouter, or the deterministic fallback engine when no API key is set — so it never breaks mid-demo). Every draft stays **locked until approved**.
- **Result:** ready-to-use launch copy with version history; publishing is approval-gated through a visible queue (no rogue posting).

### 5. Strategy (`/strategy`)
- **They do:** check off roadmap tasks and review competitor intel.
- **Result:** a working launch roadmap tied to their app.

### 6. Campaigns (`/campaigns`)
- **They click:** **"New campaign"**, pick platforms, and schedule it.
- **Result:** a created campaign that can be scheduled and tracked — and this is what unlocks Analytics.

### 7. Sandbox Simulator (`/simulator`)
- **They click:** **"Run simulation."**
- **App logic:** simulates a full launch week.
- **Result:** installs, CTR, and store rank evolve live, ending in a letter grade.

### 8. Discover (`/discover`)
- **They do:** browse curated communities and influencers and **bookmark** the relevant ones.
- **Result:** a saved shortlist of launch channels.

### 9. Analytics (`/analytics`)
- **App logic:** stays locked until at least one campaign has run, then derives install trends and channel performance from the user's **real campaign data**.
- **Result:** charts backed by their own activity, not demo filler.

### 10. Growth Agent (Ask AI — on every screen)
- **They click:** the **"Ask AI"** button available on any page.
- **App logic:** the assistant knows the user's app *and* the screen they're on, and deep-links its advice to the right page.
- **Result:** context-aware guidance that closes the loop — *what happened, why, and the exact next action* — with a click-through to where they can act on it.

---

*Built by Team High 5 Hackers for the HackOnVibe hackathon.*
