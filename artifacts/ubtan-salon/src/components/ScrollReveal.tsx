import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}

const OFFSETS: Record<NonNullable<ScrollRevealProps['direction']>, { x?: number; y?: number; scale?: number; rotateX?: number }> = {
  up: { y: 42, rotateX: 10 },
  left: { x: -56, rotateX: 6 },
  right: { x: 56, rotateX: 6 },
  scale: { scale: 0.94, rotateX: 8 },
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function ScrollReveal({ children, className, delay = 0, direction = 'up' }: ScrollRevealProps) {
  const offset = OFFSETS[direction];

  return (
    <motion.div
      className={cn(className)}
      style={{ transformPerspective: 1200 }}
      initial={{ opacity: 0, x: offset.x ?? 0, y: offset.y ?? 0, scale: offset.scale ?? 1, rotateX: offset.rotateX ?? 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: false, margin: '0px 0px -80px 0px', amount: 0.1 }}
      transition={{ duration: 0.9, delay: delay / 1000, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
