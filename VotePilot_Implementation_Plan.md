# VotePilot AI — Full Implementation Plan
> Hackathon: Hack2skill PromptWars — "Election Process Education" Challenge
> Stack: Next.js 14 + Tailwind CSS + Gemini API + Firebase Firestore
> Platform: Antigravity (vibe-coding environment)
> Timeline: 10 days, solo

---

## Project Summary

VotePilot AI is a neutral, interactive election education companion that turns confusing Indian election procedures into a personalized voter journey, guided simulations, and bite-sized civic learning.

**Pitch line:**
> "VotePilot AI is a smart, dynamic election education assistant that adapts to user context and turns a confusing civic process into a guided, interactive learning journey."

**What makes it different from every other team's submission:**
- Booth Day Simulator — branching interactive walkthrough of polling day (no other team will have this)
- Explain toggle — same AI answer at 3 reading levels (12-year-old / first-time voter / informed citizen)
- Regional language toggle — English / Hindi / Assamese AI responses
- Firestore-backed persistence — app remembers the user across sessions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI | Google Gemini API (gemini-2.0-flash) |
| Database | Firebase Firestore |
| Analytics | Firebase Analytics |
| Deployment | Vercel or Firebase Hosting |
| Language | TypeScript |

---

## Folder Structure

```
votepilot/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── onboarding/page.tsx       # User profile setup
│   ├── dashboard/page.tsx        # Personalized dashboard
│   ├── ask/page.tsx              # Ask VotePilot (AI Q&A)
│   ├── simulator/page.tsx        # Booth Day Simulator
│   ├── elections/page.tsx        # Upcoming/ongoing/completed elections
│   └── mythbuster/page.tsx       # Myth vs Fact
├── components/
│   ├── ResponseCard.tsx          # Structured AI answer card
│   ├── SimulatorStage.tsx        # Single simulator stage UI
│   ├── ElectionCard.tsx          # Election info card
│   ├── MythCard.tsx              # Myth vs fact card
│   ├── ReadinessScore.tsx        # Circular progress ring
│   └── LanguageToggle.tsx        # EN / HI / AS toggle
├── data/
│   ├── simulator.json            # Full simulator state machine
│   └── elections.json            # Fallback election data
├── lib/
│   ├── gemini.ts                 # Gemini API utility
│   ├── firebase.ts               # Firebase init
│   ├── firestore.ts              # Firestore read/write helpers
│   └── recommendationEngine.ts   # Personalization logic
├── hooks/
│   ├── useSimulator.ts           # Simulator state machine hook
│   └── useUserProfile.ts         # Load/save user profile from Firestore
└── types/
    └── index.ts                  # Shared TypeScript types
```

---

## Day-by-Day Build Plan

### Days 1–2 — Scaffold + Landing + Onboarding

**Goal:** App runs, user can complete onboarding, profile saved to Firestore.

Tasks:
- Init Next.js 14 project with Tailwind in Antigravity
- Set up Firebase project, enable Firestore + Analytics
- Create `.env.local` with Gemini API key and Firebase config
- Build landing page with hero + 3 demo persona buttons
- Build onboarding form (5 fields: age, first-time voter, has voter ID, moved recently, state)
- On submit: save profile to Firestore, redirect to dashboard
- Commit: `init scaffold + landing + onboarding with firestore save`

**Demo personas on landing page:**
- "First-Time Voter" → pre-fills onboarding
- "Recently Moved Citizen" → pre-fills onboarding
- "Last-Minute Learner" → pre-fills onboarding

---

### Days 3–4 — Dashboard + Recommendation Engine

**Goal:** Dashboard shows personalized checklist and next action based on user profile.

Tasks:
- Build `recommendationEngine.ts` (pure function, no API call)
- Build dashboard with cards: You Are Here / Your Next Action / Preparation Checklist / Try Simulator / Test Your Readiness
- Load user profile from Firestore on page load
- Run profile through recommendation engine, render output
- Commit: `dashboard + recommendation engine working for all 3 personas`

