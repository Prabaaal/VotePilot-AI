"use client"
import { useEffect, useState } from "react"

export function ReadinessRing({ score }: { score: number }) {
  const [offset, setOffset] = useState(100)

  useEffect(() => {
    // Animate from 0 to score (out of 100)
    // small delay to ensure animation plays on mount
    const timer = setTimeout(() => {
      setOffset(100 - score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  let color = "#22C55E" // green
  if (score <= 30) color = "#EF4444" // red
  else if (score <= 60) color = "#F59E0B" // amber

  return (
    <div className="relative flex items-center justify-center w-[120px] h-[120px] sm:w-[160px] sm:h-[160px]">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="transparent"
          stroke="#E5E0D8"
          strokeWidth="12"
        />
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="transparent"
          stroke={color}
          strokeWidth="12"
          strokeDasharray="276.46" /* 2 * PI * 44 ≈ 276.46 */
          strokeDashoffset={(276.46 * offset) / 100}
          className="transition-all duration-[1200ms] ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-[var(--font-heading)] font-extrabold text-[28px] sm:text-[36px] text-[#1A1A2E] leading-none">
          {score}
        </span>
        <span className="font-[var(--font-body)] text-[12px] text-[#9CA3AF] mt-1 uppercase tracking-widest font-semibold">
          Score
        </span>
      </div>
    </div>
  )
}
