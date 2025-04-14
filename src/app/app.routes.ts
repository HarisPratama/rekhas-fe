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
      // Add other children like invoice, delivery, etc.
    ]
  }
];
