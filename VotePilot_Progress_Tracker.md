# VotePilot AI — Hackathon Progress Tracker
### Hack2skill PromptWars | Solo | 10 Days
### Update this file at the end of every work session

---

## Project Info

| Field | Value |
|---|---|
| Project Name | VotePilot AI |
| Hackathon | Hack2skill PromptWars — Election Process Education |
| Organizer | Google |
| Builder | Prabal |
| Start Date | _______________ |
| Submission Deadline | _______________ |
| GitHub Repo | github.com/prabaaal/VotePilot-AI |
| Production URL | https://votepilot-frontend-74810085857.asia-south1.run.app |
| Cloud Run URL | https://votepilot-backend-74810085857.asia-south1.run.app |

---

## Overall Progress

```
Setup       [██████████] 100%
Day 1       [██████████] 100%
Day 2       [██████████] 100%
Day 3       [██████████] 100%
Day 4       [██████████] 100%
Day 5       [██████████] 100%
Day 6       [██████████] 100%
Day 7       [██████████] 100%
Day 8       [----------]   0%
Day 9       [----------]   0%
Day 10      [----------]   0%
─────────────────────────────
Total       [██████----]  60%
```

> Update each bar manually: replace `-` with `█` as you progress.
> Each `█` = 10%. Example: `[████████--]  80%`

---

## Pre-Build Setup Checklist

### Google Account & GCP
- [ ] Clean Google account designated for VotePilot
- [ ] GCP project created — name: `VotePilot-ai`
- [ ] Project ID noted: `VotePilot-ai-___________`
- [ ] Hackathon GCP credits linked to billing
- [ ] Billing alert set at $10
- [ ] APIs enabled:
  - [ ] Vertex AI API
  - [ ] Cloud Run API
  - [ ] Cloud Build API
  - [ ] Artifact Registry API
  - [ ] Firebase Management API
  - [ ] Secret Manager API

### Firebase
- [ ] Firebase project created — linked to GCP project (NOT separate)
- [ ] Firestore created — production mode, asia-south1 region
- [ ] Firestore security rules configured
- [ ] Firebase Analytics enabled
- [ ] Web app registered in Firebase — config keys copied
- [ ] Firebase Studio opened and verified
- [ ] `users` collection initialized in Firebase Studio
- [ ] `elections` collection initialized in Firebase Studio

### Vertex AI
- [ ] Vertex AI APIs confirmed enabled
- [ ] ECI PDFs downloaded (5 documents):
  - [ ] Handbook for Electors
  - [ ] EVM & VVPAT FAQs
  - [ ] Model Code of Conduct
  - [ ] Voter Helpline 1950 Guide
  - [ ] EPIC Enrollment Guide
- [ ] Vertex AI Search app created — name: `VotePilot-search`
- [ ] Datastore created — name: `eci-documents`
- [ ] PDFs uploaded to datastore
- [ ] Indexing started (note start time: _________)
- [ ] Indexing completed and verified
- [ ] Datastore ID noted: `eci-documents____________`

### Cloud Run Prep
- [ ] gcloud CLI installed
- [ ] gcloud authenticated (`gcloud auth login`)
- [ ] GCP project set (`gcloud config set project`)
- [ ] Artifact Registry repo created — name: `VotePilot-repo`
- [ ] Service account created — name: `VotePilot-cloudrun`
- [ ] Roles assigned to service account:
  - [ ] Vertex AI User
  - [ ] Cloud Datastore User
  - [ ] Secret Manager Secret Accessor
- [ ] Service account key downloaded
- [ ] Key added to Secret Manager

### Local Dev & GitHub
- [ ] Antigravity project created — name: `VotePilot-ai`
- [ ] `.env.local` created with all variable names
- [ ] `.gitignore` created — `.env.local` excluded
- [ ] GitHub repo created — `VotePilot-ai` (private)
- [ ] Initial commit pushed
- [ ] Domain checked (VotePilot.in / VotePilot.app / VotePilot.ai)
- [ ] Social handles checked (@VotePilotapp)

---

## Day 1 — Scaffold + Landing + Firebase
**Goal:** Runnable Next.js app connected to Firebase
**Branch:** `feat/landing-onboarding`

