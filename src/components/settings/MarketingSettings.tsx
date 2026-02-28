import { useState, useEffect } from "react";
import {
    Building2,
    Image as ImageIcon,
    MessageSquare,
    Search,
    Layout,
    Plus,
    Trash2,
    Save,
    Loader2,
    CheckCircle,
    Phone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/useSettings";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { TestimonialsSection } from "./TestimonialsSection";
import { GallerySection } from "./GallerySection";
import { useToast } from "@/hooks/use-toast";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SocialLink {
    platform: string;
    url: string;
}

interface Feature {
    title: string;
    description: string;
    icon: string;
}

interface WhyUsItem {
    title: string;
    description: string;
}

interface MarketingStat {
    label: string;
    value: string;
    symbol: string;
}

interface MarketingFields {
    hero_title?: string;
    hero_subtitle?: string;
    hero_description?: string;
    hero_image_url?: string;
    footer_text?: string;
    social_links?: SocialLink[];
    features?: Feature[];
    why_us?: WhyUsItem[];
    cta_text?: string;
    statistics?: MarketingStat[];
}

interface FormData {
    clinic_name: string;
    clinic_description: string;
    phone: string;
    email: string;
    address: string;
    logo_url: string;
    marketing_fields: MarketingFields;
}

export function MarketingSettings() {
    const { clinicSettings, updateClinicSettings, uploadImage, isLoading } = useSettings();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // Local state for all fields
    const [formData, setFormData] = useState<FormData>({
        clinic_name: "",
        clinic_description: "",
        phone: "",
        email: "",
        address: "",
        logo_url: "",
        marketing_fields: {
            features: [],
            statistics: [],
            why_us: [
                { title: "", description: "" },
                { title: "", description: "" },
                { title: "", description: "" },
                { title: "", description: "" }
            ]
        }
    });

    useEffect(() => {
        if (clinicSettings) {
            const marketing = (clinicSettings.marketing_fields as MarketingFields) || {};
            // Ensure exactly 4 why_us items exist
            const whyUs = marketing.why_us || [];
            while (whyUs.length < 4) whyUs.push({ title: "", description: "" });
            const finalWhyUs = whyUs.slice(0, 4);

            setFormData({
                clinic_name: clinicSettings.clinic_name || "",
                clinic_description: clinicSettings.clinic_description || "",
                phone: clinicSettings.phone || "",
                email: clinicSettings.email || "",
                address: clinicSettings.address || "",
                logo_url: clinicSettings.logo_url || "",
                marketing_fields: {
                    ...marketing,
                    why_us: finalWhyUs,
                    statistics: marketing.statistics || []
                },
            });
        }
    }, [clinicSettings]);

    const handleSave = async () => {
        if (!clinicSettings) return;
        setIsSaving(true);
        try {
            await updateClinicSettings({
                clinic_name: formData.clinic_name,
                clinic_description: formData.clinic_description,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                logo_url: formData.logo_url,
                marketing_fields: formData.marketing_fields,
            });
            toast({
                title: "Success",
                description: "Settings saved successfully."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpload = async (file: File, path: string) => {
        return await uploadImage(file, path);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-5xl">
            {/* Header with Save Button */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Marketing Page Settings</h2>
                    <p className="text-muted-foreground">Configure how your clinic appears to the public.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleSave} disabled={isSaving} className="px-6 h-10">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="hero" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 h-12">
                    <TabsTrigger value="hero" className="gap-2">Hero & About</TabsTrigger>
                    <TabsTrigger value="features" className="gap-2">Features</TabsTrigger>
                    <TabsTrigger value="testimonials" className="gap-2">Testimonials</TabsTrigger>
                    <TabsTrigger value="gallery" className="gap-2">Gallery</TabsTrigger>
                    <TabsTrigger value="contact" className="gap-2">Footer & Info</TabsTrigger>
                </TabsList>

                {/* HERO & ABOUT TAB */}
                <TabsContent value="hero" className="space-y-8 animate-in fade-in-50 duration-500">
                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Layout className="h-5 w-5 text-primary" />
                                Hero Section
                            </CardTitle>
                            <CardDescription>Introductory content for your main landing page.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hero_title">Hero Title</Label>
                                        <Input
                                            id="hero_title"
                                            placeholder="e.g. Specialized Medical Care"
                                            value={formData.marketing_fields.hero_title || ""}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                marketing_fields: { ...formData.marketing_fields, hero_title: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                                        <Input
                                            id="hero_subtitle"
                                            placeholder="e.g. Premium Private Healthcare"
                                            value={formData.marketing_fields.hero_subtitle || ""}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                marketing_fields: { ...formData.marketing_fields, hero_subtitle: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hero_description">Hero Description</Label>
                                        <Textarea
                                            id="hero_description"
                                            rows={4}
                                            placeholder="Enter the main introductory text..."
                                            value={formData.marketing_fields.hero_description || ""}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                marketing_fields: { ...formData.marketing_fields, hero_description: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <ImageUpload
                                        label="Hero Background/Image"
                                        value={formData.marketing_fields.hero_image_url || ""}
                                        onChange={(url) => setFormData({
                                            ...formData,
                                            marketing_fields: { ...formData.marketing_fields, hero_image_url: url }
                                        })}
                                        onRemove={() => setFormData({
                                            ...formData,
                                            marketing_fields: { ...formData.marketing_fields, hero_image_url: "" }
                                        })}
                                        uploadFn={(file) => handleUpload(file, "marketing")}
                                        aspectRatio="video"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>



                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layout className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">Clinic Statistics</CardTitle>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={(formData.marketing_fields.statistics || []).length >= 4}
                                    onClick={() => {
                                        const stats = formData.marketing_fields.statistics || [];
                                        if (stats.length >= 4) return;
                                        setFormData({
                                            ...formData,
                                            marketing_fields: {
                                                ...formData.marketing_fields,
                                                statistics: [...stats, { label: "", value: "", symbol: "none" }]
                                            }
                                        });
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Stat
                                </Button>
                            </div>
                            <CardDescription>Display key metrics (Max 4). Values are numeric with an optional symbol.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {(formData.marketing_fields.statistics || []).map((stat, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-lg bg-muted/30 border items-end group animate-in slide-in-from-left-2 duration-300">
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Value</Label>
                                            <Input
                                                placeholder="e.g. 15,000"
                                                value={stat.value}
                                                onChange={(e) => {
                                                    const stats = [...(formData.marketing_fields.statistics || [])];
                                                    stats[idx].value = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        marketing_fields: { ...formData.marketing_fields, statistics: stats }
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Symbol</Label>
                                            <Select
                                                value={stat.symbol}
                                                onValueChange={(val) => {
                                                    const stats = [...(formData.marketing_fields.statistics || [])];
                                                    stats[idx].symbol = val;
                                                    setFormData({
                                                        ...formData,
                                                        marketing_fields: { ...formData.marketing_fields, statistics: stats }
                                                    });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    <SelectItem value="+">+</SelectItem>
                                                    <SelectItem value="%">%</SelectItem>
                                                    <SelectItem value="-">-</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Label</Label>
                                            <Input
                                                placeholder="e.g. Happy Patients"
                                                value={stat.label}
                                                onChange={(e) => {
                                                    const stats = [...(formData.marketing_fields.statistics || [])];
                                                    stats[idx].label = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        marketing_fields: { ...formData.marketing_fields, statistics: stats }
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive mb-0.5"
                                        onClick={() => {
                                            const stats = (formData.marketing_fields.statistics || []).filter((_, i) => i !== idx);
                                            setFormData({
                                                ...formData,
                                                marketing_fields: { ...formData.marketing_fields, statistics: stats }
                                            });
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {(formData.marketing_fields.statistics || []).length === 0 && (
                                <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                                    No statistics added yet. Click "Add Stat" to get started.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FEATURES TAB */}
                <TabsContent value="features" className="space-y-8 animate-in fade-in-50 duration-500">
                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layout className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">Clinic Features</CardTitle>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const feats = formData.marketing_fields.features || [];
                                        setFormData({
                                            ...formData,
                                            marketing_fields: {
                                                ...formData.marketing_fields,
                                                features: [...feats, { title: "", description: "", icon: "Stethoscope" }]
                                            }
                                        });
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Feature
                                </Button>
                            </div>
                            <CardDescription>Highlight key characteristics or unique selling points.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {(formData.marketing_fields.features || []).map((feat, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-lg bg-muted/30 border items-start group">
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Title</Label>
                                                <Input
                                                    value={feat.title}
                                                    onChange={(e) => {
                                                        const feats = [...(formData.marketing_fields.features || [])];
                                                        feats[idx].title = e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            marketing_fields: { ...formData.marketing_fields, features: feats }
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Icon</Label>
                                                <Select
                                                    value={feat.icon}
                                                    onValueChange={(val) => {
                                                        const feats = [...(formData.marketing_fields.features || [])];
                                                        feats[idx].icon = val;
                                                        setFormData({
                                                            ...formData,
                                                            marketing_fields: { ...formData.marketing_fields, features: feats }
                                                        });
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Stethoscope">Stethoscope</SelectItem>
                                                        <SelectItem value="Shield">Shield</SelectItem>
                                                        <SelectItem value="Clock">Clock</SelectItem>
                                                        <SelectItem value="UserCheck">UserCheck</SelectItem>
                                                        <SelectItem value="Heart">Heart</SelectItem>
                                                        <SelectItem value="Star">Star</SelectItem>
                                                        <SelectItem value="Hospital">Hospital</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input
                                                value={feat.description}
                                                onChange={(e) => {
                                                    const feats = [...(formData.marketing_fields.features || [])];
                                                    feats[idx].description = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        marketing_fields: { ...formData.marketing_fields, features: feats }
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                            const feats = (formData.marketing_fields.features || []).filter((_, i) => i !== idx);
                                            setFormData({
                                                ...formData,
                                                marketing_fields: { ...formData.marketing_fields, features: feats }
                                            });
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-primary" />
                                Why Us Section
                            </CardTitle>
                            <CardDescription>Exactly 4 items highlighting why patients should choose you.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-2 gap-6">
                            {(formData.marketing_fields.why_us || []).map((item, idx) => (
                                <div key={idx} className="space-y-4 p-4 rounded-lg bg-muted/20 border">
                                    <h4 className="font-bold text-xs uppercase text-primary">Item {idx + 1}</h4>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={item.title}
                                            onChange={(e) => {
                                                const items = [...(formData.marketing_fields.why_us || [])];
                                                items[idx].title = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    marketing_fields: { ...formData.marketing_fields, why_us: items }
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={item.description}
                                            rows={2}
                                            onChange={(e) => {
                                                const items = [...(formData.marketing_fields.why_us || [])];
                                                items[idx].description = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    marketing_fields: { ...formData.marketing_fields, why_us: items }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TESTIMONIALS TAB */}
                <TabsContent value="testimonials" className="animate-in fade-in-50 duration-500">
                    <TestimonialsSection />
                </TabsContent>

                {/* GALLERY TAB */}
                <TabsContent value="gallery" className="animate-in fade-in-50 duration-500">
                    <GallerySection />
                </TabsContent>

                {/* INFO TAB */}
                <TabsContent value="contact" className="space-y-8 animate-in fade-in-50 duration-500">
                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                CTA Block
                            </CardTitle>
                            <CardDescription>The call-to-action block at the bottom of the page.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid md:grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="cta_text">CTA Button Text</Label>
                                    <Input
                                        id="cta_text"
                                        placeholder="e.g. Book Your Consultation"
                                        value={formData.marketing_fields.cta_text || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            marketing_fields: { ...formData.marketing_fields, cta_text: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Phone className="h-5 w-5 text-primary" />
                                Footer & Contact Information
                            </CardTitle>
                            <CardDescription>Manage your clinic profile and contact details.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="clinic_name">Clinic Name</Label>
                                        <Input
                                            id="clinic_name"
                                            value={formData.clinic_name}
                                            onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="public_phone">Public Phone</Label>
                                        <Input
                                            id="public_phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="public_email">Public Email</Label>
                                        <Input
                                            id="public_email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="public_address">Office Address</Label>
                                        <Textarea
                                            id="public_address"
                                            rows={4}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                    <ImageUpload
                                        label="Clinic Logo"
                                        value={formData.logo_url}
                                        onChange={(url) => setFormData({ ...formData, logo_url: url })}
                                        onRemove={() => setFormData({ ...formData, logo_url: "" })}
                                        uploadFn={(file) => handleUpload(file, "logos")}
                                        aspectRatio="square"
                                        className="max-w-[150px]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t">
                                <Label htmlFor="footer_text">Footer Bio Text</Label>
                                <Textarea
                                    id="footer_text"
                                    rows={3}
                                    placeholder="A short description for the footer..."
                                    value={formData.marketing_fields.footer_text || ""}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        marketing_fields: { ...formData.marketing_fields, footer_text: e.target.value }
                                    })}
                                />
                            </div>

                            {/* Social Links Manager */}
                            <div className="space-y-4 pt-6 border-t">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-sm">Social Media Links</h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const social = formData.marketing_fields.social_links || [];
                                            setFormData({
                                                ...formData,
                                                marketing_fields: {
                                                    ...formData.marketing_fields,
                                                    social_links: [...social, { platform: "Instagram", url: "" }]
                                                }
                                            });
                                        }}
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add Link
                                    </Button>
                                </div>
                                <div className="grid gap-3">
                                    {(formData.marketing_fields.social_links || []).map((link, idx) => (
                                        <div key={idx} className="flex gap-3 items-end">
                                            <div className="flex-1 space-y-1.5">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Platform</Label>
                                                <Input
                                                    placeholder="e.g. Facebook"
                                                    value={link.platform}
                                                    onChange={(e) => {
                                                        const social = [...(formData.marketing_fields.social_links || [])];
                                                        social[idx].platform = e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            marketing_fields: { ...formData.marketing_fields, social_links: social }
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-[2] space-y-1.5">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">URL</Label>
                                                <Input
                                                    placeholder="https://..."
                                                    value={link.url}
                                                    onChange={(e) => {
                                                        const social = [...(formData.marketing_fields.social_links || [])];
                                                        social[idx].url = e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            marketing_fields: { ...formData.marketing_fields, social_links: social }
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const social = [...(formData.marketing_fields.social_links || [])].filter((_, i) => i !== idx);
                                                    setFormData({
                                                        ...formData,
                                                        marketing_fields: { ...formData.marketing_fields, social_links: social }
                                                    });
                                                }}
                                                className="text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}
