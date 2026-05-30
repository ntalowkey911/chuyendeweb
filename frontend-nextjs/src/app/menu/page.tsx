import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ProductGrid } from "@/components/ProductGrid";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { SORT_OPTIONS } from "@/utils/catalog";
import { getStorefrontCategories, getStorefrontProducts } from "@/utils/storefront";

type SearchValue = string | string[] | undefined;

const CATEGORY_LABELS: Record<string, string> = {
  "cac-loai-hat-va-dau": "Các loại hạt và đậu",
  "trai-cay-va-rau-cu-say": "Trái cây và rau củ sấy",
  "luong-thuc-va-tinh-bot": "Lương thực và tinh bột",
  "nam-va-rong-bien": "Nấm và rong biển",
  "thuoc-nam": "Thuốc nam",
};

function readValue(value: SearchValue) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getCategoryLabel(value: string) {
  return CATEGORY_LABELS[value] || value;
}

function buildHref(values: {
  category?: string;
  sort?: string;
  keyword?: string;
}) {
  const query = new URLSearchParams();

  if (values.category) query.set("category", values.category);
  if (values.sort) query.set("sort", values.sort);
  if (values.keyword) query.set("keyword", values.keyword);

  const result = query.toString();
  return result ? `/menu?${result}` : "/menu";
}

function deriveCategories(products: Product[]): Category[] {
  const categoryMap = new Map<string, Category>();

  for (const product of products) {
    const slug = product.category?.trim();
    if (!slug || categoryMap.has(slug)) {
      continue;
    }

    categoryMap.set(slug, {
      id: slug,
      slug,
      name: getCategoryLabel(product.categoryName || slug),
      description: "",
    });
  }

  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchValue>>;
}) {
  const params = await searchParams;
  const currentCategory = decodeURIComponent(readValue(params.category));
  const keyword = readValue(params.keyword);
  const currentSort = readValue(params.sort);

  const [categories, allProducts, filteredProducts] = await Promise.all([
    getStorefrontCategories().catch((e) => { console.error("categories error", e); return [] as Category[]; }),
    getStorefrontProducts({
      activeOnly: true,
    }).catch((e) => { console.error("allProducts error", e); return [] as Product[]; }),
    getStorefrontProducts({
      activeOnly: true,
      category: currentCategory || undefined,
      keyword: keyword || undefined,
      sort: currentSort || undefined,
    }).catch((e) => { console.error("filteredProducts error", e); return [] as Product[]; }),
  ]);

  const visibleCategories = (categories.length > 0 ? categories : deriveCategories(allProducts)).map(
    (category) => ({
      ...category,
      name: getCategoryLabel(category.name),
    })
  );

  const selectedCategory = visibleCategories.find(
    (item) => item.slug.toLowerCase() === currentCategory.toLowerCase()
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-6 md:py-10">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
              {selectedCategory?.name || "Sản phẩm"}
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              {keyword
                ? `Kết quả cho từ khóa "${keyword}".`
                : selectedCategory
                  ? `Đang xem nhóm ${selectedCategory.name.toLowerCase()}.`
                  : "Chọn nhanh theo nhóm sản phẩm và sắp xếp gọn nhẹ hơn."}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-slate-700">Danh mục</p>

              <div className="mt-5 flex flex-col gap-2">
                {visibleCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={buildHref({
                      category: category.slug,
                      sort: currentSort,
                      keyword,
                    })}
                    className={
                      currentCategory.toLowerCase() === category.slug.toLowerCase()
                        ? "rounded-[1.25rem] bg-primary px-5 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(47,125,50,0.22)]"
                        : "rounded-[1.25rem] px-5 py-4 text-base font-semibold text-slate-800 transition-colors hover:bg-emerald-50 hover:text-primary"
                    }
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </aside>

            <section>
              <div className="mb-5 rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                      Sắp xếp
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {SORT_OPTIONS.map((option) => (
                        <Link
                          key={option.value || "newest"}
                          href={buildHref({
                            category: currentCategory,
                            sort: option.value,
                            keyword,
                          })}
                          className={
                            currentSort === option.value
                              ? "rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-primary"
                              : "rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700"
                          }
                        >
                          {option.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {(currentCategory || currentSort || keyword) && (
                    <Link
                      href="/menu"
                      className="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700"
                    >
                      Xóa lọc
                    </Link>
                  )}
                </div>
              </div>

              <ProductGrid products={filteredProducts} />
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
