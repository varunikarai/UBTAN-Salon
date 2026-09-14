import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Instagram, MessageCircle, Phone } from 'lucide-react';

// Phone/WhatsApp are derived from the number already published in the site's
// own Contact section (+91 9999680536). No real Instagram handle was given,
// so that link is a placeholder, swap INSTAGRAM_URL for the real profile.
const PHONE_DIGITS = '919999680536';
const INSTAGRAM_URL = 'https://instagram.com/REPLACE_WITH_HANDLE';

const ACTIONS = [
  { label: 'WhatsApp', href: `https://wa.me/${PHONE_DIGITS}`, icon: MessageCircle, external: true },
  { label: 'Call', href: `tel:+${PHONE_DIGITS}`, icon: Phone, external: false },
  { label: 'Instagram', href: INSTAGRAM_URL, icon: Instagram, external: true },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open &&
          ACTIONS.map((action, i) => (
            <motion.a
              key={action.label}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
              className="group flex items-center gap-3"
            >
              <span className="hidden border border-primary/20 bg-background/90 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 sm:inline-block">
                {action.label}
              </span>
              <span className="flex h-11 w-11 items-center justify-center border border-primary/30 bg-card text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:h-12 sm:w-12">
                <action.icon className="h-5 w-5" />
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 border border-primary/30 bg-background/90 px-4 py-3 text-xs uppercase tracking-[0.2em] text-primary backdrop-blur-sm transition-colors duration-300 hover:bg-primary hover:text-primary-foreground active:bg-primary/80"
      >
        Contact Us
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex items-center justify-center"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </motion.button>
    </div>
  );
}
