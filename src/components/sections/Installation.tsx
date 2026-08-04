import { Wrench } from "lucide-react";

const services = [
  "CCTV Cameras",
  "Wi-Fi Routers",
  "Smart Home Devices",
  "Projectors",
];

export function Installation() {
  return (
    <section className="container-shell section-pad py-10 md:py-14">
      <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-brand-soft via-white to-white p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Installation Services
          </p>
          <h2 className="section-title mt-2">
            Need help installing your products?
          </h2>
          <p className="section-copy">
            We provide installation support for selected products so you can
            start using your tech with confidence.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {services.map((service) => (
              <li
                key={service}
                className="flex items-center gap-2 text-sm font-medium text-ink-soft"
              >
                <span className="size-1.5 rounded-full bg-brand" />
                {service}
              </li>
            ))}
          </ul>
          <a href="/contact" className="btn-primary mt-8">
            <Wrench className="size-4" />
            Book Installation
          </a>
        </div>
        <div className="relative min-h-56 overflow-hidden rounded-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(145deg, rgba(14,64,84,0.45), rgba(37,150,190,0.25)), url('https://images.unsplash.com/photo-1558002038-1055907dfabb?auto=format&fit=crop&w=1200&q=80')",
            }}
          />
        </div>
      </div>
    </section>
  );
}
