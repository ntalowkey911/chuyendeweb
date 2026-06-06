import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#eadfd7] bg-[#2f2521] py-10 text-white">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <Link href="/" className="flex shrink-0 items-center gap-3 text-xl font-black tracking-tight text-[#ffd3c2] md:text-2xl">
              <img src="/logo.png" alt="FastBite Logo" className="h-16 w-auto object-contain" />
              FastBite
            </Link>
            <p className="max-w-md text-sm leading-7 text-slate-300">
              FastBite tự hào mang đến những bữa ăn nhanh, nóng hổi và ngon miệng. Cam kết nguyên liệu sạch, phục vụ chu đáo, giao hàng cực tốc độ.
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <h4 className="font-bold uppercase tracking-wider text-white">Liên hệ</h4>
            <p>Hotline: 0900 000 001</p>
            <p>Email: support@fastbite.vn</p>
            <p>Giờ mở cửa: 08:00 - 21:30</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-white">Đi nhanh</h4>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <Link href="/menu" className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
                Sản phẩm
              </Link>
              <Link href="/cart" className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
                Giỏ hàng
              </Link>
              <Link href="/orders" className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
                Đơn hàng
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} FastBite. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
