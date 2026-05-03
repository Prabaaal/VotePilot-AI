"use client"
import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import type { Election } from "@/types"

// Fallback election data — seeded from eci.gov.in
const ELECTIONS: Election[] = [
  {
    id: "bihar-2025",
    state: "Bihar",
    type: "State Assembly",
    status: "upcoming",
    phases: [
      { phase: 1, date: "2025-10-15" },
      { phase: 2, date: "2025-10-25" },
    ],
    resultDate: "2025-10-28",
    description: "Bihar Vidhan Sabha Elections 2025",
    winner: null,
  },
  {
    id: "west-bengal-panchayat-2025",
    state: "West Bengal",
    type: "Panchayat",
    status: "upcoming",
    phases: [
      { phase: 1, date: "2025-11-10" },
    ],
    resultDate: "2025-11-13",
    description: "West Bengal Panchayat Elections 2025",
    winner: null,
  },
  {
    id: "assam-panchayat-2025",
    state: "Assam",
    type: "Panchayat",
    status: "upcoming",
    phases: [
      { phase: 1, date: "2025-12-03" },
    ],
    resultDate: "2025-12-05",
    description: "Assam Panchayat Elections 2025",
    winner: null,
  },
  {
    id: "jharkhand-2024",
    state: "Jharkhand",
    type: "State Assembly",
    status: "completed",
    phases: [
      { phase: 1, date: "2024-11-13" },
      { phase: 2, date: "2024-11-20" },
    ],
    resultDate: "2024-11-23",
    description: "Jharkhand Vidhan Sabha Elections 2024",
    winner: "Jharkhand Mukti Morcha (JMM) Alliance",
  },
  {
    id: "maharashtra-2024",
    state: "Maharashtra",
    type: "State Assembly",
    status: "completed",
    phases: [
      { phase: 1, date: "2024-11-20" },
    ],
    resultDate: "2024-11-23",
    description: "Maharashtra Vidhan Sabha Elections 2024",
    winner: "Mahayuti Alliance (BJP + NCP + Shiv Sena)",
  },
  {
    id: "delhi-2025",
    state: "Delhi",
    type: "State Assembly",
    status: "completed",
    phases: [
      { phase: 1, date: "2025-02-05" },
    ],
    resultDate: "2025-02-08",
    description: "Delhi Vidhan Sabha Elections 2025",
    winner: "Bharatiya Janata Party (BJP)",
  },
  {
    id: "lok-sabha-2024",
    state: "All India",
    type: "Lok Sabha (General Election)",
    status: "completed",
    phases: [
      { phase: 1, date: "2024-04-19" },
      { phase: 2, date: "2024-04-26" },
      { phase: 3, date: "2024-05-07" },
      { phase: 4, date: "2024-05-13" },
      { phase: 5, date: "2024-05-20" },
      { phase: 6, date: "2024-05-25" },
      { phase: 7, date: "2024-06-01" },
    ],
    resultDate: "2024-06-04",
    description: "18th Lok Sabha General Elections 2024",
    winner: "National Democratic Alliance (NDA)",
  },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function ElectionCard({ election }: { election: Election }) {
  return (
    <div
      className="card"
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Status accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background:
            election.status === "upcoming" ? '#3B82F6' :
            election.status === "ongoing" ? '#F59E0B' : '#22C55E',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', marginTop: '4px' }}>
        <div>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '20px', color: '#1A1A2E', marginBottom: '2px' }}>
            {election.state}
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280' }}>
            {election.type}
          </p>
        </div>
        <span className={`badge ${
          election.status === "upcoming" ? "badge-upcoming" :
          election.status === "ongoing" ? "badge-ongoing" : "badge-completed"
        }`}>
          {election.status === "upcoming" ? "🔜 Upcoming" :
           election.status === "ongoing" ? "🔴 Live" : "✅ Completed"}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280', marginBottom: '14px' }}>
        {election.description}
      </p>

      {/* Phases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
        {election.phases.map((phase) => (
          <div
            key={phase.phase}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: '#F5F0E8',
              borderRadius: '8px',
              border: '1px solid #E5E0D8',
            }}
          >
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#1A1A2E' }}>
              Phase {phase.phase}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#374151' }}>
              {formatDate(phase.date)}
            </span>
          </div>
        ))}
      </div>

      {/* Result date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #E5E0D8', paddingTop: '12px' }}>
        <div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280' }}>Result Date</span>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1A1A2E' }}>
            {formatDate(election.resultDate)}
          </div>
        </div>
        {election.winner && (
          <div style={{ textAlign: 'right', maxWidth: '55%' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280' }}>Winner</span>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#166534' }}>
              🏆 {election.winner}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type FilterStatus = "upcoming" | "ongoing" | "completed"

export default function ElectionsPage() {
  const [activeTab, setActiveTab] = useState<FilterStatus>("upcoming")

  const filtered = ELECTIONS.filter((e) => e.status === activeTab)

  const tabs: { value: FilterStatus; label: string; count: number }[] = [
    { value: "upcoming", label: "🔜 Upcoming", count: ELECTIONS.filter((e) => e.status === "upcoming").length },
    { value: "ongoing", label: "🔴 Ongoing", count: ELECTIONS.filter((e) => e.status === "ongoing").length },
    { value: "completed", label: "✅ Completed", count: ELECTIONS.filter((e) => e.status === "completed").length },
  ]

  return (
    <div className="min-h-screen page-enter" style={{ background: '#F5F0E8' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 4vw, 40px)', color: '#1A1A2E', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Upcoming & Recent <span style={{ color: '#FF6B2B' }}>Elections</span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#6B7280' }}>
            Track Indian elections — schedules, phases, results, and winners.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: '2px solid #1A1A2E',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: activeTab === tab.value ? '#FF6B2B' : '#FFFFFF',
                color: activeTab === tab.value ? '#FFFFFF' : '#1A1A2E',
                boxShadow: activeTab === tab.value ? '3px 3px 0px #1A1A2E' : '3px 3px 0px #1A1A2E',
              }}
            >
              {tab.label}
              <span
                style={{
                  marginLeft: '8px',
                  background: activeTab === tab.value ? 'rgba(255,255,255,0.3)' : '#F5F0E8',
                  borderRadius: '8px',
                  padding: '2px 8px',
                  fontSize: '12px',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((election) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        ) : (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '18px', color: '#6B7280' }}>
              No {activeTab} elections
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', marginTop: '8px' }}>
              Check back for updates from eci.gov.in
            </p>
          </div>
        )}

        {/* Source note */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#9CA3AF' }}>
            Data sourced from eci.gov.in · Last updated May 2025
          </p>
        </div>
      </div>
    </div>
  )
}
