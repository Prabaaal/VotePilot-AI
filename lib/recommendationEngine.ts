import type { UserProfile } from "@/types"

export type Recommendation = {
  currentStage: string
  nextActions: string[]
  recommendedModules: string[]
  warnings: string[]
  readinessScore: number
}

export function getRecommendations(profile: UserProfile): Recommendation {
  const nextActions: string[] = []
  const warnings: string[] = []
  const recommendedModules: string[] = []
  let readinessScore = 40

  if (profile.age < 18) {
    return {
      currentStage: "Not Yet Eligible",
      nextActions: ["Learn about eligibility requirements for future elections"],
      recommendedModules: ["Ask VotePilot", "Myth Buster"],
      warnings: ["You may not meet the voting age requirement"],
      readinessScore: 10
    }
  }

  if (profile.firstTimeVoter) {
    nextActions.push("Start with the Booth Day Simulator")
    recommendedModules.push("Simulator", "Ask VotePilot")
    readinessScore += 10
  }

  if (!profile.hasVoterId) {
    nextActions.push("Apply for Voter ID at voterportal.eci.gov.in")
    warnings.push("You need a valid photo ID to vote")
  } else {
    readinessScore += 20
  }

  if (profile.movedRecently) {
    nextActions.push("Verify your name on electoral roll at electoralsearch.eci.gov.in")
    warnings.push("Recent address changes may affect your registration")
    recommendedModules.push("Ask VotePilot")
  } else {
    readinessScore += 15
  }

  recommendedModules.push("Elections", "Myth Buster")

  return {
    currentStage: "Pre-Election Preparation",
    nextActions,
    recommendedModules: Array.from(new Set(recommendedModules)),
    warnings,
    readinessScore
  }
}
