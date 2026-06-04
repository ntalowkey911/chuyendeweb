export interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  imageUrl?: string;
  author?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleRequest {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  imageUrl?: string;
  isActive: boolean;
}