### Tasks
- [x] Next.js 14 + Tailwind scaffolded in Antigravity
- [x] Folder structure created
- [x] `lib/firebase.ts` — Firebase init
- [x] `lib/firestore.ts` — shell with placeholder functions
- [x] `.env.local.example` created
- [x] Landing page (`/`) built:
  - [x] Hero section
  - [x] 3 demo persona buttons
  - [x] "How it works" 3-card section
  - [x] Features overview strip
- [x] Persona button → navigates to `/onboarding`
- [x] Firestore write/read verified in console

### Commits
- [x] `chore: next.js scaffold with tailwind`
- [x] `feat: landing page - hero, personas, how it works`
- [x] `chore: firebase firestore connected and verified`

### Notes / Blockers
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### End of Day Status
- [x] ✅ Goal met — moving to Day 2
- [ ] ⚠️ Partial — carrying over: ___________________________
- [ ] ❌ Blocked — reason: ___________________________________

---

## Day 2 — Onboarding + Recommendation Engine
**Goal:** User profile collected, saved to Firestore, recommendation logic working
**Branch:** `feat/landing-onboarding`

### Tasks
- [x] Onboarding page (`/onboarding`) built:
  - [x] Age field
  - [x] First-time voter toggle
  - [x] Has Voter ID toggle
  - [x] Recently moved toggle
  - [x] State dropdown (all Indian states)
  - [x] Help mode selector
- [x] UUID generation on submit
- [x] UUID stored in localStorage as `VotePilot_user_id`
- [x] Demo persona auto-fill working from landing
- [x] Form validation working
- [x] Profile saves to Firestore `users/{userId}`
- [x] Verified in Firebase Studio console
- [x] Redirects to `/dashboard` on submit
- [x] `lib/recommendationEngine.ts` built:
  - [x] Under-18 case handled
  - [x] No voter ID case handled
  - [x] Recently moved case handled
  - [x] First-time voter case handled
  - [x] Returns checklist, nextAction, warnings, readinessSeedScore
- [x] All 3 demo personas tested — different results confirmed

### Commits
- [x] `feat: onboarding page - form, validation, uuid generation`
- [x] `feat: firestore write on onboarding submit`
- [x] `feat: recommendation engine - profile to checklist logic`

### Notes / Blockers
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### End of Day Status
- [x] ✅ Goal met — moving to Day 3
- [ ] ⚠️ Partial — carrying over: ___________________________
- [ ] ❌ Blocked — reason: ___________________________________

---

## Day 3 — Dashboard + Readiness Ring
**Goal:** Personalized dashboard live, readiness score renders from Firestore
**Branch:** `feat/dashboard`

### Tasks
- [x] Dashboard page (`/dashboard`) built
- [x] Reads `VotePilot_user_id` from localStorage
- [x] Fetches profile from Firestore
- [x] Loading state while fetching
- [x] Runs profile through `recommendationEngine`
- [x] Renders "You Are Here" stage label
- [x] Renders "Your Next Action"
- [x] Renders warnings (if any)
- [x] `components/ChecklistItem.tsx` built
- [x] Checklist renders from recommendation engine output
- [x] `components/ReadinessRing.tsx` built:
  - [x] SVG circular progress ring
  - [x] Animates from 0 to score on mount
  - [x] Score number in center
  - [x] Color: red (0–30), amber (31–60), green (61–100)
- [x] Readiness ring integrated into dashboard
- [x] Quick nav cards → Simulator, Ask VotePilot, Myth Buster
- [x] All 3 demo personas show different dashboards confirmed

### Commits
- [x] `feat: dashboard page - firestore read + recommendation render`
- [x] `feat: voter readiness score ring component`
- [x] `feat: quick nav links on dashboard`

### Notes / Blockers
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### End of Day Status
- [x] ✅ Goal met — moving to Day 4
- [ ] ⚠️ Partial — carrying over: ___________________________
- [ ] ❌ Blocked — reason: ___________________________________

---

## Day 4 — GCP + Vertex AI Search Datastore
**Goal:** Vertex AI Search datastore live with ECI documents indexed
**Branch:** `feat/adk-agents`

### Tasks
- [x] GCP project fully configured
- [x] All APIs confirmed enabled
- [x] ECI PDFs downloaded and ready
- [x] Vertex AI Search app created: `VotePilot-search`
- [x] Datastore created: `eci-documents`
- [x] All 5 PDFs uploaded
- [x] Indexing started — start time: 2026-05-03T14:00:00Z
- [x] Backend folder scaffold created:
  - [x] `/backend/agents/` — empty agent files
  - [x] `/backend/prompts/system_prompt.txt` — Gemini system prompt
  - [x] `/backend/requirements.txt`
  - [x] `/backend/main.py` — empty FastAPI shell
  - [x] `/backend/config.py` — GCP constants
  - [x] `/backend/Dockerfile` — base Dockerfile
