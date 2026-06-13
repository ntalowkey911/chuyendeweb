import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { CustomComboBuilder } from "@/components/CustomComboBuilder";
import { getStorefrontProducts } from "@/utils/storefront";

export const dynamic = "force-dynamic";

export default async function CustomComboPage() {
  const products = await getStorefrontProducts({ activeOnly: true }).catch(() => []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="text-3xl font-black text-slate-900 sm:text-5xl">
              Tạo Combo Của Bạn
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500 sm:text-lg">
              Tự do phối hợp các món ăn yêu thích để tạo ra một bữa ăn hoàn hảo. 
              Thêm tất cả vào giỏ hàng chỉ với một cú click!
            </p>
          </div>

          <CustomComboBuilder products={products} />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
