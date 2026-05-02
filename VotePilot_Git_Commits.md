# VotePilot AI — GitHub Commit Pathway
### Every commit, in order, with exact message and what goes in it

---

## Branch Strategy

```
main
 └── dev
      ├── feat/landing-onboarding
      ├── feat/dashboard
      ├── feat/ask-votepilot
      ├── feat/adk-agents
      ├── feat/simulator
      ├── feat/elections
      ├── feat/mythbuster
      └── polish/final
```

**Rule:** Never commit broken code to `main`. Work on feature branches, merge to `dev` when the feature works end-to-end, merge `dev` to `main` only on Day 5 and Day 10.

---

## Day 0 — Repo Init (Before You Start Building)

### Commit 1
```
git init
git remote add origin https://github.com/yourusername/votepilot-ai
```
```
chore: init repo
```
**What's in it:**
- `README.md` (just title + "Work in progress" for now)
- `.gitignore` (Next.js default + add `.env.local`)
- `LICENSE` (MIT)

> ⚠️ Never commit `.env.local`. Ever. Add it to `.gitignore` on day 0 before anything else.

---

## Day 1 — Scaffold + Landing + Firebase

### Commit 2
```
chore: next.js scaffold with tailwind
```
**What's in it:**
- Fresh Next.js 14 App Router project
- Tailwind configured
- Base folder structure created (empty files are fine)
- `lib/firebase.ts` — Firebase init (keys from env vars)
- `lib/firestore.ts` — empty shell with placeholder functions
- `.env.local.example` — template with all variable names, no values

### Commit 3
```
feat: landing page - hero, personas, how it works
```
**What's in it:**
- `app/page.tsx` — full landing page
- 3 demo persona buttons (First-Time Voter, Recently Moved, Last-Minute Learner)
- "How it works" 3-card section
- Features overview strip
- Navigation to `/onboarding` working

### Commit 4
```
chore: firebase firestore connected and verified
```
**What's in it:**
- `lib/firestore.ts` — `saveUserProfile()` and `getUserProfile()` functions implemented
- Firebase SDK properly initialized
- Verified Firestore writes work (test write/read in console, then delete test data)

---

## Day 2 — Onboarding + Recommendation Engine

### Commit 5
```
feat: onboarding page - form, validation, uuid generation
```
**What's in it:**
- `app/onboarding/page.tsx` — full form (age, first-time voter, EPIC, moved, state, help mode)
- UUID generation on submit → stored in `localStorage` as `votepilot_user_id`
- Form validation (age must be a number, state must be selected)
- Demo persona auto-fill working from landing page
- Navigates to `/dashboard` on submit

### Commit 6
```
feat: firestore write on onboarding submit
```
**What's in it:**
- `lib/firestore.ts` — `saveUserProfile()` fully implemented
- Profile saves to `users/{userId}` on form submit
- Verified in Firebase Studio console that document appears correctly

### Commit 7
```
feat: recommendation engine - profile to checklist logic
```
**What's in it:**
- `lib/recommendationEngine.ts` — full implementation
- Handles: under-18, no voter ID, recently moved, first-time voter
- Returns: `currentStage`, `nextAction`, `checklist[]`, `warnings[]`, `readinessSeedScore`
- All 3 demo personas tested and return different results

---

## Day 3 — Dashboard + Readiness Ring

### Commit 8
```
feat: dashboard page - firestore read + recommendation render
```
**What's in it:**
- `app/dashboard/page.tsx` — reads `votepilot_user_id` from localStorage → fetches from Firestore
- Runs profile through `recommendationEngine`
- Renders: "You Are Here" stage, "Your Next Action", warnings
- `components/ChecklistItem.tsx` — checklist item with done/undone state
- Loading state while Firestore fetches

### Commit 9
```
feat: voter readiness score ring component
```
**What's in it:**
- `components/ReadinessRing.tsx` — SVG circular progress ring
- Animates from 0 to current score on mount
- Shows score number in center
- Color changes: red (0–30), amber (31–60), green (61–100)
- Integrated into dashboard

### Commit 10
```
feat: quick nav links on dashboard
```
**What's in it:**
- Quick nav cards on dashboard → Simulator, Ask VotePilot, Myth Buster
- Each card shows what the module does + estimated time
- Links working

---

## Day 4 — GCP + Vertex AI Search Setup

