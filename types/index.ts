export type UserProfile = {
  age: number
  firstTimeVoter: boolean
  movedRecently: boolean
  hasVoterId: boolean
  state: string
  helpMode?: string
  readinessScore?: number
  completedModules?: string[]
}

export type ExplainLevel = "simple" | "standard" | "detailed"
export type Language = "english" | "hindi" | "assamese"

export type VotePilotResponse = {
  answer: string
  whyItMatters: string
  whatYouShouldDo: string
  keepInMind: string
}

export type SimulatorStage = {
  id: string
  type?: "info" | "dead_end" | "completion"
  title: string
  description: string
  tip?: string
  illustration: string
  choices: {
    id: string
    label: string
    next: string
  }[]
}

export type Election = {
  id: string
  state: string
  type: string
  status: "upcoming" | "ongoing" | "completed"
  phases: { phase: number; date: string }[]
  resultDate: string
  description: string
  winner?: string | null
}
