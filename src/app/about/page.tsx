import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/config/site";
import { Manifesto } from "@/components/home/Manifesto";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon, SendIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Про бренд",
  description: "EGO — жіночий одяг, який ти захочеш. Готові капсули до твоєї події: весілля, побачення, прогулянка чи просто бажання себе порадувати.",
};

const manifesto = [
  "Покликала подруга на весілля?",
  "Побачення? Прогулянка в парк?",
  <>
    Чи просто бажання <em>себе порадувати?</em>
  </>,
  "Тут ти знайдеш усе — і навіть більше.",
];

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero__media">
          {["hero-alpaca", "hero-coat", "knit"].map((n) => (
            <div key={n}>
              <Image src={`/images/editorial/${n}.jpg`} alt="" fill priority sizes="(max-width: 960px) 50vw, 33vw" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
        <div className="container about-hero__body">
          <span className="eyebrow">EGO · women wear · estd 2026</span>
          <h1 className="display">
            Жіночий одяг, <em>який ти захочеш</em>
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container story">
          <Reveal className="story__media">
            <Image src="/images/editorial/about.jpg" alt="Костюм-трійка з альпаки в шоколадному кольорі" fill sizes="(max-width: 960px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </Reveal>
          <div className="story__body">
            <span className="eyebrow">Давай знайомитись</span>
            <h2 className="title">
              Поруч у <em>будь-якій ситуації</em>
            </h2>
            <p className="lead">
              EGO — це місце, яке допоможе тобі в будь-якій ситуації. Ми завжди поруч і завжди розуміємо твій запит: від затишного
              флісового костюма на кожен день до сукні, в якій ти — головна подія вечора.
            </p>
            <p className="lead">
              У Direct на тебе чекає наш менеджер: відповість на всі питання, допоможе з розміром і оформить тобі доставку краси.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">EGO</span>
            <h2 className="title">
              Що для нас <em>важливо</em>
            </h2>
          </div>
          <div className="values">
            <Reveal className="value">
              <b>01</b>
              <h3>Тканини, які видно</h3>
              <p>Турецький двосторонній фліс, кашемір, велюр, шовк Армані, в&apos;язка з Туреччини — речі, що виглядають дорого і тримають форму.</p>
            </Reveal>
            <Reveal className="value" delay={100}>
              <b>02</b>
              <h3>Готові капсули</h3>
              <p>Збираємо образи під твою подію: весілля, побачення, офіс, подорож у гори чи прогулянка містом.</p>
            </Reveal>
            <Reveal className="value" delay={200}>
              <b>03</b>
              <h3>Турбота в деталях</h3>
              <p>Швидка відправка, допомога з розміром у Direct, обмін і повернення, якщо щось не підійшло.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Manifesto lines={manifesto} />
        </div>
      </section>

      <section className="feature feature--dark">
        <div className="feature__media">
          <Image src="/images/editorial/about-2.jpg" alt="Велюровий костюм In My Prime Era у шоколадному кольорі" fill sizes="(max-width: 960px) 100vw, 52vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="feature__panel">
          <span className="eyebrow">{site.socials.instagram.handle}</span>
          <h2 className="display">
            Пиши нам <em>у Direct</em>
          </h2>
          <p className="lead">
            Живі відео, огляди, відгуки і всі новинки — в Instagram. А в Direct підберемо розмір і зберемо образ саме під тебе.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={site.directUrl} target="_blank" rel="noreferrer" className="btn btn--light">
              <SendIcon width={16} height={16} /> Написати
            </a>
            <a href={site.socials.instagram.url} target="_blank" rel="noreferrer" className="btn btn--ghost-light">
              <InstagramIcon width={16} height={16} /> Instagram
            </a>
            <Link href="/shop" className="btn btn--ghost-light">
              До каталогу
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