> No frontend commits today. This is infrastructure day.
> Commits are in the `/backend` folder only.

### Commit 11
```
chore: backend folder scaffold + adk project structure
```
**What's in it:**
- `/backend` folder created
- `/backend/agents/` — empty Python files for each agent
- `/backend/prompts/system_prompt.txt` — Gemini system prompt
- `/backend/requirements.txt` — ADK, google-cloud-aiplatform, fastapi, uvicorn
- `/backend/main.py` — empty FastAPI app shell
- `/backend/Dockerfile` — base Dockerfile for Cloud Run

### Commit 12
```
chore: vertex ai search datastore config + ECI docs uploaded
```
**What's in it:**
- `/backend/config.py` — GCP project ID, location, datastore ID constants
- `/docs/eci/` folder — list of ECI PDF filenames used (not the PDFs themselves, too large)
- `README_DATASTORE.md` — instructions for recreating the datastore if needed
- Note in commit body: "Datastore ID: [your-id], indexed [date]"

---

## Day 5 — ADK Agents

### Commit 13
```
feat: rag agent - vertex ai search retrieval
```
**What's in it:**
- `/backend/agents/rag_agent.py` — full RAG agent
- Queries Vertex AI Search datastore
- Returns `{ rawAnswer, sourceDocument, sourcePage }`
- Tested locally with 3 sample questions

### Commit 14
```
feat: search agent - vertex ai google grounding
```
**What's in it:**
- `/backend/agents/search_agent.py` — full Search agent
- Uses Vertex AI grounding with Google Search
- Returns `{ rawAnswer, sourceUrl, retrievedDate }`
- Tested with live election queries

### Commit 15
```
feat: formatter agent - explain level + language transform
```
**What's in it:**
- `/backend/agents/formatter_agent.py` — full Formatter agent
- Accepts `explainLevel` and `language` parameters
- Applies Gemini system prompt with those parameters
- Returns structured JSON: `{ answer, whyItMatters, whatYouShouldDo, keepInMind, source }`
- Tested all 3 explain levels × 3 languages = 9 combinations verified

### Commit 16
```
feat: orchestrator - routes queries to correct agents
```
**What's in it:**
- `/backend/agents/orchestrator.py` — routing logic
- `/backend/main.py` — FastAPI `POST /ask` endpoint wired to orchestrator
- Routing rules: factual → RAG, live data → Search, all → Formatter last
- End-to-end pipeline tested locally

### Merge to dev + main
```
git checkout dev
git merge feat/adk-agents
git checkout main
git merge dev
```
```
release: v0.1 - adk pipeline working end-to-end
```
> First `main` merge. Pipeline is the core — if this works, everything else is frontend.

---

## Day 6 — Cloud Run + Ask VotePilot Page

### Commit 17
```
chore: cloud run deployment - adk orchestrator live
```
**What's in it:**
- `/backend/Dockerfile` — finalized
- Cloud Run service URL noted in commit body
- `CLOUD_RUN_ORCHESTRATOR_URL` added to `.env.local.example`
- Backend health check endpoint `GET /health` returning 200

### Commit 18
```
feat: api route - next.js proxy to cloud run
```
**What's in it:**
- `app/api/ask/route.ts` — POST handler
- Reads `question`, `explainLevel`, `language`, `userProfile` from request body
- Proxies to Cloud Run `/ask`
- Returns response as JSON
- Error handling: if Cloud Run fails, return 500 with friendly message

### Commit 19
```
feat: ask votepilot page - input, toggles, response card
```
**What's in it:**
- `app/ask/page.tsx` — full Ask VotePilot page
- Text input with submit
- 5 preloaded example question chips (clickable)
- Explain Level toggle: Simple / Standard / Detailed
- Language toggle: English / Hindi / Assamese
- Loading skeleton while waiting for response
- `components/ResponseCard.tsx` — renders 4 fields + source citation
- Firestore update: first use of Ask VotePilot → readiness score +10

### Commit 20
```
test: verify hindi and assamese responses render correctly
```
**What's in it:**
- No new features — verification commit
- Screenshots in `/docs/screenshots/` folder showing Hindi + Assamese renders
- Any font or encoding fixes applied
- Commit body: "Assamese verified by native speaker ✓"

---

## Day 7 — Booth Day Simulator

