// ============================================
// CLINIC DATA — All dynamic content in one place
// Replace with CMS or database fetch as needed
// ============================================

export interface ClinicInfo {
  name: string
  tagline: string
  phone: string
  email: string
  address: string
  bookingUrl: string
  logo: string
  logoUrl?: string | null
}

export interface NavLink {
  label: string
  href: string
}

export interface HeroContent {
  headline: string
  description: string
  primaryCta: string
  secondaryCta: string
  image: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  duration: string
  price: string
}

export interface TrustPoint {
  title: string
  description: string
  icon: string
}

export interface Stat {
  value: string
  label: string
  suffix?: string
}

export interface Testimonial {
  name: string
  quote: string
  image: string
  role: string
  rating: number
}

export interface GalleryImage {
  src: string
  alt: string
}

export interface CtaContent {
  headline: string
  description: string
  buttonText: string
  phone?: string
}

export interface FooterContent {
  description: string
  copyright: string
}

// --- Booking-specific types ---

export interface Period {
  id: string
  label: string // dynamic label from backend, e.g. "Morning", "Late Afternoon"
  description?: string // optional availability hint, e.g. "3 slots remaining"
  available: boolean
}

export interface AvailableDate {
  date: string // ISO date string e.g. "2026-03-02"
  periods: Period[]
}

// --- Data ---

export const clinicInfo: ClinicInfo = {
  name: "Elara Medical",
  tagline: "Premium Private Healthcare",
  phone: "+1 (555) 234-5678",
  email: "hello@elaramedical.com",
  address: "128 Greenview Boulevard, Suite 200, San Francisco, CA 94102",
  bookingUrl: "#book",
  logo: "Elara",
}

export const navLinks: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
]

export const heroContent: HeroContent = {
  headline: "Your Health Deserves Personal Attention",
  description:
    "Experience healthcare the way it should be — thoughtful, unhurried, and centered on you. Our expert physicians provide premium, personalized care in a calm, modern environment.",
  primaryCta: "Book an Appointment",
  secondaryCta: "View Our Services",
  image: "/images/hero-clinic.jpg",
}

export const services: Service[] = [
  {
    id: "general-medicine",
    title: "General Medicine",
    description:
      "Comprehensive health assessments, preventive screenings, and management of chronic conditions with a personalized approach.",
    icon: "stethoscope",
    duration: "30 min",
    price: "$120",
  },
  {
    id: "cardiology",
    title: "Cardiology",
    description:
      "Advanced cardiac diagnostics including ECG, stress testing, and ongoing heart health monitoring by board-certified specialists.",
    icon: "heart-pulse",
    duration: "45 min",
    price: "$250",
  },
  {
    id: "dermatology",
    title: "Dermatology",
    description:
      "Expert skin care from acne and eczema treatment to cosmetic consultations and mole screenings, all under one roof.",
    icon: "scan-face",
    duration: "30 min",
    price: "$180",
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    description:
      "Gentle, family-friendly care for infants, children, and adolescents with a focus on developmental milestones and wellness.",
    icon: "baby",
    duration: "30 min",
    price: "$100",
  },
  {
    id: "orthopedics",
    title: "Orthopedics",
    description:
      "Diagnosis and treatment of bone, joint, and muscle conditions, from sports injuries to chronic pain management.",
    icon: "bone",
    duration: "40 min",
    price: "$200",
  },
  {
    id: "diagnostics",
    title: "Diagnostics",
    description:
      "State-of-the-art lab testing and imaging services including blood work, X-rays, and ultrasounds with rapid results.",
    icon: "microscope",
    duration: "60 min",
    price: "$300",
  },
]

export const trustPoints: TrustPoint[] = [
  {
    title: "Board-Certified Physicians",
    description:
      "Every doctor on our team holds current board certifications and participates in ongoing medical education.",
    icon: "shield-check",
  },
  {
    title: "Same-Day Appointments",
    description:
      "We respect your time. Walk-in availability and same-day bookings mean you never have to wait when it matters.",
    icon: "clock",
  },
  {
    title: "Modern Facilities",
    description:
      "Our clinic features the latest medical equipment and a thoughtfully designed space for your comfort.",
    icon: "building-2",
  },
  {
    title: "Patient-Centered Care",
    description:
      "We listen first. Every treatment plan is tailored to your unique health goals and lifestyle.",
    icon: "heart-handshake",
  },
]

