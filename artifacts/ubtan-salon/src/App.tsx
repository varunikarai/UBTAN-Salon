import { useEffect, useState } from 'react';
import { BookingModal } from './components/BookingModal';
import { GalleryModal } from './components/GalleryModal';
import { ReviewModal } from './components/ReviewModal';
import { ScrollReveal } from './components/ScrollReveal';
import { useReturningVisitor } from './hooks/useReturningVisitor';

type ServiceItem = {
  id?: number;
  title: string;
  description: string;
};

type ReviewItem = {
  id?: number;
  name: string;
  body: string;
  rating: number;
};

type GalleryItem = {
  id?: number;
  src: string;
  alt: string;
};

const defaultServices: ServiceItem[] = [
  { title: 'Hair Architecture', description: 'Precision cuts, bespoke coloring, and restorative rituals tailored to your hair profile.' },
  { title: 'Skin Radiance', description: 'Clinical facials and luminous treatments designed for a polished glow.' },
  { title: 'Bespoke Makeup', description: 'Modern glamour and soft enhancement for any occasion.' },
  { title: 'Hands & Feet', description: 'Spa-grade manicures and pedicures with calm, elevated comfort.' }
];

export default function App() {
  const [showReviews, setShowReviews] = useState(false);
  const [ownerMode, setOwnerMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('ubtan-owner-mode') === 'true';
  });
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const isReturningVisitor = useReturningVisitor();

  const handleOwnerAccess = () => {
    const password = window.prompt('Enter owner access code');
    if (password === 'ubtan2026') {
      setOwnerMode(true);
    } else if (password) {
      window.alert('Access denied');
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [servicesRes, reviewsRes, galleryRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/reviews'),
          fetch('/api/gallery'),
        ]);

        if (servicesRes.ok) {
          const data = await servicesRes.json() as ServiceItem[];
          if (Array.isArray(data) && data.length > 0) {
            setServices(data);
          }
        }

        if (reviewsRes.ok) {
          const data = await reviewsRes.json() as ReviewItem[];
          if (Array.isArray(data)) {
            setReviews(data);
          }
        }

        if (galleryRes.ok) {
          const data = await galleryRes.json() as GalleryItem[];
          if (Array.isArray(data)) {
            setGalleryItems(data);
          }
        }
      } catch {
        // Fall back to defaults if the API is unavailable.
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('ubtan-owner-mode', ownerMode ? 'true' : 'false');
  }, [ownerMode]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isOwnerShortcut = (event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === 'o';
      if (isOwnerShortcut) {
        event.preventDefault();
        handleOwnerAccess();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleAddService = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newServiceTitle.trim();
    const description = newServiceDescription.trim();

    if (!title || !description) return;

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const created = await response.json() as ServiceItem;
        setServices((current) => [created, ...current]);
        setNewServiceTitle('');
        setNewServiceDescription('');
      }
    } catch {
      // Ignore failed saves.
    }
  };

  const handleRemoveService = async (serviceId?: number) => {
    if (typeof serviceId !== 'number') return;

    try {
      const response = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
      if (response.ok) {
        setServices((current) => current.filter((service) => service.id !== serviceId));
      }
    } catch {
      // Ignore failed deletes.
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <nav className="floating-panel fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-background/75 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <div className="text-2xl font-serif text-primary tracking-widest uppercase">UBTAN</div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-light tracking-wide text-muted-foreground">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#gallery" className="hover:text-primary transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <GalleryModal>
              <button className="flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 border border-primary/30 text-primary text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Gallery
              </button>
            </GalleryModal>
            <BookingModal>
              <button className="flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300">
                Book Now
              </button>
            </BookingModal>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-bg.png" alt="Luxury Salon Interior" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_55%)]" />
          <div className="pointer-events-none absolute left-8 top-24 h-40 w-40 rounded-full border border-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-16 right-8 h-56 w-56 rounded-full border border-primary/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto mt-20 max-w-4xl px-6 text-center">
          <ScrollReveal>
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block">Ladies-Only Premium Salon</span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 text-foreground font-medium">UBTAN</h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="mb-8 text-xl font-serif italic text-muted-foreground md:text-2xl">“Blossom into a new u...”</p>
          </ScrollReveal>
          <ScrollReveal delay={500}>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground/80">
              <span className="rounded-full border border-primary/20 px-4 py-2">Private consultations</span>
              <span className="rounded-full border border-primary/20 px-4 py-2">Quiet comfort</span>
              <span className="rounded-full border border-primary/20 px-4 py-2">Luxury rituals</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <BookingModal>
              <button className="px-8 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase shadow-[0_16px_40px_rgba(212,175,55,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90">
                Experience Luxury
              </button>
            </BookingModal>
          </ScrollReveal>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 bg-card relative overflow-hidden">
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[28rem] h-[28rem] border border-primary/10 rounded-full" />
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-72 h-72 border border-primary/10 rounded-full" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <ScrollReveal>
              <span className="text-primary text-sm tracking-[0.2em] uppercase mb-4 block">The Visionary</span>
              <h2 className="text-3xl md:text-5xl font-serif text-foreground">Meet Neelu Rai</h2>
              <div className="h-px w-24 bg-primary/30 mx-auto mt-6" />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-lg font-light leading-relaxed text-muted-foreground">
                Founded by Neelu Rai, UBTAN is more than a salon—it is a private sanctuary designed exclusively for women. With years of expertise in high-end beauty, Neelu created this space with one philosophy in mind: every woman deserves to experience her own beauty in a setting of absolute sophistication.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <p className="text-lg font-light leading-relaxed text-muted-foreground">
                Here, there is no rush, no noise. Only meticulous craftsmanship, premium products, and an environment tailored to your comfort and transformation.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={600}>
              <div className="pt-4">
                <p className="font-serif text-2xl italic text-primary">Neelu Rai</p>
                <p className="text-sm tracking-widest text-muted-foreground uppercase mt-2">Founder & Creative Director</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-primary text-sm tracking-[0.2em] uppercase mb-4 block">Our Offerings</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">A Curated Menu of Refinement</h2>
              <div className="h-px w-24 bg-primary/30 mx-auto mt-8" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Hair Architecture", desc: "Precision cuts, bespoke coloring, and deep restorative treatments designed for your unique hair profile." },
              { title: "Skin Radiance", desc: "Clinical-grade facials and luxurious skin therapies that reveal your natural luminosity." },
              { title: "Bespoke Makeup", desc: "From subtle enhancements to dramatic transformations, applied by master artists." },
              { title: "Hands & Feet", desc: "Spa-grade manicures and pedicures featuring premium polishes and soothing massages." },
              { title: "Threading & Waxing", desc: "Gentle, precise hair removal using the finest hard waxes and traditional techniques." }
            ].map((service, i) => (
              <ScrollReveal key={i} delay={i * 100} direction="scale">
                <div className="luxury-card group h-full p-8 transition-all duration-500 hover:-translate-y-1">
                  <h3 className="mb-4 text-xl font-serif text-primary transition-colors group-hover:text-primary/90">{service.title}</h3>
                  <p className="font-light leading-relaxed text-muted-foreground">{service.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Menu Management */}
      <section id="menu" className="py-32 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent_45%)]" />
        <div className="container mx-auto px-6 relative">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-primary text-sm tracking-[0.2em] uppercase mb-4 block">Private Menu</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">A Mini Menu of Available Rituals</h2>
              <div className="h-px w-24 bg-primary/30 mx-auto mt-8" />
            </div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <ScrollReveal delay={120} direction="left">
              <div className="luxury-card p-8 md:p-10">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary">Guest View</p>
                    <h3 className="mt-2 text-2xl font-serif text-foreground">Signature Services</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={`${service.title}-${index}`} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-serif text-lg text-primary">{service.title}</p>
                          <p className="mt-1 text-sm font-light leading-relaxed text-muted-foreground">{service.description}</p>
                        </div>
                        <span className="rounded-full border border-primary/20 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180} direction="right">
              <div className="luxury-card bg-background/90 p-8 md:p-10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary">Owner Access</p>
                    <h3 className="mt-2 text-2xl font-serif text-foreground">Manage the Menu</h3>
                  </div>
                  {ownerMode && (
                    <span className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">Editing On</span>
                  )}
                </div>

                {!ownerMode ? (
                  <div className="mt-6 rounded-sm border border-white/10 bg-background/50 p-4 text-center text-sm font-light leading-relaxed text-muted-foreground">
                    Private editing controls are available to the owner through a secure access shortcut.
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    <form onSubmit={handleAddService} className="space-y-3">
                      <input
                        value={newServiceTitle}
                        onChange={(event) => setNewServiceTitle(event.target.value)}
                        placeholder="New service title"
                        className="w-full border border-white/10 bg-background/70 px-4 py-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground"
                      />
                      <textarea
                        value={newServiceDescription}
                        onChange={(event) => setNewServiceDescription(event.target.value)}
                        placeholder="Short service description"
                        rows={3}
                        className="w-full border border-white/10 bg-background/70 px-4 py-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground"
                      />
                      <button
                        type="submit"
                        className="w-full bg-primary px-4 py-3 text-sm uppercase tracking-[0.28em] text-primary-foreground transition-all duration-300 hover:bg-primary/90"
                      >
                        Add Service
                      </button>
                    </form>

                    <div className="space-y-3">
                      {services.map((service, index) => (
                        <div key={`${service.title}-${index}`} className="flex items-center justify-between gap-3 rounded-sm border border-white/10 bg-background/50 px-4 py-3">
                          <div>
                            <p className="font-serif text-sm text-foreground">{service.title}</p>
                            <p className="text-xs font-light text-muted-foreground">{service.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(service.id)}
                            className="text-[0.65rem] uppercase tracking-[0.28em] text-primary transition-colors duration-300 hover:text-primary/80"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="gallery" className="py-32 bg-card relative overflow-hidden">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-primary text-sm tracking-[0.2em] uppercase mb-4 block">The Experience</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">Why Women Choose UBTAN</h2>
              <div className="h-px w-24 bg-primary/30 mx-auto mt-8" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Experienced Professionals", desc: "Years of refined expertise in high-end beauty craftsmanship." },
              { title: "Hygienic Environment", desc: "Immaculate standards maintained at every step of your visit." },
              { title: "Premium Products", desc: "Only the finest, salon-grade formulations touch your skin and hair." },
              { title: "Personalized Care", desc: "Every service tailored to your unique features and preferences." },
              { title: "Relaxing Ambience", desc: "A calm, unhurried sanctuary designed for total ease." },
              { title: "Ladies Only", desc: "A private space exclusively for women, always." }
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100} direction={i % 3 === 0 ? 'left' : i % 3 === 1 ? 'up' : 'right'}>
                <div className="text-center space-y-3 p-6">
                  <div className="w-12 h-12 mx-auto rounded-full border border-primary/30 flex items-center justify-center text-primary font-serif text-lg">
                    {i + 1}
                  </div>
                  <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif text-primary">Trusted by Women</h2>
            </div>
          </ScrollReveal>

          <div className="flex flex-col items-center gap-4 mb-16">
            {isReturningVisitor && (
              <ScrollReveal direction="scale">
                <ReviewModal>
                  <button className="px-6 py-3 border border-primary text-primary text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    Leave a Review
                  </button>
                </ReviewModal>
              </ScrollReveal>
            )}
            <ScrollReveal delay={100} direction="scale">
              <button
                onClick={() => setShowReviews((v) => !v)}
                className="text-sm font-light tracking-wide text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                {showReviews ? 'Hide Reviews' : 'View Reviews'}
              </button>
            </ScrollReveal>
          </div>

          {showReviews && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {reviews.map((review, i) => (
                <ScrollReveal key={review.id ?? i} delay={i * 150} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className="luxury-card relative p-8">
                    <div className="absolute left-8 top-8 text-4xl font-serif text-primary/20">“</div>
                    <p className="relative z-10 mb-6 pt-4 text-lg font-light italic leading-relaxed text-muted-foreground">
                      {review.body}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-px bg-primary" />
                      <div>
                        <p className="font-serif text-foreground">{review.name}</p>
                        <div className="flex text-primary text-xs mt-1">
                          {Array.from({ length: review.rating }).map((_, index) => (
                            <span key={index}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 bg-card relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 justify-between items-center">
            <div className="w-full lg:w-1/2 space-y-8">
              <ScrollReveal direction="left">
                <h2 className="text-4xl md:text-5xl font-serif text-primary">Reserve Your Time</h2>
                <p className="mt-4 text-muted-foreground font-light max-w-md">
                  Step into our sanctuary. Contact us directly or request an appointment online to begin your UBTAN experience.
                </p>
              </ScrollReveal>
              
              <div className="space-y-6 pt-8">
                <ScrollReveal delay={100}>
                  <div className="flex flex-col">
                    <span className="text-xs tracking-widest text-primary uppercase mb-2">Location</span>
                    <span className="font-light text-foreground">1608, 16th floor, Tower-C,<br/>Ajnara Le Gaden, Sector - 16B, Gr Noida West</span>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                  <div className="flex flex-col">
                    <span className="text-xs tracking-widest text-primary uppercase mb-2">Contact</span>
                    <span className="font-light text-foreground">+91 9999680536</span>
                    <span className="font-light text-foreground mt-1">hello@ubtansalon.com</span>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={300}>
                  <div className="flex flex-col">
                    <span className="text-xs tracking-widest text-primary uppercase mb-2">Hours</span>
                    <span className="font-light text-foreground">Mon – Sat: 10:00 AM – 8:00 PM</span>
                    <span className="font-light text-foreground mt-1">Sunday: By Appointment Only</span>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <ScrollReveal delay={400} direction="right">
                <div className="luxury-card bg-background/90 p-10">
                  <h3 className="mb-6 text-2xl font-serif text-foreground">Inquire Now</h3>
                  <BookingModal>
                    <button className="w-full py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm tracking-widest uppercase">
                      Open Booking Form
                    </button>
                  </BookingModal>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-background text-center">
        <div className="container mx-auto px-6">
          <p className="text-2xl font-serif tracking-widest text-primary/50 mb-4">UBTAN</p>
          <p className="text-sm font-light text-muted-foreground">© {new Date().getFullYear()} UBTAN Salon by Neelu Rai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}