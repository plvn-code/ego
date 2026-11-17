"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface HeroSlide {
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  cta: { href: string; label: string };
  images: [string, string];
  alt: string;
}

const DELAY = 7000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), DELAY);
    return () => window.clearTimeout(t);
  }, [active, paused, slides.length]);

  return (
    <section
      className={`hero ${paused ? "hero--paused" : ""}`}
      aria-roledescription="carousel"
      aria-label="Колекції EGO"
      style={{ ["--hero-delay" as string]: `${DELAY}ms` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`hero__slide ${i === active ? "hero__slide--active" : ""}`}
          aria-hidden={i !== active}
          inert={i !== active}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} з ${slides.length}`}
        >
          <div className="hero__media">
            {s.images.map((src, k) => (
              <div className="hero__img" key={src}>
                <Image
                  src={src}
                  alt={k === 0 ? s.alt : ""}
                  fill
                  priority={i === 0}
                  quality={85}
                  sizes="(max-width: 960px) 100vw, 50vw"
                  style={{ objectFit: "cover", objectPosition: "center 30%" }}
                />
              </div>
            ))}
          </div>
          <div className="hero__shade" />
          <div className="hero__content">
            <span className="eyebrow">{s.eyebrow}</span>
            {i === 0 ? <h1 className="hero__title">{s.title}</h1> : <h2 className="hero__title">{s.title}</h2>}
            <p className="hero__text">{s.text}</p>
            <Link href={s.cta.href} className="btn btn--light">
              {s.cta.label}
            </Link>
          </div>
        </div>
      ))}

      <div className="hero__nav">
        <div className="hero__bars">
          {slides.map((_, i) => (
            <button
              key={i}
              className="hero__bar"
              aria-current={i === active}
              aria-label={`Слайд ${i + 1}`}
              onClick={() => setActive(i)}
            >
              <i key={`${i}-${active}`} />
            </button>
          ))}
        </div>
        <span className="hero__count" aria-hidden="true">
          {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
