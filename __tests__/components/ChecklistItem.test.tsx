import { render, screen } from '@testing-library/react'
import ChecklistItem from '@/components/ChecklistItem'

describe('ChecklistItem', () => {

  test('renders label text', () => {
    render(<ChecklistItem label="Check voter registration status" done={false} />)
    expect(screen.getByText('Check voter registration status')).toBeInTheDocument()
  })

  test('applies done styling when done is true', () => {
    const { container } = render(
      <ChecklistItem label="Task complete" done={true} />
    )
    expect(container.firstChild).toHaveClass('done')
  })

  test('does not apply done class when not done', () => {
    const { container } = render(
      <ChecklistItem label="Task pending" done={false} />
    )
    expect(container.firstChild).not.toHaveClass('done')
  })

})
