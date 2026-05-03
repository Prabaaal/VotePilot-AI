"use client"
import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { ResponseCard } from "@/components/ResponseCard"
import { askVotePilot, type ExplainLevel, type Language, type VotePilotResponse } from "@/lib/gemini"
import { getSessionId, updateReadinessScore, loadUserProfile } from "@/lib/firestore"

const EXAMPLE_QUESTIONS = [
  "What happens inside the polling booth?",
  "Can I vote if I don't have my Voter ID card?",
  "What is NOTA and should I use it?",
  "What is the Model Code of Conduct?",
  "How are votes counted after polling day?",
]

const EXPLAIN_LEVELS: { value: ExplainLevel; label: string }[] = [
  { value: "simple", label: "🧒 Simple" },
  { value: "standard", label: "🧑 Standard" },
  { value: "detailed", label: "🎓 Detailed" },
]

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "english", label: "🇬🇧 English" },
  { value: "hindi", label: "🇮🇳 हिन्दी" },
  { value: "assamese", label: "🏔️ অসমীয়া" },
]

function ResponseSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: '90px',
            borderRadius: '12px',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function AskPage() {
  const [question, setQuestion] = useState("")
  const [explainLevel, setExplainLevel] = useState<ExplainLevel>("standard")
  const [language, setLanguage] = useState<Language>("english")
  const [response, setResponse] = useState<VotePilotResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasAsked, setHasAsked] = useState(false)

  // Cache: (question + level + language) → response
  const [cache, setCache] = useState<Record<string, VotePilotResponse>>({})

  async function handleAsk(q?: string) {
    const finalQuestion = (q ?? question).trim()
    if (!finalQuestion) return

    setQuestion(finalQuestion)
    setError(null)

    const cacheKey = `${finalQuestion}|${explainLevel}|${language}`
    if (cache[cacheKey]) {
      setResponse(cache[cacheKey])
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      const result = await askVotePilot(finalQuestion, explainLevel, language)
      setResponse(result)
      setCache((prev) => ({ ...prev, [cacheKey]: result }))

      // Award readiness points on first ask
      if (!hasAsked) {
        setHasAsked(true)
        try {
          const sessionId = getSessionId()
          const profile = await loadUserProfile(sessionId)
          if (profile) {
            const newScore = Math.min(100, (profile.readinessScore ?? 40) + 10)
            await updateReadinessScore(sessionId, newScore)
          }
        } catch {
          // Firestore update is non-critical
        }
      }
    } catch {
      setError("VotePilot is temporarily unavailable. Please try again in a moment.")
    } finally {
      setLoading(false)
    }
  }

  function PillToggle<T extends string>({
    options,
    value,
    onChange,
  }: {
    options: { value: T; label: string }[]
    value: T
    onChange: (v: T) => void
  }) {
    return (
      <div className="pill-toggle">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`pill-option${value === opt.value ? " active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: '#F5F0E8' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(26px, 4vw, 40px)',
              color: '#1A1A2E',
              marginBottom: '8px',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Ask <span style={{ color: '#FF6B2B' }}>VotePilot</span> AI
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#6B7280', lineHeight: 1.6 }}>
            Get answers grounded in official ECI documents — in your language and reading level.
          </p>
        </div>

        {/* Toggles */}
        <div className="card mb-5">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '12px', color: '#1A1A2E', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Explanation Level
              </p>
              <PillToggle
                options={EXPLAIN_LEVELS}
                value={explainLevel}
                onChange={(v) => {
                  setExplainLevel(v)
                  // Re-fetch if there's a current question
                  if (response && question) {
                    const cacheKey = `${question}|${v}|${language}`
                    if (cache[cacheKey]) {
                      setResponse(cache[cacheKey])
                    } else {
                      setResponse(null)
                    }
                  }
                }}
              />
            </div>
            <div>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '12px', color: '#1A1A2E', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Language
              </p>
              <PillToggle
                options={LANGUAGES}
                value={language}
                onChange={(v) => {
                  setLanguage(v)
                  if (response && question) {
                    const cacheKey = `${question}|${explainLevel}|${v}`
                    if (cache[cacheKey]) {
                      setResponse(cache[cacheKey])
                    } else {
                      setResponse(null)
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Example Questions */}
        <div className="mb-5">
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '12px', color: '#6B7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Try these questions
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleAsk(q)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#1A1A2E',
                  background: '#FFFFFF',
                  border: '2px solid #1A1A2E',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#FFF0E8'
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#FF6B2B'
                  ;(e.currentTarget as HTMLElement).style.color = '#FF6B2B'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#FFFFFF'
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#1A1A2E'
                  ;(e.currentTarget as HTMLElement).style.color = '#1A1A2E'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="card mb-6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea
              id="ask-input"
              className="input"
              rows={3}
              placeholder="Ask anything about voting in India..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAsk()
                }
              }}
              style={{ resize: 'none', fontSize: '16px' }}
            />
            <button
              type="button"
              onClick={() => handleAsk()}
              disabled={loading || !question.trim()}
              className="btn-primary w-full"
              style={{ width: '100%', opacity: loading || !question.trim() ? 0.6 : 1 }}
            >
              {loading ? "Asking VotePilot..." : "Ask VotePilot →"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="card card-danger mb-5">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#B91C1C' }}>
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && <ResponseSkeleton />}

        {/* Response */}
        {response && !loading && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '14px', color: '#6B7280' }}>
                Response — {explainLevel} level · {language}
              </p>
              <button
                type="button"
                onClick={() => {
                  setResponse(null)
                  setQuestion("")
                }}
                className="btn-ghost"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Ask Another
              </button>
            </div>
            <ResponseCard response={response} />
          </div>
        )}

        {/* Info note */}
        {!response && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '16px', color: '#6B7280' }}>
              Ask any election question
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#9CA3AF', marginTop: '4px' }}>
              Your answer will be grounded in official ECI documents.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
