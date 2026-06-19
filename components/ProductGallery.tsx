'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({
  images,
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(
    images[0]
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[90px_1fr]">
      {/* Thumbnails */}
      <div className="flex gap-3 overflow-auto lg:flex-col">
        {images.map((image) => (
          <button
            key={image}
            onClick={() => setActiveImage(image)}
            className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition
              ${
                activeImage === image
                  ? 'border-leaf'
                  : 'border-transparent'
              }`}
          >
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="overflow-hidden rounded-[2rem] bg-white p-6 shadow-soft">
        <div className="relative aspect-square">
          <Image
            src={activeImage}
            alt=""
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}