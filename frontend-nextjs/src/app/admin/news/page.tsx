"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import articleService from "@/services/articleService";
import type { Article } from "@/types/article";

function AdminNewsContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadArticles = async (p: number) => {
    try {
      const res = await articleService.getAdminArticles(p, 10);
      setArticles(res.data.content);
      setTotalPages(res.data.totalPages || 1);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await loadArticles(page);
      setLoading(false);
    })();
  }, [page]);

  const resetForm = () => {
    setEditingArticle(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setImageUrl("");
    setIsActive(true);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setSummary(article.summary || "");
    setContent(article.content);
    setImageUrl(article.imageUrl || "");
    setIsActive(article.isActive);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        title,
        slug,
        summary,
        content,
        imageUrl,
        isActive,
      };

      if (editingArticle) {
        await articleService.updateArticle(editingArticle.id, payload);
      } else {
        await articleService.createArticle(payload);
      }

      resetForm();
      await loadArticles(page);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi lưu bài viết");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      try {
        await articleService.deleteArticle(id);
        await loadArticles(page);
      } catch (err) {
        alert("Có lỗi xảy ra khi xóa bài viết");
      }
    }
  };

  if (loading && articles.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 py-10">
          <Container>
            <div className="text-center text-slate-500">Đang tải...</div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-10">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Quản lý Tin tức</h1>
              <p className="mt-2 text-slate-600">Thêm, sửa, xóa các bài viết trên blog.</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90"
            >
              Thêm bài viết mới
            </button>
          </div>

          {showForm && (
            <section className="mb-8 rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                {editingArticle ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
              </h2>
              {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Tiêu đề *</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Đường dẫn (slug) *</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Tóm tắt</label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Nội dung (Hỗ trợ HTML) *</label>
                  <textarea
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Đường dẫn ảnh bìa</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Hiển thị (Active)</label>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-primary px-6 py-3 font-bold text-white disabled:opacity-50"
                  >
                    {saving ? "Đang lưu..." : "Lưu bài viết"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-slate-200 px-6 py-3 font-bold text-slate-700"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-3">Tiêu đề</th>
                    <th className="py-3">Slug</th>
                    <th className="py-3">Tác giả</th>
                    <th className="py-3">Trạng thái</th>
                    <th className="py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-b border-slate-50">
                      <td className="py-4 font-bold text-slate-900">{article.title}</td>
                      <td className="py-4 text-slate-500">{article.slug}</td>
                      <td className="py-4">{article.author || "Admin"}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            article.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {article.isActive ? "Hiển thị" : "Đã ẩn"}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(article)}
                            className="font-semibold text-primary hover:underline"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="font-semibold text-red-600 hover:underline"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {articles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Chưa có bài viết nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                >
                  Trang trước
                </button>
                <span className="text-sm font-semibold text-slate-600">
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                >
                  Trang sau
                </button>
              </div>
            )}
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function AdminNewsPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminNewsContent />
    </ProtectedRoute>
  );
}
