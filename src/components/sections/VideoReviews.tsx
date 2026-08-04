import { Play } from "lucide-react";

const videos = [
  { title: "A10 Plus Unboxing", meta: "Customer experience" },
  { title: "CCTV Installation Tour", meta: "Real setup" },
  { title: "Projector Home Night", meta: "Living room review" },
];

export function VideoReviews() {
  return (
    <section className="container-shell section-pad py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Customer Video Reviews
        </p>
        <h2 className="section-title mt-2">
          See what our customers say after purchasing
        </h2>
        <p className="section-copy">
          Watch unboxing videos, installation guides, and real customer
          experiences.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {videos.map((video, index) => (
          <a
            key={video.title}
            href="#contact"
            className="group relative overflow-hidden rounded-2xl border border-line"
          >
            <div
              className="aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(160deg, rgba(14,64,84,0.55), rgba(37,150,190,0.35)), url('https://images.unsplash.com/photo-${
                  index === 0
                    ? "1593508512255-86ab42a8e620"
                    : index === 1
                      ? "1557597774-9c82b59f7120"
                      : "1522869635100-9f4c5e86aa37"
                }?auto=format&fit=crop&w=900&q=80')`,
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110">
                <Play className="size-6 fill-white" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold">
                {video.title}
              </p>
              <p className="text-sm text-white/80">{video.meta}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8">
        <a href="#contact" className="btn-primary">
          <Play className="size-4" />
          Watch Reviews
        </a>
      </div>
    </section>
  );
}
