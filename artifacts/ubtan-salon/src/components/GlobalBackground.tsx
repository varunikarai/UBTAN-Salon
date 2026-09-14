import type { CSSProperties } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

// The site's one background image (hero-bg.png), fixed behind every page and
// section, as three depth layers of that SAME single photo. Earlier versions
// tiled copies of the image side by side to cover the whole page, which
// always showed as "the same picture twice", hero-bg.png is one scenic
// photo, not a repeatable pattern, so no amount of feathering hides a tile
// seam. This version never tiles anything: each layer is exactly one
// oversized copy of the photo that only ever pans within its own overhang,
// so there is never a second copy on screen to seam against.
//
// Each layer combines two motions:
//   1. A slow autonomous pan (CSS), the same top-right-to-bottom-left
//      direction, that runs once over minutes and holds at its end state
//      (animation-fill-mode: forwards), it never reverses and never loops
//      back through a visible jump.
//   2. A real scroll-linked parallax offset (framer-motion useScroll), so
//      the layers actually separate at different rates as you scroll, not
//      just something happening on a timer regardless of scroll.
// Depth itself comes from blur/scale/brightness differing per layer, back
// layer slow and blurred, front layer fast and brighter. No drawn shapes
// are added, only this photo, panned and layered, plus a flat scrim on top
// for text contrast.

type Layer = {
  blurPx?: number;
  opacity: number;
  brightness?: number;
  blend?: CSSProperties['mixBlendMode'];
  panDurationS: number;
  panX: string;
  panY: string;
  parallaxCapPx: number;
};

const LAYERS: Layer[] = [
  { blurPx: 16, opacity: 0.34, panDurationS: 320, panX: '-6%', panY: '6%', parallaxCapPx: 26 },
  { opacity: 0.44, panDurationS: 240, panX: '-10%', panY: '10%', parallaxCapPx: 55 },
  { opacity: 0.14, brightness: 1.15, blend: 'screen', panDurationS: 170, panX: '-13%', panY: '13%', parallaxCapPx: 90 },
];

function BackgroundLayer({ layer, scrollY }: { layer: Layer; scrollY: MotionValue<number> }) {
  const parallaxY = useTransform(scrollY, [0, 3200], [0, layer.parallaxCapPx], { clamp: true });
  const filter = [
    layer.blurPx ? `blur(${layer.blurPx}px)` : '',
    layer.brightness && layer.brightness !== 1 ? `brightness(${layer.brightness})` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        y: parallaxY,
        opacity: layer.opacity,
        filter: filter || undefined,
        mixBlendMode: layer.blend,
      }}
    >
      <div
        className="absolute -inset-[30%] bg-[url('/images/hero-bg.png')] bg-cover bg-center will-change-transform"
        style={
          {
            '--pan-x': layer.panX,
            '--pan-y': layer.panY,
            animation: `bg-pan ${layer.panDurationS}s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
          } as CSSProperties
        }
      />
    </motion.div>
  );
}

export function GlobalBackground() {
  const { scrollY } = useScroll();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {LAYERS.map((layer, i) => (
        <BackgroundLayer key={i} layer={layer} scrollY={scrollY} />
      ))}
      <div className="absolute inset-0 bg-background/50" />
    </div>
  );
}