export const stats: Stat[] = [
  { value: "15,000+", label: "Patients Treated" },
  { value: "20+", label: "Expert Physicians" },
  { value: "98%", label: "Patient Satisfaction" },
  { value: "12", label: "Years of Excellence" },
]

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    quote:
      "From the moment I walked in, I felt truly cared for. The staff was warm, the facility was pristine, and my doctor took the time to listen to every concern. This is healthcare done right.",
    image: "/images/testimonial-1.jpg",
    role: "Patient since 2019",
    rating: 5,
  },
  {
    name: "James Thornton",
    quote:
      "After years of feeling rushed at other clinics, Elara Medical was a breath of fresh air. My cardiologist explained everything clearly and followed up personally after every visit.",
    image: "/images/testimonial-2.jpg",
    role: "Patient since 2021",
    rating: 5,
  },
  {
    name: "Emily Chen",
    quote:
      "I switched my entire family to Elara Medical. The pediatric team is incredible with my kids, and the online booking system makes scheduling effortless. Highly recommended.",
    image: "/images/testimonial-3.jpg",
    role: "Patient since 2020",
    rating: 5,
  },
]

export const galleryImages: GalleryImage[] = [
  { src: "/images/hero-clinic.jpg", alt: "Clinic reception area" },
  { src: "/images/gallery-1.jpg", alt: "Consultation room" },
  { src: "/images/gallery-2.jpg", alt: "Diagnostics laboratory" },
  { src: "/images/gallery-3.jpg", alt: "Patient waiting area" },
  { src: "/images/gallery-4.jpg", alt: "Examination room" },
  { src: "/images/gallery-5.jpg", alt: "Medical supplies" },
  { src: "/images/gallery-6.jpg", alt: "Clinic exterior" },
]

export const ctaContent: CtaContent = {
  headline: "Ready to Experience Better Healthcare?",
  description:
    "Take the first step toward personalized, attentive medical care. Our team is ready to welcome you.",
  buttonText: "Book Your Appointment",
}

export const footerContent: FooterContent = {
  description:
    "Providing compassionate, personalized healthcare in a modern, welcoming environment. Your health is our .",
  copyright: `\u00A9 ${new Date().getFullYear()} Elara Medical. All rights reserved.`,
}

// -------------------------------------------------------------------
// Generate dynamic available dates + periods (simulates backend data)
// In production, this would be an API call.
// -------------------------------------------------------------------

const PERIOD_TEMPLATES: Omit<Period, "available" | "description">[][] = [
  // Variation A — 3 periods
  [
    { id: "morning", label: "Morning (8:00 AM - 12:00 PM)" },
    { id: "afternoon", label: "Afternoon (12:00 PM - 4:00 PM)" },
    { id: "evening", label: "Evening (4:00 PM - 7:00 PM)" },
  ],
  // Variation B — 2 periods
  [
    { id: "first-half", label: "Morning (8:00 AM - 12:00 PM)" },
    { id: "second-half", label: "Afternoon (12:00 PM - 5:00 PM)" },
  ],
  // Variation C — 4 periods
  [
    { id: "early-morning", label: "Early Morning (8:00 AM - 10:00 AM)" },
    { id: "late-morning", label: "Late Morning (10:00 AM - 12:00 PM)" },
    { id: "early-afternoon", label: "Early Afternoon (1:00 PM - 3:00 PM)" },
    { id: "late-afternoon", label: "Late Afternoon (3:00 PM - 5:00 PM)" },
  ],
]

const AVAILABILITY_HINTS = [
  "5 slots remaining",
  "3 slots remaining",
  "2 slots remaining",
  "Limited availability",
  "Good availability",
  undefined,
]

function generateAvailableDates(): AvailableDate[] {
  const dates: AvailableDate[] = []
  const today = new Date()
  let current = new Date(today)
  current.setDate(current.getDate() + 1)

  while (dates.length < 14) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) {
      const iso = current.toISOString().split("T")[0]
      const seed = current.getDate() + current.getMonth() * 31

      // Pick a period template based on date
      const template = PERIOD_TEMPLATES[seed % PERIOD_TEMPLATES.length]

      const periods: Period[] = template.map((p, i) => {
        const availSeed = (seed + i * 7) % 5
        const isAvailable = availSeed !== 0 // ~80% of periods available
        return {
          ...p,
          available: isAvailable,
          description: isAvailable
            ? AVAILABILITY_HINTS[(seed + i) % AVAILABILITY_HINTS.length]
            : "Fully booked",
        }
      })

      dates.push({ date: iso, periods })
    }
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export const availableDates: AvailableDate[] = generateAvailableDates()
