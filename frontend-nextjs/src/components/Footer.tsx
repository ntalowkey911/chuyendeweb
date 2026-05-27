import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#3b2e2d] pb-8 pt-16 text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-5">
            <Link href="/" className="text-2xl font-black tracking-tight text-[#ffb6b6]">
              FASTFOOD & DRINKS
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-300">
              Giao đồ ăn nhanh, đậm vị, gọn đẹp và ổn định với giao diện mới kết hợp từ FE2 và backend Spring Boot.
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-300">
            <h4 className="font-bold uppercase tracking-wider text-white">Thông tin</h4>
            <p>Hotline: 1900 1234</p>
            <p>Giờ mở cửa: 08:00 - 22:00</p>
            <p>Email: support@fastfooddrinks.vn</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-white">Điều hướng nhanh</h4>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <Link href="/menu" className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
                Thực đơn
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

        <div className="mt-14 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          © 2026 FASTFOOD & DRINKS. Next.js + Spring Boot.
        </div>
      </Container>
    </footer>
  );
}
