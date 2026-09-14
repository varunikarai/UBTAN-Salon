import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

// Animates the text as ONE unbroken string, never split into characters,
// splitting breaks the font's native kerning and visibly changes the
// letter-spacing. Base color is a fixed gold ombre (dark amber to pale
// yellow-gold), with a second copy of the same text stacked exactly on
// top carrying only a light shine band that sweeps through once, so the
// ombre itself never moves or shifts, only the highlight passing over it.
export function Heading3D({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={cn('relative inline-block', className)}
      style={{ whiteSpace: 'pre' }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.8, ease: EASE }}
      aria-label={text}
    >
      <span
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(100deg, #93650f 0%, #d4af37 40%, #f2d478 72%, #fdf0c8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(100deg, transparent 0%, transparent 46%, #fffbe8 50%, transparent 54%, transparent 100%)',
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
