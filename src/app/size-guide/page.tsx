import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getSizeGuide, listProducts } from "@/lib/catalog/repository";
import { site } from "@/lib/config/site";
import { SizeChart } from "@/components/product/SizeChart";

export const metadata: Metadata = {
  title: "Розмірна сітка",
  description: "Розмірна сітка EGO (42–48), як зняти мірки та розміри кожної моделі.",
};

const howTo = [
  { t: "Груди", d: "Обхват по найбільш виступаючих точках грудей, стрічка паралельно підлозі." },
  { t: "Талія", d: "Обхват у найвужчому місці талії, не затягуючи стрічку." },
  { t: "Стегна", d: "Обхват по найбільш виступаючих точках сідниць." },
];

export default async function SizeGuidePage() {
  const [chart, products, categories] = await Promise.all([getSizeGuide(), listProducts(), getCategories()]);

  return (
    <div className="container">
      <div className="page-hero">
        <nav aria-label="Хлібні крихти">
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li aria-current="page">Розміри</li>
          </ol>
        </nav>
        <h1 className="page-title">
          Size <em className="serif-em">guide</em>
        </h1>
        <p className="lead">Правильна посадка починається з точних параметрів. Звір свої заміри з таблицею — або напиши нам, і ми підберемо розмір.</p>
      </div>

      <section className="story" style={{ alignItems: "start", paddingBottom: "clamp(56px, 7vw, 110px)" }}>
        <div style={{ display: "grid", gap: 20 }}>
          <span className="eyebrow">Український розмір · обхвати, см</span>
          <SizeChart chart={chart} caption="Розмірна сітка EGO" />
          <p className="note">{chart.note} Подвійні розміри (42-44, 46-48) охоплюють обидва значення, «One size» та «універсал» — вільна посадка на 42–46. Джинси: 34 = 40, 36 = 42, 38 = 44, 40 = 46.</p>
          <div className="accordion" style={{ marginTop: 12 }}>
            {howTo.map((h) => (
              <details key={h.t}>
                <summary>{h.t}</summary>
                <div className="accordion__body">
                  <p>{h.d}</p>
                </div>
              </details>
            ))}
          </div>
          <div className="pdp__help">
            <span>
              Між двома розмірами? Напиши свій зріст і параметри{" "}
              <a href={site.directUrl} target="_blank" rel="noreferrer">
                нам у Direct
              </a>{" "}
              — підкажемо, як сяде конкретна модель.
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gap: 20 }}>
          <span className="eyebrow">Розміри моделей</span>
          {categories.map((c) => {
            const items = products.filter((p) => p.category === c.slug);
            if (!items.length) return null;
            return (
              <div key={c.slug} style={{ display: "grid", gap: 4 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 20 }}>{c.title}</h2>
                <dl className="spec-list" style={{ fontSize: 14 }}>
                  {items.map((p) => (
                    <div key={p.id} style={{ borderBottom: "1px solid var(--line)", padding: "8px 0" }}>
                      <dt>
                        <Link href={`/product/${p.slug}`} style={{ color: "var(--ink)" }}>
                          {p.name}
                        </Link>
                      </dt>
                      <dd>{p.options.join(" · ")}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
