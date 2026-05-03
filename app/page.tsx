"use client"

import Link from "next/link"
import { Navbar } from "@/components/Navbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="page-enter">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="badge badge-new">🆕 AI-Powered Civic Education</span>
              </div>

              <h1
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: '#1A1A2E',
                }}
                className="mb-6"
              >
                Vote with{" "}
                <span style={{ color: '#FF6B2B' }}>Confidence,</span>
                <br />
                Not Confusion.
              </h1>

              <p
                style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', fontSize: '18px', lineHeight: 1.6 }}
                className="mb-8 max-w-xl"
              >
                Your neutral, intelligent election education companion. Learn the process,
                find your booth, and get ready for polling day — in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/onboarding" className="btn-primary text-center" style={{ padding: '14px 32px', fontSize: '16px' }}>
                  Get Started Free →
                </Link>
                <Link href="/simulator" className="btn-secondary text-center" style={{ padding: '14px 32px', fontSize: '16px' }}>
                  Try Simulator
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { value: "3", label: "Languages" },
                  { value: "7+", label: "Learning Modules" },
                  { value: "100%", label: "Free & Neutral" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '24px', color: '#1A1A2E' }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Hero Card */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div
                className="card"
                style={{
                  width: '320px',
                  animation: 'float 4s ease-in-out infinite',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: '#FFF0E8',
                      border: '2px solid #FF6B2B',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                    }}
                  >
                    🗳️
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1A1A2E' }}>
                      Voter Readiness
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Pre-Election Preparation</div>
                  </div>
                </div>

                {/* Mini readiness bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A2E' }}>Score</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#22C55E' }}>85%</span>
                  </div>
                  <div style={{ background: '#E5E0D8', borderRadius: '8px', height: '10px', border: '2px solid #1A1A2E', overflow: 'hidden' }}>
                    <div style={{ background: '#22C55E', width: '85%', height: '100%', borderRadius: '6px' }} />
                  </div>
                </div>

                {[
                  { label: "✅ Voter ID verified", done: true },
                  { label: "✅ Booth location found", done: true },
                  { label: "⬜ Simulator completed", done: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: `2px solid ${item.done ? '#86EFAC' : '#1A1A2E'}`,
                      background: item.done ? '#DCFCE7' : '#FFFFFF',
                      marginBottom: 8,
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#1A1A2E',
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Demo Personas Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div
            className="card"
            style={{ background: '#FFFFFF' }}
          >
            <h2
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '24px', color: '#1A1A2E', textAlign: 'center', marginBottom: '8px' }}
            >
              Choose a demo persona to start instantly
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B7280', textAlign: 'center', marginBottom: '32px' }}>
              Click to auto-fill your profile and jump straight to your personalized dashboard.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  href: "/onboarding?persona=first-time",
                  emoji: "🎓",
                  title: "First-Time Voter",
                  desc: "Just turned 18 and never voted before.",
                  bg: '#FFF0E8',
                  border: '#FF6B2B',
                  shadow: '#FF6B2B',
                },
                {
                  href: "/onboarding?persona=moved",
                  emoji: "📦",
                  title: "Recently Moved",
                  desc: "Changed city and need to update my details.",
                  bg: '#DCFCE7',
                  border: '#86EFAC',
                  shadow: '#86EFAC',
                },
                {
                  href: "/onboarding?persona=last-minute",
                  emoji: "⚡",
                  title: "Last-Minute Learner",
                  desc: "Election is tomorrow. Give me the essentials!",
                  bg: '#FEF3C7',
                  border: '#FCD34D',
                  shadow: '#FCD34D',
                },
              ].map((persona) => (
                <Link
                  key={persona.href}
                  href={persona.href}
                  className="group flex flex-col items-center text-center gap-4 p-6 transition-all duration-150"
                  style={{
                    background: persona.bg,
                    border: `2px solid ${persona.border}`,
                    borderRadius: '16px',
                    boxShadow: `4px 4px 0px ${persona.shadow}`,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `6px 6px 0px ${persona.shadow}`
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = ''
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0px ${persona.shadow}`
                  }}
                >
                  <div style={{ fontSize: '40px', lineHeight: 1 }}>{persona.emoji}</div>
                  <div>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1A1A2E', marginBottom: '4px' }}>
                      {persona.title}
                    </h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B7280' }}>{persona.desc}</p>
                  </div>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#FF6B2B' }}>
                    Start with this profile →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(22px, 3vw, 32px)', color: '#1A1A2E', textAlign: 'center', marginBottom: '48px', letterSpacing: '-0.01em' }}>
            How VotePilot <span style={{ color: '#FF6B2B' }}>Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                emoji: "📝",
                title: "Tell us your status",
                desc: "Answer 4 quick questions so we can personalize your dashboard, checklist, and voter readiness score.",
              },
              {
                step: "02",
                emoji: "💬",
                title: "Ask any question",
                desc: "Chat with VotePilot AI in English, Hindi, or Assamese. Adjust the explanation depth to your comfort level.",
              },
              {
                step: "03",
                emoji: "🏫",
                title: "Walk into the booth",
                desc: "Practice the exact voting sequence with our interactive Booth Day Simulator. Be prepared, not surprised.",
              },
            ].map((card) => (
              <div key={card.step} className="card relative overflow-hidden">
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-5px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 800,
                    fontSize: '80px',
                    color: '#F5F0E8',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {card.step}
                </div>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{card.emoji}</div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1A1A2E', marginBottom: '8px' }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card card-primary">
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1A1A2E', marginBottom: '20px', textAlign: 'center' }}>
              Everything you need to vote with confidence
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { emoji: "🔵", text: "Personalized Voter Roadmap" },
                { emoji: "🤖", text: "AI Q&A — 3 explain levels" },
                { emoji: "🌐", text: "English, Hindi & Assamese" },
                { emoji: "🗳️", text: "Booth Day Simulator" },
                { emoji: "📊", text: "Live Elections Tracker" },
                { emoji: "🔍", text: "Myth Buster — Fact Cards" },
              ].map((f) => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#FFFFFF', border: '2px solid #FF6B2B', borderRadius: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{f.emoji}</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#1A1A2E' }}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#FFFFFF', borderTop: '2px solid #1A1A2E', marginTop: '24px', padding: '40px 16px' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1A1A2E', marginBottom: '8px' }}>
            Built for Hack2skill PromptWars 🇮🇳
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280' }}>
            Information provided is neutral, non-partisan, and strictly educational. Powered by Gemini + Vertex AI.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}
