import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type GalleryImage = {
  id?: number;
  src: string;
  alt: string;
};

export function GalleryModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [ownerMode, setOwnerMode] = useState(false);
  const [ownerToken, setOwnerToken] = useState('');
  const [newSrc, setNewSrc] = useState('');
  const [newAlt, setNewAlt] = useState('');

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json() as GalleryImage[];
          if (Array.isArray(data) && data.length > 0) {
            setGalleryImages(data);
          }
        }
      } catch {
        // Ignore fetch failures.
      }
    };

    if (open) {
      setOwnerMode(window.localStorage.getItem('ubtan-owner-mode') === 'true');
      setOwnerToken(window.localStorage.getItem('ubtan-owner-token') ?? '');
      loadGallery();
    }
  }, [open]);

  const handleAddImage = async (event: React.FormEvent) => {
    event.preventDefault();
    const src = newSrc.trim();
    const alt = newAlt.trim();
    if (!src || !alt) return;

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-owner-token': ownerToken },
        body: JSON.stringify({ src, alt }),
      });

      if (response.ok) {
        const created = await response.json() as GalleryImage;
        setGalleryImages((current) => [created, ...current]);
        setNewSrc('');
        setNewAlt('');
      } else {
        window.alert('Could not add the image. Try again.');
      }
    } catch {
      window.alert('Could not add the image. Try again.');
    }
  };

  const handleRemoveImage = async (imageId?: number) => {
    if (typeof imageId !== 'number') return;

    try {
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: 'DELETE',
        headers: { 'x-owner-token': ownerToken },
      });
      if (response.ok) {
        setGalleryImages((current) => current.filter((image) => image.id !== imageId));
      } else {
        window.alert('Could not remove the image. Try again.');
      }
    } catch {
      window.alert('Could not remove the image. Try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setActive(null); }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl border-primary/20 bg-card rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary font-normal">Our Work</DialogTitle>
          <DialogDescription className="font-light text-muted-foreground">
            A glimpse into the craftsmanship and care behind every UBTAN experience.
          </DialogDescription>
        </DialogHeader>

        {active === null ? (
          <>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {galleryImages.map((img, i) => (
                <div key={img.id ?? i} className="relative group overflow-hidden aspect-square">
                  <button onClick={() => setActive(i)} className="block w-full h-full">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />
                  </button>
                  {ownerMode && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-2 right-2 bg-background/80 px-2 py-1 text-[0.6rem] uppercase tracking-widest text-primary hover:bg-background"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {ownerMode && (
              <form onSubmit={handleAddImage} className="mt-6 space-y-3 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">Add Image</p>
                <Input
                  value={newSrc}
                  onChange={(event) => setNewSrc(event.target.value)}
                  placeholder="Image URL (e.g. /images/gallery-5.png)"
                  className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary"
                />
                <Input
                  value={newAlt}
                  onChange={(event) => setNewAlt(event.target.value)}
                  placeholder="Description (for accessibility)"
                  className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary"
                />
                <Button type="submit" className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
                  Add Image
                </Button>
              </form>
            )}
          </>
        ) : (
          <div className="mt-4">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={galleryImages[active].src}
                alt={galleryImages[active].alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm font-light text-muted-foreground">{galleryImages[active].alt}</p>
              <button
                onClick={() => setActive(null)}
                className="text-xs tracking-widest text-primary uppercase hover:underline"
              >
                Back to gallery
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
