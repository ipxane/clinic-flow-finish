import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Linkedin, Globe } from "lucide-react"
import type { ClinicInfo, FooterContent } from "@/marketing-landing/lib/clinic-data"

interface ExtendedFooterContent extends FooterContent {
  schedule?: any[];
  socialLinks?: any[];
}

interface FooterProps {
  clinic: ClinicInfo
  content: ExtendedFooterContent
}

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <Instagram className="h-5 w-5" />;
  if (p.includes('facebook')) return <Facebook className="h-5 w-5" />;
  if (p.includes('twitter') || p === 'x') return <Twitter className="h-5 w-5" />;
  if (p.includes('linkedin')) return <Linkedin className="h-5 w-5" />;
  return <Globe className="h-5 w-5" />;
};

export function Footer({ clinic, content }: FooterProps) {
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const getWorkingHoursText = (day: any) => {
    if (!day.is_working) return "Closed";
    if (!day.periods || day.periods.length === 0) return "Closed";

    let minStart = day.periods[0].start_time;
    let maxEnd = day.periods[0].end_time;

    day.periods.forEach((p: any) => {
      if (p.start_time < minStart) minStart = p.start_time;
      if (p.end_time > maxEnd) maxEnd = p.end_time;
    });

    if (minStart.startsWith('00:00') && (maxEnd.startsWith('23:59') || maxEnd.startsWith('24:00'))) {
      return "24 Hours";
    }

    return `${formatTime(minStart)} \u2013 ${formatTime(maxEnd)}`;
  };

  return (
    <footer id="contact" className="bg-card py-16 lg:py-20 border-t">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand & Social */}
          <div>
            <div className="flex items-center gap-2">
              {clinic.logoUrl ? (
                <img
                  src={clinic.logoUrl}
                  alt={`${clinic.name} logo`}
                  className="h-9 w-9 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">
                    {clinic.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-lg font-semibold text-foreground">
                {clinic.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {content.description}
            </p>

            {/* Social Links */}
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-4">
                {content.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="sr-only">{link.platform}</span>
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Contact
            </h3>
            <div className="mt-4 flex flex-col gap-4">
              <a
                href={`tel:${clinic.phone}`}
                className="flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{clinic.phone}</span>
              </a>
              <a
                href={`mailto:${clinic.email}`}
                className="flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{clinic.email}</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{clinic.address}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Hours
            </h3>
            <div className="mt-4 flex flex-col gap-4">
              {content.schedule && content.schedule.length > 0 ? (
                content.schedule.map((day) => {
                  const hoursText = getWorkingHoursText(day);
                  return (
                    <div key={day.id} className="flex justify-between items-start text-sm text-muted-foreground">
                      <span>{day.day_name}</span>
                      <span>{hoursText}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start text-sm text-muted-foreground">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between items-start text-sm text-muted-foreground">
                    <span>Saturday</span>
                    <span>9:00 AM - 3:00 PM</span>
                  </div>
                  <div className="flex justify-between items-start text-sm text-muted-foreground">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          {content.copyright}
        </div>
      </div>
    </footer>
  )
}
