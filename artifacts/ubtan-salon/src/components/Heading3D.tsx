import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

// All three variants animate the text as ONE unbroken string. Splitting into
// per-character spans (an earlier version of this file did that) breaks the
// font's native kerning, the letter-spacing subtly changes because the
// browser can no longer shape neighboring glyphs together. Never split
// "text" into characters here.
export type Heading3DVariant = 'extrude' | 'shine' | 'glide';

const EASE = [0.22, 1, 0.36, 1] as const;
const EXTRUDE_LAYERS = 16;

function Extrude({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-30, 0, 30]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
  const shine = useTransform(scrollYProgress, [0, 1], ['160% 0%', '-60% 0%']);

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
                background: isFront
                  ? undefined
                  : `linear-gradient(135deg, color-mix(in srgb, var(--color-primary) ${100 - t * 85}%, black), black)`,
                color: isFront ? undefined : undefined,
                WebkitBackgroundClip: isFront ? undefined : 'text',
                WebkitTextFillColor: isFront ? undefined : 'transparent',
                opacity: isFront ? 1 : 0.95,
              }}
            >
              {isFront ? (
                <motion.span
                  style={{
                    backgroundImage:
                      'linear-gradient(100deg, color-mix(in srgb, var(--color-primary) 55%, black) 0%, var(--color-primary) 40%, #fff7d6 50%, var(--color-primary) 60%, color-mix(in srgb, var(--color-primary) 55%, black) 100%)',
                    backgroundSize: '260% 100%',
                    backgroundPosition: shine,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {text}
                </motion.span>
              ) : (
                text
              )}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

function Shine({ text, className }: { text: string; className?: string }) {
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
            'linear-gradient(100deg, color-mix(in srgb, var(--color-primary) 60%, black) 0%, var(--color-primary) 42%, #fff7d6 50%, var(--color-primary) 58%, color-mix(in srgb, var(--color-primary) 60%, black) 100%)',
          backgroundSize: '260% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        initial={{ backgroundPosition: '160% 0%' }}
        whileInView={{ backgroundPosition: '-60% 0%' }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

function Glide({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{ whiteSpace: 'pre', transformPerspective: 1200, transformOrigin: 'bottom center' }}
      initial={{ opacity: 0, rotateX: -55, y: 26 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 1, ease: EASE }}
    >
      {text}
    </motion.span>
  );
}

export function Heading3D({ text, variant, className }: { text: string; variant: Heading3DVariant; className?: string }) {
  if (variant === 'shine') return <Shine text={text} className={className} />;
  if (variant === 'glide') return <Glide text={text} className={className} />;
  return <Extrude text={text} className={className} />;
}
