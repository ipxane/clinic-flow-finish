import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/marketing-landing/components/ui/button"
import type { CtaContent, ClinicInfo } from "@/marketing-landing/lib/clinic-data"

interface FinalCtaProps {
  content: CtaContent
  clinic: ClinicInfo
  onBooking: () => void
}

export function FinalCta({ content, clinic, onBooking }: FinalCtaProps) {
  return (
    <section id="book" className="bg-primary py-24 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
          {content.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80">
          {content.description}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full px-8 text-base font-semibold"
            onClick={onBooking}
          >
            {content.buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <a
            href={`tel:${content.phone || clinic.phone}`}
            className="flex items-center gap-2 text-sm font-medium text-primary-foreground/90 transition-colors hover:text-primary-foreground"
          >
            <Phone className="h-4 w-4" />
            <span>{content.phone || clinic.phone}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
