type P = React.SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const BagIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 8h14l-1 12.5H6L5 8Z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </svg>
);
export const HeartIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
  </svg>
);
export const UserIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20.5c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
  </svg>
);
export const MenuIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3.5 8h17M3.5 16h17" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const ChevronDown = (p: P) => (
  <svg viewBox="0 0 12 12" width="10" height="10" {...base} {...p}>
    <path d="M2.5 4.5 6 8l3.5-3.5" />
  </svg>
);
export const ChevronLeft = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
export const ChevronRight = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);
export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <path d="M9 4.5 16.5 12 9 19.5" />
  </svg>
);
export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const TruckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7" />
    <circle cx="6.5" cy="17.5" r="1.6" />
    <circle cx="17" cy="17.5" r="1.6" />
  </svg>
);
export const GlobeIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5Z" />
  </svg>
);
export const ReturnIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 9h11a5 5 0 0 1 0 10H8" />
    <path d="M8 5 4 9l4 4" />
  </svg>
);
export const SparkIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
);
export const InstagramIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);
export const TikTokIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M14 3.5v11.2a3.8 3.8 0 1 1-3.8-3.8" />
    <path d="M14 3.5c.4 2.6 2.3 4.4 5 4.6" />
  </svg>
);
export const ThreadsIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M17.2 8.2C16.3 5.4 14.3 4 11.8 4 7.6 4 5 7.2 5 12s2.6 8 6.8 8c3.4 0 5.9-2 5.9-4.9 0-2.6-2-4.2-5.2-4.2-2.2 0-3.6 1.1-3.6 2.6 0 1.4 1.2 2.3 2.8 2.3 2.6 0 3.7-2 3.7-5.6" />
  </svg>
);
export const PinIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const RulerIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3 16.5 16.5 3 21 7.5 7.5 21 3 16.5Z" />
    <path d="m7 12.5 2 2M10 9.5l2 2M13 6.5l2 2" />
  </svg>
);
export const SendIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M21 3 10.5 13.5" />
    <path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z" />
  </svg>
);
export const NeedleIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 20 17.5 6.5" />
    <path d="M16 4.5 19.5 8a1.5 1.5 0 0 0 0-2.1l-1.4-1.4a1.5 1.5 0 0 0-2.1 0Z" />
    <path d="M14 10c3 1 4 4 1.5 6.5S9 18 8 15" />
  </svg>
);
export const ClockIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const SearchIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
