"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionId, loadUserProfile } from "@/lib/firestore"
import { getRecommendations, Recommendation } from "@/lib/recommendationEngine"
import type { UserProfile } from "@/types"
import { ReadinessRing } from "@/components/ReadinessRing"
import { ChecklistItem } from "@/components/ChecklistItem"
import { Navbar } from "@/components/Navbar"
import Link from "next/link"

function SkeletonDashboard() {
  return (
    <div className="min-h-screen page-enter" style={{ background: '#F5F0E8' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="skeleton" style={{ height: '48px', width: '240px', borderRadius: '12px' }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="skeleton" style={{ height: '260px', borderRadius: '20px' }} />
          <div className="col-span-2 skeleton" style={{ height: '260px', borderRadius: '20px' }} />
        </div>
        <div className="skeleton" style={{ height: '140px', borderRadius: '20px' }} />
        <div className="grid grid-cols-3 gap-5">
          <div className="skeleton" style={{ height: '120px', borderRadius: '20px' }} />
          <div className="skeleton" style={{ height: '120px', borderRadius: '20px' }} />
          <div className="skeleton" style={{ height: '120px', borderRadius: '20px' }} />
        </div>
      </div>
    </div>
  )
}

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

  if (loading) return <SkeletonDashboard />
  if (!profile || !recommendation) return null

  const score = profile.readinessScore ?? recommendation.readinessScore
  const completedModules = profile.completedModules ?? ["onboarding"]

  return (
    <div className="min-h-screen page-enter" style={{ background: '#F5F0E8' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ fontSize: '32px' }}>👋</div>
            <div>
              <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 36px)', color: '#1A1A2E', lineHeight: 1.1 }}>
                Welcome, Voter
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B7280' }}>
                Here&apos;s your personalized readiness summary — {profile.state}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <span className="badge badge-info">📍 {recommendation.currentStage}</span>
            {completedModules.map((mod) => (
              <span key={mod} className="badge badge-completed">✅ {mod}</span>
            ))}
          </div>
        </header>

        {/* Top Grid: Readiness + Next Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {/* Readiness Ring */}
          <div className="card card-primary flex flex-col items-center text-center">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1A1A2E', marginBottom: '20px' }}>
              Voter Readiness Score
            </h2>
            <ReadinessRing score={score} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', marginTop: '16px' }}>
              Complete modules to increase your score
            </p>
          </div>

          {/* Next Actions */}
          <div className="col-span-1 md:col-span-2 card">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1A1A2E', marginBottom: '16px' }}>
              🎯 Your Next Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendation.nextActions.length > 0 ? (
                recommendation.nextActions.map((action, i) => (
                  <ChecklistItem key={i} item={action} done={false} />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '32px', background: '#DCFCE7', border: '2px solid #86EFAC', borderRadius: '14px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '18px', color: '#166534' }}>
                    You&apos;re all set!
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#166534', marginTop: '4px' }}>
                    Explore other modules to learn more and increase your score.
                  </p>
                </div>
              )}
            </div>

            {/* Score breakdown */}
            <div style={{ marginTop: '20px', padding: '14px', background: '#F5F0E8', borderRadius: '12px', border: '2px solid #E5E0D8' }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '12px', color: '#1A1A2E', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Score Breakdown
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { label: "Onboarding", pts: "+20", done: completedModules.includes("onboarding") },
                  { label: "Simulator", pts: "+25", done: completedModules.includes("simulator") },
                  { label: "Ask VotePilot", pts: "+10", done: completedModules.includes("ask") },
                  { label: "Myth Buster", pts: "+15", done: completedModules.includes("mythbuster") },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: `2px solid ${item.done ? '#86EFAC' : '#E5E0D8'}`,
                      background: item.done ? '#DCFCE7' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: item.done ? '#166534' : '#9CA3AF',
                    }}
                  >
                    {item.done ? '✅' : '○'} {item.label} <span style={{ color: item.done ? '#22C55E' : '#9CA3AF' }}>{item.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {recommendation.warnings.length > 0 && (
          <div className="card card-warning mb-5">
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#92400E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ Needs Attention
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recommendation.warnings.map((warn, i) => (
                <li
                  key={i}
                  style={{
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    border: '2px solid #FCD34D',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: '#92400E',
                    fontWeight: 500,
                  }}
                >
                  {warn}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Preparation Checklist */}
        <div className="card mb-5">
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1A1A2E', marginBottom: '16px' }}>
            📋 Preparation Checklist
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: "Check voter registration status", done: profile.hasVoterId },
              { label: "Know your polling booth location", done: false },
              { label: "Understand the EVM voting process", done: completedModules.includes("simulator") },
              { label: "Know your rights at the booth", done: completedModules.includes("ask") },
              ...(profile.movedRecently ? [{ label: "Verify registration after address change", done: false }] : []),
            ].map((item, i) => (
              <ChecklistItem key={i} item={item.label} done={item.done} />
            ))}
          </div>
        </div>

        {/* Quick Nav */}
        <div>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1A1A2E', marginBottom: '16px' }}>
            Explore Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { href: "/simulator", emoji: "🗳️", title: "Booth Day Simulator", desc: "Practice the voting sequence", color: '#DBEAFE', border: '#93C5FD', shadow: '#93C5FD' },
              { href: "/ask", emoji: "💬", title: "Ask VotePilot", desc: "Get instant AI answers", color: '#FFF0E8', border: '#FF6B2B', shadow: '#FF6B2B' },
              { href: "/mythbuster", emoji: "🔍", title: "Myth Buster", desc: "Facts vs fiction", color: '#DCFCE7', border: '#86EFAC', shadow: '#86EFAC' },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group text-center block transition-all duration-150"
                style={{
                  background: card.color,
                  border: `2px solid ${card.border}`,
                  borderRadius: '20px',
                  boxShadow: `6px 6px 0px ${card.shadow}`,
                  padding: '24px',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `8px 8px 0px ${card.shadow}`
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = ''
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `6px 6px 0px ${card.shadow}`
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '10px' }} className="group-hover:scale-110 transition-transform inline-block">
                  {card.emoji}
                </div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1A1A2E', marginBottom: '4px' }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280' }}>
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Also explore */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/elections" className="btn-secondary" style={{ fontSize: '14px', padding: '10px 20px' }}>
            📊 Elections Tracker
          </Link>
          <Link href="/onboarding" className="btn-ghost" style={{ fontSize: '14px', padding: '10px 20px' }}>
            ✏️ Update Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