### Commit 21
```
feat: simulator data - full state machine json
```
**What's in it:**
- `data/simulator.json` — complete state machine
- All 7 main stages + 8 branch stages
- All choices have valid `next` references
- All dead ends resolve to `restart`

### Commit 22
```
feat: simulator hook - state machine navigation
```
**What's in it:**
- `lib/useSimulator.ts` — full hook
- `choose()`, `goBack()`, `restart()` functions
- History stack for back button
- `canGoBack` boolean for conditional back button render

### Commit 23
```
feat: simulator stage component - renders all stage types
```
**What's in it:**
- `components/SimulatorStage.tsx` — handles normal, info, dead_end, completion
- Dead-end: red background tint + "restart" message
- Completion: celebratory UI + 🇮🇳 + "You've voted!" message
- Info stages: blue tint + tip callout box

### Commit 24
```
feat: simulator page - full working with back button + firestore score
```
**What's in it:**
- `app/simulator/page.tsx` — wires hook + component
- Progress indicator (stage X of ~15 possible)
- Back button (hidden when at start)
- On completion: Firestore readiness score update +25
- Restart button always visible

---

## Day 8 — Elections Page + Myth Buster

### Commit 25
```
feat: elections page - firestore read + filter tabs
```
**What's in it:**
- `app/elections/page.tsx` — filter tabs: Upcoming / Ongoing / Completed
- `components/ElectionCard.tsx` — state, type, phases, dates, status badge, winner
- Reads from Firestore `elections` collection
- Elections data seeded in Firebase Studio (from eci.gov.in)
- Loading + empty state handled

### Commit 26
```
feat: mythbuster agent - rag grounded myth debunking
```
**What's in it:**
- `/backend/agents/mythbuster_agent.py` — myth debunking via RAG
- `/backend/main.py` — added `POST /mythbuster` endpoint
- `app/api/mythbuster/route.ts` — Next.js proxy
- Cloud Run redeployed with myth agent included

### Commit 27
```
feat: myth buster page - flip cards with rag citations
```
**What's in it:**
- `app/mythbuster/page.tsx` — 8–10 myth cards layout
- `components/MythCard.tsx` — flip animation, myth front, fact + source citation back
- Calls `/api/mythbuster` on card flip
- Loading state on flip
- On all myths viewed: Firestore readiness score +15

---

## Day 9 — Polish + Analytics + Mobile

### Commit 28
```
fix: readiness score - audit all firestore update points
```
**What's in it:**
- Verified and fixed all 4 score update paths:
  - Onboarding complete → +20
  - Simulator complete → +25
  - Ask VotePilot first use → +10
  - Myth Buster all viewed → +15
- Dashboard score ring now reflects real accumulated total
- No duplicate score additions on re-visit

### Commit 29
```
feat: firebase analytics - key event tracking
```
**What's in it:**
- Analytics events added:
  - `ask_question` — fired on every VotePilot query
  - `simulator_completed` — fired on reaching exit stage
  - `myth_revealed` — fired on each card flip
  - `language_changed` — fired when toggle switches
  - `persona_selected` — fired on landing page persona click

### Commit 30
```
polish: mobile responsiveness - all pages 375px
```
**What's in it:**
- All 7 pages checked and fixed at 375px width
- Toggle buttons stack vertically on mobile
- Simulator choice buttons full-width on mobile
- ReadinessRing scales down correctly
- Election cards single-column on mobile

### Commit 31
```
polish: loading states + error boundaries on all ai components
```
**What's in it:**
- Loading skeletons on ResponseCard, MythCard
- Error state if Cloud Run returns 500: "Something went wrong. Try again."
- Error state if Firestore fails: app still renders with default/empty state
- No white screens on any failure path

### Commit 32
```
polish: ui consistency pass - typography, spacing, colors
```
**What's in it:**
- Consistent heading sizes across all pages
- Consistent card padding and border radius
- Consistent button styles (primary, secondary, ghost)
- Color palette unified
- Any leftover placeholder text removed

---

## Day 10 — README + Deploy + Submission

### Commit 33
```
docs: README - full submission documentation
```
**What's in it:**
- `README.md` — all 10 sections (see roadmap Section 12)
- Architecture diagram (ASCII version)
- `/docs/screenshots/` — dashboard, simulator, ask page, elections
- `.env.local.example` — final version with all variable names

