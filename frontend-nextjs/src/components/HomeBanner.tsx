import Link from "next/link";
import { Button } from "./ui/button";

export function HomeBanner() {
  return (
    <section className="relative mb-12 overflow-hidden rounded-lg bg-white">
      <img
        src="https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=75"
        alt="Nông sản khô và hạt dinh dưỡng"
        className="h-[420px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex max-w-2xl flex-col justify-center px-6 text-white md:px-12">
        <h1 className="text-4xl font-black leading-tight md:text-5xl">
          Nông sản khô, hạt và thực phẩm tiện trữ
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85">
          Trái cây sấy, hạt dinh dưỡng, lương thực khô, nấm và rong biển cho gian bếp gọn hơn.
        </p>
        <div className="mt-6">
          <Link href="/menu">
            <Button className="rounded-lg bg-primary px-6 py-5 font-bold text-white hover:bg-primary/90">
              Xem sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
