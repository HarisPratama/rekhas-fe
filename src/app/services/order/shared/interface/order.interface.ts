import {Product} from '../../../../models/stock.model';
import {Customer} from '../../../customer/shared/interface/customer.interface';

export interface CreateOrder {
  customerId: number;
  priority: string;
  payment_method: string;
  payment_type: string;
  status?: string;
  account_number?: string;
  bank_name?: string;
  due_date: Date | string; // bisa string jika dari form input
  sales_id?: number;
}

export interface OrderInterface {
  id: number;
  account_number: string;
  bank_name: string;
  code: string;
  payment_method: string;
  payment_type: string;
  due_date: string; // ISO string format
  status: string;
  total_amount: string;
  priority: string;
  created_at: string;
  customer_id: number;
  sales_id: number;
  customer: Customer;
  sales: Sales;
  items: OrderItem[];
}

export interface Sales {
  id: number;
  name: string;
  code: string;
  nick_name: string;
  image_url: string;
  is_pic: boolean;
  payments: string;
  whatsapp_number: string;
  roleId: number;
  checkpoint_id: number | null;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price_each: string;
  product: Product;
}
