import {Customer} from '../../customer/shared/interface/customer.interface';
import {Product} from '../../../models/stock.model';

export interface Invoice {
  issued_at: string;
  code: string;
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

