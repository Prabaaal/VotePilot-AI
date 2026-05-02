"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

function OnboardingContent() {
  const searchParams = useSearchParams()
  const persona = searchParams.get("persona")

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Onboarding</h1>
        <p className="text-gray-600 mb-8">
          {persona ? `Loaded persona: ${persona}` : "Please fill out your profile."}
        </p>
        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl mb-6">
          <p className="text-sm">This page will be fully built in Day 2.</p>
        </div>
        <Link 
          href="/"
          className="text-blue-600 hover:underline font-medium"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}
