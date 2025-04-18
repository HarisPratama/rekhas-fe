import {OrderInterface} from '../../order/shared/interface/order.interface';
import {Product} from '../../../models/stock.model';

export interface Workshop {
  id: number;
  order_id: number;
  status: 'on_process' | 'done' | 'cancelled'; // atau bisa pakai enum
  tailor_id: number | null;
  cutter_id: number | null;
  notes: string;
  scheduled_delivery_date: string | null;
  created_at: string;
  updated_at: string;
  order: OrderInterface;
  product: Product
}

