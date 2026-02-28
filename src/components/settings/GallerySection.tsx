import { useState } from "react";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/hooks/useSettings";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function GallerySection() {
    const { clinicSettings, updateClinicSettings, uploadImage } = useSettings();

    const galleryImages = clinicSettings?.gallery_images || [];

    const handleAddImage = async (url: string) => {
        if (!url || galleryImages.length >= 12) return;

        const updatedImages = [...galleryImages, url];
        await updateClinicSettings({ gallery_images: updatedImages });
    };

    const handleDeleteImage = async (url: string) => {
        const updatedImages = galleryImages.filter((img) => img !== url);
        await updateClinicSettings({ gallery_images: updatedImages });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Gallery Settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Showcase your clinic (Max 12 images). {galleryImages.length}/12 used.
                    </p>
                </div>
                {galleryImages.length < 12 && (
                    <div className="w-[200px]">
                        <ImageUpload
                            onChange={handleAddImage}
                            onRemove={() => { }}
                            uploadFn={(file) => uploadImage(file, "gallery")}
                            aspectRatio="video"
                        />
                    </div>
                )}
            </div>

            {galleryImages.length === 0 ? (
                <Card className="border-dashed shadow-none bg-muted/10">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mb-2 opacity-10" />
                        <p className="text-sm font-medium">No images in your gallery yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {galleryImages.map((url, index) => (
                        <div key={index} className="group relative aspect-video rounded-xl overflow-hidden bg-muted border shadow-sm transition-all hover:shadow-md">
                            <img
                                src={url}
                                alt={`Gallery image ${index + 1}`}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-10 w-10 shadow-xl rounded-full scale-75 group-hover:scale-100 transition-transform"
                                    onClick={() => handleDeleteImage(url)}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