**Recommendation engine logic (simplified):**
```typescript
export type UserProfile = {
  age: number
  firstTimeVoter: boolean
  movedRecently: boolean
  hasVoterId: boolean
  state: string
}

export type Recommendation = {
  currentStage: string
  nextActions: string[]
  recommendedModules: string[]
  warnings: string[]
  readinessScore: number
}

export function getRecommendations(profile: UserProfile): Recommendation {
  const nextActions: string[] = []
  const warnings: string[] = []
  const recommendedModules: string[] = []
  let readinessScore = 40

  if (profile.age < 18) {
    return {
      currentStage: "Not Yet Eligible",
      nextActions: ["Learn about eligibility requirements for future elections"],
      recommendedModules: ["Ask VotePilot", "Myth Buster"],
      warnings: ["You may not meet the voting age requirement"],
      readinessScore: 10
    }
  }

  if (profile.firstTimeVoter) {
    nextActions.push("Start with the Booth Day Simulator")
    recommendedModules.push("Simulator", "Ask VotePilot")
    readinessScore += 10
  }

  if (!profile.hasVoterId) {
    nextActions.push("Apply for Voter ID at voterportal.eci.gov.in")
    warnings.push("You need a valid photo ID to vote")
  } else {
    readinessScore += 20
  }

  if (profile.movedRecently) {
    nextActions.push("Verify your name on electoral roll at electoralsearch.eci.gov.in")
    warnings.push("Recent address changes may affect your registration")
    recommendedModules.push("Ask VotePilot")
  } else {
    readinessScore += 15
  }

  recommendedModules.push("Elections", "Myth Buster")

  return {
    currentStage: "Pre-Election Preparation",
    nextActions,
    recommendedModules: [...new Set(recommendedModules)],
    warnings,
    readinessScore
  }
}
```

---

### Days 5–6 — Ask VotePilot (AI Core) + Toggles

**Goal:** AI Q&A working with explain toggle (3 levels) and language toggle (EN/HI/AS).

Tasks:
- Set up Gemini API utility in `lib/gemini.ts`
- Build Ask VotePilot page with input, toggles, and response card
- Build `ResponseCard.tsx` component
- Add 5 preloaded example questions (clickable chips)
- Commit: `ask votepilot with explain + language toggles working`

**`lib/gemini.ts` — Full implementation:**
```typescript
const SYSTEM_PROMPT = `
You are VotePilot AI, a neutral and trustworthy election education assistant built for Indian voters.

Your job is to explain election-related questions in a clear, accurate, and educational way.

Rules:
- Never give partisan opinions or favor any party or candidate
- Never make up legal facts — if unsure, say so clearly
- Keep answers grounded in Indian election context (ECI, EVM, EPIC, Model Code of Conduct, etc.)
- Do not lecture or moralize

You will receive two parameters with every question:
1. explain_level: "simple" | "standard" | "detailed"
2. language: "english" | "hindi" | "assamese"

Adjust your response:
- "simple" → explain like the user is 12 years old. No jargon. Short sentences. Use analogies.
- "standard" → explain like a first-time voter. Clear and practical. Minimal jargon.
- "detailed" → explain like an informed citizen. Include legal and procedural detail.

- "english" → respond entirely in English
- "hindi" → respond entirely in Hindi (Devanagari script, not Hinglish)
- "assamese" → respond entirely in Assamese (Assamese script)

