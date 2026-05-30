import Link from "next/link";
import { Button } from "./ui/button";

const bannerGifs = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmtpbGMxbTQ5ZWd4ZXA3Y2owc290OXR1YnBzOGFnMWNrdTI5MmdkbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/vFKqnCdLPNOKc/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Njc0NHUxZjZhdWN4azNkNzE3OGVvOXkxNzJodXVpcmxnZGRmYWQwMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/g88xUM1rTwjfLhoRYP/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWkzbjk5YTF4djRmZHdnNWJyNmtsNGRrZDFrN2RwNnMwb28yZmwyaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IcGkqdUmYLFGE/giphy.gif",
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
        poster="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=70"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-harvesting-vegetables-1568458683504?download=1080p"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(18,18,18,0.88)_0%,rgba(93,31,16,0.72)_48%,rgba(250,162,44,0.18)_100%)]" />

      <div className="relative grid gap-8 px-6 py-10 sm:px-8 md:px-12 md:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-white/75">
            Kho ngon mỗi ngày
          </p>
          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Nông sản sấy, hạt và thực phẩm khô cho gian bếp gọn nhẹ hơn.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Chọn nhanh các món pantry thực dụng, giá rõ ràng, giao diện gọn trên điện thoại và
            dễ quản lý hơn cho shop.
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
