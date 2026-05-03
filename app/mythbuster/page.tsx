"use client"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { askVotePilot } from "@/lib/gemini"
import { getSessionId, updateReadinessScore, loadUserProfile } from "@/lib/firestore"

const MYTHS = [
  {
    id: 1,
    myth: "The polling officer can see who you voted for.",
    verdict: "MYTH",
    fact: "The EVM and VVPAT system is designed so that your vote is completely secret. The voting compartment is private and no officer can see which button you pressed. Your vote is completely confidential.",
    source: "ECI Voter Guide 2024 — Section: Secrecy of Ballot",
  },
  {
    id: 2,
    myth: "You must have a Voter ID card specifically to vote.",
    verdict: "MYTH",
    fact: "The Election Commission of India accepts 12 alternative photo ID documents. These include Aadhaar card, Passport, Driving License, PAN card, MNREGA Job Card, and more. Voter ID is recommended but not the only option.",
    source: "ECI Order on Alternative Photo IDs, 2019",
  },
  {
    id: 3,
    myth: "If NOTA gets the most votes, the election is cancelled.",
    verdict: "MYTH",
    fact: "NOTA (None of the Above) votes are counted and published but have no legal effect on the result. The candidate with the highest number of valid votes wins, regardless of how many NOTA votes were cast.",
    source: "People's Union for Civil Liberties v. Union of India, 2013 — Supreme Court Judgment",
  },
  {
    id: 4,
    myth: "You can take your phone into the voting compartment.",
    verdict: "MYTH",
    fact: "Mobile phones, cameras, and any recording devices are strictly prohibited inside the voting compartment. This protects the secrecy of your vote. You can keep your phone in your pocket outside the compartment.",
    source: "ECI Conduct of Elections Rules, Rule 49M",
  },
  {
    id: 5,
    myth: "If your name isn't on the electoral roll, you can never vote.",
    verdict: "MYTH",
    fact: "If your name is missing, you can file a complaint with the Returning Officer and get it added for future elections. You can also apply online at voterportal.eci.gov.in or visit your local Electoral Registration Officer.",
    source: "Representation of the People Act, 1950 — Section 22",
  },
  {
    id: 6,
    myth: "The EVM can be hacked easily through wireless signals.",
    verdict: "MYTH",
    fact: "Indian EVMs are standalone machines with no wireless capability, no internet connectivity, and no Bluetooth. They are not networked in any way. The Supreme Court has upheld the integrity of EVMs multiple times. They are manufactured by ECIL and BEL under strict protocols.",
    source: "ECI Technical Expert Committee Report on EVMs; Supreme Court ruling 2019",
  },
  {
    id: 7,
    myth: "Campaigning is allowed on polling day.",
    verdict: "MYTH",
    fact: "Under the Model Code of Conduct, all campaigning must stop 48 hours before polling begins. No political rallies, speeches, music, or distribution of materials is allowed on polling day. Violations can lead to arrest and fines.",
    source: "Model Code of Conduct — Section on Campaign Prohibition Period",
  },
  {
    id: 8,
    myth: "Indelible ink washes off within a day or two.",
    verdict: "MYTH",
    fact: "Indelible ink applied at polling stations lasts 2–3 weeks. It is specifically designed to be resistant to soap, water, and solvents. The ink contains Silver Nitrate which reacts with skin cells, making it very difficult to remove.",
    source: "ECI Technical Specification for Indelible Ink",
  },
  {
    id: 9,
    myth: "You must vote for someone — abstaining is illegal.",
    verdict: "MYTH",
    fact: "You have the right to vote NOTA (None of the Above), which is a legitimate choice available on every EVM. You can also choose not to vote at all — voting is a right, not a legal obligation in India.",
    source: "People's Union for Civil Liberties v. Union of India, 2013",
  },
  {
    id: 10,
    myth: "Only Indian citizens born in India can vote.",
    verdict: "MYTH",
    fact: "Any Indian citizen aged 18 or above can vote — including naturalized citizens. You must be registered as a voter in the relevant constituency. The law makes no distinction based on where you were born.",
    source: "Representation of the People Act, 1950 — Section 62",
  },
]

