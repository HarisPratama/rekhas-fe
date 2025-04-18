export interface Product {
  id?: number;
  name: string;
  image_url: string;
  full_image_url?: string;
  code: string;
  fabric: string;
  size: string | null;
  status: string | null;
  type: string;
  description: string;
  price: string;
  quantity: number;
  created_at: string;
}
