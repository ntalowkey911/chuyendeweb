export const PRODUCT_CATEGORIES = [
  { value: "trai-cay-va-rau-cu-say", label: "Trái cây và rau củ sấy" },
  { value: "cac-loai-hat-va-dau", label: "Các loại hạt và đậu" },
  { value: "luong-thuc-va-tinh-bot", label: "Lương thực và tinh bột" },
  { value: "nam-va-rong-bien", label: "Nấm và rong biển" },
] as const;

export const PRICE_FILTERS = [
  { value: "", label: "Tất cả mức giá" },
  { value: "under100", label: "Dưới 100.000đ" },
  { value: "100to200", label: "Từ 100.000đ đến 200.000đ" },
  { value: "above200", label: "Trên 200.000đ" },
] as const;

export function getCategoryLabel(category: string) {
  return (
    PRODUCT_CATEGORIES.find((item) => item.value === category)?.label || category
  );
}
