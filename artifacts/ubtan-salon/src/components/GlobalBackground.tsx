// The site's one background image (hero-bg.png), fixed behind every page and
// section, endlessly panning from top-right to bottom-left. Two copies of the
// same image sit one full viewport apart along that path; translating both by
// exactly one viewport's worth of distance brings the second copy to exactly
// where the first started, so the loop resets with no visible jump or seam.
// No drawn shapes are added on top, only this image and a flat dark scrim for
// text contrast.
export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 animate-[flow-diagonal_50s_linear_infinite] opacity-40 will-change-transform">
        <div className="absolute top-0 left-0 h-screen w-screen bg-[url('/images/hero-bg.png')] bg-cover bg-center" />
        <div className="absolute top-[-100vh] left-[100vw] h-screen w-screen bg-[url('/images/hero-bg.png')] bg-cover bg-center" />
      </div>
      <div className="absolute inset-0 bg-background/55" />
    </div>
  );
}
