import { Routes } from '@angular/router';

import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { StockComponent } from './pages/stock/stock.component';
import { OrderComponent } from './pages/order/order.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import {ProductComponent} from './pages/product/product.component';
import {ReadyToWearComponent} from './pages/product/ready-to-wear/ready-to-wear.component';
import {
  ReadyToWearDetailComponent
} from './pages/product/ready-to-wear/ready-to-wear-detail/ready-to-wear-detail.component';
import {SizeMeasureComponent} from './pages/product/size-measure/size-measure.component';
import {CartComponent} from './pages/cart/cart.component';
import {OrderSummaryComponent} from './pages/order-summary/order-summary.component';
import {InvoiceComponent} from './pages/invoice/invoice.component';
import {WorkshopComponent} from './pages/workshop/workshop.component';
import {EmployeeComponent} from './pages/employee/employee.component';
import {CheckpointComponent} from './pages/checkpoint/checkpoint.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'stock', pathMatch: 'full' },
      { path: 'stock', component: StockComponent },
      { path: 'order', component: OrderComponent },
      { path: 'delivery', component: DeliveryComponent },
      { path: 'product', component: ProductComponent, children: [
          { path: 'ready-to-wear', component: ReadyToWearComponent },
          { path: 'ready-to-wear/:id', component: ReadyToWearDetailComponent },
          { path: 'size-measure/:id', component: SizeMeasureComponent },
        ]
      },
      { path: 'cart', component: CartComponent },
      { path: 'order-summary/:cartId', component: OrderSummaryComponent },
      { path: 'invoice', component: InvoiceComponent },
      { path: 'workshop', component: WorkshopComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'checkpoint', component: CheckpointComponent },
      // Add other children like invoice, delivery, etc.
    ]
  }
];
