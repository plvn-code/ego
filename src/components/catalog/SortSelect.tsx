"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortKey } from "@/lib/catalog/repository";
import { ChevronDown } from "@/components/ui/Icons";

const options: { value: SortKey; label: string }[] = [
  { value: "new", label: "Спочатку новинки" },
  { value: "price-asc", label: "Ціна: за зростанням" },
  { value: "price-desc", label: "Ціна: за спаданням" },
];

export function SortSelect({ value }: { value: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString());
    if (e.target.value === "new") next.delete("sort");
    else next.set("sort", e.target.value);
    const q = next.toString();
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  return (
    <label className="select">
      <span className="sr-only">Сортування</span>
      <select value={value} onChange={onChange}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown width={14} height={14} />
    </label>
  );
}
