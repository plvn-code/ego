import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/catalog/repository";
import { site } from "@/lib/config/site";
import { InstagramIcon, SendIcon } from "@/components/ui/Icons";
import { MadeBy } from "./MadeBy";

export async function Footer() {
  const categories = await getCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Image src="/brand/ego-logo-white.png" alt="EGO — women wear" width={524} height={308} sizes="170px" />
          <p>Жіночий одяг, який ти захочеш. Готові капсули до твоєї події, швидка відправка, обмін і повернення.</p>
          <div className="footer__social">
            <a href={site.socials.instagram.url} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon width={18} height={18} />
            </a>
            <a href={site.directUrl} target="_blank" rel="noreferrer" aria-label="Написати в Direct">
              <SendIcon width={18} height={18} />
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h3>Каталог</h3>
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`}>{c.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3>Покупцям</h3>
          <ul>
            <li>
              <Link href="/info/delivery">Доставка та оплата</Link>
            </li>
            <li>
              <Link href="/info/returns">Обмін і повернення</Link>
            </li>
            <li>
              <Link href="/size-guide">Розмірна сітка</Link>
            </li>
            <li>
              <Link href="/wishlist">Обране</Link>
            </li>
            <li>
              <Link href="/cart">Кошик</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h3>EGO</h3>
          <ul>
            <li>
              <Link href="/about">Про бренд</Link>
            </li>
            <li>
              <Link href="/looks">Капсули</Link>
            </li>
            <li>
              <Link href="/contacts">Контакти</Link>
            </li>
            <li>
              <a href={site.socials.instagram.url} target="_blank" rel="noreferrer">
                {site.socials.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Link href="/" className="footer__word" aria-label="EGO — на головну">
        <Image src="/brand/ego-mark-white.png" alt="" width={525} height={198} sizes="100vw" />
      </Link>

      <div className="container footer__bottom">
        <span>© {year} EGO · women wear</span>
        <nav aria-label="Документи">
          <Link href="/info/offer">Публічна оферта</Link>
          <Link href="/info/privacy">Конфіденційність</Link>
        </nav>
        <MadeBy />
      </div>
    </footer>
  );
}
