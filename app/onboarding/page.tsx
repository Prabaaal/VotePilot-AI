"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { saveUserProfile, getSessionId } from "@/lib/firestore"
import type { UserProfile } from "@/types"
import { Navbar } from "@/components/Navbar"
import { getRecommendations } from "@/lib/recommendationEngine"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
]

function ToggleGroup({
  value,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
}: {
  value: boolean
  onChange: (v: boolean) => void
  yesLabel?: string
  noLabel?: string
}) {
  return (
    <div className="toggle-group">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`toggle-option${value ? " active" : ""}`}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`toggle-option${!value ? " active" : ""}`}
      >
        {noLabel}
      </button>
    </div>
  )
}

function OnboardingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const persona = searchParams.get("persona")

  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<UserProfile>({
    age: 18,
    firstTimeVoter: false,
    hasVoterId: true,
    movedRecently: false,
    state: "Assam",
  })

  useEffect(() => {
    if (persona === "first-time") {
      setProfile({ age: 18, firstTimeVoter: true, hasVoterId: false, movedRecently: false, state: "Assam" })
    } else if (persona === "moved") {
      setProfile({ age: 30, firstTimeVoter: false, hasVoterId: true, movedRecently: true, state: "Maharashtra" })
    } else if (persona === "last-minute") {
      setProfile({ age: 45, firstTimeVoter: false, hasVoterId: true, movedRecently: false, state: "Delhi" })
    }
    // If a persona is provided, jump to review step
    if (persona) setStep(4)
  }, [persona])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sessionId = getSessionId()
    const recs = getRecommendations(profile)
    const profileWithScore = {
      ...profile,
      readinessScore: recs.readinessScore,
      completedModules: ["onboarding"],
    }
    // Synchronous localStorage save — no await, no spinner, no hang
    saveUserProfile(sessionId, profileWithScore)
    router.push("/dashboard")
  }

  const steps = [
    {
      label: "Your Age",
      content: (
        <div>
          <label className="label">How old are you?</label>
          <input
            id="age-input"
            type="number"
            required
            min={1}
            max={120}
            className="input"
            value={profile.age || ""}
            onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
            autoFocus
          />
          {profile.age < 18 && profile.age > 0 && (
            <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '8px' }}>
              ⚠️ You need to be 18+ to vote. You can still learn about the process.
            </p>
          )}
        </div>
      ),
    },
    {
      label: "Voting History",
      content: (
        <div>
          <label className="label">Are you a first-time voter?</label>
          <ToggleGroup
            value={profile.firstTimeVoter}
            onChange={(v) => setProfile({ ...profile, firstTimeVoter: v })}
            yesLabel="Yes, first time 🆕"
            noLabel="No, voted before"
          />
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '12px' }}>
            This helps us tailor the experience — first-timers get extra guidance.
          </p>
        </div>
      ),
    },
    {
      label: "Voter ID",
      content: (
        <div className="space-y-4">
          <div>
            <label className="label">Do you have a Voter ID (EPIC card)?</label>
            <ToggleGroup
              value={profile.hasVoterId}
              onChange={(v) => setProfile({ ...profile, hasVoterId: v })}
              yesLabel="Yes, I have it ✅"
              noLabel="No, I don't"
            />
          </div>
          <div>
            <label className="label">Have you moved recently?</label>
            <ToggleGroup
              value={profile.movedRecently}
              onChange={(v) => setProfile({ ...profile, movedRecently: v })}
              yesLabel="Yes, changed address"
              noLabel="No, same address"
            />
          </div>
        </div>
      ),
    },
    {
      label: "Your State",
      content: (
        <div>
          <label className="label" htmlFor="state-select">Your state / union territory</label>
          <div style={{ position: 'relative' }}>
            <select
              id="state-select"
              className="input"
              style={{ appearance: 'none', paddingRight: '40px' }}
              value={profile.state}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
            >
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#1A1A2E' }}>
              ▾
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Review",
      content: (
        <div>
          <div style={{ background: '#F5F0E8', border: '2px solid #1A1A2E', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1A1A2E', marginBottom: '16px' }}>
              Your Profile Summary
            </h3>
            {[
              { label: "Age", value: `${profile.age} years old` },
              { label: "First-time voter", value: profile.firstTimeVoter ? "Yes" : "No" },
              { label: "Has Voter ID", value: profile.hasVoterId ? "Yes ✅" : "No ⚠️" },
              { label: "Moved recently", value: profile.movedRecently ? "Yes ⚠️" : "No" },
              { label: "State", value: profile.state },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E0D8' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B7280' }}>{item.label}</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1A1A2E' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>
            Your profile is saved anonymously. No login required.
          </p>
        </div>
      ),
    },
  ]

  const totalSteps = steps.length
  const progress = ((step + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen page-enter" style={{ background: '#F5F0E8' }}>
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '28px', color: '#1A1A2E', marginBottom: '8px' }}>
            Set Up Your <span style={{ color: '#FF6B2B' }}>Voter Profile</span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B7280' }}>
            4 quick questions to personalize your election journey.
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '12px', color: '#1A1A2E' }}>
              {steps[step].label}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280' }}>
              Step {step + 1} of {totalSteps}
            </span>
          </div>
          <div style={{ background: '#E5E0D8', borderRadius: '8px', height: '8px', border: '2px solid #1A1A2E', overflow: 'hidden' }}>
            <div
              style={{
                background: '#FF6B2B',
                width: `${progress}%`,
                height: '100%',
                borderRadius: '6px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: '20px', minHeight: '200px' }}>
            {steps[step].content}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {step > 0 && (
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setStep((s) => s - 1)}
              >
                ← Back
              </button>
            )}
            {step < totalSteps - 1 ? (
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && (!profile.age || profile.age < 1)}
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1 }}
                >
                Go to My Dashboard →
              </button>
            )}
          </div>
        </form>

        {/* Skip to dashboard if already set up */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6B7280' }}>
          Already set up?{" "}
          <a href="/dashboard" style={{ color: '#FF6B2B', fontWeight: 600 }}>
            Go to dashboard →
          </a>
        </p>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F0E8' }}>
          <div className="skeleton" style={{ width: '400px', height: '400px', borderRadius: '20px' }} />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
