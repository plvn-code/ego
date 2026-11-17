import Image from "next/image";
import Link from "next/link";
import {
  getActivities,
  getBestsellers,
  getProductBySlug,
  getCategories,
  getColorFilters,
  getLooks,
  getNewArrivals,
  listProducts,
} from "@/lib/catalog/repository";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/config/site";
import { HeroSlider, type HeroSlide } from "@/components/home/HeroSlider";
import { Manifesto } from "@/components/home/Manifesto";
import { ProductCard } from "@/components/product/ProductCard";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, InstagramIcon } from "@/components/ui/Icons";

const slides: HeroSlide[] = [
  {
    eyebrow: "Осінь — зима 2026",
    title: (
      <>
        Пальто, яке <em>робить образ</em>
      </>
    ),
    text: "Вкорочене кашемірове пальто оверсайз з хутряними манжетами — must-have сезону. Чотири кольори: молочний, чорний, шоколад і сірий.",
    cta: { href: "/product/fur-cuff-coat", label: "Дивитися пальто" },
    images: ["/images/editorial/hero-coat.jpg", "/images/editorial/hero-coat-2.jpg"],
    alt: "Пальто оверсайз з хутряними манжетами EGO",
  },
  {
    eyebrow: "Готові капсули до твоєї події",
    title: (
      <>
        М&apos;якість, що <em>закохує</em>
      </>
    ),
    text: "Костюм-трійка з альпаки: довгий кардиган, укорочений топ і мініспідниця. Носи разом або окремо — образів безліч.",
    cta: { href: "/product/alpaca-three-piece", label: "Костюм-трійка" },
    images: ["/images/editorial/hero-alpaca.jpg", "/images/editorial/hero-alpaca-2.jpg"],
    alt: "Костюм-трійка з альпаки EGO у білому та чорному",
  },
  {
    eyebrow: "Cozy season",
    title: (
      <>
        Тепло, яке <em>виглядає дорого</em>
      </>
    ),
    text: "Костюм Bloom зі щільного турецького двостороннього флісу: кофта з коміром-стійкою та вишивкою, широкі штани на фіксаторах.",
    cta: { href: "/shop?category=suits", label: "Усі костюми" },
    images: ["/images/editorial/hero-bloom.jpg", "/images/editorial/hero-bloom-2.jpg"],
    alt: "Флісовий костюм Bloom EGO у чорному та молочному",
  },
  {
    eyebrow: "Evening",
    title: (
      <>
        Мерехтить, як <em>тисяча діамантів</em>
      </>
    ),
    text: "Сукня SAPFIR з королівського оксамиту з дрібною паєткою. Ідеальна посадка — і всі погляди твої.",
    cta: { href: "/product/sapfir-dress", label: "Сукня SAPFIR" },
    images: ["/images/editorial/hero-sapfir.jpg", "/images/editorial/hero-sapfir-2.jpg"],
    alt: "Сукня SAPFIR EGO з оксамиту з паєткою",
  },
];

const manifesto = [
  "EGO — це не просто одяг.",
  <em key="you">Це твій настрій.</em>,
  "Весілля, побачення, офіс чи прогулянка —",
  "у тебе завжди є що вдягнути.",
  <>
    Жіночий одяг, <em>який ти захочеш.</em>
  </>,
];

const instagram = Array.from({ length: 12 }, (_, i) => `ig-${i + 1}`);

