// A thin-line botanical accent, drawn to match the gold line-art already
// baked into hero-bg.png. That artwork is flat pixels in a single PNG, it
// can't be isolated and animated on its own, so this is a separate real SVG
// layer that CAN carry its own independent scroll parallax.
export function LeafSprig({ className, opacity = 0.35 }: { className?: string; opacity?: number }) {
  const leaf = (cx: number, cy: number, size: number, angle: number) => (
    <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>
      <path
        d={`M0,0 C ${size * 0.55},-${size * 0.5} ${size},-${size * 0.15} ${size},0 C ${size},${size * 0.15} ${size * 0.55},${size * 0.5} 0,0 Z`}
        fill="none"
      />
      <path d={`M0,0 L${size},0`} />
    </g>
  );

  return (
    <svg
      viewBox="0 0 220 420"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth={1.1}
      strokeLinecap="round"
    >
      <path d="M110 10 C 90 90, 130 150, 100 220 C 75 285, 115 340, 95 410" />
      {leaf(100, 60, 34, -35)}
      {leaf(100, 60, 30, 145)}
      {leaf(112, 130, 30, 25)}
      {leaf(96, 130, 28, -155)}
      {leaf(104, 195, 32, -30)}
      {leaf(90, 200, 26, 160)}
      {leaf(100, 265, 30, 30)}
      {leaf(80, 270, 26, -150)}
      {leaf(98, 335, 26, -25)}
      {leaf(88, 340, 22, 155)}
    </svg>
  );
}
