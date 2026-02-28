import {
  Stethoscope,
  HeartPulse,
  ScanFace,
  Baby,
  Bone,
  Microscope,
  Clock,
  DollarSign,
  Shield,
  UserCheck,
  Heart,
  Star,
  Hospital,
  ShieldCheck,
} from "lucide-react"
import type { Service } from "@/marketing-landing/lib/clinic-data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
  "scan-face": ScanFace,
  baby: Baby,
  bone: Bone,
  microscope: Microscope,
  shield: Shield,
  usercheck: UserCheck,
  heart: Heart,
  star: Star,
  hospital: Hospital,
  shieldcheck: ShieldCheck,
  clock: Clock,
}

interface ServicesProps {
  services: Service[]
}

export function Services({ services }: ServicesProps) {
  const count = services.length

  let gridContainerClass = "mt-12 lg:mt-16 mx-auto grid gap-6 lg:gap-8"
  if (count === 1) {
    gridContainerClass += " grid-cols-1 max-w-md"
  } else if (count === 2) {
    gridContainerClass += " grid-cols-1 sm:grid-cols-2 max-w-4xl"
  } else if (count === 3) {
    gridContainerClass += " grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl"
  } else if (count === 4) {
    gridContainerClass += " grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl"
  } else if (count === 5) {
    gridContainerClass += " grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 max-w-6xl"
  } else {
    gridContainerClass += " grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl"
  }

  return (
    <section id="services" className="bg-card py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Services
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Medical Expertise
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            From routine check-ups to specialized treatments, we offer a wide
            range of medical services tailored to your needs.
          </p>
        </div>

        {/* Grid */}
        <div className={gridContainerClass}>
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon.toLowerCase()] || Stethoscope
            return (
              <div
                key={service.id}
                className={cn(
                  "group flex flex-col rounded-2xl border border-border bg-background p-6 lg:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg",
                  count === 5 && index < 3 && "lg:col-span-2",
                  count === 5 && index === 3 && "lg:col-start-2 lg:col-span-2",
                  count === 5 && index === 4 && "lg:col-start-4 lg:col-span-2"
                )}
              >
                <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                {(service.duration || service.price) && (
                  <div className="mt-6 flex items-center gap-4 border-t border-border pt-5">
                    {service.duration && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration}
                      </span>
                    )}
                    {service.price && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <DollarSign className="h-3.5 w-3.5" />
                        {service.price}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
