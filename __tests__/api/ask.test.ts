/**
 * @jest-environment node
 */
import { POST } from '@/app/api/ask/route'
import { NextRequest } from 'next/server'

// Mock fetch — don't hit Cloud Run in tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      answer: 'You need your Voter ID (EPIC card) or one of 12 alternative photo IDs.',
      whyItMatters: 'Without valid ID you cannot vote.',
      whatYouShouldDo: 'Carry your EPIC card or Aadhaar card on election day.',
      keepInMind: 'Passport, driving license, and PAN card are also accepted.',
      source: 'ECI Handbook for Electors 2024'
    })
  })
) as jest.Mock

describe('POST /api/ask', () => {

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_CLOUD_RUN_ORCHESTRATOR_URL = 'http://mock-cloud-run.example.com'
  })

  test('returns 200 for valid request', async () => {
    const req = new NextRequest('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What documents do I need to vote?',
        explain_level: 'simple',
        language: 'english'
      })
    })
    const response = await POST(req)
    expect(response.status).toBe(200)
  })

  test('response contains all required fields', async () => {
    const req = new NextRequest('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What is EVM?',
        explain_level: 'standard',
        language: 'english'
      })
    })
    const response = await POST(req)
    const data = await response.json()
    expect(data).toHaveProperty('answer')
    expect(data).toHaveProperty('whyItMatters')
    expect(data).toHaveProperty('whatYouShouldDo')
    expect(data).toHaveProperty('keepInMind')
  })

  test('passes explain_level to Cloud Run', async () => {
    const req = new NextRequest('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What is NOTA?',
        explain_level: 'detailed',
        language: 'hindi'
      })
    })
    await POST(req)
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(fetchCall[1].body)
    expect(body.explain_level).toBe('detailed')
    expect(body.language).toBe('hindi')
  })

  test('handles Cloud Run failure gracefully', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Cloud Run unavailable'))
    )
    const req = new NextRequest('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        question: 'test',
        explain_level: 'simple',
        language: 'english'
      })
    })
    const response = await POST(req)
    expect(response.status).toBe(500)
  })

})
