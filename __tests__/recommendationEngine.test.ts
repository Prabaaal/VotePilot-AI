import { getRecommendations } from '@/lib/recommendationEngine'

describe('getRecommendations', () => {

  test('under-18 voter returns Not Yet Eligible stage', () => {
    const result = getRecommendations({
      age: 17,
      firstTimeVoter: true,
      hasVoterId: false,
      movedRecently: false,
      state: 'Assam',
      helpMode: 'full'
    })
    expect(result.currentStage).toBe('Not Yet Eligible')
    expect(result.readinessSeedScore).toBeLessThan(10)
  })

  test('first time voter gets simulator as next action', () => {
    const result = getRecommendations({
      age: 19,
      firstTimeVoter: true,
      hasVoterId: true,
      movedRecently: false,
      state: 'Assam',
      helpMode: 'full'
    })
    expect(result.nextAction).toContain('Simulator')
  })

  test('no voter ID triggers warning', () => {
    const result = getRecommendations({
      age: 22,
      firstTimeVoter: false,
      hasVoterId: false,
      movedRecently: false,
      state: 'Delhi',
      helpMode: 'quick'
    })
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  test('no voter ID sets correct next action', () => {
    const result = getRecommendations({
      age: 22,
      firstTimeVoter: false,
      hasVoterId: false,
      movedRecently: false,
      state: 'Delhi',
      helpMode: 'quick'
    })
    expect(result.nextAction).toContain('voterportal')
  })

  test('recently moved adds extra checklist item', () => {
    const result = getRecommendations({
      age: 25,
      firstTimeVoter: false,
      hasVoterId: true,
      movedRecently: true,
      state: 'Maharashtra',
      helpMode: 'full'
    })
    const hasMovedItem = result.checklist.some(item =>
      item.label.toLowerCase().includes('address')
    )
    expect(hasMovedItem).toBe(true)
  })

  test('recently moved adds extra warning', () => {
    const result = getRecommendations({
      age: 25,
      firstTimeVoter: false,
      hasVoterId: true,
      movedRecently: true,
      state: 'Maharashtra',
      helpMode: 'full'
    })
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  test('eligible voter returns at least 4 checklist items', () => {
    const result = getRecommendations({
      age: 21,
      firstTimeVoter: false,
      hasVoterId: true,
      movedRecently: false,
      state: 'Bihar',
      helpMode: 'full'
    })
    expect(result.checklist.length).toBeGreaterThanOrEqual(4)
  })

  test('has voter ID gives higher seed score than no voter ID', () => {
    const withId = getRecommendations({
      age: 21,
      firstTimeVoter: false,
      hasVoterId: true,
      movedRecently: false,
      state: 'Bihar',
      helpMode: 'full'
    })
    const withoutId = getRecommendations({
      age: 21,
      firstTimeVoter: false,
      hasVoterId: false,
      movedRecently: false,
      state: 'Bihar',
      helpMode: 'full'
    })
    expect(withId.readinessSeedScore).toBeGreaterThan(withoutId.readinessSeedScore)
  })

  test('result always contains required fields', () => {
    const result = getRecommendations({
      age: 20,
      firstTimeVoter: true,
      hasVoterId: true,
      movedRecently: false,
      state: 'Assam',
      helpMode: 'full'
    })
    expect(result).toHaveProperty('currentStage')
    expect(result).toHaveProperty('nextAction')
    expect(result).toHaveProperty('checklist')
    expect(result).toHaveProperty('warnings')
    expect(result).toHaveProperty('readinessSeedScore')
  })

})
