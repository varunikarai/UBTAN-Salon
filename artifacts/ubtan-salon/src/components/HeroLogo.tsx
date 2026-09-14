import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// How far into the page the mark has fully receded and dissolved.
const RECEDE_SCROLL_PX = 760;

function useViewportSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window === 'undefined' ? 1280 : window.innerWidth,
    height: typeof window === 'undefined' ? 800 : window.innerHeight,
  }));

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}

// The real UBTAN mark (lotus + hand), traced from the business card into a
// vector so it stays sharp at any size, sitting behind the hero as a large,
// soft, translucent watermark. The hero itself is untouched and still the
// first thing on the page: this layer sits under it (z-[5], below the hero's
// z-10 content, above the fixed background), so the opening screen reads
// exactly as it did before, just with the mark breathing behind it.
//
// Scrolling makes only the mark move: it recedes (shrinks, untilts, drifts
// back in Z) while its blur widens and its opacity falls, so it dissolves
// into the page rather than sliding off it.
//
// Size is animated as real width/height, not `transform: scale()`. Scale only
// stretches whatever bitmap the browser already rasterised at the element's
// laid-out size, so a small box scaled up stays a blurry small raster blown
// large. Animating width/height makes the browser render the vector at its
// actual current size every frame.
export function HeroLogo() {
  const { scrollY } = useScroll();
  const { width: vw, height: vh } = useViewportSize();

  const openWidth = Math.min(vw, vh) * 0.58;
  const aspect = 343 / 309; // the traced mark's real proportions

  const boxWidth = useTransform(scrollY, [0, RECEDE_SCROLL_PX], [openWidth, openWidth * 0.55], { clamp: true });
  const boxHeight = useTransform(boxWidth, (w: number) => w * aspect);
  const x = useTransform(boxWidth, (w: number) => vw / 2 - w / 2);
  const y = useTransform(boxHeight, (h: number) => vh / 2 - h / 2 - vh * 0.06);

  const opacity = useTransform(scrollY, [0, RECEDE_SCROLL_PX * 0.85], [0.2, 0], { clamp: true });
  const blurPx = useTransform(scrollY, [0, RECEDE_SCROLL_PX], [12, 30], { clamp: true });
  const filter = useTransform(blurPx, (b: number) => `blur(${b}px)`);
  const rotateX = useTransform(scrollY, [0, RECEDE_SCROLL_PX], [10, 26], { clamp: true });
  const rotateY = useTransform(scrollY, [0, RECEDE_SCROLL_PX], [-14, -34], { clamp: true });

  return (
    <motion.img
      src="/images/logo.svg"
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] select-none"
      style={{
        width: boxWidth,
        height: boxHeight,
        x,
        y,
        opacity,
        filter,
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
    />
  );
}
