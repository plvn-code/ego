"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Keep in sync with the inline script in app/layout.tsx */
const INTRO_KEY = "ego.intro.seen";

/**
 * Logo reveal on a graphite curtain — once per browser session.
 * Rendered on the server so there is no flash of the page before it; an inline
 * script in <head> adds `intro-seen` to <html> on repeat views (CSS hides it).
 */
export function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(INTRO_KEY));
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      seen = true;
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => setShow(false), 2600);
    return () => window.clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro__inner">
        <Image className="intro__logo" src="/brand/ego-mark-white.png" alt="" width={525} height={198} priority sizes="360px" />
        <span className="intro__tag">women wear · estd 2026</span>
      </div>
    </div>
  );
}