- [x] Indexing completed — verified with test search query in GCP console
- [x] Datastore ID noted: `eci-documents_1777829976236`

### Commits
- [ ] `chore: backend folder scaffold + adk project structure`
- [ ] `chore: vertex ai search datastore config + ECI docs uploaded`

### Notes / Blockers
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### End of Day Status
- [ ] ✅ Goal met — moving to Day 5
- [ ] ⚠️ Partial — carrying over: ___________________________
- [ ] ❌ Blocked — reason: ___________________________________

---

## Day 5 — ADK Agents
**Goal:** Full ADK pipeline working end-to-end locally
**Branch:** `feat/adk-agents`

### Tasks
- [x] `config.py` — all GCP constants configured
- [x] RAG Agent (`rag_agent.py`):
  - [x] `search_eci_documents()` tool built
  - [x] Queries Vertex AI Search datastore
  - [x] Returns `{ retrieved_context, source_document, found }`
  - [x] Agent defined with correct description + instruction
  - [x] Tested with 3 sample factual questions ✓
- [x] Search Agent (`search_agent.py`):
  - [x] `search_live_election_data()` tool built
  - [x] Vertex AI grounding with Google Search working
  - [x] Returns `{ raw_answer, source_url, found }`
  - [x] Agent defined
  - [x] Tested with live election queries ✓
- [x] Formatter Agent (`formatter_agent.py`):
  - [x] `format_response()` tool built
  - [x] Applies explain level + language correctly
  - [x] Returns structured JSON (4 fields + source)
  - [x] JSON parse fallback working
  - [x] Tested all 3 levels × 3 languages = 9 combinations ✓
- [x] Myth Buster Agent (`mythbuster_agent.py`):
  - [x] `debunk_myth()` tool built
  - [x] Uses RAG agent internally
  - [x] Returns verdict + formatted response
  - [x] Tested with 3 myth statements ✓
- [x] Orchestrator (`orchestrator.py`):
  - [x] Routing logic: factual → RAG, live → Search
  - [x] Formatter always called last
  - [x] Sub-agents wired as tools
- [x] `main.py` — FastAPI app:
  - [x] `POST /ask` endpoint wired to orchestrator
  - [x] `POST /mythbuster` endpoint wired to myth agent
  - [x] `GET /health` returns 200
- [x] End-to-end local test:
  - [x] `curl POST /ask` returns structured JSON ✓
  - [x] Hindi response verified ✓
  - [x] Assamese response verified (native speaker check) ✓
- [x] Merge feat/adk-agents → dev → main
- [x] Tag: `v0.1`

### Commits
- [ ] `feat: rag agent - vertex ai search retrieval`
- [ ] `feat: search agent - vertex ai google grounding`
- [ ] `feat: formatter agent - explain level + language transform`
- [ ] `feat: orchestrator - routes queries to correct agents`
- [ ] `release: v0.1 - adk pipeline working end-to-end`

### Notes / Blockers
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### End of Day Status
- [ ] ✅ Goal met — moving to Day 6
- [ ] ⚠️ Partial — carrying over: ___________________________
- [ ] ❌ Blocked — reason: ___________________________________

---

## Day 6 — Cloud Run + Ask VotePilot Page
**Goal:** Pipeline deployed to Cloud Run, Ask VotePilot page working end-to-end
**Branch:** `feat/ask-VotePilot`

### Tasks
- [x] Dockerfile finalized
- [x] Docker image built and pushed to Artifact Registry
- [x] Cloud Run service deployed: `VotePilot-backend`
- [x] Cloud Run URL noted: `https://votepilot-backend-74810085857.asia-south1.run.app`
- [x] `GET /health` returns 200 on production URL ✓
- [x] `CLOUD_RUN_ORCHESTRATOR_URL` added to `.env.local`
- [x] `app/api/ask/route.ts` built — Next.js proxy to Cloud Run
- [x] Error handling on API route (500 → friendly message)
- [x] Ask VotePilot page (`/ask`) built:
  - [x] Text input with submit
  - [x] 5 preloaded example question chips
  - [x] Explain Level toggle (Simple / Standard / Detailed)
  - [x] Language toggle (English / Hindi / Assamese)
  - [x] Loading skeleton while waiting
  - [x] `components/ResponseCard.tsx` — 4 fields + source citation
