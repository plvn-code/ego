import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config/site";
import { BagIcon, InstagramIcon, SendIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Контакти",
  description: "Зв'язатися з EGO: Instagram Direct. Відповіді на часті питання про доставку, оплату, розміри та повернення.",
};

const faq = [
  {
    q: "Як оформити замовлення?",
    a: "Додай речі в кошик і заповни коротку форму. Одразу після цього менеджер зв'яжеться з тобою в зручному месенджері або за телефоном, підтвердить наявність і розмір та надішле реквізити для оплати.",
  },
  {
    q: "Коли ви відправляєте замовлення?",
    a: `Одразу після підтвердження замовлення — Новою поштою до відділення, поштомату або кур'єром. Термін доставки — ${site.delivery.term}.`,
  },
  {
    q: "Допоможете зібрати образ на подію?",
    a: "Так! Напиши в Direct, куди збираєшся — весілля, побачення, день народження чи просто прогулянка, — і ми підберемо готову капсулу під твій запит.",
  },
  {
    q: "Як обрати розмір?",
    a: "Звір свої обхвати з розмірною сіткою на сторінці «Розміри» або напиши нам у Direct свій зріст і параметри — підберемо посадку для конкретної моделі.",
  },
  {
    q: "Можна обміняти чи повернути річ?",
    a: "Так, у нас є повернення та обмін. Товар має бути новим, без слідів носіння, у повній комплектації. Напиши нам у Direct — підкажемо, як оформити.",
  },
];

export default function ContactsPage() {
  return (
    <div className="container">
      <div className="page-hero">
        <nav aria-label="Хлібні крихти">
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li aria-current="page">Контакти</li>
          </ol>
        </nav>
        <h1 className="page-title">
          Ми на <em className="serif-em">зв&apos;язку</em>
        </h1>
        <p className="lead">Питання щодо розміру, наявності чи замовлення — пиши нам, відповімо й допоможемо з вибором.</p>
      </div>

      <div className="contact-cards">
        <a className="contact-card" href={site.directUrl} target="_blank" rel="noreferrer">
          <SendIcon width={26} height={26} />
          <h3>Direct</h3>
          <p>Найшвидший спосіб: підбір розміру, наявність, статус замовлення.</p>
          <span className="link-u" style={{ justifySelf: "start" }}>
            Написати
          </span>
        </a>
        <a className="contact-card" href={site.socials.instagram.url} target="_blank" rel="noreferrer">
          <InstagramIcon width={26} height={26} />
          <h3>Instagram</h3>
          <p>Новинки, живі відео, огляди та відгуки — {site.socials.instagram.handle}.</p>
          <span className="link-u" style={{ justifySelf: "start" }}>
            Відкрити
          </span>
        </a>
        <Link className="contact-card" href="/looks">
          <BagIcon width={26} height={26} />
          <h3>Капсули</h3>
          <p>Готові образи до твоєї події — від побачення до офісу.</p>
          <span className="link-u" style={{ justifySelf: "start" }}>
            Дивитися
          </span>
        </Link>
      </div>

      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="section-head">
          <div className="section-head__text">
            <span className="eyebrow">FAQ</span>
            <h2 className="title">
              Часті <em>питання</em>
            </h2>
          </div>
        </div>
        <div className="accordion faq">
          {faq.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <div className="accordion__body">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
