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

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr"
  let id = localStorage.getItem("votepilot_session_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("votepilot_session_id", id)
  }
  return id
}
