"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import { Button } from "./ui/button";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = useAuthStore((state) => state.user);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get<Review[]>(`/products/${productId}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.warn("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await api.post<Review>(`/products/${productId}/reviews`, {
        rating,
        comment,
      });
      setReviews([res.data, ...reviews]);
      setComment("");
      setRating(5);
    } catch (err: any) {
      console.error("Failed to submit review", err);
      setErrorMsg(err.response?.data?.message || "Không thể gửi đánh giá, vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="mt-12 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-10">
      <h2 className="text-2xl font-black text-slate-900">Đánh giá sản phẩm</h2>
      
      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-6 text-center">
          <span className="text-5xl font-black text-primary">{avgRating}</span>
          <div className="mt-2 flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={star <= Number(avgRating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={star <= Number(avgRating) ? "text-yellow-400" : "text-slate-300"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ))}
          </div>
          <span className="mt-2 text-sm font-medium text-slate-500">{reviews.length} đánh giá</span>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <h3 className="font-bold text-slate-900">Viết đánh giá của bạn</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={star <= rating ? "text-yellow-400" : "text-slate-300"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              rows={3}
              placeholder={user ? "Chia sẻ cảm nhận của bạn về sản phẩm..." : "Vui lòng đăng nhập để đánh giá"}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!user || submitting}
            />
            <Button
              type="submit"
              disabled={!user || submitting || !comment.trim()}
              className="rounded-full bg-primary px-8 font-bold text-white hover:bg-primary/90"
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
            {errorMsg && <p className="mt-2 text-sm font-semibold text-red-600">{errorMsg}</p>}
          </form>

          {loading ? (
            <p className="text-slate-500">Đang tải đánh giá...</p>
          ) : reviews.length === 0 ? (
            <p className="text-slate-500">Chưa có đánh giá nào cho sản phẩm này.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{review.userName}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="mt-1 flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={star <= review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={star <= review.rating ? "text-yellow-400" : "text-slate-200"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
