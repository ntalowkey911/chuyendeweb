import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { CustomComboBuilder } from "@/components/CustomComboBuilder";
import { Product } from "@/types/product";
import api from "@/services/api";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await api.get("/products");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch products for custom combo:", error);
    return [];
  }
}

export default async function CustomComboPage() {
  const products = await getProducts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <Container>
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
              Tạo <span className="text-primary">Combo</span> Của Riêng Bạn
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Thỏa sức kết hợp các món ăn yêu thích với giá ưu đãi. Tiết kiệm hơn 15% khi tạo combo từ 3 món trở lên!
            </p>
          </div>

          {products.length > 0 ? (
            <CustomComboBuilder products={products} />
          ) : (
            <div className="py-20 text-center text-slate-500">
              <p>Không thể tải danh sách món ăn. Vui lòng thử lại sau.</p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
