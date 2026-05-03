import type { UserProfile } from "@/types"

export type ChecklistEntry = {
  label: string
  done: boolean
}

export type Recommendation = {
  currentStage: string
  nextAction: string
  checklist: ChecklistEntry[]
  warnings: string[]
  readinessSeedScore: number
  // Legacy fields kept for backward compat
  nextActions?: string[]
  recommendedModules?: string[]
  readinessScore?: number
}

export function getRecommendations(profile: UserProfile): Recommendation {
  const warnings: string[] = []
  const checklist: ChecklistEntry[] = []
  let readinessSeedScore = 40

  if (profile.age < 18) {
    return {
      currentStage: "Not Yet Eligible",
      nextAction: "Learn about eligibility requirements for future elections",
      checklist: [
        { label: "Check eligibility age requirement", done: false },
        { label: "Prepare for future election registration", done: false },
      ],
      warnings: ["You may not meet the voting age requirement"],
      readinessSeedScore: 5,
      nextActions: ["Learn about eligibility requirements for future elections"],
      recommendedModules: ["Ask VotePilot", "Myth Buster"],
      readinessScore: 5,
    }
  }

  // Base checklist items
  checklist.push({ label: "Confirm your name on the electoral roll", done: true })
  checklist.push({ label: "Locate your assigned polling booth", done: false })

  let nextAction = "Review your voter readiness checklist"

  if (profile.firstTimeVoter) {
    nextAction = "Start with the Booth Day Simulator"
    checklist.push({ label: "Complete the Booth Day Simulator", done: false })
    readinessSeedScore += 10
  }

  if (!profile.hasVoterId) {
    nextAction = "Apply for Voter ID at voterportal.eci.gov.in"
    checklist.push({ label: "Apply for Voter ID at voterportal.eci.gov.in", done: false })
    warnings.push("You need a valid photo ID to vote")
  } else {
    checklist.push({ label: "Keep your Voter ID ready for polling day", done: true })
    readinessSeedScore += 20
  }

  if (profile.movedRecently) {
    checklist.push({ label: "Update your address on the electoral roll", done: false })
    warnings.push("Recent address changes may affect your registration")
    readinessSeedScore -= 5
  } else {
    readinessSeedScore += 15
  }

  checklist.push({ label: "Know your polling booth location", done: false })

  return {
    currentStage: "Pre-Election Preparation",
    nextAction,
    checklist,
    warnings,
    readinessSeedScore,
    nextActions: [nextAction],
    recommendedModules: ["Elections", "Myth Buster"],
    readinessScore: readinessSeedScore,
  }
}
