type BrandLogoProps = {
  showParis?: boolean;
  className?: string;
};

export default function BrandLogo({
  showParis = false,
  className = ""
}: BrandLogoProps) {
  const label = showParis ? "HandRope Paris" : "HandRope";

  return (
    <span
      className={[
        "inline-flex items-baseline font-display font-semibold tracking-wide",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true" className="inline-flex items-baseline">
        <span className="text-foreground">Hand</span>
        <span className="handrope-logo-neon">Rope</span>
        {showParis ? (
          <span className="ml-2 text-foreground">Paris</span>
        ) : null}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
