export const dynamic = "force-dynamic";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { HomeBanner } from "@/components/HomeBanner";
import { ProductCard } from "@/components/ProductCard";
import { getStorefrontCategories, getStorefrontProducts } from "@/utils/storefront";

const heroGifs = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop", // Burger
  "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop", // Fries
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop", // Pizza
  "https://images.unsplash.com/photo-1558857563-b371033873b8?w=800&auto=format&fit=crop", // Boba
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop", // Burger 2
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop", // Pizza 2
  "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop", // Fried Chicken
  "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop", // Burger Meal
  "https://images.unsplash.com/photo-1543253687-c931c8e01820?w=800&auto=format&fit=crop", // Sprite/Drink
  "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&auto=format&fit=crop", // Ice cream
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop", // Salad
  "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&auto=format&fit=crop", // Soup
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop", // Ribs/Meat
];

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getStorefrontProducts({ activeOnly: true, sort: "best-selling", limit: 12 }).catch(() => []),
    getStorefrontCategories().catch(() => []),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-6 md:py-10">
        <Container>
          <HomeBanner />

          <section className="mb-14">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Góc Gây Nghiện</h2>
              <p className="mt-2 text-sm text-slate-600">
                Nhìn là muốn cắn ngay một miếng!
              </p>
            </div>

            <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
              {heroGifs.map((gif, index) => (
                <div
                  key={gif}
                  className={`mb-4 break-inside-avoid overflow-hidden rounded-[1.25rem] border border-slate-100 bg-white shadow-sm ${
                    index % 5 === 0 ? "h-[300px]" : index % 3 === 0 ? "h-[220px]" : "h-[180px]"
                  }`}
                >
                  <img
                    src={gif}
                    alt={`Gif nổi bật ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Danh mục chính</h2>
              </div>
              <Link href="/menu" className="text-sm font-bold text-primary hover:underline">
                Xem tất cả
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/menu?category=${category.slug}`}
                  className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-primary">
                    <span className="text-lg font-black">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {category.description || "Danh mục món ăn nhanh, lựa chọn đa dạng."}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Sản phẩm nổi bật</h2>
              </div>
              <Link href="/menu?sort=best-selling" className="text-sm font-bold text-primary hover:underline">
                Lọc bán chạy
              </Link>
            </div>

            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[240px] max-w-[240px] snap-start sm:min-w-[280px] sm:max-w-[280px]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