export default async function HomePage() {
  const [categories, newIn, best, looks, colors, activities, all, sapfir, hoodie] = await Promise.all([
    getCategories(),
    getNewArrivals(8),
    getBestsellers(8),
    getLooks(),
    getColorFilters(),
    getActivities(),
    listProducts(),
    getProductBySlug("sapfir-dress"),
    getProductBySlug("home-hoodie"),
  ]);
  const activityCount = (a: string) => all.filter((p) => p.activities.includes(a as never)).length;

  return (
    <>
      <HeroSlider slides={slides} />

      {/* Categories */}
      <section className="section section--tight">
        <div className="container">
          <Rail
            label="Категорії"
            className="cats__track"
            head={
              <>
                <span className="eyebrow">Каталог</span>
                <h2 className="title">
                  Обери <em>свою</em> категорію
                </h2>
              </>
            }
            extra={
              <Link href="/shop" className="link-u">
                Весь каталог
              </Link>
            }
          >
            {categories.map((c) => (
              <Link key={c.slug} href={`/shop?category=${c.slug}`} className="cat">
                <span className="cat__img">
                  <Image src={c.image} alt="" fill sizes="(max-width: 760px) 40vw, 15vw" style={{ objectFit: "cover" }} />
                </span>
                <span className="cat__label">
                  {c.title} <small>{c.count}</small>
                </span>
              </Link>
            ))}
          </Rail>
        </div>
      </section>

      {/* New arrivals */}
      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <Rail
            label="Нові надходження"
            head={
              <>
                <span className="eyebrow">Осінь — зима 2026</span>
                <h2 className="title">
                  Нові <em>надходження</em>
                </h2>
              </>
            }
            extra={
              <Link href="/shop?sort=new" className="link-u">
                Дивитися все
              </Link>
            }
          >
            {newIn.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </Rail>
        </div>
      </section>

      {/* Evening feature */}
      <section className="feature feature--dark" aria-labelledby="evening-title">
        <div className="feature__media">
          <Image src="/images/editorial/evening.jpg" alt="Сукня SAPFIR з оксамиту з паєткою" fill sizes="(max-width: 960px) 100vw, 52vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="feature__panel">
          <Reveal>
            <span className="eyebrow">Evening by EGO</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display" id="evening-title">
              Головна подія <em>вечора</em>
            </h2>
          </Reveal>
          <div className="feature__row">
            <Reveal delay={160}>
              <div style={{ display: "grid", gap: 24 }}>
                <p className="lead">
                  Покликала подруга на весілля? Побачення? Ми зберемо образ під твою подію — від сукні з паєткою до корсета й шубки.
                </p>
                <div className="feature__list">
                  {sapfir && (
                    <Link href={`/product/${sapfir.slug}`}>
                      <span>Сукня {sapfir.name}</span>
                      <span>{formatPrice(sapfir.price)}</span>
                    </Link>
                  )}
                  <Link href="/shop?category=dresses">
                    <span>Усі сукні</span>
                    <span>→</span>
                  </Link>
                  <Link href="/shop?activity=event">
                    <span>Образи на подію</span>
                    <span>→</span>
                  </Link>
                </div>
                <Link href="/looks#evening" className="btn btn--light" style={{ justifySelf: "start" }}>
                  Капсула Evening
                </Link>
              </div>
            </Reveal>
            <Reveal delay={240} className="feature__thumb">
              <Image src="/images/editorial/hero-sapfir-2.jpg" alt="Сукня SAPFIR — деталь" fill sizes="20vw" style={{ objectFit: "cover" }} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Colours */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Твій настрій</span>
            <h2 className="title">
              Обери <em>свій</em> колір
            </h2>
          </div>
          <Reveal>
            <div className="palette">
              {colors.map((c) => (
                <Link key={c.family} href={`/shop?color=${c.family}`} className="palette__item">
                  <span className="palette__dot" style={{ background: c.hex }} />
                  {c.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Looks */}
      <section className="section section--soft">
        <div className="container">
          <Rail
            label="Капсули"
            className="looks__track"
            head={
              <>
                <span className="eyebrow">Готові капсули до твоєї події</span>
                <h2 className="title">
                  Образи, <em>зібрані за тебе</em>
                </h2>
                <p className="lead">Речі, які ідеально поєднуються між собою. Бери капсулу повністю або окремі речі.</p>
              </>
            }
            extra={
              <Link href="/looks" className="link-u">
                Усі капсули
              </Link>
            }
          >
            {looks.map((l) => (
              <Link key={l.slug} href={`/looks#${l.slug}`} className="look-card">
                <Image src={l.image} alt={`Капсула ${l.name}`} fill sizes="(max-width: 760px) 84vw, (max-width: 960px) 60vw, 33vw" style={{ objectFit: "cover" }} />
                <div className="look-card__body">
                  <span className="eyebrow">{l.tagline}</span>
                  <span className="look-card__name">{l.name}</span>
                  <span className="look-card__meta">
                    <span>{l.products.map((p) => p.product.name).join(" + ")}</span>
                    <span>{formatPrice(l.total)}</span>
                  </span>
                </div>
              </Link>
            ))}
          </Rail>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="section">
        <div className="container">
          <Rail
            label="Бестселери"
            head={
              <>
                <span className="eyebrow">Обирають найчастіше</span>
                <h2 className="title">
                  Наші <em>бестселери</em>
                </h2>
              </>
            }
            extra={
              <Link href="/shop" className="link-u">
                Каталог
              </Link>
            }
          >
            {best.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Rail>
        </div>
      </section>

      {/* HOME hoodie feature */}
      <section className="feature feature--reverse" aria-labelledby="home-title" style={{ background: "var(--bg-soft)" }}>
        <div className="feature__media">
          <Image src="/images/editorial/home-hoodie.jpg" alt="Худі HOME у молочному кольорі" fill sizes="(max-width: 960px) 100vw, 52vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="feature__panel">
          <Reveal>
            <span className="eyebrow">Подивись, скільки кольорів</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display" id="home-title">
              Худі <em>HOME</em>
            </h2>
          </Reveal>
          <div className="feature__row">
            <Reveal delay={160}>
              <div style={{ display: "grid", gap: 24 }}>
                <p className="lead">
                  Те саме худі, в якому хочеться провести всю зиму. Оверсайз, об&apos;ємний капюшон і дев&apos;ять кольорів — від молочного до
                  пляшкового.
                </p>
                {hoodie && (
                  <ul className="swatch-row" aria-label="Кольори худі HOME">
                    {hoodie.colors.map((c) => (
                      <li key={c.name}>
                        <Link href={`/product/${hoodie.slug}?color=${encodeURIComponent(c.name)}`} title={c.name} aria-label={c.name}>
                          <span style={{ background: c.hex }} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/product/home-hoodie" className="btn" style={{ justifySelf: "start" }}>
                  Обрати колір{hoodie ? ` · ${formatPrice(hoodie.price)}` : ""}
                </Link>
              </div>
            </Reveal>
            <Reveal delay={240} className="feature__thumb">
              <Image src="/images/editorial/home-hoodie-2.jpg" alt="Худі HOME у рожевому кольорі" fill sizes="20vw" style={{ objectFit: "cover" }} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Куди збираєшся?</span>
            <h2 className="title">
              Обирай за <em>приводом</em>
            </h2>
          </div>
          <div className="acts">
            {activities.map((a, i) => (
              <Reveal key={a.slug} delay={i * 80}>
                <Link href={`/shop?activity=${a.slug}`} className="act">
                  <Image src={a.image} alt="" fill sizes="(max-width: 960px) 50vw, 25vw" style={{ objectFit: "cover" }} />
                  <span className="act__title">{a.title}</span>
                  <span className="act__count">{activityCount(a.slug)} моделей</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fabrics */}
      <section className="section section--cream">
        <div className="container fabric">
          <div className="fabric__media">
            <Reveal className="fabric__img">
              <Image src="/images/editorial/knit.jpg" alt="В'язаний костюм з Туреччини в молочному кольорі" fill sizes="(max-width: 960px) 55vw, 28vw" style={{ objectFit: "cover" }} />
            </Reveal>
            <Reveal delay={120} className="fabric__img fabric__img--offset">
              <Image src="/images/editorial/knit-2.jpg" alt="В'язаний костюм у шоколадному кольорі" fill sizes="(max-width: 960px) 45vw, 22vw" style={{ objectFit: "cover" }} />
            </Reveal>
          </div>
          <div className="fabric__body">
            <span className="eyebrow">Якість, яку видно</span>
            <h2 className="title">
              Тканини, що <em>тримають форму</em>
            </h2>
            <p className="lead">
              Ми обираємо матеріали, у яких річ виглядає дорого і після десятого прання: щільні, приємні до тіла, з продуманим кроєм.
            </p>
            <ul className="fabric__facts">
              <li>
                <strong>Двосторонній фліс</strong>
                <span>Турецький, щільний — чудово зберігає тепло</span>
              </li>
              <li>
                <strong>Кашемір</strong>
                <span>Пальта, бомбери й тренчі на осінь і зиму</span>
              </li>
              <li>
                <strong>Шовк Армані</strong>
                <span>Легкі сукні та костюми з благородним блиском</span>
              </li>
              <li>
                <strong>В&apos;язка з Туреччини</strong>
                <span>М&apos;які костюми та светри відмінної якості</span>
              </li>
            </ul>
            <Link href="/shop?activity=cozy" className="link-u" style={{ justifySelf: "start" }}>
              Тепло і затишок <ArrowRight width={14} height={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="section">
        <div className="container">
          <Manifesto lines={manifesto} />
        </div>
      </section>

      {/* Instagram */}
      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">{site.socials.instagram.handle}</span>
              <h2 className="title">
                EGO <em>в Instagram</em>
              </h2>
            </div>
            <a href={site.socials.instagram.url} target="_blank" rel="noreferrer" className="link-u">
              <InstagramIcon width={15} height={15} /> {site.socials.instagram.handle}
            </a>
          </div>
        </div>
        <div className="insta">
          <div className="insta__track">
            {[...instagram, ...instagram].map((name, i) => (
              <a
                key={i}
                href={site.socials.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="insta__item"
                aria-hidden={i >= instagram.length || undefined}
                tabIndex={i >= instagram.length ? -1 : undefined}
                aria-label={i < instagram.length ? `Фото EGO в Instagram ${i + 1}` : undefined}
              >
                <Image src={`/images/editorial/${name}.jpg`} alt="" fill sizes="280px" style={{ objectFit: "cover" }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container" style={{ paddingBottom: "clamp(40px, 5vw, 80px)" }}>
        <ul className="perks">
          <li>
            <strong>Швидка відправка</strong>
            <span>Відправляємо одразу після підтвердження замовлення</span>
          </li>
          <li>
            <strong>Нова пошта</strong>
            <span>Відділення, поштомат або кур&apos;єр по всій Україні</span>
          </li>
          <li>
            <strong>Капсули під подію</strong>
            <span>Підберемо образ і розмір у Direct</span>
          </li>
          <li>
            <strong>Обмін і повернення</strong>
            <span>Якщо щось не підійшло — вирішимо</span>
          </li>
        </ul>
      </section>
    </>
  );
}
