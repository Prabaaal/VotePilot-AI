# VotePilot AI — Full Project Roadmap
### Hackathon: Hack2skill PromptWars — Election Process Education
### Builder: Solo | Deadline: 10 Days | Platform: Antigravity

---

## Table of Contents
1. [Project Summary](#1-project-summary)
2. [Final Tech Stack](#2-final-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Pages & Features](#4-pages--features)
5. [Agent Architecture (ADK)](#5-agent-architecture-adk)
6. [Data Schemas](#6-data-schemas)
7. [Core Code References](#7-core-code-references)
8. [Day-by-Day Chronological Roadmap](#8-day-by-day-chronological-roadmap)
9. [Folder Structure](#9-folder-structure)
10. [Environment Variables](#10-environment-variables)
11. [Differentiators Summary](#11-differentiators-summary)
12. [README Sections](#12-readme-sections)
13. [Demo Script (2 Minutes)](#13-demo-script-2-minutes)
14. [Pitch Line](#14-pitch-line)

---

## 1. Project Summary

**VotePilot AI** is a neutral, intelligent election education companion for Indian voters.

It combines a multi-agent RAG pipeline (Vertex AI + ADK) with an interactive booth simulator and multilingual support to turn confusing election procedures into a personalized, guided civic learning journey.

**Target Users:** First-time voters, recently moved voters, last-minute learners
**Languages:** English, Hindi, Assamese
**Core Problem:** Indian voters — especially first-timers — don't know what to expect on election day and can't easily find trustworthy, plain-language answers.

---

## 2. Final Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | Next.js 14 (App Router) | Full-stack React framework |
| Styling | Tailwind CSS | Utility-first styling |
| AI Model | Gemini 2.0 Flash via Vertex AI | All AI responses |
| Agent Framework | Google ADK (Agent Development Kit) | Multi-agent orchestration |
| Knowledge Base | Vertex AI Search | RAG over ECI documents |
| Live Data | Vertex AI Grounding (Google Search) | Live election results/news |
| Backend Runtime | Cloud Run | Hosts ADK orchestrator as container |
| Database | Firebase Firestore | User profiles, scores, elections data |
| Monitoring | Firebase Analytics | Usage tracking |
| Dev Environment | Firebase Studio | Firestore management + project setup |
| Vibe-Coding | Antigravity | Development environment |
| Deployment | Vercel or Firebase Hosting | Frontend deployment |

**Mandatory tools coverage:**
- ✅ Gemini — Core AI for all responses
- ✅ Vertex AI — Agent Engine + Search datastore + Grounding
- ✅ ADK — Multi-agent orchestration
- ✅ Cloud Run — Hosts the ADK orchestrator backend
- ✅ Firebase — Firestore + Analytics + Studio
- ✅ Antigravity — Development

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│          Next.js Frontend (Vercel)                  │
│  Landing → Onboarding → Dashboard → Ask → Simulator │
└──────────────────────┬──────────────────────────────┘
                       │ POST /api/ask
                       │ { question, explainLevel, language, userProfile }
                       ▼
┌─────────────────────────────────────────────────────┐
│              Cloud Run                              │
│         (ADK Orchestrator Service)                  │
└──────────────────────┬──────────────────────────────┘
                       │ routes to agents
                       ▼
┌─────────────────────────────────────────────────────┐
│              Vertex AI Agent Engine                 │
│                                                     │
│  ┌─────────────┐         ┌──────────────────────┐   │
│  │  RAG Agent  │         │   Search Agent       │   │
│  │             │         │  (Google Grounding)  │   │
│  └──────┬──────┘         └──────────┬───────────┘   │
│         │                           │               │
│         └─────────────┬─────────────┘               │
│                       ▼                             │
│          ┌────────────────────────┐                 │
│          │  Formatter Agent       │                 │
│          │  (language + level)    │                 │
│          └────────────────────────┘                 │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
  Vertex AI Search  Firestore   Google Search
  (ECI documents)  (profiles,  (live election
                    scores)      data)
```

**Data flow summary:**
- Frontend calls one Cloud Run endpoint
- Cloud Run ADK Orchestrator decides which agents to call
- RAG Agent answers from ECI documents (factual, grounded)
- Search Agent answers from live Google Search (current data)
- Formatter Agent applies language + explain level
- Response returns as structured JSON
- Firestore stores and retrieves user state

---

## 4. Pages & Features

### Route Map
```
/                 → Landing page
/onboarding       → User profile collection
/dashboard        → Personalized voter roadmap + readiness score
/ask              → Ask VotePilot (AI Q&A via ADK pipeline)
/simulator        → Booth Day Simulator (static JSON state machine)
/elections        → Upcoming/ongoing/completed elections (Search Agent)
/mythbuster       → AI-powered myth vs fact cards (RAG Agent)
```

---

### Page 1: Landing (`/`)
- Hero headline: "Understand elections without the confusion."
- 3 one-click demo persona buttons:
  - First-Time Voter
  - Recently Moved
  - Last-Minute Learner
- Clicking a persona auto-fills onboarding and jumps to dashboard
- "How it works" — 3 cards
- Features overview strip

---

### Page 2: Onboarding (`/onboarding`)
Collects from user:
- Age
- First-time voter? (yes/no)
- Has Voter ID / EPIC card? (yes/no)
- Recently moved? (yes/no)
- State (dropdown — all Indian states)
- Preferred mode: Full Guide / Quick Summary

On submit:
- Generate UUID, store as `votepilot_user_id` in localStorage
- Save profile to **Firestore** `users/{userId}`
- Redirect to `/dashboard`

---

### Page 3: Dashboard (`/dashboard`)
Reads from Firestore, renders:
- **"You Are Here"** stage label (Pre-Election / Election Day / Post-Election)
- **"Your Next Action"** — single personalized next step
- **Preparation Checklist** — based on profile flags
- **Voter Readiness Score** — circular progress ring (0–100)
- **Warnings** — e.g. "Recent address change may affect your booth"
- Quick nav to Simulator, Ask VotePilot, Myth Buster

Readiness score accumulates as:
| Action | Points |
|---|---|
| Onboarding completed | +20 |
| Simulator completed | +25 |
| Ask VotePilot used | +10 |
| Myth Buster viewed | +15 |
| Quiz passed (if built) | +30 |

---

### Page 4: Ask VotePilot (`/ask`)
- Text input for any election question
- 5 preloaded example questions as clickable chips
- **Explain Level toggle:** Simple (🧒) | Standard (🧑) | Detailed (🎓)
- **Language toggle:** English | Hindi | Assamese
- Calls Cloud Run `/api/ask` endpoint (ADK pipeline)
- Renders structured response card:
  - Answer
  - Why It Matters
  - What You Should Do
  - Keep In Mind
  - Source citation (from RAG Agent — "Source: ECI Voter Guide 2024")

---

### Page 5: Booth Day Simulator (`/simulator`)
- Fully static JSON state machine — zero AI calls
- 7 main stages + 8 branch stages
- Back button (history stack)
- Stage types: normal | info | dead_end | completion
- UI tint: red for dead ends, green/celebratory for completion
- On completion: update Firestore readiness score (+25)

**Stage flow:**
```
arrival
  ├── join_queue → identity_check
  ├── lost → branch_wrong_booth → identity_check
  └── nervous → branch_nervous → identity_check

identity_check
  ├── have_epic → name_found
  ├── no_epic → branch_no_epic
  │     ├── have_alternative → name_found
  │     └── no_id_at_all → branch_no_id_at_all (DEAD END)
  └── name_missing → branch_name_missing (DEAD END)

name_found → inking
  ├── inked → enter_booth
  └── already_inked → branch_already_inked (DEAD END)

enter_booth
  ├── enter → cast_vote
  └── phone_question → branch_phone → cast_vote

cast_vote
  ├── voted → vvpat
  ├── confused_evm → branch_confused_evm → cast_vote
  └── nota → branch_nota
        ├── vote_nota → vvpat
        └── reconsider → cast_vote

vvpat
  ├── confirmed → exit (COMPLETION 🎉)
  └── wrong_slip → branch_wrong_slip → exit
```

---

### Page 6: Elections (`/elections`)
- Filter tabs: Upcoming | Ongoing | Completed
- Data sourced via **Search Agent** (Vertex AI Google grounding) — live, not hardcoded
- Fallback: Firestore `elections` collection manually seeded from eci.gov.in
- Each card shows: state, election type, phases + dates, result date, status badge
- Completed cards show winner party

---

### Page 7: Myth Buster (`/mythbuster`)
- 8–10 myth cards
- Each card: myth statement front → flip → fact explanation back
- Fact explanation generated by **RAG Agent** grounded in ECI documents
- On viewing all myths: update Firestore readiness score (+15)

---

## 5. Agent Architecture (ADK)

### Agent 1 — Orchestrator (entry point on Cloud Run)
Routes each query to the right agent(s) based on question type:

| Query type | Agent(s) called |
|---|---|
| "What is EVM?" — factual/procedural | RAG Agent |
| "Who won Bihar elections?" — live data | Search Agent |
| "What do I need on voting day?" — procedural + personal | RAG Agent + Firestore context |
| Any query | → Formatter Agent last |

---

### Agent 2 — RAG Agent
- Connected to **Vertex AI Search** datastore
- Datastore contains: ECI Voter Guide, Model Code of Conduct, EVM/VVPAT FAQs, EPIC enrollment guide, Voter Helpline 1950 guide
- Retrieves relevant document chunks
- Passes chunks as context to Gemini on Vertex AI
- Returns: `{ rawAnswer, sourceDocument, sourcePage }`

---

### Agent 3 — Search Agent
- Uses **Vertex AI Grounding with Google Search**
- Handles live queries: election schedules, results, news
- Returns: `{ rawAnswer, sourceUrl, retrievedDate }`
- Powers the Elections page

---

### Agent 4 — Formatter Agent
- Receives raw answer from RAG or Search Agent
- Applies `explain_level`: simple | standard | detailed
- Applies `language`: english | hindi | assamese
- Returns structured JSON:
```json
{
  "answer": "...",
  "whyItMatters": "...",
  "whatYouShouldDo": "...",
  "keepInMind": "...",
  "source": "ECI Voter Guide 2024, Page 12"
}
```

---

### Agent 5 — Myth Buster Agent
- Specialized prompt: given a myth statement, debunk or confirm with official ECI source
- Uses RAG Agent internally for grounding
- Returns: `{ verdict: "myth"|"fact", explanation, source }`

---

### Gemini System Prompt (base — used by Formatter Agent)

```
You are VotePilot AI, a neutral and trustworthy election education assistant built for Indian voters.

Your job is to explain election-related questions in a clear, accurate, and educational way.

Rules:
- Never give partisan opinions or favor any party/candidate
- Never make up legal facts — if unsure, say so
- Keep answers grounded in Indian election context (ECI, EVM, EPIC, Model Code of Conduct, etc.)
- Do not lecture or moralize
- Always cite the source document if context was provided

You will receive:
1. explain_level: "simple" | "standard" | "detailed"
2. language: "english" | "hindi" | "assamese"
3. retrieved_context: relevant chunks from ECI documents (may be empty)

explain_level behavior:
- "simple" → explain like the user is 12 years old. No jargon. Short sentences. Analogies.
- "standard" → explain like a first-time voter. Clear and practical. Minimal jargon.
- "detailed" → explain like an informed citizen. Full legal/procedural context.

language behavior:
- "english" → respond entirely in English
- "hindi" → respond entirely in Hindi (Devanagari script, not Hinglish)
- "assamese" → respond entirely in Assamese (Bengali script)

Always respond in this exact JSON with no extra text, no markdown, no backticks:
{
  "answer": "...",
  "whyItMatters": "...",
  "whatYouShouldDo": "...",
  "keepInMind": "...",
  "source": "document name if context was provided, else empty string"
}
```

---

## 6. Data Schemas

### Firestore: `users/{userId}`
```json
{
  "age": 19,
  "firstTimeVoter": true,
  "hasVoterId": true,
  "movedRecently": false,
  "state": "Assam",
  "helpMode": "full",
  "readinessScore": 45,
  "completedModules": ["onboarding", "simulator", "mythbuster"],
  "createdAt": "timestamp"
}
```

### Firestore: `elections/{electionId}`
```json
{
  "state": "Bihar",
  "type": "State Assembly",
  "status": "upcoming",
  "phases": [
    { "phase": 1, "date": "2025-10-15" },
    { "phase": 2, "date": "2025-10-25" }
  ],
  "resultDate": "2025-10-28",
  "description": "Bihar Vidhan Sabha Elections 2025",
  "winner": null
}
```

Status values: `"upcoming"` | `"ongoing"` | `"completed"`

### Anonymous Auth Flow
- On first visit: generate UUID → store as `votepilot_user_id` in localStorage
- Use UUID as Firestore document ID
- No login required, fully anonymous

---

## 7. Core Code References

### Recommendation Engine (`lib/recommendationEngine.ts`)
```typescript
export type UserProfile = {
  age: number
  firstTimeVoter: boolean
  movedRecently: boolean
  hasVoterId: boolean
  state: string
  helpMode: "full" | "quick"
}

export function getRecommendations(profile: UserProfile) {
  const checklist = []
  const warnings = []
  let nextAction = ""
  let readinessSeedScore = 20

  if (profile.age < 18) {
    return {
      currentStage: "Not Yet Eligible",
      nextAction: "You must be 18 to vote. Learn the process now so you're ready.",
      checklist: [{ label: "Understand voting eligibility", done: false }],
      warnings: ["You are below voting age"],
      readinessSeedScore: 5
    }
  }

  checklist.push({ label: "Check voter registration status", done: profile.hasVoterId })
  checklist.push({ label: "Know your polling booth location", done: false })
  checklist.push({ label: "Understand the EVM voting process", done: false })
  checklist.push({ label: "Know your rights at the booth", done: false })

  if (!profile.hasVoterId) {
    warnings.push("Verify your voter ID status before election day")
    nextAction = "Check registration at voterportal.eci.gov.in"
  } else {
    readinessSeedScore += 20
    nextAction = "Find your polling booth using your EPIC card"
  }

  if (profile.movedRecently) {
    warnings.push("Recent address change may affect your assigned polling booth")
    checklist.push({ label: "Verify registration after address change", done: false })
  }

  if (profile.firstTimeVoter) {
    nextAction = "Start with the Booth Day Simulator to understand the full voting process"
    readinessSeedScore += 10
  }

  return {
    currentStage: "Pre-Election",
    nextAction,
    checklist,
    warnings,
    readinessSeedScore
  }
}
```

### Simulator Hook (`lib/useSimulator.ts`)
```typescript
import { useState } from "react"
import simulatorData from "@/data/simulator.json"

export function useSimulator() {
  const [currentStageId, setCurrentStageId] = useState("arrival")
  const [history, setHistory] = useState<string[]>([])

  const currentStage = simulatorData.simulator.stages[currentStageId]

  function choose(nextStageId: string) {
    setHistory(prev => [...prev, currentStageId])
    setCurrentStageId(nextStageId)
  }

  function goBack() {
    if (history.length === 0) return
    const prev = [...history]
    const last = prev.pop()!
    setHistory(prev)
    setCurrentStageId(last)
  }

  function restart() {
    setHistory([])
    setCurrentStageId("arrival")
  }

  return { currentStage, choose, goBack, restart, canGoBack: history.length > 0 }
}
```

### Cloud Run API Route (`app/api/ask/route.ts`)
```typescript
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { question, explainLevel, language, userProfile } = await req.json()

  // Call Cloud Run ADK orchestrator
  const response = await fetch(process.env.CLOUD_RUN_ORCHESTRATOR_URL + "/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, explainLevel, language, userProfile })
  })

  const data = await response.json()
  return NextResponse.json(data)
}
```

---

## 8. Day-by-Day Chronological Roadmap

---

### DAY 1 — Project Scaffold + Firebase Setup

**Goal:** Runnable Next.js app connected to Firebase

**Steps in order:**
1. Create Next.js 14 project in Antigravity with Tailwind
2. Set up folder structure (see Section 9)
3. Create Firebase project in **Firebase Studio**
4. Enable Firestore in Firebase Studio — create `users` and `elections` collections manually
5. Enable Firebase Analytics
6. Add Firebase SDK to Next.js (`lib/firebase.ts`, `lib/firestore.ts`)
7. Create `.env.local` with all Firebase keys
8. Build Landing page (`/`) — hero, 3 persona buttons, how it works section
9. Test persona button click navigates to `/onboarding`

**Commit message:** `feat: scaffold + landing page + firebase connected`

---

### DAY 2 — Onboarding + Firestore Write

**Goal:** User profile collected and saved to Firestore

**Steps in order:**
1. Build Onboarding page (`/onboarding`) — all form fields
2. On submit: generate UUID → store in localStorage → save profile to Firestore `users/{userId}`
3. Build `lib/recommendationEngine.ts` — profile → checklist + next action logic
4. Test all 3 demo personas auto-fill and submit correctly
5. Verify Firestore documents appearing in Firebase Studio console

**Commit message:** `feat: onboarding + firestore write + recommendation engine`

---

### DAY 3 — Dashboard + Readiness Score

**Goal:** Personalized dashboard reading from Firestore

**Steps in order:**
1. Build Dashboard page (`/dashboard`)
2. Read user profile from Firestore on page load using `votepilot_user_id` from localStorage
3. Run profile through `recommendationEngine` → render checklist + next action + warnings
4. Build `ReadinessRing` component — circular SVG progress ring for readiness score
5. Render readiness score from Firestore value
6. Add quick nav links to Simulator, Ask VotePilot, Myth Buster
7. Test all 3 demo personas show different dashboards

**Commit message:** `feat: dashboard + readiness ring + firestore read`

---

### DAY 4 — GCP Setup + Vertex AI Search Datastore

**Goal:** Vertex AI Search datastore live with ECI documents

**Steps in order:**
1. Set up GCP project — enable Vertex AI API, Cloud Run API, ADK
2. Download these ECI PDFs from eci.gov.in:
   - Voter Guide (General Elections)
   - Model Code of Conduct
   - EVM & VVPAT FAQs
   - EPIC enrollment guide
   - Voter Helpline 1950 guide
3. Create Vertex AI Search datastore in GCP console
4. Upload ECI PDFs to datastore — let it index (takes ~15 mins)
5. Test search queries in GCP console to verify retrieval is working
6. Note datastore ID for ADK agent config

**Commit message:** `chore: GCP setup + vertex ai search datastore with ECI docs`

---

### DAY 5 — ADK Agents (RAG + Search + Formatter)

**Goal:** Working ADK pipeline returning structured answers

**Steps in order:**
1. Create ADK project structure in `/backend` folder
2. Build **RAG Agent** — connected to Vertex AI Search datastore, returns `{ rawAnswer, sourceDocument }`
3. Build **Search Agent** — Vertex AI grounding with Google Search, returns `{ rawAnswer, sourceUrl }`
4. Build **Formatter Agent** — takes raw answer + `explainLevel` + `language` → returns structured JSON
5. Build **Orchestrator** — routes queries to RAG vs Search agent based on question type
6. Test pipeline end-to-end in ADK local runner:
   - Factual query → RAG Agent → Formatter → JSON output with citation
   - Live query → Search Agent → Formatter → JSON output with URL

**Commit message:** `feat: ADK agents - rag + search + formatter + orchestrator`

---

### DAY 6 — Cloud Run Deployment + Ask VotePilot Frontend

**Goal:** Full AI pipeline live, Ask VotePilot page working end-to-end

**Steps in order:**
1. Containerize ADK orchestrator — write `Dockerfile` in `/backend`
2. Deploy to **Cloud Run** via GCP console or `gcloud run deploy`
3. Note Cloud Run service URL → add as `CLOUD_RUN_ORCHESTRATOR_URL` in `.env.local`
4. Build `app/api/ask/route.ts` — Next.js API route that proxies to Cloud Run
5. Build Ask VotePilot page (`/ask`):
   - Text input
   - 5 preloaded example question chips
   - Explain Level toggle (Simple / Standard / Detailed)
   - Language toggle (English / Hindi / Assamese)
   - `ResponseCard` component — renders 4 fields + source citation
6. Test full flow: question → Cloud Run → ADK → Vertex AI → response rendered on frontend
7. Verify Hindi and Assamese responses render correctly

**Commit message:** `feat: cloud run deployment + ask votepilot page live`

---

### DAY 7 — Booth Day Simulator

**Goal:** Full simulator working with branching, back button, completion state

**Steps in order:**
1. Create `data/simulator.json` — full state machine (all stages from Section 4)
2. Build `lib/useSimulator.ts` hook
3. Build `SimulatorStage` component:
   - Renders illustration emoji, title, description
   - Renders choice buttons
   - Dead-end stages: red tint + explanation
   - Completion stage: celebratory UI with 🇮🇳
4. Build Simulator page (`/simulator`) using the hook and component
5. Add back button (uses history stack from hook)
6. On completion stage reached: update Firestore readiness score (+25)
7. Test all branches including dead ends — every path must resolve

**Commit message:** `feat: booth day simulator - full branching state machine`

---

### DAY 8 — Elections Page + Myth Buster Agent

**Goal:** Elections page live, Myth Buster working with RAG citations

**Steps in order:**

**Elections Page (morning):**
1. Seed `elections` Firestore collection with current data from eci.gov.in (~20 mins)
2. Build Elections page (`/elections`) — filter tabs (Upcoming / Ongoing / Completed)
3. Build `ElectionCard` component — state, type, phases, dates, status badge
4. Fetch from Firestore on page load, filter by status

**Myth Buster (afternoon):**
1. Build **Myth Buster Agent** in ADK backend — add to orchestrator routing
2. Create `app/api/mythbuster/route.ts` — proxies to Cloud Run myth endpoint
3. Build Myth Buster page (`/mythbuster`) — 8–10 myth cards
4. Build `MythCard` component — flip card animation, myth front, fact + source back
5. On reveal: call Myth Buster Agent for fact explanation + ECI source
6. On all myths viewed: update Firestore readiness score (+15)
7. Redeploy Cloud Run with Myth Buster Agent included

**Commit message:** `feat: elections page + myth buster with RAG citations`

---

### DAY 9 — Polish + Readiness Score Wiring + Mobile

**Goal:** All readiness score updates working, app looks good on mobile

**Steps in order:**
1. Audit all readiness score update points — verify all Firestore writes work:
   - Onboarding (+20) ✓
   - Simulator completion (+25) ✓
   - Ask VotePilot first use (+10)
   - Myth Buster viewed (+15) ✓
2. Fix any broken Firestore update calls
3. Mobile responsiveness pass — check all pages on 375px width
4. Add loading states to all AI-powered components
5. Add error states — graceful fallback if Cloud Run fails
6. Add Firebase Analytics event tracking on key interactions:
   - `ask_question`
   - `simulator_completed`
   - `myth_revealed`
7. Final review of all 7 pages for UI consistency

**Commit message:** `polish: readiness score wiring + mobile + analytics events`

---

### DAY 10 — README + Deploy + Demo Prep

**Goal:** Submission-ready, deployed, demo rehearsed

**Steps in order:**
1. Write README.md (see Section 12 for all required sections)
2. Final deployment:
   - Frontend → Vercel or Firebase Hosting
   - Backend → Cloud Run (already deployed, verify it's running)
3. Set all production environment variables in Vercel dashboard
4. Run through full demo script (Section 13) — time it, must be under 2 minutes
5. Test all 3 demo personas end-to-end on production URL
6. Verify Hindi and Assamese responses on production
7. Screenshot dashboard with readiness score for README
8. Submit

**Commit message:** `chore: README + production deployment + submission ready`

---

## 9. Folder Structure

```
votepilot-ai/
├── app/
│   ├── page.tsx                        # Landing
│   ├── onboarding/page.tsx
│   ├── dashboard/page.tsx
│   ├── ask/page.tsx
│   ├── simulator/page.tsx
│   ├── elections/page.tsx
│   ├── mythbuster/page.tsx
│   └── api/
│       ├── ask/route.ts               # Proxies to Cloud Run
│       └── mythbuster/route.ts        # Proxies to Cloud Run
├── components/
│   ├── ResponseCard.tsx               # AI answer card (4 fields + source)
│   ├── SimulatorStage.tsx             # Single simulator stage
│   ├── ReadinessRing.tsx              # Circular SVG progress ring
│   ├── ElectionCard.tsx               # Election info card
│   ├── MythCard.tsx                   # Flip card for myths
│   └── ChecklistItem.tsx
├── lib/
│   ├── firebase.ts                    # Firebase init
│   ├── firestore.ts                   # Firestore read/write helpers
│   └── recommendationEngine.ts        # Profile → checklist + next action
├── data/
│   └── simulator.json                 # Full simulator state machine
├── backend/                           # ADK orchestrator (deployed to Cloud Run)
│   ├── main.py                        # Entry point
│   ├── agents/
│   │   ├── orchestrator.py
│   │   ├── rag_agent.py
│   │   ├── search_agent.py
│   │   ├── formatter_agent.py
│   │   └── mythbuster_agent.py
│   ├── prompts/
│   │   └── system_prompt.txt
│   ├── requirements.txt
│   └── Dockerfile
└── .env.local
```

---

## 10. Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Cloud Run (server-side only — no NEXT_PUBLIC_)
CLOUD_RUN_ORCHESTRATOR_URL=https://your-service-url.run.app

# GCP (for local backend development)
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_SEARCH_DATASTORE_ID=your-datastore-id
```

Note: Gemini API key is handled by Vertex AI credentials on Cloud Run — not needed as a separate env var in production.

---

## 11. Differentiators Summary

| Differentiator | What it is | Why it wins |
|---|---|---|
| Multi-agent RAG pipeline | ADK orchestrator + Vertex AI Search over ECI docs | Every answer is grounded in official government sources with citations — not just Gemini hallucinations |
| Booth Day Simulator | Branching interactive simulation of voting day | Only team with this — judges will play with it live |
| Explain Level toggle | 3-depth AI response modes | Same question, completely different answer depth — memorable UX |
| Multilingual (Hindi + Assamese) | Language toggle on all AI responses | Builder is native Assamese — quality guaranteed, regionally relevant |
| Voter Readiness Score | Quantified progress ring across all modules | Makes the app feel like a finished product, not a prototype |
| Live election data | Search Agent with Google grounding | Elections page is live, not hardcoded — cites real sources |

---

## 12. README Sections

1. **Project Overview** — what VotePilot is and why it exists
2. **Features** — list all 7 pages and key capabilities
3. **Tech Stack** — table of all tools with their specific role
4. **Architecture** — include the architecture diagram from Section 3
5. **How to Run Locally** — env vars, `npm install`, `npm run dev`, Cloud Run local instructions
6. **ADK Agent Pipeline** — brief explanation of each agent and what it does
7. **Assumptions Made** — ECI document versions used, manual elections data seed date
8. **Future Scope & Sustainability**

> "VotePilot is designed with long-term deployment in mind. Potential sustainability paths include licensing to state election commissions, NGO voter awareness programs, and CSR-funded civic initiatives. The multi-agent architecture is built to scale regionally — additional languages, states, and election types can be added without restructuring the core pipeline."

9. **Testing Checklist** — list of things verified before submission
10. **Demo Flow** — link to Section 13

---

## 13. Demo Script (2 Minutes)

| Time | Action |
|---|---|
| 0:00 | Open landing page — show hero and 3 persona buttons |
| 0:15 | Click "First-Time Voter" — show auto-filled onboarding submitting |
| 0:30 | Show personalized dashboard — readiness score ring, checklist, next action |
| 0:45 | Open Ask VotePilot — ask "What happens inside the polling booth?" |
| 1:00 | Switch Explain Level: Standard → Simple — show response change |
| 1:10 | Switch language to Assamese — show Assamese response with source citation |
| 1:20 | Open Simulator — walk through 3 stages, hit one dead-end branch |
| 1:40 | Show Elections page — Upcoming tab with live data |
| 1:50 | Open Myth Buster — flip one card, show RAG citation |
| 2:00 | Close on dashboard — readiness score now higher |

**Closing line:**
"VotePilot uses a multi-agent RAG pipeline on Vertex AI — every answer is grounded in official ECI documents, not just model training data. It's not a chatbot. It's a civic knowledge system."

---

## 14. Pitch Line

> **"VotePilot AI is a multi-agent election education system that combines Vertex AI RAG over ECI documents, Google Search grounding for live data, and an interactive booth simulator — delivering personalized, multilingual civic guidance in English, Hindi, and Assamese."**

---

*Last updated: Day 0 planning session*
*Builder: Prabal | Platform: Antigravity | Stack: Next.js + Tailwind + ADK + Vertex AI + Cloud Run + Firebase*