Always respond in this exact JSON format with no extra text, no markdown, no backticks:
{
  "answer": "...",
  "whyItMatters": "...",
  "whatYouShouldDo": "...",
  "keepInMind": "..."
}
`

export type ExplainLevel = "simple" | "standard" | "detailed"
export type Language = "english" | "hindi" | "assamese"

export type VotePilotResponse = {
  answer: string
  whyItMatters: string
  whatYouShouldDo: string
  keepInMind: string
}

export async function askVotePilot(
  question: string,
  explainLevel: ExplainLevel = "standard",
  language: Language = "english"
): Promise<VotePilotResponse> {
  const userMessage = `explain_level: ${explainLevel}\nlanguage: ${language}\nquestion: ${question}`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      })
    }
  )

  const data = await response.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

  try {
    return JSON.parse(raw)
  } catch {
    return {
      answer: raw,
      whyItMatters: "",
      whatYouShouldDo: "",
      keepInMind: ""
    }
  }
}
```

**Preloaded example questions:**
1. "What happens inside the polling booth?"
2. "Can I vote if I don't have my Voter ID card?"
3. "What is NOTA and should I use it?"
4. "What is the Model Code of Conduct?"
5. "How are votes counted after polling day?"

**Explain toggle UI:** 3 pill buttons — "Simple 🧒" / "Standard 🧑" / "Detailed 🎓"

**Language toggle UI:** 3 pill buttons — "English" / "हिन्दी" / "অসমীয়া"

**Important:** Cache results per (question + level + language) combination in component state so switching levels doesn't re-fetch unnecessarily.

---

### Days 7–8 — Booth Day Simulator

**Goal:** Full branching simulator working end-to-end with back button and completion screen.

Tasks:
- Save `simulator.json` to `/data/` folder (full state machine — see Simulator Data section below)
- Build `useSimulator.ts` hook
- Build `SimulatorStage.tsx` component
- Build simulator page
- Style completion screen with celebration UI
- Style dead-end screens with red tint
- Commit: `booth day simulator complete with all branches`

**`hooks/useSimulator.ts`:**
```typescript
import { useState } from "react"
import simulatorData from "@/data/simulator.json"

export function useSimulator() {
  const [currentStageId, setCurrentStageId] = useState("arrival")
  const [history, setHistory] = useState<string[]>([])

  const stages = simulatorData.simulator.stages as Record<string, any>
  const currentStage = stages[currentStageId]

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

  return {
    currentStage,
    choose,
    goBack,
    restart,
    canGoBack: history.length > 0,
    stepsCompleted: history.length
  }
}
```

---

### Day 8 (second half) — Elections Page

**Goal:** Elections page showing upcoming, ongoing, and completed elections pulled from Firestore.

Tasks:
- Create Firestore collection `elections` and add data manually from ECI website
- Build elections page with 3 tabs: Upcoming / Ongoing / Completed
- Build `ElectionCard.tsx` component
- Fallback to `/data/elections.json` if Firestore fetch fails
- Commit: `elections page with firestore data`

