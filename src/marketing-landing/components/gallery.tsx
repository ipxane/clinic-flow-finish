


import { useState } from "react"
import type { GalleryImage } from "@/marketing-landing/lib/clinic-data"

interface GalleryProps {
  images: GalleryImage[]
}

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <>
      <section id="gallery" className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Our Clinic
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              A Space Designed for Your Comfort
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Take a look at our modern facilities, designed to create a calm and
              welcoming environment for every patient.
            </p>
          </div>

          {/* Grid */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((img) => (
              <button
                key={img.src}
                onClick={() => setSelectedImage(img)}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={480}
                  height={360}
                  className="aspect-square md:aspect-video h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-label="Image lightbox"
        >
          <div className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1200}
              height={800}
              className="h-auto max-h-[85vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
