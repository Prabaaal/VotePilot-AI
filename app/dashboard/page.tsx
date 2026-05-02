"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionId, loadUserProfile } from "@/lib/firestore"
import { getRecommendations, Recommendation } from "@/lib/recommendationEngine"
import type { UserProfile } from "@/types"
import { ReadinessRing } from "@/components/ReadinessRing"
import { ChecklistItem } from "@/components/ChecklistItem"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const sessionId = getSessionId()
      const data = await loadUserProfile(sessionId)
      if (!data) {
        router.push("/onboarding")
        return
      }
      setProfile(data)
      const recs = getRecommendations(data)
      setRecommendation(recs)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6 gap-6 page-enter">
        <div className="skeleton skeleton-card max-w-4xl w-full h-[200px]"></div>
        <div className="skeleton skeleton-card max-w-4xl w-full h-[300px]"></div>
      </div>
    )
  }

  if (!profile || !recommendation) return null

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto space-y-[48px] sm:space-y-[80px] page-enter">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-[var(--font-heading)] font-bold text-[var(--color-text-primary)]">
            Your Dashboard
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
          <div className="col-span-1 md:col-span-1">
            <div className="card card-primary flex flex-col items-center text-center h-full">
              <h2 className="text-[20px] font-bold mb-6 font-[var(--font-heading)] text-[var(--color-text-primary)]">Readiness Score</h2>
              <ReadinessRing score={profile.readinessScore || recommendation.readinessScore} />
              <div className="mt-6">
                <span className="text-[14px] text-[var(--color-text-secondary)] block mb-1">Current Stage</span>
                <span className="badge badge-info">{recommendation.currentStage}</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-[20px]">
            <div className="card h-full flex flex-col">
              <h2 className="text-[22px] sm:text-[24px] font-bold mb-4 font-[var(--font-heading)] text-[var(--color-text-primary)]">
                Your Next Actions
              </h2>
              <div className="space-y-[16px] flex-1">
                {recommendation.nextActions.map((action, i) => (
                  <ChecklistItem key={i} item={action} done={false} />
                ))}
                {recommendation.nextActions.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4">
                      🎉
                    </div>
                    <p className="text-[18px] font-medium text-[var(--color-text-primary)]">You are all set!</p>
                    <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">Explore other modules to learn more.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {recommendation.warnings.length > 0 && (
          <div className="card card-warning">
            <h3 className="text-[18px] font-bold text-amber-900 mb-3 flex items-center gap-2 font-[var(--font-heading)]">
              <span className="text-xl">⚠️</span> Needs Attention
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-amber-800 font-medium font-[var(--font-body)]">
              {recommendation.warnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-[22px] sm:text-[24px] font-bold mb-[20px] font-[var(--font-heading)] text-[var(--color-text-primary)]">
            Explore Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
            <Link href="/simulator" className="card card-info text-center block group">
              <div className="text-[40px] mb-3 group-hover:scale-110 transition-transform inline-block">🗳️</div>
              <h3 className="font-bold text-[18px] font-[var(--font-heading)] text-[var(--color-text-primary)]">Simulator</h3>
              <p className="text-[14px] text-[#1E40AF] mt-1 font-[var(--font-body)]">Practice voting</p>
            </Link>
            <Link href="/ask" className="card card-info text-center block group">
              <div className="text-[40px] mb-3 group-hover:scale-110 transition-transform inline-block">💬</div>
              <h3 className="font-bold text-[18px] font-[var(--font-heading)] text-[var(--color-text-primary)]">Ask VotePilot</h3>
              <p className="text-[14px] text-[#1E40AF] mt-1 font-[var(--font-body)]">Get instant answers</p>
            </Link>
            <Link href="/mythbuster" className="card card-info text-center block group">
              <div className="text-[40px] mb-3 group-hover:scale-110 transition-transform inline-block">🔍</div>
              <h3 className="font-bold text-[18px] font-[var(--font-heading)] text-[var(--color-text-primary)]">Myth Buster</h3>
              <p className="text-[14px] text-[#1E40AF] mt-1 font-[var(--font-body)]">Facts vs Fiction</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
