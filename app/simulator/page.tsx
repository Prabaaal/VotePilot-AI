"use client"
import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { updateReadinessScore, getSessionId, loadUserProfile } from "@/lib/firestore"

import simulatorData from "@/data/simulator.json"

type StageChoice = { id: string; label: string; next: string }
type StageData = {
  id: string
  type?: "info" | "dead_end" | "completion"
  title: string
  description: string
  tip?: string
  illustration: string
  choices: StageChoice[]
}

function useSimulator() {
  const [currentStageId, setCurrentStageId] = useState(simulatorData.simulator.startStage)
  const [history, setHistory] = useState<string[]>([])
  const [scoreAwarded, setScoreAwarded] = useState(false)

  const stages = simulatorData.simulator.stages as Record<string, StageData>
  const currentStage = stages[currentStageId]

  async function choose(nextStageId: string) {
    setHistory((prev) => [...prev, currentStageId])
    setCurrentStageId(nextStageId)

    // Award score on completion
    if (nextStageId === "exit" && !scoreAwarded) {
      setScoreAwarded(true)
      try {
        const sessionId = getSessionId()
        const profile = await loadUserProfile(sessionId)
        if (profile) {
          const newScore = Math.min(100, (profile.readinessScore ?? 40) + 25)
          updateReadinessScore(sessionId, newScore)
        }
      } catch {
        // Non-critical
      }
    }
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
    setCurrentStageId(simulatorData.simulator.startStage)
  }

  return { currentStage, choose, goBack, restart, history, totalStages: Object.keys(stages).length }
}

function StageCard({
  stage,
  onChoose,
}: {
  stage: StageData
  onChoose: (next: string) => void
}) {
  const isDeadEnd = stage.type === "dead_end"
  const isCompletion = stage.type === "completion"
  const isInfo = stage.type === "info"

  const cardStyle = isDeadEnd
    ? { background: '#FEE2E2', borderColor: '#FCA5A5', boxShadow: '6px 6px 0px #FCA5A5' }
    : isCompletion
    ? { background: '#DCFCE7', borderColor: '#86EFAC', boxShadow: '6px 6px 0px #86EFAC' }
    : isInfo
    ? { background: '#DBEAFE', borderColor: '#93C5FD', boxShadow: '6px 6px 0px #93C5FD' }
    : {}

  return (
    <div
      className="card page-enter"
      style={{
        ...cardStyle,
        textAlign: 'center',
        padding: '32px 24px',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '72px', lineHeight: 1, marginBottom: '20px' }}>
          {stage.illustration}
        </div>

        {stage.type && (
          <div className="mb-3">
            <span className={`badge ${isDeadEnd ? 'badge-danger' : isCompletion ? 'badge-completed' : 'badge-info'}`}
              style={isDeadEnd ? { background: '#FEE2E2', color: '#B91C1C', borderColor: '#FCA5A5' } : {}}>
              {isDeadEnd ? '❌ DEAD END' : isCompletion ? '✅ COMPLETED' : 'ℹ️ INFO'}
            </span>
          </div>
        )}

        <h2
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(20px, 3vw, 26px)',
            color: '#1A1A2E',
            marginBottom: '14px',
            lineHeight: 1.2,
          }}
        >
          {stage.title}
        </h2>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            color: '#374151',
            lineHeight: 1.7,
            marginBottom: '16px',
            maxWidth: '480px',
          }}
        >
          {stage.description}
        </p>

        {stage.tip && (
          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #1A1A2E',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '8px',
              maxWidth: '480px',
              boxShadow: '3px 3px 0px #1A1A2E',
            }}
          >
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '12px', color: '#FF6B2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              💡 Tip
            </span>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#1A1A2E', marginTop: '4px', lineHeight: 1.5 }}>
              {stage.tip}
            </p>
          </div>
        )}
      </div>

      {/* Choices */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px', maxWidth: '480px' }}>
        {stage.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => onChoose(choice.next)}
            className={isCompletion ? "btn-primary" : "btn-secondary"}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '14px 18px',
              fontSize: '15px',
            }}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SimulatorPage() {
  const { currentStage, choose, goBack, restart, history, totalStages } = useSimulator()

  const progress = Math.min(((history.length) / 10) * 100, 100)

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '22px', color: '#1A1A2E' }}>
                Booth Day <span style={{ color: '#FF6B2B' }}>Simulator</span>
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280' }}>
                Stage {history.length + 1} • {totalStages} total stages
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="btn-ghost"
                  style={{ fontSize: '13px', padding: '8px 14px' }}
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                onClick={restart}
                className="btn-ghost"
                style={{ fontSize: '13px', padding: '8px 14px' }}
              >
                ↺ Restart
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background: '#E5E0D8', borderRadius: '8px', height: '10px', border: '2px solid #1A1A2E', overflow: 'hidden' }}>
            <div
              style={{
                background: currentStage.type === "completion" ? '#22C55E' : '#FF6B2B',
                width: `${Math.max(5, progress)}%`,
                height: '100%',
                borderRadius: '6px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Stage Card */}
        <StageCard stage={currentStage} onChoose={choose} />

        {/* Info bar */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#9CA3AF' }}>
            All scenarios are based on official ECI voter guidelines.
          </p>
        </div>
      </div>
    </div>
  )
}
