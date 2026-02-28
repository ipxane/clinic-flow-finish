

import { useEffect, useRef, useState } from "react"
import type { Stat } from "@/marketing-landing/lib/clinic-data"

interface StatsProps {
  stats: Stat[]
}

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          // Extract numeric part
          const numericMatch = value.match(/[\d,]+/)
          if (!numericMatch) {
            setDisplay(value)
            return
          }
          const target = parseInt(numericMatch[0].replace(/,/g, ""), 10)
          const prefix = value.slice(0, value.indexOf(numericMatch[0]))
          const suffix = value.slice(
            value.indexOf(numericMatch[0]) + numericMatch[0].length
          )
          const duration = 1800
          const startTime = performance.now()

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(eased * target)
            setDisplay(
              `${prefix}${current.toLocaleString()}${suffix}`
            )
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>{display}</span>
}

export function Statistics({ stats }: StatsProps) {
  // Determine grid columns dynamically
  const gridCols = stats.length === 1 ? "grid-cols-1"
    : stats.length === 2 ? "grid-cols-2"
      : stats.length === 3 ? "grid-cols-1 md:grid-cols-3"
        : "grid-cols-2 lg:grid-cols-4";

  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className={`flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 md:grid md:gap-8 md:pb-0 hide-scrollbar ${gridCols}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center snap-center shrink-0 w-[70vw] md:w-auto">
              <div className="text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
                <AnimatedNumber value={stat.value} />
                {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
              </div>
              <p className="mt-2 text-sm font-medium text-secondary-foreground md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
