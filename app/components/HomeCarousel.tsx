"use client";

import { useState } from "react";

const photos = [
  { src: "/images/home/coast-cliffs.jpg", alt: "海岸沿いの断崖と海" },
  { src: "/images/home/fishing-harbor.jpg", alt: "山に囲まれた漁港" },
  { src: "/images/home/coast-dawn.jpg", alt: "海を望む林と明け方の空" },
  { src: "/images/home/coast-harbor.jpg", alt: "断崖に囲まれた静かな港" },
];

export function HomeCarousel() {
  const [current, setCurrent] = useState(0);

  const move = (offset: number) => {
    setCurrent((index) => (index + offset + photos.length) % photos.length);
  };

  return (
    <section className="home-carousel" aria-label="活動地域の写真">
      {/* Images are already resized; keeping one plain img in the DOM avoids preloading every slide. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={photos[current].src}
        src={photos[current].src}
        alt={photos[current].alt}
        fetchPriority={current === 0 ? "high" : "auto"}
      />
      <button
        className="carousel-button carousel-button-previous"
        type="button"
        aria-label="前の写真"
        onClick={() => move(-1)}
      >
        ‹
      </button>
      <button
        className="carousel-button carousel-button-next"
        type="button"
        aria-label="次の写真"
        onClick={() => move(1)}
      >
        ›
      </button>
      <p className="carousel-counter" aria-live="polite">
        {`${current + 1} / ${photos.length}`}
      </p>
    </section>
  );
}
