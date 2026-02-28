
import { Star } from "lucide-react"
import type { Testimonial } from "@/marketing-landing/lib/clinic-data"

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  // Determine grid columns dynamically based on number of testimonials
  const gridCols = testimonials.length === 1 ? "max-w-xl mx-auto md:grid-cols-1"
    : testimonials.length === 2 ? "max-w-4xl mx-auto md:grid-cols-2"
      : testimonials.length === 3 ? "md:grid-cols-3"
        : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <section id="testimonials" className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            What Our Patients Say
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Real experiences from patients who trust us with their health and
            well-being.
          </p>
        </div>

        {/* Cards */}
        <div className={`mt-16 flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:gap-8 md:pb-0 hide-scrollbar ${gridCols}`}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col flex-shrink-0 w-[85vw] snap-center md:w-auto h-full rounded-2xl border border-border bg-background p-8 shadow-sm"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                      }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {`"${t.quote}"`}
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center overflow-hidden border border-primary/10">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-primary">{t.name.charAt(0)}</span>
                    )}
                  </div>
                  {!t.image && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
