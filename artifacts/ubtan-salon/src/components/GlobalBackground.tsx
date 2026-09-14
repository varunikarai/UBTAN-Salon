import type { CSSProperties } from 'react';

// The site's one background image (hero-bg.png), fixed behind every page and
// section, built as three depth layers of the SAME photo rather than one
// flat slab sliding across the screen:
//   - back:  large, blurred, slow, always full-coverage. This is the layer
//            that guarantees there is never a black gap behind everything
//            else, using the proven 4-tile grid (see PanLayer below).
//   - mid:   normal size and sharpness, medium speed, edges feathered with
//            a radial mask so each tile dissolves into the back layer
//            instead of showing a hard rectangular seam.
//   - front: brighter/more saturated, fastest, screen-blended so it only
//            ever adds light (a glint), also feathered.
// Layers move at different speeds along the same top-right-to-bottom-left
// path, which is what reads as real depth (distant things drift slower)
// rather than one image translating. No drawn shapes are added, only this
// photo, processed and layered, plus a flat scrim on top for text contrast.

const TILE_POSITIONS = [
  { top: '-100vh', left: '0' },
  { top: '-100vh', left: '100vw' },
  { top: '0', left: '0' },
  { top: '0', left: '100vw' },
];

const FEATHER_MASK = 'radial-gradient(circle at center, black 45%, transparent 78%)';

function PanLayer({
  durationS,
  opacity,
  blurPx = 0,
  scale = 1,
  brightness = 1,
  saturate = 1,
  blend = 'normal',
  feather = false,
}: {
  durationS: number;
  opacity: number;
  blurPx?: number;
  scale?: number;
  brightness?: number;
  saturate?: number;
  blend?: CSSProperties['mixBlendMode'];
  feather?: boolean;
}) {
  const filter = [
    blurPx ? `blur(${blurPx}px)` : '',
    brightness !== 1 ? `brightness(${brightness})` : '',
    saturate !== 1 ? `saturate(${saturate})` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity,
        filter: filter || undefined,
        mixBlendMode: blend,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{ animation: `flow-diagonal ${durationS}s linear infinite` }}
      >
        {TILE_POSITIONS.map((pos, i) => (
          <div
            key={i}
            className="absolute h-screen w-screen bg-[url('/images/hero-bg.png')] bg-cover bg-center"
            style={{
              top: pos.top,
              left: pos.left,
              maskImage: feather ? FEATHER_MASK : undefined,
              WebkitMaskImage: feather ? FEATHER_MASK : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <PanLayer durationS={85} opacity={0.3} blurPx={14} scale={1.2} />
      <PanLayer durationS={50} opacity={0.42} feather />
      <PanLayer durationS={28} opacity={0.18} brightness={1.5} saturate={1.3} blend="screen" feather />
      <div className="absolute inset-0 bg-background/50" />
    </div>
  );
}
