

import { useState, useEffect } from "react"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/marketing-landing/components/ui/button"
import type { ClinicInfo, NavLink } from "@/marketing-landing/lib/clinic-data"

interface NavbarProps {
  clinic: ClinicInfo
  links: NavLink[]
  onBooking: () => void
}

export function Navbar({ clinic, links, onBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-card/95 shadow-sm backdrop-blur-md"
          : "bg-transparent"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          {clinic.logoUrl ? (
            <img
              src={clinic.logoUrl}
              alt={`${clinic.name} logo`}
              className="h-9 w-9 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                {clinic.logo.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-lg font-semibold tracking-tight text-foreground">
            {clinic.name}
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${clinic.phone}`}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            <span>{clinic.phone}</span>
          </a>
          <Button size="sm" className="rounded-full px-6" onClick={onBooking}>
            Book Appointment
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="border-t border-border bg-card px-6 pb-6 lg:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${clinic.phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Phone className="h-4 w-4" />
              <span>{clinic.phone}</span>
            </a>
            <Button
              className="mt-2 rounded-full"
              onClick={() => {
                setIsMobileOpen(false)
                onBooking()
              }}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
