export interface Product {
  id: number;
  name: string;
  image_url: string | null;
  full_image_url?: string | null;
  code: string;
  fabric: string;
  size: string;
  status: string;
  type: string;
  description: string | null;
  price: string;
  quantity: number;
  created_at: string;
  checkpointStocks?: Stock[];
}

export interface Checkpoint {
  id: number;
  name: string;
  address: string;
  code: string;
  image_url: string;
  phone: string;
  type: string;
  pic_id: number;
}

export interface Stock {
  id: number;
  quantity: number;
  updated_at: string;
  product: Product;
  checkpoint: Checkpoint;
}
