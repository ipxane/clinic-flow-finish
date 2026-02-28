import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClinicSettings, Testimonial } from "./useSettings";
import { Service } from "./useServices";

// Interface for the Service shape expected by Marketing UI
export interface MarketingService {
    id: string;
    title: string;
    description: string;
    icon: string;
    duration: string;
    price: string;
}

// Interface for the Testimonial shape expected by Marketing UI
export interface MarketingTestimonial {
    name: string;
    quote: string;
    image: string;
    role: string;
    rating: number;
}

export function useMarketingSettings() {
    const [clinicSettings, setClinicSettings] = useState<ClinicSettings | null>(null);
    const [schedule, setSchedule] = useState<any[]>([]);
    const [services, setServices] = useState<MarketingService[]>([]);
    const [testimonials, setTestimonials] = useState<MarketingTestimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                // Fetch clinic settings
                const { data: settingsData } = await supabase
                    .from("clinic_settings")
                    .select("*")
                    .maybeSingle();

                let currentSettings: ClinicSettings | null = null;
                if (settingsData) {
                    currentSettings = settingsData as any as ClinicSettings;
                    setClinicSettings(currentSettings);
                }

                // Fetch schedule
                const { data: daysData } = await supabase
                    .from("working_days")
                    .select("*")
                    .order("day_of_week");

                const { data: periodsData } = await supabase
                    .from("working_periods")
                    .select("*")
                    .order("start_time");

                if (daysData) {
                    const daysWithPeriods = daysData.map(day => ({
                        ...day,
                        periods: (periodsData || []).filter(p => p.working_day_id === day.id)
                    }));
                    setSchedule(daysWithPeriods);
                } else {
                    setSchedule([]);
                }

                // If clinic features are defined in settings, use them. Otherwise, fallback to services table.
                const marketingFeatures = (currentSettings?.marketing_fields as any)?.features;

                if (marketingFeatures && Array.isArray(marketingFeatures) && marketingFeatures.length > 0) {
                    const mappedFeatures: MarketingService[] = marketingFeatures.map((f: any, idx: number) => ({
                        id: `feat-${idx}`,
                        title: f.title,
                        description: f.description || "",
                        icon: f.icon || "Stethoscope",
                        duration: "", // Not needed for features
                        price: ""     // Not needed for features
                    }));
                    setServices(mappedFeatures);
                } else {
                    // Fallback to services table
                    const { data: servicesData } = await supabase
                        .from("services")
                        .select("*")
                        .eq("is_active", true)
                        .order("name");

                    if (servicesData) {
                        const mappedServices: MarketingService[] = servicesData.map(s => ({
                            id: s.id,
                            title: s.name,
                            description: s.description || "",
                            icon: s.category?.toLowerCase() === "surgery" ? "scissors" : "stethoscope",
                            duration: `${s.duration} min`,
                            price: `$${s.price}`
                        }));
                        setServices(mappedServices);
                    }
                }

                // Fetch testimonials and map to marketing format
                const { data: testimonialsData } = await (supabase as any)
                    .from("testimonials")
                    .select("*")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(4); // Limit to 4 as per requirements

                if (testimonialsData) {
                    const mappedTestimonials: MarketingTestimonial[] = testimonialsData.map(t => ({
                        name: t.author_name,
                        quote: t.content,
                        image: t.image_url || null, // Allow null for fallback circular avatar
                        role: t.author_role || "Patient",
                        rating: t.rating
                    }));
                    setTestimonials(mappedTestimonials);
                }
            } catch (error) {
                console.error("Error fetching marketing data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const statistics = clinicSettings?.marketing_fields?.statistics || [];
    const socialLinks = clinicSettings?.marketing_fields?.social_links || [];

    return {
        clinicSettings,
        schedule,
        services,
        testimonials,
        statistics,
        socialLinks,
        isLoading,
    };
}