**Firestore collection structure (`elections/{id}`):**
```json
{
  "id": "bihar-2025",
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

---

### Day 9 — Myth Buster + Readiness Score (if time)

**Goal:** Myth Buster page working. Readiness Score ring on dashboard updated by completed actions.

**Myth Buster:**
- Use Gemini to generate myth vs fact — prompt: "Is this statement about Indian elections true or false? Explain in simple terms."
- OR hardcode 10 myths as static cards (faster, safer)
- Flip card UI — front shows myth, back shows verdict + explanation
- Commit: `myth buster page complete`

**10 hardcoded myths:**
1. "The polling officer can see who you voted for" → FALSE
2. "You need a Voter ID card specifically to vote" → FALSE (12 alternatives accepted)
3. "NOTA means the election is cancelled if it wins" → FALSE
4. "You can take your phone into the voting compartment" → FALSE
5. "If your name isn't on the list, you can never vote" → FALSE (complaint process exists)
6. "The EVM can be hacked easily" → FALSE
7. "You must vote for someone — abstaining is illegal" → FALSE (NOTA exists)
8. "Campaigning is allowed on polling day" → FALSE (MCC prohibits it)
9. "The indelible ink washes off in a day" → FALSE (lasts 2–3 weeks)
10. "Only Indian citizens born in India can vote" → FALSE (naturalised citizens can vote)

**Readiness Score (if time permits):**
- Circular SVG progress ring on dashboard
- Score starts at value from recommendation engine
- Increases when: simulator completed (+20), quiz answered (+10 per question), VotePilot asked (+5)
- Save updated score to Firestore user profile
- Commit: `readiness score ring with firestore sync`

---

### Day 10 — Polish + README + Deploy

Tasks:
- Mobile responsiveness pass on all pages
- Add loading states to all Gemini API calls
- Add error states (API failure fallback messages)
- Verify Firestore security rules (allow read/write for now — note in README)
- Write README (see README section below)
- Deploy to Vercel or Firebase Hosting
- Prepare 2-minute demo flow
- Final commit: `polish + deploy + readme`

---

## Simulator Data (Full State Machine)

Save this as `/data/simulator.json`:

```json
{
  "simulator": {
    "startStage": "arrival",
    "stages": {
      "arrival": {
        "id": "arrival",
        "title": "You've Arrived at the Polling Booth",
        "description": "It's election day. You've reached your assigned polling station. There's a queue outside and election officers are managing the crowd.",
        "illustration": "🏫",
        "choices": [
          { "id": "join_queue", "label": "Join the queue", "next": "identity_check" },
          { "id": "lost", "label": "I don't know which booth is mine", "next": "branch_wrong_booth" },
          { "id": "nervous", "label": "I'm nervous, what do I do?", "next": "branch_nervous" }
        ]
      },
      "branch_wrong_booth": {
        "id": "branch_wrong_booth",
        "type": "info",
        "title": "Finding Your Correct Booth",
        "description": "Every voter is assigned to a specific booth based on your address. Check your EPIC card or ask the Booth Level Officer (BLO) present outside.",
        "tip": "Your booth number is printed on your Voter ID. You can also check on the Voter Helpline app or call 1950.",
        "illustration": "🗺️",
        "choices": [
          { "id": "found_booth", "label": "Found it, joining the queue now", "next": "identity_check" }
        ]
      },
      "branch_nervous": {
        "id": "branch_nervous",
        "type": "info",
        "title": "It's Okay to Be Nervous",
        "description": "First-time voting feels overwhelming but the process is simple. Officers are there to help. You have every right to ask for assistance.",
        "tip": "If you need help understanding the machine, ask the Presiding Officer — they are required to assist you.",
        "illustration": "😌",
        "choices": [
          { "id": "feeling_ready", "label": "Okay I'm ready, joining the queue", "next": "identity_check" }
        ]
      },
      "identity_check": {
        "id": "identity_check",
        "title": "Identity Verification",
        "description": "You're at the front of the queue. The polling officer asks for your Voter ID to verify your name on the electoral roll.",
        "illustration": "🪪",
        "choices": [
          { "id": "have_epic", "label": "I have my Voter ID", "next": "name_found" },
          { "id": "no_epic", "label": "I forgot my Voter ID", "next": "branch_no_epic" },
          { "id": "name_missing", "label": "My name isn't on the list", "next": "branch_name_missing" }
        ]
      },
      "branch_no_epic": {
        "id": "branch_no_epic",
        "type": "info",
        "title": "No Voter ID? You May Still Vote",
        "description": "ECI allows 12 alternative photo ID documents. These include Aadhaar, Passport, Driving License, PAN card, and MNREGA job card.",
        "tip": "Voter ID is not the only option. Any valid government photo ID is accepted.",
        "illustration": "📄",
        "choices": [
          { "id": "have_alternative", "label": "I have an alternative ID", "next": "name_found" },
          { "id": "no_id_at_all", "label": "I have no ID at all", "next": "branch_no_id_at_all" }
        ]
      },
      "branch_no_id_at_all": {
        "id": "branch_no_id_at_all",
        "type": "dead_end",
        "title": "Unfortunately You Cannot Vote Today",
        "description": "Without any valid photo ID, the polling officer cannot verify your identity. You will not be permitted to cast your vote.",
        "tip": "For future elections, apply for your EPIC card at voterportal.eci.gov.in well in advance.",
        "illustration": "❌",
        "choices": [
          { "id": "restart", "label": "Start over", "next": "arrival" }
        ]
      },
      "branch_name_missing": {
        "id": "branch_name_missing",
        "type": "dead_end",
        "title": "Your Name Isn't on the List",
        "description": "If your name doesn't appear in the electoral roll at that booth, you cannot vote there even with valid ID. This can happen after a recent move.",
        "tip": "Always verify your name at electoralsearch.eci.gov.in before polling day.",
        "illustration": "📋",
        "choices": [
          { "id": "restart", "label": "Start over", "next": "arrival" }
        ]
      },
      "name_found": {
        "id": "name_found",
        "title": "Name Verified ✓",
        "description": "The officer finds your name on the electoral roll, marks it, and directs you to the next table for finger inking.",
        "illustration": "✅",
        "choices": [
          { "id": "proceed", "label": "Proceed to inking", "next": "inking" }
        ]
      },
      "inking": {
        "id": "inking",
        "title": "Finger Inking",
        "description": "An officer applies indelible ink on your left index finger. This ink cannot be washed off for several days and prevents double voting.",
        "illustration": "🖊️",
        "choices": [
          { "id": "inked", "label": "Done, what's next?", "next": "enter_booth" },
          { "id": "already_inked", "label": "I already have ink on my finger", "next": "branch_already_inked" }
        ]
      },
      "branch_already_inked": {
        "id": "branch_already_inked",
        "type": "info",
        "title": "Already Inked Means Already Voted",
        "description": "If you already have indelible ink on your finger, a vote has been cast in your name. Report this immediately to the Presiding Officer.",
        "tip": "This could indicate voter fraud. Contact the Election Commission helpline at 1950.",
        "illustration": "⚠️",
        "choices": [
          { "id": "restart", "label": "Start over", "next": "arrival" }
        ]
      },
      "enter_booth": {
        "id": "enter_booth",
        "title": "Entering the Voting Compartment",
        "description": "You're directed to the voting compartment — a small private space with the EVM. No phones allowed inside.",
        "illustration": "🚪",
        "choices": [
          { "id": "enter", "label": "Enter the compartment", "next": "cast_vote" },
          { "id": "phone_question", "label": "Can I take my phone inside?", "next": "branch_phone" }
        ]
      },
      "branch_phone": {
        "id": "branch_phone",
        "type": "info",
        "title": "No Phones Inside the Booth",
        "description": "Phones are not allowed in the voting compartment. This protects the secrecy of your vote.",
        "tip": "Leave your phone in your pocket — just don't take it into the compartment.",
        "illustration": "📵",
        "choices": [
          { "id": "understood", "label": "Understood, entering now", "next": "cast_vote" }
        ]
      },
      "cast_vote": {
        "id": "cast_vote",
        "title": "Casting Your Vote",
        "description": "The EVM shows candidates with their party symbols. Press the button next to your chosen candidate. The machine beeps and a light confirms your vote.",
        "illustration": "🗳️",
        "choices": [
          { "id": "voted", "label": "I pressed the button and heard a beep", "next": "vvpat" },
          { "id": "confused_evm", "label": "I'm confused by the machine", "next": "branch_confused_evm" },
          { "id": "nota", "label": "I don't want to vote for anyone", "next": "branch_nota" }
        ]
      },
      "branch_confused_evm": {
        "id": "branch_confused_evm",
        "type": "info",
        "title": "Confused by the EVM?",
        "description": "Find your candidate's name and party symbol, then press the blue button next to it. Step out and ask the Presiding Officer for help if needed — they must assist you.",
        "tip": "You cannot accidentally vote for the wrong person. Each button only activates one candidate.",
        "illustration": "🖲️",
        "choices": [
          { "id": "understood", "label": "Got it, casting my vote now", "next": "cast_vote" }
        ]
      },
      "branch_nota": {
        "id": "branch_nota",
        "type": "info",
        "title": "You Can Vote NOTA",
        "description": "NOTA (None of the Above) is the last option on every EVM. Your vote counts as participation even if you choose NOTA.",
        "tip": "NOTA votes are counted but do not affect the winner. The candidate with most votes wins regardless.",
        "illustration": "🚫",
        "choices": [
          { "id": "vote_nota", "label": "I'll press NOTA", "next": "vvpat" },
          { "id": "reconsider", "label": "Actually I'll vote for a candidate", "next": "cast_vote" }
        ]
      },
      "vvpat": {
        "id": "vvpat",
        "title": "VVPAT Slip Appears",
        "description": "A paper slip appears in the VVPAT machine for 7 seconds showing the candidate and symbol you voted for. This is your confirmation.",
        "illustration": "🧾",
        "choices": [
          { "id": "confirmed", "label": "I saw the slip, vote confirmed", "next": "exit" },
          { "id": "wrong_slip", "label": "The slip shows the wrong candidate", "next": "branch_wrong_slip" }
        ]
      },
      "branch_wrong_slip": {
        "id": "branch_wrong_slip",
        "type": "info",
        "title": "Wrong Candidate on VVPAT?",
        "description": "If the VVPAT slip shows a different candidate, immediately call the Presiding Officer without leaving the booth. This is a serious EVM malfunction.",
        "tip": "Do not leave the booth before reporting this. Once you exit, the complaint may not be accepted.",
        "illustration": "🚨",
        "choices": [
          { "id": "reported", "label": "I've reported it to the officer", "next": "exit" }
        ]
      },
      "exit": {
        "id": "exit",
        "type": "completion",
        "title": "You've Successfully Voted! 🎉",
        "description": "You exit the booth. Your vote has been cast. The ink on your finger is your badge of participation in Indian democracy.",
        "tip": "Results are typically declared within 24–48 hours of polling day closing. Follow live counts at results.eci.gov.in.",
        "illustration": "🇮🇳",
        "choices": [
          { "id": "restart", "label": "Try a different scenario", "next": "arrival" }
        ]
      }
    }
  }
}
```

---

## Firebase Setup

```typescript
// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)

