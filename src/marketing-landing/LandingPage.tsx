import { useState } from "react"
import { Navbar } from "@/marketing-landing/components/navbar"
import { Hero } from "@/marketing-landing/components/hero"
import { Services } from "@/marketing-landing/components/services"
import { WhyChooseUs } from "@/marketing-landing/components/why-choose-us"
import { Statistics } from "@/marketing-landing/components/statistics"
import { Testimonials } from "@/marketing-landing/components/testimonials"
import { Gallery } from "@/marketing-landing/components/gallery"
import { FinalCta } from "@/marketing-landing/components/final-cta"
import { Footer } from "@/marketing-landing/components/footer"
import { BookingModal } from "@/marketing-landing/components/booking-modal"
import { useMarketingSettings } from "@/hooks/useMarketingSettings"
import { Loader2 } from "lucide-react"
import {
  navLinks,
  trustPoints,
  stats as fallbackStats,
  galleryImages,
  availableDates,
} from "@/marketing-landing/lib/clinic-data"

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const openBooking = () => setBookingOpen(true)
  const {
    clinicSettings,
    schedule,
    services,
    testimonials,
    statistics,
    socialLinks,
    isLoading
  } = useMarketingSettings()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const marketing = (clinicSettings?.marketing_fields as any) || {}

  // Map settings to component props while keeping structure locked
  const clinicInfo = {
    name: clinicSettings?.clinic_name || "Clinic Name",
    tagline: marketing.hero_subtitle || "Professional Care",
    phone: clinicSettings?.phone || "",
    email: clinicSettings?.email || "",
    address: clinicSettings?.address || "",
    bookingUrl: "#book",
    logo: clinicSettings?.clinic_name?.split(' ')[0] || "Clinic",
    logoUrl: clinicSettings?.logo_url,
  }

  const heroContent = {
    headline: marketing.hero_title || "Your Health Deserves Personal Attention",
    description: marketing.hero_description || clinicSettings?.clinic_description || "Professional medical care centered on you.",
    primaryCta: "Book an Appointment",
    secondaryCta: "View Our Services",
    image: marketing.hero_image_url || null,
  }

  // Temporary console verification for strict data binding requirement


  const ctaContent = {
    headline: marketing.cta_title || "Ready to Experience Better Healthcare?",
    description: marketing.cta_description || "Take the first step toward personalized, attentive medical care. Our team is ready to welcome you.",
    buttonText: marketing.cta_text || "Book Your Appointment",
    phone: clinicInfo.phone,
  }

  const footerContent = {
    description: marketing.footer_text || "Providing compassionate, personalized healthcare in a modern, welcoming environment.",
    copyright: `\u00A9 ${new Date().getFullYear()} ${clinicInfo.name}. All rights reserved.`,
    schedule: schedule || [],
    socialLinks: socialLinks || []
  }

  // Use dynamic Why Us points if available, otherwise fallback
  const whyUsPoints = marketing.why_us && marketing.why_us.length > 0
    ? marketing.why_us.map((p: any, i: number) => ({
      ...p,
      icon: trustPoints[i]?.icon || "shield-check" // Keep original icons
    }))
    : trustPoints

  // Use dynamic Gallery images
  const gallery = clinicSettings?.gallery_images && clinicSettings.gallery_images.length > 0
    ? clinicSettings.gallery_images.map((src: string, i: number) => ({ src, alt: `Clinic gallery ${i + 1}` }))
    : galleryImages

  // Use dynamic stats if available, otherwise fallback
  const finalStats = statistics && statistics.length > 0
    ? statistics.map((s: any) => ({
      ...s,
      // Map 'symbol' back to 'suffix' for the component to use
      suffix: s.symbol !== "none" ? s.symbol : ""
    }))
    : fallbackStats

  return (
    <main>
      <Navbar clinic={clinicInfo} links={navLinks} onBooking={openBooking} />
      <Hero content={heroContent} clinic={clinicInfo} onBooking={openBooking} />
      <Services services={services} />
      <WhyChooseUs points={whyUsPoints} />
      <Statistics stats={finalStats} />
      <Testimonials testimonials={testimonials as any} />
      <Gallery images={gallery} />
      <FinalCta
        content={ctaContent}
        clinic={clinicInfo}
        onBooking={openBooking}
      />
      <Footer clinic={clinicInfo} content={footerContent as any} />

      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        services={services}
        availableDates={availableDates}
      />
    </main>
  )
}

