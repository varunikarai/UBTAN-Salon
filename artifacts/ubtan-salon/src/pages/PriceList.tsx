import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { BookingModal } from '../components/BookingModal';
import { ScrollReveal } from '../components/ScrollReveal';

type ServiceItem = {
  id?: number;
  title: string;
  description: string;
  price?: string | null;
};

// The full menu. The homepage carries only the short, most-booked list; this
// page is the complete one with prices against every service.
export function PriceList() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json() as ServiceItem[];
          if (Array.isArray(data)) setServices(data);
        }
      } catch {
        // Leave the list empty and let the message below explain.
      } finally {
        setLoaded(true);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen w-full text-foreground selection:bg-primary/30 selection:text-primary">
      <nav className="floating-panel fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-background/75 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.svg" alt="" aria-hidden="true" className="block h-9 w-auto shrink-0" />
            <motion.span
              className="inline-block cursor-pointer text-2xl font-serif text-primary tracking-widest uppercase"
              style={{ transformOrigin: 'left center' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              UBTAN
            </motion.span>
          </Link>
          <Link href="/">
            <motion.span
              className="cursor-pointer text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ x: -4 }}
              transition={{ duration: 0.25 }}
            >
              &larr; Back to Home
            </motion.span>
          </Link>
        </div>
      </nav>

      <section className="relative px-6 pt-36 pb-16 text-center">
        <ScrollReveal>
          <span className="mb-4 block text-sm uppercase tracking-[0.3em] text-primary">The Full Menu</span>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <h1 className="text-5xl font-serif font-medium text-foreground md:text-6xl">Price List</h1>
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <div className="mx-auto mt-8 h-px w-24 bg-primary/30" />
        </ScrollReveal>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-3xl">
          {services.map((service, index) => (
            <ScrollReveal key={service.id ?? index} delay={Math.min(index, 6) * 80}>
              <div className="flex items-baseline gap-5 border-b border-white/10 py-7 last:border-b-0">
                <span className="font-serif text-lg text-primary/40 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h2 className="font-serif text-xl text-foreground">{service.title}</h2>
                    <span className="font-serif text-lg text-primary tabular-nums">
                      {service.price?.trim() ? service.price : 'On request'}
                    </span>
                  </div>
                  <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}

          {loaded && services.length === 0 && (
            <p className="py-16 text-center font-light text-muted-foreground">
              The menu is being updated. Call +91 9999680536 for current pricing.
            </p>
          )}

          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="max-w-md text-sm font-light leading-relaxed text-muted-foreground">
              Prices are a starting point and can vary with hair length, density, and the products chosen for you.
              Anything marked on request is quoted after a short consultation.
            </p>
            <BookingModal>
              <button className="mt-2 bg-primary px-8 py-4 text-sm uppercase tracking-widest text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--color-primary)] active:translate-y-0 active:shadow-none">
                Reserve Your Time
              </button>
            </BookingModal>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 pb-24 pt-12 text-center sm:py-12">
        <div className="container relative z-10 mx-auto px-6">
          <p className="mb-4 text-2xl font-serif tracking-widest text-primary/50">UBTAN</p>
          <p className="text-sm font-light text-muted-foreground">
            © {new Date().getFullYear()} UBTAN Salon by Neelu Rai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
