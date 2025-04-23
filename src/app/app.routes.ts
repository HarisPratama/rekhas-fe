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
import {LoginComponent} from './pages/login/login.component';
import {roleGuard} from './guards/role.guard';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {RedirectComponent} from './pages/redirect/redirect.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: RedirectComponent },
      { path: 'stock', component: StockComponent, canActivate: [roleGuard('stock')] },
      { path: 'order', component: OrderComponent, canActivate: [roleGuard('order')] },
      { path: 'delivery', component: DeliveryComponent, canActivate: [roleGuard('delivery')] },
      { path: 'product', component: ProductComponent, canActivate: [roleGuard('product')], children: [
          { path: 'ready-to-wear', component: ReadyToWearComponent },
          { path: 'ready-to-wear/:id', component: ReadyToWearDetailComponent },
          { path: 'size-measure/:id', component: SizeMeasureComponent },
        ]
      },
      { path: 'cart', component: CartComponent, canActivate: [roleGuard('cart')] },
      { path: 'order-summary/:cartId', component: OrderSummaryComponent, canActivate: [roleGuard('order-summary')] },
      { path: 'invoice', component: InvoiceComponent, canActivate: [roleGuard('invoice')] },
      { path: 'workshop', component: WorkshopComponent, canActivate: [roleGuard('workshop')] },
      { path: 'employee', component: EmployeeComponent, canActivate: [roleGuard('employee')] },
      { path: 'checkpoint', component: CheckpointComponent, canActivate: [roleGuard('checkpoint')] },
      { path: 'unauthorized', component: UnauthorizedComponent },
      // Add other children like invoice, delivery, etc.
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', component: UnauthorizedComponent },

];
