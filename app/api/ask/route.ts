import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const orchestratorUrl = process.env.NEXT_PUBLIC_CLOUD_RUN_ORCHESTRATOR_URL || process.env.CLOUD_RUN_ORCHESTRATOR_URL
    
    if (!orchestratorUrl || orchestratorUrl === "") {
      return NextResponse.json(
        { error: "Cloud Run Orchestrator URL is not configured." },
        { status: 500 }
      )
    }

    const response = await fetch(`${orchestratorUrl.replace(/\/$/, "")}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      return NextResponse.json(
        { error: "Failed to fetch response from ADK backend." },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API Route error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred proxying to the backend." },
      { status: 500 }
    )
  }
}