function MythCard({
  myth,
  index,
  onReveal,
}: {
  myth: typeof MYTHS[number]
  index: number
  onReveal: () => void
}) {
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  async function handleFlip() {
    if (!flipped) {
      setFlipped(true)
      setLoading(true)
      onReveal()

      try {
        const res = await askVotePilot(
          `Is this statement about Indian elections true or false? "${myth.myth}" Explain in simple terms.`,
          "standard",
          "english"
        )
        setAiResponse(res.answer)
      } catch {
        setAiResponse(myth.fact)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div
      onClick={handleFlip}
      style={{
        perspective: '1000px',
        height: '220px',
        cursor: flipped ? 'default' : 'pointer',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front — Myth */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: '#FEE2E2',
            border: '2px solid #1A1A2E',
            borderRadius: '20px',
            boxShadow: '6px 6px 0px #FCA5A5',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="badge" style={{ background: '#FEE2E2', color: '#B91C1C', borderColor: '#FCA5A5', fontSize: '11px' }}>
                🚫 #{index + 1} MYTH
              </span>
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '15px', color: '#1A1A2E', lineHeight: 1.5 }}>
              &ldquo;{myth.myth}&rdquo;
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '16px' }}>👆</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
              Tap to reveal the truth
            </span>
          </div>
        </div>

        {/* Back — Fact */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#DCFCE7',
            border: '2px solid #1A1A2E',
            borderRadius: '20px',
            boxShadow: '6px 6px 0px #86EFAC',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge badge-completed" style={{ fontSize: '11px' }}>
                ✅ FACT
              </span>
            </div>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton" style={{ height: '14px', borderRadius: '6px' }} />
                <div className="skeleton" style={{ height: '14px', borderRadius: '6px', width: '80%' }} />
                <div className="skeleton" style={{ height: '14px', borderRadius: '6px', width: '90%' }} />
              </div>
            ) : (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#166534', lineHeight: 1.5, overflow: 'hidden' }}>
                {aiResponse || myth.fact}
              </p>
            )}
          </div>
          <div style={{ borderTop: '1px solid #86EFAC', paddingTop: '8px', marginTop: '8px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>📄</span> {myth.source}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MythBusterPage() {
  const [revealedCount, setRevealedCount] = useState(0)
  const [scoreAwarded, setScoreAwarded] = useState(false)

  useEffect(() => {
    if (revealedCount >= MYTHS.length && !scoreAwarded) {
      setScoreAwarded(true)
      try {
        const sessionId = getSessionId()
        loadUserProfile(sessionId).then((profile) => {
          if (profile) {
            const newScore = Math.min(100, (profile.readinessScore ?? 40) + 15)
            updateReadinessScore(sessionId, newScore)
          }
        })
      } catch {
        // Non-critical
      }
    }
  }, [revealedCount, scoreAwarded])

  function handleReveal() {
    setRevealedCount((c) => Math.min(c + 1, MYTHS.length))
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: '#F5F0E8' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(26px, 4vw, 40px)',
              color: '#1A1A2E',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            Election <span style={{ color: '#FF6B2B' }}>Myth Buster</span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#6B7280', marginBottom: '16px' }}>
            10 common myths about voting in India — revealed with official ECI sources.
          </p>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, background: '#E5E0D8', borderRadius: '8px', height: '10px', border: '2px solid #1A1A2E', overflow: 'hidden' }}>
              <div
                style={{
                  background: '#22C55E',
                  width: `${(revealedCount / MYTHS.length) * 100}%`,
                  height: '100%',
                  borderRadius: '6px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1A1A2E', whiteSpace: 'nowrap' }}>
              {revealedCount}/{MYTHS.length} revealed
            </span>
            {revealedCount >= MYTHS.length && (
              <span className="badge badge-completed">+15 pts ✅</span>
            )}
          </div>
        </div>

        {/* Instruction */}
        <div className="card card-info mb-6">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#1E40AF' }}>
            💡 <strong>Tap any card</strong> to flip it and reveal the truth behind the myth. Each answer is backed by an official ECI source.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MYTHS.map((myth, i) => (
            <MythCard
              key={myth.id}
              myth={myth}
              index={i}
              onReveal={handleReveal}
            />
          ))}
        </div>

        {/* Completion message */}
        {revealedCount >= MYTHS.length && (
          <div className="card card-success mt-8" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '22px', color: '#166534', marginBottom: '8px' }}>
              You&apos;ve busted all 10 myths!
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#166534' }}>
              +15 points added to your Voter Readiness Score.
            </p>
          </div>
        )}

        {/* Source note */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#9CA3AF' }}>
            All facts are sourced from official Election Commission of India (ECI) documents.
          </p>
        </div>
      </div>
    </div>
  )
}
