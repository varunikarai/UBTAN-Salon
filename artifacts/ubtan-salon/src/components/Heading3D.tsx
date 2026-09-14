import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export type Heading3DVariant = 'flip' | 'assemble' | 'wave';

const EASE = [0.22, 1, 0.36, 1] as const;

function splitChars(text: string) {
  return Array.from(text);
}

function FlipUp({ text, className }: { text: string; className?: string }) {
  const chars = splitChars(text);
  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{ whiteSpace: 'pre', transformPerspective: 800 }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ show: { transition: { staggerChildren: 0.035 } } }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ transformOrigin: 'bottom center' }}
          variants={{
            hidden: { opacity: 0, rotateX: -90, y: 16 },
            show: { opacity: 1, rotateX: 0, y: 0 },
          }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function Assemble({ text, className }: { text: string; className?: string }) {
  const chars = splitChars(text);
  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{ whiteSpace: 'pre', transformPerspective: 800 }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ show: { transition: { staggerChildren: 0.045 } } }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, scale: 0.5, rotateY: 50, filter: 'blur(6px)' },
            show: { opacity: 1, scale: 1, rotateY: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function WaveChar({ char, phase, progress }: { char: string; phase: number; progress: MotionValue<number> }) {
  const shifted = useTransform(progress, (v) => Math.min(1, Math.max(0, v + (phase - 0.5) * 0.5)));
  const rotateX = useTransform(shifted, [0, 0.5, 1], [45, 0, -45]);

  return (
    <motion.span className="inline-block" style={{ rotateX, transformOrigin: 'center' }}>
      {char}
    </motion.span>
  );
}

function ScrollWave({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const chars = splitChars(text);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  return (
    <span ref={ref} className={cn('inline-block', className)} style={{ whiteSpace: 'pre', perspective: 800 }}>
      {chars.map((char, i) => (
        <WaveChar key={i} char={char} phase={i / chars.length} progress={scrollYProgress} />
      ))}
    </span>
  );
}

export function Heading3D({ text, variant, className }: { text: string; variant: Heading3DVariant; className?: string }) {
  if (variant === 'flip') return <FlipUp text={text} className={className} />;
  if (variant === 'assemble') return <Assemble text={text} className={className} />;
  return <ScrollWave text={text} className={className} />;
}
