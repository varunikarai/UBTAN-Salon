import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { BookingModal } from '../components/BookingModal';
import { ScrollReveal } from '../components/ScrollReveal';

const MILESTONES: Array<{ label: string; title: string; body: string; direction: 'left' | 'right' }> = [
  {
    label: '01',
    title: 'The Beginning',
    body: '[Add how it all started here: what first drew her to this craft, and the moment she decided to pursue it.]',
    direction: 'left',
  },
  {
    label: '02',
    title: 'Finding Her Craft',
    body: '[Add her training and early years here: where she learned, who influenced her, and the skills she built along the way.]',
    direction: 'right',
  },
  {
    label: '03',
    title: 'Building UBTAN',
    body: '[Add the story of founding the salon here: the vision behind the name, the space, and what "Blossom into a new u..." means to her.]',
    direction: 'left',
  },
  {
    label: '04',
    title: 'Today',
    body: "[Add where UBTAN stands today here: what she's proudest of, and what's next for the salon.]",
    direction: 'right',
  },
];

export function OurStory() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <nav className="floating-panel fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-background/75 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <Link href="/">
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

      {/* Page hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-24">
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <span className="mb-4 block text-sm uppercase tracking-[0.3em] text-primary">Her Journey</span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="mb-6 text-5xl font-serif font-medium text-foreground md:text-7xl">Our Story</h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
              [Add a short introduction here: a sentence or two setting up the story that follows, in her voice.]
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Milestones / timeline */}
      <section className="relative py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent md:block" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto flex max-w-4xl flex-col gap-16">
            {MILESTONES.map((milestone) => (
              <ScrollReveal key={milestone.label} direction={milestone.direction}>
                <div
                  className={`flex flex-col gap-6 md:items-center ${
                    milestone.direction === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  <div className="flex-1">
                    <div className="luxury-card p-8 md:p-10">
                      <span className="font-serif text-4xl text-primary/30">{milestone.label}</span>
                      <h3 className="mt-3 text-2xl font-serif text-foreground">{milestone.title}</h3>
                      <p className="mt-4 font-light italic leading-relaxed text-muted-foreground">{milestone.body}</p>
                    </div>
                  </div>
                  <div className="hidden h-3 w-3 shrink-0 rounded-full bg-primary md:block" />
                  <div className="flex-1 md:block hidden" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="py-28">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal direction="scale">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-3xl font-serif italic leading-relaxed text-primary md:text-4xl">
                "[Insert a quote from her here, something that captures her philosophy or what UBTAN means to her.]"
              </p>
              <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">Neelu Rai, Founder</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-28 text-center">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl font-serif text-foreground md:text-4xl">Ready to experience UBTAN?</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <BookingModal>
                <button className="px-8 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase shadow-[0_16px_40px_rgba(212,175,55,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90">
                  Book Now
                </button>
              </BookingModal>
              <Link href="/">
                <span className="cursor-pointer px-8 py-4 border border-primary/30 text-primary text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  Back to Home
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="pb-24 pt-12 sm:py-12 border-t border-white/5 text-center">
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-2xl font-serif tracking-widest text-primary/50 mb-4">UBTAN</p>
          <p className="text-sm font-light text-muted-foreground">&copy; {new Date().getFullYear()} UBTAN Salon by Neelu Rai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
