import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export type Heading3DVariant = 'flip' | 'assemble' | 'wave' | 'shatter' | 'extrude' | 'flythrough';

const EASE = [0.22, 1, 0.36, 1] as const;
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

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

// Hand-tuned chaos vectors, cycled per character so the explosion reads as
// wild but is still deterministic across renders (no Math.random in render).
const SHATTER_VECTORS = [
  { x: -420, y: -190, rotateZ: -560, rotateX: 110, rotateY: -70, scale: 2.6 },
  { x: 400, y: 230, rotateZ: 500, rotateX: -120, rotateY: 90, scale: 0.15 },
  { x: -280, y: 270, rotateZ: -380, rotateX: 150, rotateY: -100, scale: 2.9 },
  { x: 360, y: -250, rotateZ: 620, rotateX: -95, rotateY: 80, scale: 0.18 },
  { x: -170, y: -340, rotateZ: -500, rotateX: 90, rotateY: -60, scale: 2.4 },
  { x: 320, y: 170, rotateZ: 440, rotateX: -140, rotateY: 110, scale: 0.22 },
];

function Shatter({ text, className }: { text: string; className?: string }) {
  const chars = splitChars(text);
  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{ whiteSpace: 'pre', transformPerspective: 1400 }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
    >
      {chars.map((char, i) => {
        const v = SHATTER_VECTORS[i % SHATTER_VECTORS.length];
        return (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: {
                opacity: 0,
                x: v.x,
                y: v.y,
                rotateZ: v.rotateZ,
                rotateX: v.rotateX,
                rotateY: v.rotateY,
                scale: v.scale,
                filter: 'blur(6px)',
              },
              show: { opacity: 1, x: 0, y: 0, rotateZ: 0, rotateX: 0, rotateY: 0, scale: 1, filter: 'blur(0px)' },
            }}
            transition={{ type: 'spring', stiffness: 110, damping: 13, mass: 0.9 }}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

const EXTRUDE_LAYERS = 16;

function Extrude({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-42, 0, 42]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [14, 0, -14]);

  const layers = Array.from({ length: EXTRUDE_LAYERS }, (_, i) => i).reverse();

  return (
    <div ref={ref} style={{ perspective: 1600 }} className="inline-block">
      <motion.div
        style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
        className={cn('relative inline-block', className)}
      >
        {/* Spacer keeps layout height/width since the layers below are absolute */}
        <span className="invisible" style={{ whiteSpace: 'pre' }}>{text}</span>
        {layers.map((i) => {
          const t = i / (EXTRUDE_LAYERS - 1);
          const isFront = i === 0;
          return (
            <span
              key={i}
              aria-hidden={!isFront}
              style={{
                position: 'absolute',
                inset: 0,
                whiteSpace: 'pre',
                transform: `translate3d(${i * 1.1}px, ${i * 1.1}px, ${-i * 5}px)`,
                color: isFront ? 'var(--color-primary)' : undefined,
                background: isFront
                  ? undefined
                  : `linear-gradient(135deg, color-mix(in srgb, var(--color-primary) ${100 - t * 85}%, black), black)`,
                WebkitBackgroundClip: isFront ? undefined : 'text',
                WebkitTextFillColor: isFront ? undefined : 'transparent',
                opacity: isFront ? 1 : 0.95,
              }}
            >
              {text}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

function Flythrough({ text, className }: { text: string; className?: string }) {
  const chars = splitChars(text);
  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{ whiteSpace: 'pre', transformPerspective: 2000 }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, scale: 9, z: -900, rotateX: 65, rotateY: i % 2 === 0 ? -70 : 70, filter: 'blur(24px)' },
            show: { opacity: 1, scale: 1, z: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 1.1, ease: EXPO_OUT }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function Heading3D({ text, variant, className }: { text: string; variant: Heading3DVariant; className?: string }) {
  if (variant === 'flip') return <FlipUp text={text} className={className} />;
  if (variant === 'assemble') return <Assemble text={text} className={className} />;
  if (variant === 'shatter') return <Shatter text={text} className={className} />;
  if (variant === 'extrude') return <Extrude text={text} className={className} />;
  if (variant === 'flythrough') return <Flythrough text={text} className={className} />;
  return <ScrollWave text={text} className={className} />;
}
