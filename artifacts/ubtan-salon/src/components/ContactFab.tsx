import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Instagram, MessageCircle, Phone, Plus } from 'lucide-react';

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
              initial={{ opacity: 0, y: 14, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.8 }}
              transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
              className="group flex items-center gap-3"
            >
              <span className="hidden border border-primary/20 bg-background/90 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 sm:inline-block">
                {action.label}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-card text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:h-12 sm:w-12">
                <action.icon className="h-5 w-5" />
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        aria-label={open ? 'Close contact options' : 'Contact us'}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground sm:h-14 sm:w-14"
      >
        <motion.span
          animate={{ rotate: open ? 135 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex items-center justify-center"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.span>
      </motion.button>
    </div>
  );
}
