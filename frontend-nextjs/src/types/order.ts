export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentMethod = "BANK_TRANSFER" | "CASH_ON_DELIVERY" | "VNPAY" | "PAYOS";

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: string;
  phone: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  promotionCode?: string;
  discountAmount?: number;
  shippingFee?: number;
  ghnOrderCode?: string;
  status: OrderStatus;
  createdAt?: string;
}

export interface CreateOrderRequest {
  shippingAddress: string;
  phone: string;
  paymentMethod: PaymentMethod;
  promotionCode?: string;
  toDistrictId?: number;
  toWardCode?: string;
  customerName?: string;
}
