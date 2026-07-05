import { BookingModal } from './components/BookingModal';
import { ScrollReveal } from './components/ScrollReveal';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-serif text-primary tracking-widest uppercase">UBTAN</div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-light tracking-wide text-muted-foreground">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#gallery" className="hover:text-primary transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <BookingModal>
            <button className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm tracking-widest uppercase">
              Book Now
            </button>
          </BookingModal>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-bg.png" alt="Luxury Salon Interior" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <ScrollReveal>
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block">Ladies-Only Premium Salon</span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 text-foreground font-medium">UBTAN</h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="text-xl md:text-2xl font-serif italic text-muted-foreground mb-12">"Blossom into a new u..."</p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <BookingModal>
              <button className="px-8 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-primary/90 transition-all duration-300">
                Experience Luxury
              </button>
            </BookingModal>
          </ScrollReveal>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 bg-card relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="w-full md:w-1/2">
              <ScrollReveal>
                <div className="relative">
                  <div className="absolute -inset-4 border border-primary/20" />
                  <img src="/images/owner.png" alt="Neelu Rai" className="w-full aspect-[3/4] object-cover" />
                </div>
              </ScrollReveal>
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              <ScrollReveal>
                <h2 className="text-3xl md:text-5xl font-serif text-primary">The Visionary</h2>
                <div className="h-px w-24 bg-primary/30 mt-6" />
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
              <ScrollReveal key={i} delay={i * 100}>
                <div className="p-8 border border-white/5 bg-white/[0.02] hover:border-primary/30 transition-colors duration-500 group h-full">
                  <h3 className="text-xl font-serif text-primary mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{service.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-32 bg-card">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-primary text-sm tracking-[0.2em] uppercase mb-4 block">The Experience</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">A Glimpse of Luxury</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScrollReveal>
              <img src="/images/gallery-hair.png" alt="Hair Styling" className="w-full aspect-square object-cover hover:opacity-90 transition-opacity" />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <img src="/images/gallery-skin.png" alt="Skin Care" className="w-full aspect-square object-cover hover:opacity-90 transition-opacity" />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <img src="/images/gallery-makeup.png" alt="Makeup" className="w-full aspect-square object-cover hover:opacity-90 transition-opacity" />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <img src="/images/gallery-nails.png" alt="Nails" className="w-full aspect-square object-cover hover:opacity-90 transition-opacity" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl font-serif text-primary">Trusted by Women</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { name: "Priya Sharma", text: "The ambiance is incredible. I've never felt so pampered. Neelu's attention to detail is unmatched." },
              { name: "Aditi Verma", text: "UBTAN is my sanctuary. The skincare treatments have completely transformed my complexion." },
              { name: "Riya Singh", text: "Finally, a luxury ladies-only salon that understands modern elegance. My hair has never looked better." },
              { name: "Sneha Kapoor", text: "From the moment you walk in, you are treated like royalty. The bespoke makeup service was flawless." }
            ].map((t, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="p-8 border border-white/5 relative">
                  <div className="absolute top-8 left-8 text-4xl font-serif text-primary/20">"</div>
                  <p className="text-lg font-light italic leading-relaxed text-muted-foreground mb-6 relative z-10 pt-4">
                    {t.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-px bg-primary" />
                    <div>
                      <p className="font-serif text-foreground">{t.name}</p>
                      <div className="flex text-primary text-xs mt-1">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 bg-card relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 justify-between items-center">
            <div className="w-full lg:w-1/2 space-y-8">
              <ScrollReveal>
                <h2 className="text-4xl md:text-5xl font-serif text-primary">Reserve Your Time</h2>
                <p className="mt-4 text-muted-foreground font-light max-w-md">
                  Step into our sanctuary. Contact us directly or request an appointment online to begin your UBTAN experience.
                </p>
              </ScrollReveal>
              
              <div className="space-y-6 pt-8">
                <ScrollReveal delay={100}>
                  <div className="flex flex-col">
                    <span className="text-xs tracking-widest text-primary uppercase mb-2">Location</span>
                    <span className="font-light text-foreground">123 Luxury Avenue, Suite 4B<br/>New Delhi, 110001</span>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                  <div className="flex flex-col">
                    <span className="text-xs tracking-widest text-primary uppercase mb-2">Contact</span>
                    <span className="font-light text-foreground">+91 98765 43210</span>
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
              <ScrollReveal delay={400}>
                <div className="bg-background p-10 border border-white/5">
                  <h3 className="text-2xl font-serif text-foreground mb-6">Inquire Now</h3>
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