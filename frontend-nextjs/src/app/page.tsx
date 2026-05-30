import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { HomeBanner } from "@/components/HomeBanner";
import { ProductCard } from "@/components/ProductCard";
import { getStorefrontCategories, getStorefrontProducts } from "@/utils/storefront";

const heroGifs = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmtpbGMxbTQ5ZWd4ZXA3Y2owc290OXR1YnBzOGFnMWNrdTI5MmdkbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/vFKqnCdLPNOKc/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Njc0NHUxZjZhdWN4azNkNzE3OGVvOXkxNzJodXVpcmxnZGRmYWQwMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/g88xUM1rTwjfLhoRYP/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWkzbjk5YTF4djRmZHdnNWJyNmtsNGRrZDFrN2RwNnMwb28yZmwyaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IcGkqdUmYLFGE/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmlyY3QwZXg5ZWY2bHM3ejYxYWQ5N2FrYmJlM2h0aWU0N2g5b2txNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/M4husJOeJQdKU/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmlyY3QwZXg5ZWY2bHM3ejYxYWQ5N2FrYmJlM2h0aWU0N2g5b2txNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QrYpdVF1uRvb2/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmlyY3QwZXg5ZWY2bHM3ejYxYWQ5N2FrYmJlM2h0aWU0N2g5b2txNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUPGcuomRFMUcsB9nO/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmlyY3QwZXg5ZWY2bHM3ejYxYWQ5N2FrYmJlM2h0aWU0N2g5b2txNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/klSQs4oaK1mOWPHLDh/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmlyY3QwZXg5ZWY2bHM3ejYxYWQ5N2FrYmJlM2h0aWU0N2g5b2txNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VLuEi3ijz0wrC/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmlyY3QwZXg5ZWY2bHM3ejYxYWQ5N2FrYmJlM2h0aWU0N2g5b2txNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RvGJFfFGVzjgU0TT4P/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmlyY3QwZXg5ZWY2bHM3ejYxYWQ5N2FrYmJlM2h0aWU0N2g5b2txNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/V0uPaov6B29Q0JwReK/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3c4Z2w5YWdpaW9sdG5kMGFvaXhpNWNhNm5wYnF4NXFnbmQ2bmxmcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jKaFXbKyZFja0/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3c4Z2w5YWdpaW9sdG5kMGFvaXhpNWNhNm5wYnF4NXFnbmQ2bmxmcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/daLw3QnTCkDjG/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3c4Z2w5YWdpaW9sdG5kMGFvaXhpNWNhNm5wYnF4NXFnbmQ2bmxmcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IgOEWPOgK6uVa/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3c4Z2w5YWdpaW9sdG5kMGFvaXhpNWNhNm5wYnF4NXFnbmQ2bmxmcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/piwLYTTDYHYQzFEySf/giphy.gif",
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
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Khung nổi bật</h2>
              <p className="mt-2 text-sm text-slate-600">
                Mảng GIF động để trang chủ bớt tĩnh và vào là thấy nổi bật ngay.
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
                    {category.description || "Nhóm hàng thiết yếu, dễ chọn nhanh."}
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
