export const PRICE_FILTERS = [
  { value: "", label: "Tất cả mức giá" },
  { value: "under100", label: "Dưới 100.000đ" },
  { value: "100to200", label: "100.000đ đến 200.000đ" },
  { value: "above200", label: "Trên 200.000đ" },
] as const;

export const SORT_OPTIONS = [
  { value: "", label: "Mới nhất" },
  { value: "best-selling", label: "Bán chạy nhất" },
  { value: "least-selling", label: "Bán ít nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
] as const;

export function getPaymentMethodLabel(value: string) {
  if (value === "BANK_TRANSFER") return "Chuyển khoản BIDV";
  if (value === "CASH_ON_DELIVERY") return "Thanh toán trực tiếp";
  return value;
}
