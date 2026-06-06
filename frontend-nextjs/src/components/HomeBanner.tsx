import Link from "next/link";
import { Button } from "./ui/button";

const bannerGifs = [
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop",
];

export function HomeBanner() {
  return (
    <section className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-[#1d1b19] text-white shadow-[0_35px_80px_rgba(35,24,12,0.25)]">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-burger-and-fries-4074/1080p.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(18,18,18,0.88)_0%,rgba(93,31,16,0.72)_48%,rgba(250,162,44,0.18)_100%)]" />

      <div className="relative grid gap-8 px-6 py-10 sm:px-8 md:px-12 md:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-white/75">
            Món ngon nóng hổi
          </p>
          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Giao hàng cực tốc độ, vị ngon giòn rụm không thể chối từ.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Khám phá thực đơn đa dạng với Gà Rán, Burger và những Combo siêu tiết kiệm. Đặt ngay để thưởng thức bữa ăn hoàn hảo của bạn!
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/menu">
              <Button className="rounded-full bg-primary px-6 py-6 font-bold text-white hover:bg-primary/90">
                Xem sản phẩm
              </Button>
            </Link>
            <Link href="/orders">
              <Button
                variant="outline"
                className="rounded-full border-white/20 bg-white/10 px-6 py-6 font-bold text-white hover:bg-white/15"
              >
                Đơn hàng của tôi
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden gap-4 lg:grid">
          {bannerGifs.map((gif, index) => (
            <div
              key={gif}
              className={`overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/10 backdrop-blur-sm ${
                index === 0 ? "rotate-[-2deg]" : index === 1 ? "translate-x-6" : "rotate-[2deg]"
              }`}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={gif}
                  alt={`Khung chuyển động ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
