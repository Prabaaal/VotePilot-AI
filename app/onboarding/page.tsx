"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { saveUserProfile, getSessionId } from "@/lib/firestore"
import type { UserProfile } from "@/types"

function OnboardingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const persona = searchParams.get("persona")

  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    age: 18,
    firstTimeVoter: false,
    hasVoterId: true,
    movedRecently: false,
    state: "Assam"
  })

  useEffect(() => {
    if (persona === "first-time") {
      setProfile({
        age: 18,
        firstTimeVoter: true,
        hasVoterId: false,
        movedRecently: false,
        state: "Assam"
      })
    } else if (persona === "moved") {
      setProfile({
        age: 30,
        firstTimeVoter: false,
        hasVoterId: true,
        movedRecently: true,
        state: "Maharashtra"
      })
    } else if (persona === "last-minute") {
      setProfile({
        age: 45,
        firstTimeVoter: false,
        hasVoterId: true,
        movedRecently: false,
        state: "Delhi"
      })
    }
  }, [persona])

  const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const sessionId = getSessionId()
      await saveUserProfile(sessionId, profile)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to save profile. Proceeding to dashboard locally.")
      // Even if Firebase fails (due to no config), just route to dashboard
      // Note: Ideally, we'd mock it if firestore is not configured, but this is fine for the hackathon.
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to VotePilot</h1>
        <p className="text-gray-500 mb-8">
          Tell us a little about yourself so we can personalize your election preparation journey.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Age</label>
            <input 
              type="number" 
              required
              min={1}
              max={120}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-50 text-gray-900"
              value={profile.age || ""}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-900">First-Time Voter?</p>
              <p className="text-sm text-gray-500">I have never voted in an election before.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={profile.firstTimeVoter}
                onChange={(e) => setProfile({ ...profile, firstTimeVoter: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Do you have a Voter ID?</p>
              <p className="text-sm text-gray-500">Also known as an EPIC card.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={profile.hasVoterId}
                onChange={(e) => setProfile({ ...profile, hasVoterId: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Moved recently?</p>
              <p className="text-sm text-gray-500">I have changed my address since the last election.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={profile.movedRecently}
                onChange={(e) => setProfile({ ...profile, movedRecently: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State / Union Territory</label>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-50 text-gray-900 appearance-none"
              value={profile.state}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
            >
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? "Saving Profile..." : "Go to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}
