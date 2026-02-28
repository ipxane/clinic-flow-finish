import {
  ShieldCheck,
  Clock,
  Building2,
  HeartHandshake,
} from "lucide-react"
import type { TrustPoint } from "@/marketing-landing/lib/clinic-data"

const iconMap: Record<string, React.ElementType> = {
  "shield-check": ShieldCheck,
  clock: Clock,
  "building-2": Building2,
  "heart-handshake": HeartHandshake,
}

interface WhyChooseUsProps {
  points: TrustPoint[]
}

export function WhyChooseUs({ points }: WhyChooseUsProps) {
  return (
    <section id="why-us" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Why Choose Us
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Healthcare Built Around You
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            We combine medical expertise with genuine compassion to deliver an
            experience that puts you first.
          </p>
        </div>

        {/* Points */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => {
            const IconComponent = iconMap[point.icon] || ShieldCheck
            return (
              <div key={point.title} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
