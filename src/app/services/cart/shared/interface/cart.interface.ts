import {Customer, CustomerMeasurement} from '../../../customer/shared/interface/customer.interface';
import {Product} from '../../../../models/stock.model';

export interface CartItem {
  id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
  customerMeasurement: CustomerMeasurement;
}

export interface Cart {
  id: number;
  created_at: string;
  updated_at: string;
  items: CartItem[];
  customer: Customer;
}
