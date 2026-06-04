import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import articleService from "@/services/articleService";
import type { Article } from "@/types/article";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  try {
    const res = await articleService.getArticleBySlug(params.slug);
    const article = res.data;
    
    return {
      title: `${article.title} - Nông Sản Sấy`,
      description: article.summary,
      openGraph: {
        images: article.imageUrl ? [article.imageUrl] : [],
      },
    };
  } catch (err) {
    return {
      title: "Bài viết không tồn tại",
    };
  }
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await articleService.getArticleBySlug(slug);
    return res.data;
  } catch (err) {
    return null;
  }
}

export default async function NewsDetailPage(props: Props) {
  const params = await props.params;
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Container className="max-w-4xl py-12 md:py-20">
          <Link href="/news" className="mb-8 inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary">
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Quay lại Tin tức
          </Link>
          
          <div className="mb-8 text-center md:mb-12">
            <div className="mb-4 flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-wider text-slate-400">
              <span>{article.author || "Admin"}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span>
                {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            
            {article.summary && (
              <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate-500">
                {article.summary}
              </p>
            )}
          </div>
          
          {article.imageUrl && (
            <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-[2rem] bg-slate-100 shadow-xl">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg prose-slate prose-img:rounded-2xl mx-auto max-w-3xl prose-a:text-primary hover:prose-a:text-primary/80 prose-headings:font-black">
            {/* Nếu sử dụng rich text, có thể đổi thành dangerouslySetInnerHTML={{ __html: article.content }} */}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
          
          <div className="mt-20 border-t border-slate-100 pt-10 text-center">
             <Link href="/news">
               <button className="rounded-full bg-slate-900 px-8 py-4 font-bold text-white transition-transform hover:scale-105 hover:bg-slate-800">
                 Xem thêm các bài viết khác
               </button>
             </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
