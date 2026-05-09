import React from "react";
import { Container } from "./Container";
import Link from "next/link";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="bg-[#3b2e2d] text-white pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tighter text-[#ffb6b6]">
                FASTFOOD & DRINKS
              </span>
            </Link>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Chúng tôi mang đến những món ăn nhanh ngon nhất, giao tận nơi trong vòng 30 phút. Luôn nóng hổi, luôn chất lượng.
            </p>
            <div className="flex space-x-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-white uppercase tracking-wider">Thông tin</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><span className="text-white">Liên hệ:</span> 1900 1234</li>
              <li><span className="text-white">Giờ mở cửa:</span> 08:00 - 22:00</li>
              <li><Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-white uppercase tracking-wider">Đăng ký nhận tin</h4>
            <p className="text-sm text-slate-300">
              Nhận ngay mã giảm giá 20% cho đơn hàng đầu tiên!
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-white/40"
              />
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-md px-4 py-3 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-slate-400">
          <p>© 2024 FASTFOOD & DRINKS. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
