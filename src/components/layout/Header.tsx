"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart/CartProvider";
import { site } from "@/lib/config/site";
import { BagIcon, CloseIcon, HeartIcon, InstagramIcon, MenuIcon } from "@/components/ui/Icons";

interface MenuCategory {
  slug: string;
  title: string;
  image: string;
}

const left = [
  { href: "/shop", label: "Каталог" },
  { href: "/shop?sort=new", label: "Новинки" },
  { href: "/looks", label: "Капсули" },
];

const right = [
  { href: "/about", label: "Про бренд" },
  { href: "/size-guide", label: "Розміри" },
];

export function Header({ categories }: { categories: MenuCategory[] }) {
  const pathname = usePathname();
  const { count, wishlist, open, ready } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Hide on scroll down, show on scroll up — only after the first screen.
      setHidden(y > 480 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y <= 480) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menu]);

  const current = (href: string) => (href === pathname ? "page" : undefined);

  return (
    <>
      <header className={`header ${scrolled ? "header--scrolled" : ""} ${hidden && !menu ? "header--hidden" : ""}`}>
        <div className="container header__inner">
          <div className="header__left">
            <button className="icon-btn burger" onClick={() => setMenu(true)} aria-label="Відкрити меню" aria-expanded={menu}>
              <MenuIcon width={22} height={22} />
            </button>
            <nav className="nav" aria-label="Основна навігація">
              {left.map((l) => (
                <Link key={l.href} href={l.href} aria-current={current(l.href)}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className="header__logo" aria-label="EGO — на головну">
            <Image src="/brand/ego-mark.png" alt="EGO" width={525} height={198} priority sizes="110px" />
          </Link>

          <div className="header__actions">
            <nav className="nav" aria-label="Про бренд" style={{ marginRight: 18 }}>
              {right.map((l) => (
                <Link key={l.href} href={l.href} aria-current={current(l.href)}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <a className="icon-btn hide-sm" href={site.socials.instagram.url} target="_blank" rel="noreferrer" aria-label="Instagram EGO">
              <InstagramIcon width={20} height={20} />
            </a>
            <Link className="icon-btn hide-sm" href="/wishlist" aria-label={`Обране${ready && wishlist.length ? `: ${wishlist.length}` : ""}`}>
              <HeartIcon width={21} height={21} />
              {ready && wishlist.length > 0 && <span className="count-badge">{wishlist.length}</span>}
            </Link>
            <button className="icon-btn" onClick={open} aria-label={`Кошик${ready && count ? `: ${count}` : ""}`}>
              <BagIcon width={21} height={21} />
              {ready && count > 0 && <span className="count-badge">{count}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`mmenu ${menu ? "mmenu--open" : ""}`} inert={!menu}>
        <div className="mmenu__backdrop" onClick={() => setMenu(false)} />
        <div className="mmenu__panel" role="dialog" aria-modal="true" aria-label="Меню">
          <div className="mmenu__head">
            <Image src="/brand/ego-mark.png" alt="EGO" width={525} height={198} sizes="90px" />
            <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Закрити меню">
              <CloseIcon />
            </button>
          </div>
          <nav className="mmenu__links" aria-label="Меню">
            {[...left, ...right, { href: "/contacts", label: "Контакти" }, { href: "/wishlist", label: "Обране" }].map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mmenu__cats">
            {categories.map((c) => (
              <Link key={c.slug} href={`/shop?category=${c.slug}`}>
                <span className="mmenu__img">
                  <Image src={c.image} alt="" fill sizes="200px" style={{ objectFit: "cover" }} />
                </span>
                {c.title}
              </Link>
            ))}
          </div>
          <div className="mmenu__foot">
            <a href={site.socials.instagram.url} target="_blank" rel="noreferrer" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <InstagramIcon width={16} height={16} /> {site.socials.instagram.handle}
            </a>
            <span className="note">Швидка відправка · Обмін і повернення</span>
          </div>
        </div>
      </div>
    </>
  );
}
