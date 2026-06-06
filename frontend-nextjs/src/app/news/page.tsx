import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import articleService from "@/services/articleService";
import type { Article } from "@/types/article";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức - FastBite",
  description: "Cập nhật những tin tức, ưu đãi và mẹo hay mới nhất từ FastBite.",
};

async function getArticles() {
  try {
    const res = await articleService.getArticles(0, 50); // Get first 50 articles
    return res.data.content;
  } catch (err) {
    console.error("Failed to fetch articles", err);
    return [];
  }
}

export default async function NewsPage() {
  const articles: Article[] = await getArticles();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Tin tức & Góc chia sẻ
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Cập nhật những câu chuyện, mẹo hay và thông tin khuyến mãi mới nhất từ FastBite
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              Chưa có bài viết nào được đăng tải. Hãy quay lại sau nhé!
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    {article.imageUrl ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>{article.author || "Admin"}</span>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <h2 className="mb-3 text-xl font-black text-slate-900 group-hover:text-primary">
                      {article.title}
                    </h2>
                    <p className="line-clamp-3 text-slate-600 flex-1">
                      {article.summary || article.content.substring(0, 100) + "..."}
                    </p>
                    <div className="mt-4 flex items-center font-bold text-primary">
                      Đọc tiếp
                      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
