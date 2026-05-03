import { Check } from "lucide-react"

type Props = {
  item: string
  done?: boolean
}

export function ChecklistItem({ item, done = false }: Props) {
  return (
    <div className={`checklist-item ${done ? "done" : ""}`}>
      <div className="checklist-checkbox">
        {done && <Check className="w-4 h-4 text-white check-animate" />}
      </div>
      <span className={`font-medium ${done ? "text-[#166534]" : "text-[var(--color-text-primary)]"}`}>
        {item}
      </span>
    </div>
  )
}
