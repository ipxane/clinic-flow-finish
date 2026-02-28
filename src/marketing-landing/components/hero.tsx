
import { Button } from "@/marketing-landing/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { HeroContent, ClinicInfo } from "@/marketing-landing/lib/clinic-data"

interface HeroProps {
  content: HeroContent
  clinic: ClinicInfo
  onBooking: () => void
}

export function Hero({ content, clinic, onBooking }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-medium tracking-wide text-secondary-foreground">
                {clinic.tagline}
              </span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {content.headline}
            </h1>

            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="rounded-full px-8 text-base"
                onClick={onBooking}
              >
                {content.primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base"
              >
                <a href="#services">{content.secondaryCta}</a>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative mx-4 sm:mx-0">
            <div className="overflow-hidden rounded-2xl shadow-xl bg-muted/20 flex items-center justify-center min-h-[520px]">
              {content.image && content.image !== "/images/hero-clinic.jpg" ? (
                <img
                  src={content.image}
                  alt="Modern medical clinic"
                  width={720}
                  height={520}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-full bg-primary/10 border-4 border-primary/20">
                  <span className="text-6xl font-bold text-primary">
                    {clinic.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            {/* Floating accent — hidden on small screens to prevent overflow */}
            <div className="absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-2xl bg-primary/10 sm:block" aria-hidden="true" />
            <div className="absolute -top-4 -right-4 hidden h-16 w-16 rounded-full bg-accent sm:block" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