- [x] Firestore update on first Ask use (+10 readiness score)
- [x] Full flow tested on production:
  - [x] English response ✓
  - [x] Hindi response renders correctly ✓
  - [x] Assamese response verified by native speaker ✓
  - [x] Source citation appears ✓
  - [x] Explain level toggle changes response ✓

### Commits
- [ ] `chore: cloud run deployment - adk orchestrator live`
- [ ] `feat: api route - next.js proxy to cloud run`
- [ ] `feat: ask VotePilot page - input, toggles, response card`
- [x] `test: verify hindi and assamese responses render correctly`

### Notes / Blockers
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### End of Day Status
- [ ] ✅ Goal met — moving to Day 7
- [ ] ⚠️ Partial — carrying over: ___________________________
- [ ] ❌ Blocked — reason: ___________________________________

---

## Day 7 — Booth Day Simulator
**Goal:** Full simulator working — all branches, back button, completion state
**Branch:** `feat/simulator`

### Tasks
- [x] `data/simulator.json` created — full state machine
- [x] All main stages present:
  - [x] arrival
  - [x] identity_check
  - [x] name_found
  - [x] inking
  - [x] enter_booth
  - [x] cast_vote
  - [x] vvpat
  - [x] exit (completion)
- [x] All branch stages present:
  - [x] branch_wrong_booth
  - [x] branch_nervous
  - [x] branch_no_epic
  - [x] branch_no_id_at_all (dead end)
  - [x] branch_name_missing (dead end)
  - [x] branch_already_inked (dead end)
  - [x] branch_phone
  - [x] branch_confused_evm
  - [x] branch_nota
  - [x] branch_wrong_slip
- [x] All `next` references verified — no broken links
- [x] All dead ends have `restart` → `arrival`
- [x] `lib/useSimulator.ts` hook built:
  - [x] `choose()` works
  - [x] `goBack()` works
  - [x] `restart()` works
  - [x] `canGoBack` boolean correct
- [x] `components/SimulatorStage.tsx` built:
  - [x] Normal stage renders correctly
  - [x] Info stage — blue tint + tip box
  - [x] Dead-end stage — red tint + restart message
  - [x] Completion stage — celebratory UI + 🇮🇳
- [x] Simulator page (`/simulator`) built
- [x] Back button shows/hides correctly
- [x] Progress indicator shows
- [x] On completion: Firestore readiness score +25
- [x] All branches manually walked through and tested ✓

### Commits
- [ ] `feat: simulator data - full state machine json`
- [ ] `feat: simulator hook - state machine navigation`
- [ ] `feat: simulator stage component - renders all stage types`
- [ ] `feat: simulator page - full working with back button + firestore score`

### Notes / Blockers
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### End of Day Status
- [ ] ✅ Goal met — moving to Day 8
- [ ] ⚠️ Partial — carrying over: ___________________________
- [ ] ❌ Blocked — reason: ___________________________________

---

## Day 8 — Elections Page + Myth Buster
**Goal:** Elections page live, Myth Buster working with RAG citations
**Branch:** `feat/elections` then `feat/mythbuster`

### Tasks

**Elections Page (morning)**
- [ ] `elections` Firestore collection seeded from eci.gov.in
- [ ] At least 6 elections added (mix of upcoming/ongoing/completed)
- [ ] Elections page (`/elections`) built
- [ ] Filter tabs: Upcoming / Ongoing / Completed
- [ ] `components/ElectionCard.tsx` built:
  - [ ] State + election type
  - [ ] Phase dates
  - [ ] Result date
  - [ ] Status badge
  - [ ] Winner (for completed)
- [ ] Loading state handled
- [ ] Empty state handled

**Myth Buster (afternoon)**
- [ ] `mythbuster_agent.py` finalized and tested
- [ ] `POST /mythbuster` endpoint in `main.py`
- [ ] Cloud Run redeployed with myth agent
- [ ] `app/api/mythbuster/route.ts` built
- [ ] Myth Buster page (`/mythbuster`) built — 8–10 myth cards
- [ ] `components/MythCard.tsx` built:
  - [ ] Flip animation
  - [ ] Myth statement on front
  - [ ] Fact + source citation on back
  - [ ] Loading state on flip
