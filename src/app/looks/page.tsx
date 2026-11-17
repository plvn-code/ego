import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getLooks } from "@/lib/catalog/repository";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Капсули",
  description: "Готові капсули EGO до твоєї події: Date Night, Office Chic, Evening, Grey Mood, Chocolate, Total Milk.",
};

export default async function LooksPage() {
  const looks = await getLooks();
  return (
    <div className="container">
      <div className="page-hero">
        <nav aria-label="Хлібні крихти">
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li aria-current="page">Капсули</li>
          </ol>
        </nav>
        <h1 className="page-title">
          Готові <em className="serif-em">капсули</em>
        </h1>
        <p className="lead">
          Образи до твоєї події — побачення, офіс, вечір чи затишна зима. Речі в капсулі ідеально поєднуються між собою, а кожну
          можна придбати окремо.
        </p>
      </div>

      <div style={{ paddingBottom: 40 }}>
        {looks.map((l, i) => (
          <section key={l.slug} id={l.slug} className="look-row" aria-labelledby={`look-${l.slug}`}>
            <Reveal className="look-row__media">
              <Image src={l.image} alt={`Капсула ${l.name}`} fill priority={i === 0} sizes="(max-width: 960px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </Reveal>
            <div className="look-row__body">
              <span className="eyebrow">
                {String(i + 1).padStart(2, "0")} · {l.tagline}
              </span>
              <h2 className="display" id={`look-${l.slug}`} style={{ fontSize: "clamp(48px, 6vw, 96px)" }}>
                {l.name}
              </h2>
              <p className="lead">{l.description}</p>
              <div className="ctl__items">
                {l.products.map(({ product: p, color, price }) => {
                  const c = p.colors.find((x) => x.name === color);
                  const img = p.images[c?.image ?? 0];
                  const href = `/product/${p.slug}${c && p.colors.indexOf(c) > 0 ? `?color=${encodeURIComponent(c.name)}` : ""}`;
                  return (
                    <div className="ctl__item" key={p.id}>
                      <Link href={href} className="ctl__thumb">
                        <Image src={img.src} alt={img.alt} fill sizes="84px" style={{ objectFit: "cover" }} />
                      </Link>
                      <div>
                        <Link href={href}>
                          <strong>{p.name}</strong>
                        </Link>
                        <span>
                          {color ?? p.kind} · {p.options.join(" / ")}
                        </span>
                      </div>
                      <Link href={href} className="btn btn--outline btn--sm">
                        {formatPrice(price)}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="ctl__total">
                <span>Разом за капсулу</span>
                <b>{formatPrice(l.total)}</b>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
