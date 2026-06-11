"use client";

import { useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] ?? "");

  useEffect(() => {
    setSelectedImage(images[0] ?? "");
  }, [images]);

  return (
    <div className="space-y-4">
      <ProductImage
        src={selectedImage}
        alt={`Bracelet HandRope Paris ${name}`}
        name={name}
        sizes="(min-width: 1024px) 48vw, 100vw"
        priority
        className="aspect-[4/5] shadow-glow"
      />
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => {
          const isSelected = selectedImage === image;

          return (
            <button
              key={image}
              type="button"
              aria-label={`Afficher la photo ${index + 1} de ${name}`}
              onClick={() => setSelectedImage(image)}
              className={[
                "rounded-lg border bg-surface transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple",
                isSelected
                  ? "border-accent-warm"
                  : "border-border hover:border-accent-purple/60"
              ].join(" ")}
            >
              <ProductImage
                src={image}
                alt={`Miniature ${index + 1} du bracelet ${name}`}
                name={name}
                sizes="160px"
                className="aspect-square rounded-md border-0"
                imageClassName="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