if (typeof window !== "undefined") {
  isSupported().then(yes => yes && getAnalytics(app))
}
```

```typescript
// lib/firestore.ts
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "./firebase"
import type { UserProfile } from "@/types"

export async function saveUserProfile(sessionId: string, profile: UserProfile) {
  await setDoc(doc(db, "users", sessionId), profile)
}

export async function loadUserProfile(sessionId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", sessionId))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function updateReadinessScore(sessionId: string, score: number) {
  await setDoc(doc(db, "users", sessionId), { readinessScore: score }, { merge: true })
}
```

**Session ID strategy (no auth required):** Generate a UUID on first visit, save to `localStorage` as `votepilot_session_id`. Use this as the Firestore document ID. Simple, no login needed.

```typescript
// Simple session ID utility
export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr"
  let id = localStorage.getItem("votepilot_session_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("votepilot_session_id", id)
  }
  return id
}
```

---

## TypeScript Types

```typescript
// types/index.ts

export type UserProfile = {
  age: number
  firstTimeVoter: boolean
  movedRecently: boolean
  hasVoterId: boolean
  state: string
  readinessScore?: number
  completedModules?: string[]
}

export type ExplainLevel = "simple" | "standard" | "detailed"
export type Language = "english" | "hindi" | "assamese"

export type VotePilotResponse = {
  answer: string
  whyItMatters: string
  whatYouShouldDo: string
  keepInMind: string
}

