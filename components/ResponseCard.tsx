"use client"
import type { VotePilotResponse } from "@/lib/gemini"

interface ResponseCardProps {
  response: VotePilotResponse
}

const sections = [
  {
    key: "answer" as keyof VotePilotResponse,
    label: "Answer",
    emoji: "🔵",
    bg: "#DBEAFE",
    border: "#93C5FD",
    leftBorder: "#3B82F6",
  },
  {
    key: "whyItMatters" as keyof VotePilotResponse,
    label: "Why It Matters",
    emoji: "🟡",
    bg: "#FEF3C7",
    border: "#FCD34D",
    leftBorder: "#F59E0B",
  },
  {
    key: "whatYouShouldDo" as keyof VotePilotResponse,
    label: "What You Should Do",
    emoji: "🟢",
    bg: "#DCFCE7",
    border: "#86EFAC",
    leftBorder: "#22C55E",
  },
  {
    key: "keepInMind" as keyof VotePilotResponse,
    label: "Keep In Mind",
    emoji: "🟠",
    bg: "#FFF0E8",
    border: "#FFD5BC",
    leftBorder: "#FF6B2B",
  },
]

export function ResponseCard({ response }: ResponseCardProps) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {sections.map((section, i) => {
        const text = response[section.key] as string
        if (!text) return null

        return (
          <div
            key={section.key}
            className="stagger"
            style={{
              background: section.bg,
              border: `1.5px solid ${section.border}`,
              borderLeftWidth: '4px',
              borderLeftColor: section.leftBorder,
              borderRadius: '12px',
              padding: '16px',
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '6px',
                opacity: 0.7,
                color: '#1A1A2E',
              }}
            >
              {section.emoji} {section.label}
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                color: '#1A1A2E',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {text}
            </p>
          </div>
        )
      })}

      {response.source && (
        <div
          style={{
            borderTop: '2px solid #E5E0D8',
            paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '16px' }}>📄</span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#6B7280',
            }}
          >
            Source: {response.source}
          </span>
        </div>
      )}
    </div>
  )
}
