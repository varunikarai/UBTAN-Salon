// The site's one background image (hero-bg.png), fixed behind every page and
// section, endlessly panning from top-right to bottom-left. The pan moves on
// both axes at once, so a single pair of copies leaves two opposite corners
// uncovered mid-cycle. Four copies, arranged in a 2x2 grid spaced by exactly
// one viewport in each direction, keep all four corners covered at every
// instant: as the group translates by one viewport's worth of distance, each
// tile hands off to its neighbor with no visible gap, jump, or reversal.
// No drawn shapes are added on top, only this image and a flat dark scrim
// for text contrast.
export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 animate-[flow-diagonal_50s_linear_infinite] opacity-40 will-change-transform">
        <div className="absolute top-[-100vh] left-0 h-screen w-screen bg-[url('/images/hero-bg.png')] bg-cover bg-center" />
        <div className="absolute top-[-100vh] left-[100vw] h-screen w-screen bg-[url('/images/hero-bg.png')] bg-cover bg-center" />
        <div className="absolute top-0 left-0 h-screen w-screen bg-[url('/images/hero-bg.png')] bg-cover bg-center" />
        <div className="absolute top-0 left-[100vw] h-screen w-screen bg-[url('/images/hero-bg.png')] bg-cover bg-center" />
      </div>
      <div className="absolute inset-0 bg-background/55" />
    </div>
  );
}
