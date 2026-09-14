import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

// Animates the text as ONE unbroken string, never split into characters,
// splitting breaks the font's native kerning and visibly changes the
// letter-spacing. Base color stays text-foreground (the original white),
// with a narrow, subtle bright band sweeping through it once.
export function Heading3D({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{ whiteSpace: 'pre' }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.span
        style={{
          backgroundImage:
            'linear-gradient(100deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 46%, #ffffff 50%, hsl(var(--foreground)) 54%, hsl(var(--foreground)) 100%)',
          backgroundSize: '260% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        initial={{ backgroundPosition: '160% 0%' }}
        whileInView={{ backgroundPosition: '-60% 0%' }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 1.8, delay: 0.25, ease: EASE }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}
