import { useEffect, useState } from 'react';

// A continuous gold vine that runs the full height of the page, always
// tracking the DEEPEST point the visitor has scrolled to (a high-water
// mark), never the raw scroll position. So it keeps drifting forward as
// you scroll down, and simply holds still (never rewinds) if you scroll
// back up. Kept low-opacity and pointer-events-none so it never competes
// with actual content; that content is given z-10 to sit above it.
function leaf(cx: number, cy: number, size: number, angle: number, glow: boolean) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${angle})`} filter={glow ? 'url(#vineGlow)' : undefined}>
      <path
        d={`M0,0 C ${size * 0.55},-${size * 0.5} ${size},-${size * 0.15} ${size},0 C ${size},${size * 0.15} ${size * 0.55},${size * 0.5} 0,0 Z`}
      />
      <path d={`M0,0 L${size},0`} />
    </g>
  );
}

const LEAVES: Array<{ x: number; y: number; size: number; angle: number; glow?: boolean }> = [
  { x: 430, y: 120, size: 26, angle: -35 },
  { x: 400, y: 180, size: 22, angle: 150, glow: true },
  { x: 370, y: 340, size: 24, angle: 20 },
  { x: 330, y: 400, size: 20, angle: -160 },
  { x: 300, y: 560, size: 26, angle: -30, glow: true },
  { x: 260, y: 610, size: 20, angle: 155 },
  { x: 320, y: 800, size: 22, angle: 25 },
  { x: 280, y: 850, size: 18, angle: -150 },
  { x: 250, y: 1020, size: 24, angle: -25, glow: true },
  { x: 210, y: 1070, size: 18, angle: 160 },
  { x: 300, y: 1260, size: 22, angle: 30 },
  { x: 260, y: 1310, size: 18, angle: -155 },
  { x: 240, y: 1500, size: 24, angle: -30 },
  { x: 200, y: 1550, size: 18, angle: 150, glow: true },
];

export function FlowingVine() {
  const [flow, setFlow] = useState(0);

  useEffect(() => {
    const update = () => {
      setFlow((prev) => Math.max(prev, window.scrollY));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const translateY = -(flow * 0.22);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        viewBox="0 0 500 1700"
        preserveAspectRatio="xMaxYMin slice"
        className="absolute right-0 top-0 h-[190vh] w-full md:w-3/4 lg:w-2/3"
        style={{ transform: `translate3d(0, ${translateY}px, 0)`, willChange: 'transform' }}
        fill="none"
        stroke="var(--color-primary)"
        strokeLinecap="round"
      >
        <defs>
          <filter id="vineGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* dim base strands */}
        <path
          d="M 410 -60 C 300 160, 460 340, 340 560 C 230 760, 400 940, 300 1160 C 210 1340, 380 1500, 300 1700"
          strokeWidth="1"
          opacity="0.12"
        />
        <path
          d="M 450 -60 C 340 180, 500 360, 380 580 C 270 780, 440 960, 340 1180 C 250 1360, 420 1520, 340 1700"
          strokeWidth="1.4"
          opacity="0.18"
        />

        {/* bold glowing strand, the one meant to actually catch the eye */}
        <path
          d="M 430 -60 C 320 170, 480 350, 360 570 C 250 770, 420 950, 320 1170 C 230 1350, 400 1510, 320 1700"
          strokeWidth="2.2"
          opacity="0.5"
          filter="url(#vineGlow)"
        />

        {LEAVES.map((l, i) => (
          <g key={i} opacity={l.glow ? 0.5 : 0.22} strokeWidth={l.glow ? 1.4 : 1}>
            {leaf(l.x, l.y, l.size, l.angle, Boolean(l.glow))}
          </g>
        ))}
      </svg>
    </div>
  );
}
