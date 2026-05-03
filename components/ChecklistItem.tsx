import { Check } from "lucide-react"

type Props = {
  label: string
  done?: boolean
  // Legacy prop alias kept for backward compat
  item?: string
}

export default function ChecklistItem({ label, item, done = false }: Props) {
  const displayText = label ?? item ?? ""
  return (
    <div className={`checklist-item ${done ? "done" : ""}`}>
      <div className="checklist-checkbox">
        {done && <Check className="w-4 h-4 text-white check-animate" />}
      </div>
      <span className={`font-medium ${done ? "text-[#166534]" : "text-[var(--color-text-primary)]"}`}>
        {displayText}
      </span>
    </div>
  )
}

// Named export kept for backward compat
export { ChecklistItem }
