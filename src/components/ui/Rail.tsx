"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "./Icons";

/**
 * Horizontal scroll-snap rail with arrow buttons rendered into the section head.
 * `head` is the left part of the section header (title etc.), `extra` sits next to the arrows.
 */
export function Rail({
  head,
  extra,
  children,
  className = "",
  label,
}: {
  head: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="rail">
      <div className="section-head">
        <div className="section-head__text">{head}</div>
        <div className="section-head__side">
          {extra}
          <div className="rail__arrows">
            <button className="rail__arrow" onClick={() => go(-1)} disabled={edge.start} aria-label="Назад">
              <ChevronLeft width={18} height={18} />
            </button>
            <button className="rail__arrow" onClick={() => go(1)} disabled={edge.end} aria-label="Далі">
              <ChevronRight width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
      <div className={`rail__track ${className}`} ref={track} onScroll={update} role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}
