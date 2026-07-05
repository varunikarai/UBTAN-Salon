import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const GALLERY_IMAGES = [
  { src: '/images/gallery-1.png', alt: 'Luxury manicure detail' },
  { src: '/images/gallery-2.png', alt: 'Bespoke makeup artistry' },
  { src: '/images/gallery-3.png', alt: 'Hair styling craftsmanship' },
  { src: '/images/gallery-4.png', alt: 'Ubtan skincare ritual' },
];

export function GalleryModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

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
          <div className="grid grid-cols-2 gap-4 mt-4">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="relative group overflow-hidden aspect-square"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={GALLERY_IMAGES[active].src}
                alt={GALLERY_IMAGES[active].alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm font-light text-muted-foreground">{GALLERY_IMAGES[active].alt}</p>
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