export type SimulatorStage = {
  id: string
  type?: "info" | "dead_end" | "completion"
  title: string
  description: string
  tip?: string
  illustration: string
  choices: {
    id: string
    label: string
    next: string
  }[]
}

export type Election = {
  id: string
  state: string
  type: string
  status: "upcoming" | "ongoing" | "completed"
  phases: { phase: number; date: string }[]
  resultDate: string
  description: string
  winner?: string | null
}
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_GEMINI_KEY=your_gemini_api_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

---

## Pages Summary

| Page | Route | Key Feature |
|---|---|---|
| Landing | `/` | Hero + 3 demo personas |
| Onboarding | `/onboarding` | 5-field form → saves to Firestore |
| Dashboard | `/dashboard` | Personalized checklist + readiness score |
| Ask VotePilot | `/ask` | Gemini Q&A + explain toggle + language toggle |
| Simulator | `/simulator` | Branching booth day walkthrough |
| Elections | `/elections` | Upcoming / ongoing / completed tabs from Firestore |
| Myth Buster | `/mythbuster` | Flip card myths with AI or hardcoded verdicts |

---

## Demo Flow for Judges (2 minutes)

1. Open landing page — click "First-Time Voter" demo persona
2. Onboarding auto-fills — submit
3. Dashboard loads with personalized checklist and warnings
4. Open Ask VotePilot — click preloaded question "What happens inside the polling booth?"
5. Show structured response card
6. Switch explain level to "Simple 🧒" — show response changes
7. Switch language to "অসমীয়া" — show Assamese response
8. Open Simulator — go through 3–4 stages including one branch
9. Show completion screen
10. Open Elections page — show upcoming/completed tabs
11. End: "VotePilot builds civic confidence through personalized, intelligent election education."

