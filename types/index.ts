export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  unit: string;
  price: number;
  stock_qty: number;
  image_urls: string[];
  video_url: string | null;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image_url: string | null;
  unit: string;
}

export interface Address {
  id: string;
  label: string;
  full_address: string;
  city: string | null;
  phone: string | null;
  is_default: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  status: OrderStatus;
  payment_status: "unpaid" | "paid" | "failed" | "refunded";
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
}