- [ ] On all myths viewed: Firestore readiness score +15
- [ ] 8 myths tested — all return ECI citations ✓

### Myth List (fill in your 8–10 myths before building)
```
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
4. _______________________________________________
5. _______________________________________________
6. _______________________________________________
7. _______________________________________________
8. _______________________________________________
9. _______________________________________________
10. ______________________________________________
```

### Commits
- [ ] `feat: elections page - firestore read + filter tabs`
- [ ] `feat: mythbuster agent - rag grounded myth debunking`
- [ ] `feat: myth buster page - flip cards with rag citations`

### Notes / Blockers
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### End of Day Status
- [ ] ✅ Goal met — moving to Day 9
- [ ] ⚠️ Partial — carrying over: ___________________________
- [ ] ❌ Blocked — reason: ___________________________________

---

## Day 9 — Polish + Analytics + Mobile
**Goal:** All score updates work, app looks good on mobile, no broken states
**Branch:** `polish/final`

### Tasks

**Readiness Score Audit**
- [ ] Onboarding complete → +20 ✓
- [ ] Simulator complete → +25 ✓
- [ ] Ask VotePilot first use → +10 ✓
- [ ] Myth Buster all viewed → +15 ✓
- [ ] No duplicate score additions on re-visit ✓
- [ ] Dashboard ring reflects real accumulated total ✓

**Firebase Analytics**
- [ ] `ask_question` event fires on every query
- [ ] `simulator_completed` event fires on exit stage
- [ ] `myth_revealed` event fires on each card flip
- [ ] `language_changed` event fires on toggle switch
- [ ] `persona_selected` event fires on landing page click
- [ ] Events visible in Firebase Analytics console ✓

**Mobile (375px)**
- [ ] Landing page ✓
- [ ] Onboarding page ✓
- [ ] Dashboard page ✓
- [ ] Ask VotePilot page ✓
- [ ] Simulator page ✓
- [ ] Elections page ✓
- [ ] Myth Buster page ✓
- [ ] Toggle buttons stack correctly on mobile ✓
- [ ] Simulator choices full-width on mobile ✓
- [ ] ReadinessRing scales correctly ✓

**Error & Loading States**
- [ ] Loading skeletons on ResponseCard ✓
- [ ] Loading state on MythCard flip ✓
- [ ] Error state if Cloud Run fails ✓
- [ ] Error state if Firestore fails ✓
- [ ] No white screens on any failure ✓

**UI Consistency**
- [ ] Consistent heading sizes across all pages ✓
- [ ] Consistent card padding and border radius ✓
- [ ] Consistent button styles ✓
- [ ] No placeholder text remaining ✓
- [ ] Color palette unified ✓

### Commits
- [ ] `fix: readiness score - audit all firestore update points`
- [ ] `feat: firebase analytics - key event tracking`
- [ ] `polish: mobile responsiveness - all pages 375px`
- [ ] `polish: loading states + error boundaries on all ai components`
- [ ] `polish: ui consistency pass - typography, spacing, colors`

### Notes / Blockers
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### End of Day Status
- [ ] ✅ Goal met — moving to Day 10
- [ ] ⚠️ Partial — carrying over: ___________________________
- [ ] ❌ Blocked — reason: ___________________________________

---

## Day 10 — README + Deploy + Submission
**Goal:** Submitted. Done.
**Branch:** `polish/final` → merge to `main`

### Tasks

**README**
- [ ] Project Overview written
- [ ] Features section written
- [ ] Tech Stack table (all tools with specific roles)
- [ ] Architecture diagram included (ASCII)
- [ ] How to Run Locally instructions
- [ ] ADK Agent Pipeline section explained
- [ ] Assumptions Made section
- [ ] Future Scope & Sustainability paragraph written
- [ ] Testing Checklist included
- [ ] Demo Flow section included
- [ ] `/docs/screenshots/` folder added:
  - [ ] Dashboard with readiness score
  - [ ] Ask VotePilot with Assamese response
  - [ ] Simulator mid-flow
  - [ ] Elections page

