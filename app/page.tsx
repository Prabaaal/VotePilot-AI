"use client"

import Link from "next/link"
import { CheckCircle2, ShieldCheck, MapPin } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              V
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">VotePilot AI</span>
          </div>
          <div>
            <Link 
              href="/onboarding" 
              className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Understand elections <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              without the confusion.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
            Your neutral, intelligent election education companion. Learn the process, find your booth, and get ready for polling day in minutes.
          </p>
        </div>

        {/* Demo Personas Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 mb-24">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Choose a demo persona to start</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link 
              href="/onboarding?persona=first-time"
              className="group relative bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 rounded-2xl p-6 transition-all duration-200 text-center flex flex-col items-center gap-4 hover:shadow-md"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎓
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">First-Time Voter</h3>
                <p className="text-sm text-gray-500">I&apos;ve just turned 18 and never voted before.</p>
              </div>
            </Link>

            <Link 
              href="/onboarding?persona=moved"
              className="group relative bg-gray-50 hover:bg-emerald-50 border-2 border-transparent hover:border-emerald-200 rounded-2xl p-6 transition-all duration-200 text-center flex flex-col items-center gap-4 hover:shadow-md"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📦
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Recently Moved</h3>
                <p className="text-sm text-gray-500">I changed my city and need to update my details.</p>
              </div>
            </Link>

            <Link 
              href="/onboarding?persona=last-minute"
              className="group relative bg-gray-50 hover:bg-amber-50 border-2 border-transparent hover:border-amber-200 rounded-2xl p-6 transition-all duration-200 text-center flex flex-col items-center gap-4 hover:shadow-md"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ⏱️
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Last-Minute Learner</h3>
                <p className="text-sm text-gray-500">Election is tomorrow, give me the summary!</p>
              </div>
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How VotePilot Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Tell us your status</h3>
              <p className="text-gray-600">Answer 4 quick questions so we can personalize your dashboard and checklist.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Ask any question</h3>
              <p className="text-gray-600">Chat with VotePilot in 3 languages and adjust the explanation level to your liking.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Walk into the booth</h3>
              <p className="text-gray-600">Use our interactive Booth Day Simulator to practice the exact sequence of events.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p className="mb-4 text-lg font-semibold text-gray-700 flex items-center justify-center gap-2">
            Built for Hack2skill PromptWars 🇮🇳
          </p>
          <p className="text-sm">Information provided is neutral and strictly educational.</p>
        </div>
      </footer>
    </div>
  )
}
