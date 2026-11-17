import type { SizeChart as Chart } from "@/lib/catalog/types";

export function SizeChart({ chart, caption, highlight }: { chart: Chart; caption: string; highlight?: string[] }) {
  return (
    <div className="table-wrap">
      <table className="size-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: "left" }}>
              Розмір
            </th>
            {chart.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((r) => (
            <tr key={r.size} style={highlight?.includes(r.size) ? { background: "var(--cream-2)" } : undefined}>
              <th scope="row">{r.size}</th>
              {r.values.map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
