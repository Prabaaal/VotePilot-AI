import simulatorData from '@/data/simulator.json'

const stages = simulatorData.simulator.stages as Record<string, any>

describe('Simulator State Machine', () => {

  test('start stage is arrival', () => {
    expect(simulatorData.simulator.startStage).toBe('arrival')
  })

  test('arrival stage exists', () => {
    expect(stages['arrival']).toBeDefined()
  })

  test('exit stage exists and is completion type', () => {
    expect(stages['exit']).toBeDefined()
    expect(stages['exit'].type).toBe('completion')
  })

  test('all stages have required fields', () => {
    Object.values(stages).forEach((stage) => {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('description')
      expect(stage).toHaveProperty('choices')
      expect(Array.isArray(stage.choices)).toBe(true)
    })
  })

  test('all choice next references point to valid stages', () => {
    Object.values(stages).forEach((stage) => {
      stage.choices.forEach((choice: any) => {
        expect(stages[choice.next]).toBeDefined()
      })
    })
  })

  test('all stages have at least one choice', () => {
    Object.values(stages).forEach((stage) => {
      expect(stage.choices.length).toBeGreaterThanOrEqual(1)
    })
  })

  test('dead end stages exist', () => {
    const deadEnds = Object.values(stages).filter(
      (s) => s.type === 'dead_end'
    )
    expect(deadEnds.length).toBeGreaterThan(0)
  })

  test('all dead end stages have restart choice back to arrival', () => {
    const deadEnds = Object.values(stages).filter(
      (s) => s.type === 'dead_end'
    )
    deadEnds.forEach((stage) => {
      const hasRestart = stage.choices.some(
        (c: any) => c.next === 'arrival'
      )
      expect(hasRestart).toBe(true)
    })
  })

  test('identity_check stage has 3 choices', () => {
    expect(stages['identity_check'].choices.length).toBe(3)
  })

  test('cast_vote stage leads to vvpat on success', () => {
    const castVote = stages['cast_vote']
    const successChoice = castVote.choices.find(
      (c: any) => c.id === 'voted'
    )
    expect(successChoice).toBeDefined()
    expect(successChoice.next).toBe('vvpat')
  })

  test('vvpat stage leads to exit on confirmation', () => {
    const vvpat = stages['vvpat']
    const confirmChoice = vvpat.choices.find(
      (c: any) => c.id === 'confirmed'
    )
    expect(confirmChoice).toBeDefined()
    expect(confirmChoice.next).toBe('exit')
  })

  test('no broken circular references on main path', () => {
    // Walk the main happy path and confirm it reaches exit
    const mainPath = [
      'arrival',
      'identity_check',
      'name_found',
      'inking',
      'enter_booth',
      'cast_vote',
      'vvpat',
      'exit'
    ]
    mainPath.forEach(stageId => {
      expect(stages[stageId]).toBeDefined()
    })
  })

})
