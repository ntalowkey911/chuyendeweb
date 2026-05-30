import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#eadfd7] bg-[#2f2521] py-10 text-white">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-black tracking-tight text-[#ffd3c2]">
              Nông Sản Sấy
            </Link>
            <p className="max-w-md text-sm leading-7 text-slate-300">
              Shop thực phẩm khô tối ưu cho việc mua nhanh, quản lý gọn và hiển thị tốt trên điện thoại lẫn desktop.
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <h4 className="font-bold uppercase tracking-wider text-white">Liên hệ</h4>
            <p>Hotline: 0900 000 001</p>
            <p>Email: support@nongsansay.vn</p>
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
          © 2026 Nông Sản Sấy. Next.js + Spring Boot.
        </div>
      </Container>
    </footer>
  );
}