**Production Deployment**
- [ ] All env vars set in Vercel dashboard
- [ ] Frontend deployed to Vercel
- [ ] Production URL working: `https://_______________`
- [ ] Cloud Run backend verified running
- [ ] All 3 demo personas tested on production URL ✓
- [ ] Hindi response on production ✓
- [ ] Assamese response on production ✓
- [ ] Readiness score updates on production ✓

**Final Git**
- [ ] `polish/final` merged to `dev`
- [ ] `dev` merged to `main`
- [ ] Tagged `v1.0`
- [ ] All branches merged and clean

**Submission**
- [ ] Submission form filled
- [ ] GitHub repo URL submitted
- [ ] Production URL submitted
- [ ] Demo video recorded (if required)
- [ ] All required fields completed

### Commits
- [ ] `docs: README - full submission documentation`
- [ ] `chore: production env vars + vercel deployment config`
- [ ] `release: v1.0 - submission ready`

### Notes
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### Final Status
- [ ] ✅ SUBMITTED ✓

---

## Mandatory Tools Verification

Before submitting, confirm every tool is genuinely used:

| Tool | Used Where | Verified |
|---|---|---|
| Gemini 2.0 Flash | All AI responses via Vertex AI | [ ] |
| Vertex AI | Agent Engine + Search + Grounding | [ ] |
| ADK | 4 agents + orchestrator | [ ] |
| Cloud Run | Hosts ADK backend | [ ] |
| Firebase Firestore | User profiles + elections + scores | [ ] |
| Firebase Analytics | Key event tracking | [ ] |
| Firebase Studio | Firestore management | [ ] |
| Antigravity | Frontend development | [ ] |

---

## Differentiators Verification

| Differentiator | Built | Tested | Demo-Ready |
|---|---|---|---|
| Booth Day Simulator | [ ] | [ ] | [ ] |
| Explain Level Toggle (3 levels) | [ ] | [ ] | [ ] |
| Hindi AI Responses | [ ] | [ ] | [ ] |
| Assamese AI Responses | [ ] | [ ] | [ ] |
| Voter Readiness Score Ring | [ ] | [ ] | [ ] |
| RAG with ECI Citations | [ ] | [ ] | [ ] |
| Live Election Data (Search Agent) | [ ] | [ ] | [ ] |

---

## Carry-Over Log

Use this if something spills from one day to the next.

| Day | Task Carried Over | Moved To | Resolved |
|---|---|---|---|
| | | | [ ] |
| | | | [ ] |
| | | | [ ] |
| | | | [ ] |
| | | | [ ] |

---

## Blockers Log

| Date | Blocker | How Resolved |
|---|---|---|
| | | |
| | | |
| | | |

---

## Commit Count

| Day | Commits Made | Total |
|---|---|---|
| Setup | 1 | 1 |
| Day 1 | 3 | 4 |
| Day 2 | 3 | 7 |
| Day 3 | 3 | 10 |
| Day 4 | 2 | 12 |
| Day 5 | 4 + tag | 16 |
| Day 6 | 4 | 20 |
| Day 7 | 4 | 24 |
| Day 8 | 3 | 27 |
| Day 9 | 5 | 32 |
| Day 10 | 3 + tag | 35 |

---

## 2-Minute Demo Script

| Time | Action | Status |
|---|---|---|
| 0:00 | Open landing — show hero + 3 persona buttons | [ ] rehearsed |
| 0:15 | Click "First-Time Voter" — auto-fill onboarding | [ ] rehearsed |
| 0:30 | Show dashboard — readiness ring, checklist, next action | [ ] rehearsed |
| 0:45 | Ask VotePilot — "What happens inside the polling booth?" | [ ] rehearsed |
| 1:00 | Switch explain level Standard → Simple | [ ] rehearsed |
| 1:10 | Switch language to Assamese — show response + citation | [ ] rehearsed |
| 1:20 | Simulator — 3 stages + one dead-end branch | [ ] rehearsed |
| 1:40 | Elections page — Upcoming tab | [ ] rehearsed |
| 1:50 | Myth Buster — flip one card, show citation | [ ] rehearsed |
| 2:00 | Close on dashboard — higher readiness score | [ ] rehearsed |

**Closing line (memorize this):**
> "VotePilot uses a multi-agent RAG pipeline on Vertex AI — every answer is grounded in official ECI documents, not just model training data. It's not a chatbot. It's a civic knowledge system."

---

*Last updated: _______________*
*Current day: _____ / 10*
*Overall status: _______________*
