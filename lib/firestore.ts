import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "./firebase"
import type { UserProfile } from "@/types"

const LOCAL_KEY = "votepilot_profile"

// ─── localStorage (instant, always works) ─────────────────────────────────

function saveLocal(profile: UserProfile) {
  if (typeof window === "undefined") return
  localStorage.setItem(LOCAL_KEY, JSON.stringify(profile))
}

function loadLocal(): UserProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch {
    return null
  }
}

// ─── Firestore with race-timeout ──────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore timeout")), ms)
    ),
  ])
}

// ─── Public API ───────────────────────────────────────────────────────────

/** Save locally NOW, sync to Firestore in background (non-blocking). */
export function saveUserProfile(sessionId: string, profile: UserProfile): void {
  saveLocal(profile)
  // Fire-and-forget — do NOT await this
  withTimeout(setDoc(doc(db, "users", sessionId), profile)).catch(() => {})
}

export async function loadUserProfile(sessionId: string): Promise<UserProfile | null> {
  // Try Firestore first (with timeout), fall back to local
  try {
    const snap = await withTimeout(getDoc(doc(db, "users", sessionId)))
    if (snap.exists()) {
      const data = snap.data() as UserProfile
      saveLocal(data) // keep local in sync
      return data
    }
  } catch {
    // Firestore unavailable or timed out
  }
  return loadLocal()
}

export function updateReadinessScore(sessionId: string, score: number): void {
  const local = loadLocal()
  if (local) saveLocal({ ...local, readinessScore: score })
  withTimeout(
    setDoc(doc(db, "users", sessionId), { readinessScore: score }, { merge: true })
  ).catch(() => {})
}

export function updateCompletedModules(sessionId: string, module: string): void {
  const local = loadLocal()
  if (local) {
    const existing = local.completedModules ?? []
    if (!existing.includes(module)) {
      saveLocal({ ...local, completedModules: [...existing, module] })
    }
  }
  // Firestore sync in background
  withTimeout(getDoc(doc(db, "users", sessionId)))
    .then((snap) => {
      const existing: string[] = snap.exists() ? (snap.data().completedModules ?? []) : []
      if (!existing.includes(module)) {
        return setDoc(doc(db, "users", sessionId), { completedModules: [...existing, module] }, { merge: true })
      }
    })
    .catch(() => {})
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr"
  let id = localStorage.getItem("votepilot_session_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("votepilot_session_id", id)
  }
  return id
}
