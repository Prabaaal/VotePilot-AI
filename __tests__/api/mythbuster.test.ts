/**
 * @jest-environment node
 */
import { POST } from '@/app/api/mythbuster/route'
import { NextRequest } from 'next/server'

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      answer: 'EVMs are thoroughly tested and verified by ECI.',
      whyItMatters: 'Understanding EVM security builds voter confidence.',
      whatYouShouldDo: 'Trust the verified process.',
      keepInMind: 'VVPAT provides a paper trail for verification.',
      source: 'ECI EVM & VVPAT FAQs',
      verdict: 'myth'
    })
  })
) as jest.Mock

describe('POST /api/mythbuster', () => {

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_CLOUD_RUN_ORCHESTRATOR_URL = 'http://mock-cloud-run.example.com'
  })

  test('returns 200 for valid myth request', async () => {
    const req = new NextRequest('http://localhost/api/mythbuster', {
      method: 'POST',
      body: JSON.stringify({
        myth_statement: 'EVMs can be easily hacked',
        language: 'english'
      })
    })
    const response = await POST(req)
    expect(response.status).toBe(200)
  })

  test('response contains verdict field', async () => {
    const req = new NextRequest('http://localhost/api/mythbuster', {
      method: 'POST',
      body: JSON.stringify({
        myth_statement: 'You must have Voter ID to vote',
        language: 'english'
      })
    })
    const response = await POST(req)
    const data = await response.json()
    expect(data).toHaveProperty('verdict')
    expect(data).toHaveProperty('answer')
    expect(data).toHaveProperty('source')
  })

})
