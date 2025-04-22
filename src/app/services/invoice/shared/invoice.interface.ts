import {Customer} from '../../customer/shared/interface/customer.interface';
import {Product} from '../../../models/stock.model';
import {OrderInterface} from '../../order/shared/interface/order.interface';

export interface Invoice {
  id?: number;
  issued_at: string;
  code: string;
  status?: string;
  note?: string;
  created_at?: string;
  order?: OrderInterface;
  customer: Customer;
  products: Product[];
  fabrics: Product[];
}

export interface CreateInvoiceDto {
  customerId: number;
  orderId?: number;
  total_amount?: number;
  due_date?: string;// ISO date string format
  productIds: number[];
  notes: string;
}