### Commit 34
```
chore: production env vars + vercel deployment config
```
**What's in it:**
- `vercel.json` — if any config needed
- All env vars set in Vercel dashboard (not committed)
- Production URL noted in README

### Commit 35 — Final
```
release: v1.0 - submission ready
```
**What's in it:**
- Merge `dev` → `main`
- Version tag: `git tag v1.0`
- Commit body lists all features shipped
- Production URL in commit body
- Any last-minute fixes

```bash
git tag v1.0
git push origin main --tags
```

---

## Full Commit Timeline at a Glance

| Day | # | Commit Message |
|---|---|---|
| 0 | 1 | `chore: init repo` |
| 1 | 2 | `chore: next.js scaffold with tailwind` |
| 1 | 3 | `feat: landing page - hero, personas, how it works` |
| 1 | 4 | `chore: firebase firestore connected and verified` |
| 2 | 5 | `feat: onboarding page - form, validation, uuid generation` |
| 2 | 6 | `feat: firestore write on onboarding submit` |
| 2 | 7 | `feat: recommendation engine - profile to checklist logic` |
| 3 | 8 | `feat: dashboard page - firestore read + recommendation render` |
| 3 | 9 | `feat: voter readiness score ring component` |
| 3 | 10 | `feat: quick nav links on dashboard` |
| 4 | 11 | `chore: backend folder scaffold + adk project structure` |
| 4 | 12 | `chore: vertex ai search datastore config + ECI docs uploaded` |
| 5 | 13 | `feat: rag agent - vertex ai search retrieval` |
| 5 | 14 | `feat: search agent - vertex ai google grounding` |
| 5 | 15 | `feat: formatter agent - explain level + language transform` |
| 5 | 16 | `feat: orchestrator - routes queries to correct agents` |
| 5 | — | `release: v0.1 - adk pipeline working end-to-end` |
| 6 | 17 | `chore: cloud run deployment - adk orchestrator live` |
| 6 | 18 | `feat: api route - next.js proxy to cloud run` |
| 6 | 19 | `feat: ask votepilot page - input, toggles, response card` |
| 6 | 20 | `test: verify hindi and assamese responses render correctly` |
| 7 | 21 | `feat: simulator data - full state machine json` |
| 7 | 22 | `feat: simulator hook - state machine navigation` |
| 7 | 23 | `feat: simulator stage component - renders all stage types` |
| 7 | 24 | `feat: simulator page - full working with back button + firestore score` |
| 8 | 25 | `feat: elections page - firestore read + filter tabs` |
| 8 | 26 | `feat: mythbuster agent - rag grounded myth debunking` |
| 8 | 27 | `feat: myth buster page - flip cards with rag citations` |
| 9 | 28 | `fix: readiness score - audit all firestore update points` |
| 9 | 29 | `feat: firebase analytics - key event tracking` |
| 9 | 30 | `polish: mobile responsiveness - all pages 375px` |
| 9 | 31 | `polish: loading states + error boundaries on all ai components` |
| 9 | 32 | `polish: ui consistency pass - typography, spacing, colors` |
| 10 | 33 | `docs: README - full submission documentation` |
| 10 | 34 | `chore: production env vars + vercel deployment config` |
| 10 | 35 | `release: v1.0 - submission ready` |

---

## Commit Message Convention

```
<type>: <what changed> - <specific detail>
```

| Type | When to use |
|---|---|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `chore` | Setup, config, tooling, no user-facing change |
| `polish` | UI/UX improvements, not new features |
| `docs` | README, comments, documentation only |
| `test` | Verification commits, no new code |
| `release` | Version milestone merges |

**Rules:**
- Commit message lowercase after the colon
- No period at the end
- If you can't describe it in one line, break it into two commits
- Never commit with message "fix", "update", "changes", "wip" alone — always say what specifically

---

## Emergency Rules

**If you break something:**
```bash
git stash          # save broken work
git checkout main  # go back to last working state
git stash pop      # reapply, now fix properly
```

**If you committed something wrong:**
```bash
git reset --soft HEAD~1   # undo last commit, keep changes staged
```

**If `.env.local` accidentally gets committed:**
```bash
git rm --cached .env.local
git commit -m "fix: remove env file from tracking"
```
Then immediately rotate all your API keys — treat them as compromised.

---

*35 commits. 10 days. Ship it.*
