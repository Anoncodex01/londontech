import { BRAND } from "@/lib/constants";

const statuses = [
  { label: "In Stock", color: "bg-emerald-500", ring: "bg-emerald-50 text-emerald-800" },
  { label: "Limited Stock", color: "bg-amber-400", ring: "bg-amber-50 text-amber-800" },
  { label: "Out of Stock", color: "bg-rose-500", ring: "bg-rose-50 text-rose-800" },
];

export function StockStatus() {
  return (
    <section className="container-shell section-pad py-10 md:py-14">
      <div className="grid gap-8 rounded-[2rem] border border-line bg-white/80 p-6 md:grid-cols-2 md:p-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Real-Time Stock Status
          </p>
          <h2 className="section-title mt-2">Know before you order</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {statuses.map((status) => (
              <span
                key={status.label}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${status.ring}`}
              >
                <span className={`size-2.5 rounded-full ${status.color}`} />
                {status.label}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-ink">
            Estimated Delivery
          </h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-brand-soft px-4 py-3 text-brand-deeper">
              {BRAND.delivery.dar}
            </div>
            <div className="rounded-xl bg-surface px-4 py-3 text-ink-soft">
              {BRAND.delivery.regions}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
