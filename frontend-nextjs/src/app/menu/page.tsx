import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ProductGrid } from "@/components/ProductGrid";
import { PRICE_FILTERS, PRODUCT_CATEGORIES } from "@/utils/catalog";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; keyword?: string; price?: string }>;
}) {
  const params = await searchParams;
  const currentCategory = params.category ?? "";
  const keyword = params.keyword ?? "";
  const currentPrice = params.price ?? "";
  const heading =
    PRODUCT_CATEGORIES.find((item) => item.value === currentCategory)?.label ||
    "Tất cả sản phẩm";

  const buildHref = (category?: string, price?: string, search?: string) => {
    const query = new URLSearchParams();
    if (category) query.set("category", category);
    if (price) query.set("price", price);
    if (search) query.set("keyword", search);
    const value = query.toString();
    return value ? `/menu?${value}` : "/menu";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10">
        <Container>
          <div className="flex flex-col gap-10 lg:flex-row">
            <aside className="w-full lg:w-80">
              <div className="sticky top-28 rounded-3xl bg-[#fdf1ef] p-6">
                <h2 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                  Danh mục
                </h2>
                <div className="space-y-2">
                  <Link
                    href={buildHref("", currentPrice, keyword)}
                    className={
                      currentCategory === ""
                        ? "block rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md"
                        : "block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
                    }
                  >
                    Tất cả
                  </Link>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <Link
                      key={category.value}
                      href={buildHref(category.value, currentPrice, keyword)}
                      className={
                        currentCategory === category.value
                          ? "block rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md"
                          : "block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
                      }
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>

                <h2 className="mb-5 mt-8 text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                  Bộ lọc giá
                </h2>
                <div className="space-y-2">
                  {PRICE_FILTERS.map((price) => (
                    <Link
                      key={price.value || "all"}
                      href={buildHref(currentCategory, price.value, keyword)}
                      className={
                        currentPrice === price.value
                          ? "block rounded-2xl bg-white px-4 py-3 text-sm font-bold text-primary shadow-sm"
                          : "block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
                      }
                    >
                      {price.label}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            <section className="flex-1">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-4xl font-black text-primary">{heading}</h1>
                  <p className="mt-2 text-slate-600">
                    {keyword
                      ? `Kết quả cho từ khóa "${keyword}".`
                      : "Danh sách nông sản sấy, hạt, tinh bột và nấm khô."}
                  </p>
                </div>
                {(currentCategory || currentPrice || keyword) && (
                  <Link href="/menu" className="text-sm font-bold text-primary hover:underline">
                    Xóa bộ lọc
                  </Link>
                )}
              </div>

              <ProductGrid
                category={currentCategory || undefined}
                keyword={keyword || undefined}
                priceFilter={currentPrice || undefined}
              />
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
