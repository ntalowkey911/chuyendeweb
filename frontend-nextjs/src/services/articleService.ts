import api from "./api";
import type { Article, ArticleRequest } from "@/types/article";

interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const articleService = {
  // Public APIs
  getArticles: (page = 0, size = 10) => {
    return api.get<PageResponse<Article>>(`/articles?page=${page}&size=${size}`);
  },

  getArticleBySlug: (slug: string) => {
    return api.get<Article>(`/articles/${slug}`);
  },

  // Admin APIs
  getAdminArticles: (page = 0, size = 10) => {
    return api.get<PageResponse<Article>>(`/admin/articles?page=${page}&size=${size}`);
  },

  createArticle: (data: ArticleRequest) => {
    return api.post<Article>("/admin/articles", data);
  },

  updateArticle: (id: string, data: ArticleRequest) => {
    return api.put<Article>(`/admin/articles/${id}`, data);
  },

  deleteArticle: (id: string) => {
    return api.delete(`/admin/articles/${id}`);
  },
};

export default articleService;