---

## README Sections

```markdown
## Features
- Personalized Voter Roadmap based on user profile
- Ask VotePilot — AI-powered Q&A with 3 explain levels
- Multilingual support — English, Hindi (हिन्दी), Assamese (অসমীয়া)
- Booth Day Simulator — interactive branching walkthrough
- Elections tracker — upcoming, ongoing, and completed Indian elections
- Myth Buster — debunking common election misconceptions
- Firebase-backed persistence — app remembers your progress

## Tech Stack
Next.js 14 · Tailwind CSS · Google Gemini API · Firebase Firestore · Firebase Analytics

## Assumptions Made
- Focuses on general Indian election education, not country-specific legal interpretation
- Designed to remain strictly neutral and non-partisan
- Region-specific official timelines are manually maintained from ECI data
- The simulator is educational and illustrative, not a substitute for official ECI instructions
- Firestore security rules are open for demo purposes — production would require authentication

## Future Scope & Sustainability
VotePilot is designed with long-term deployment in mind. Potential sustainability paths include licensing to state election commissions, NGO voter awareness programs, and CSR-funded civic initiatives. The architecture is built to scale regionally with additional language support and live ECI data integration. Potential partners include ECI, ADR (Association for Democratic Reforms), and state-level voter awareness bodies.
```

---

## What NOT to Build (Scope Guard)

Do not add these during the hackathon:
- User authentication / login
- Live candidate data or rankings
- Map integration for booth locations
- Fancy animations before core logic works
- Large media files or images
- Political opinion or party comparison features
- Any feature not listed in this document

If Antigravity suggests adding something not in this plan — say no and redirect it to the current task.

---

## Commit Sequence

```bash
git commit -m "init nextjs tailwind scaffold"
git commit -m "add landing page and demo personas"
git commit -m "build onboarding form with firestore save"
git commit -m "add recommendation engine and dashboard"
git commit -m "build ask votepilot with gemini integration"
git commit -m "add explain level and language toggles"
git commit -m "add booth day simulator with branching"
git commit -m "add elections page with firestore data"
git commit -m "add myth buster page"
git commit -m "add readiness score ring"
git commit -m "polish mobile ui and error states"
git commit -m "finalize readme and deploy"
```
