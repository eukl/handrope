"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageProps = {
  src?: string;
  alt: string;
  name: string;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
};

export default function ProductImage({
  src,
  alt,
  name,
  className,
  imageClassName,
  sizes,
  priority = false
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const wrapperClassName = [
    "relative overflow-hidden rounded-lg border border-border bg-surface-soft",
    className
  ]
    .filter(Boolean)
    .join(" ");

  if (!src || hasError) {
    return (
      <div className={wrapperClassName}>
        <div className="absolute inset-0 bg-surface-grain" />
        <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-rope/70 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-purple/10 blur-2xl" />
        <div className="relative flex h-full min-h-48 flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="text-xs uppercase tracking-[0.28em] text-muted-dark">
            Photo à venir
          </span>
          <strong className="font-display text-2xl font-semibold text-foreground">
            {name}
          </strong>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={[
          "object-cover transition duration-500",
          imageClassName
        ]
          .filter(Boolean)
          .join(" ")}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
