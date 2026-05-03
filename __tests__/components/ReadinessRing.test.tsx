import { render, screen } from '@testing-library/react'
import ReadinessRing from '@/components/ReadinessRing'

describe('ReadinessRing', () => {

  test('renders without crashing', () => {
    render(<ReadinessRing score={45} />)
  })

  test('displays the score number', () => {
    render(<ReadinessRing score={72} />)
    expect(screen.getByText('72')).toBeInTheDocument()
  })

  test('renders SVG element', () => {
    const { container } = render(<ReadinessRing score={50} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  test('renders with score 0', () => {
    render(<ReadinessRing score={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('renders with score 100', () => {
    render(<ReadinessRing score={100} />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

})
