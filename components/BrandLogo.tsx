import Image from "next/image";

type BrandLogoProps = {
  showParis?: boolean;
  className?: string;
};

export default function BrandLogo({
  showParis = false,
  className = ""
}: BrandLogoProps) {
  const label = showParis ? "HandRope Paris" : "HandRope";
  const logoClassName = showParis ? "h-[1.75em]" : "h-[2.1875em]";

  return (
    <span
      className={[
        "inline-flex items-center",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src="/brand/handrope-logo.png"
        alt=""
        width={960}
        height={518}
        priority={!showParis}
        sizes="(max-width: 640px) 155px, 180px"
        className={`${logoClassName} w-auto select-none object-contain`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
