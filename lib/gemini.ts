export type ExplainLevel = "simple" | "standard" | "detailed"
export type Language = "english" | "hindi" | "assamese"

export type VotePilotResponse = {
  answer: string
  whyItMatters: string
  whatYouShouldDo: string
  keepInMind: string
  source?: string
}

const SYSTEM_PROMPT = `You are VotePilot AI, a neutral and trustworthy election education assistant built for Indian voters.

Your job is to explain election-related questions in a clear, accurate, and educational way.

Rules:
- Never give partisan opinions or favor any party or candidate
- Never make up legal facts — if unsure, say so clearly
- Keep answers grounded in Indian election context (ECI, EVM, EPIC, Model Code of Conduct, etc.)
- Do not lecture or moralize
- Always cite the source document when relevant (e.g., "ECI Voter Guide 2024", "Model Code of Conduct")

You will receive two parameters with every question:
1. explain_level: "simple" | "standard" | "detailed"
2. language: "english" | "hindi" | "assamese"

Adjust your response:
- "simple" → explain like the user is 12 years old. No jargon. Short sentences. Use analogies.
- "standard" → explain like a first-time voter. Clear and practical. Minimal jargon.
- "detailed" → explain like an informed citizen. Include legal and procedural detail.

- "english" → respond entirely in English
- "hindi" → respond entirely in Hindi (Devanagari script, not Hinglish)
- "assamese" → respond entirely in Assamese (Assamese script using Bengali Unicode)

Always respond in this exact JSON format with no extra text, no markdown, no backticks:
{
  "answer": "...",
  "whyItMatters": "...",
  "whatYouShouldDo": "...",
  "keepInMind": "...",
  "source": "ECI document name if relevant, else empty string"
}`

export async function askVotePilot(
  question: string,
  explainLevel: ExplainLevel = "standard",
  language: Language = "english"
): Promise<VotePilotResponse> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY
  if (!apiKey || apiKey === "your_gemini_key") {
    // Return a demo response when no API key is configured
    return getDemoResponse(question, explainLevel, language)
  }

  const userMessage = `explain_level: ${explainLevel}\nlanguage: ${language}\nquestion: ${question}`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

    try {
      return JSON.parse(cleaned)
    } catch {
      return {
        answer: raw,
        whyItMatters: "",
        whatYouShouldDo: "",
        keepInMind: "",
        source: "",
      }
    }
  } catch (error) {
    console.error("Gemini API error:", error)
    return getDemoResponse(question, explainLevel, language)
  }
}

function getDemoResponse(question: string, explainLevel: ExplainLevel, language: Language): VotePilotResponse {
  const isSimple = explainLevel === "simple"
  const isDetailed = explainLevel === "detailed"
  
  if (language === "hindi") {
    return {
      answer: "भारत में मतदान की प्रक्रिया में आपको अपना EPIC कार्ड (मतदाता पहचान पत्र) लाना होता है। आप अपना बूथ नंबर EPIC कार्ड पर देख सकते हैं।",
      whyItMatters: "मतदान आपका मौलिक अधिकार है। हर वोट मायने रखता है।",
      whatYouShouldDo: "voterportal.eci.gov.in पर अपनी मतदाता सूची में नाम जाँचें।",
      keepInMind: "मतदान केंद्र पर पहुँचने से पहले अपना बूथ नंबर और पता जान लें।",
      source: "ECI Voter Guide 2024",
    }
  }

  if (language === "assamese") {
    return {
      answer: "ভাৰতত ভোটদানৰ বাবে আপুনি আপোনাৰ EPIC কাৰ্ড (ভোটাৰ পৰিচয় পত্ৰ) আনিব লাগিব। আপোনাৰ বুথ নম্বৰ EPIC কাৰ্ডত দিয়া আছে।",
      whyItMatters: "ভোটদান আপোনাৰ মৌলিক অধিকাৰ। প্ৰতিটো ভোটৰ গুৰুত্ব আছে।",
      whatYouShouldDo: "voterportal.eci.gov.in ত আপোনাৰ নাম পৰীক্ষা কৰক।",
      keepInMind: "ভোট কেন্দ্ৰলৈ যোৱাৰ আগতে আপোনাৰ বুথ নম্বৰ জানি লওক।",
      source: "ECI Voter Guide 2024",
    }
  }

  const baseAnswer = isSimple
    ? "Voting in India is like choosing the captain of your class. You go to a special room called a polling booth, press a button next to the person you want to vote for on a machine called the EVM, and that's it! The machine makes a beep sound and shows you a paper slip through a glass window to confirm your vote."
    : isDetailed
    ? "The Indian electoral process is governed by the Representation of the People Act, 1951. Every eligible citizen (18+ years) can vote using the Electronic Voting Machine (EVM). The VVPAT (Voter Verifiable Paper Audit Trail) machine shows a paper slip for 7 seconds confirming your vote. Under Section 79(d), you require your EPIC card or one of 12 alternative photo IDs approved by the ECI."
    : "Voting in India is a straightforward process. You go to your assigned polling booth, show your Voter ID (EPIC card) or an alternative government photo ID, get your finger inked, and press a button on the EVM next to your chosen candidate. The VVPAT machine shows a paper slip confirming your vote."

  return {
    answer: baseAnswer,
    whyItMatters: isSimple
      ? "When people vote, it decides who runs the country and makes rules. Your vote helps pick leaders who make decisions about schools, hospitals, and roads."
      : "Your vote directly determines your local, state, and national representatives. Voter turnout affects the legitimacy of election outcomes and shapes governance priorities.",
    whatYouShouldDo: "Check your name on the electoral roll at electoralsearch.eci.gov.in. Know your polling booth number (printed on your EPIC card). Bring a valid photo ID on election day.",
    keepInMind: "You can vote using 12 alternative IDs besides the Voter ID — including Aadhaar, Passport, Driving License, PAN card, and MNREGA job card. Voter ID is not mandatory.",
    source: "ECI Voter Guide 2024",
  }
}
