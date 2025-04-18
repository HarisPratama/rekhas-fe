import {Component, OnInit} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';
import {ButtonModule} from 'primeng/button';
import {CartService} from '../../services/cart/cart.service';
import {Cart} from '../../services/cart/shared/interface/cart.interface';
import {CurrencyPipe} from '@angular/common';
import {DividerModule} from 'primeng/divider';
import {CustomerMeasurement} from '../../services/customer/shared/interface/customer.interface';
import {Router} from '@angular/router';
import {AccordionModule} from 'primeng/accordion';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmPopupModule} from 'primeng/confirmpopup';

type NumericMeasurementKey = {
  [K in keyof CustomerMeasurement]: CustomerMeasurement[K] extends number ? K : never
}[keyof CustomerMeasurement];

@Component({
  selector: 'app-cart',
  imports: [PanelModule, ToastModule, ConfirmPopupModule, AccordionModule, CardModule, BadgeModule, ButtonModule, CurrencyPipe, DividerModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  providers: [MessageService, ConfirmationService]
})
export class CartComponent implements OnInit {
  onDelete = false;

  carts: Cart[] = []

  constructor(
    private cartService: CartService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.cartService.getCarts()
    this.cartService.carts
      .subscribe((carts: Cart[]) => {
        this.carts = carts;
      })
  }

  getMeasurementKeys(group: CustomerMeasurement): NumericMeasurementKey[] {
    const measurementKeys: NumericMeasurementKey[] = [
      'length', 'waist', 'chest', 'collar', 'shoulder',
      'sleeveLength', 'upperSleeveRim', 'lowerSleeveRim',
      'thigh', 'knee', 'foot', 'hip', 'armLength',
      'cuff', 'kriss'
    ];

    return Object.keys(group).filter((key): key is NumericMeasurementKey =>
      measurementKeys.includes(key as NumericMeasurementKey)
    );
  }

  getCustomerMeasurementValue(
    measurement: CustomerMeasurement | undefined,
    key: NumericMeasurementKey
  ): number | undefined {
    return measurement?.[key];
  }

  proccesToOrder(cartId: number): any {
    this.router.navigate(['/order-summary', cartId]);
  }

  deleteItem(event: Event, itemId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.onDelete = true;
        this.cartService.deleteCart(itemId)
          .subscribe({
            next: () => {
              this.cartService.getCarts()
              this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
              this.onDelete = false;
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: err?.error?.message ?? 'You have rejected', life: 3000 });
              this.onDelete = false;
            }
          })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }
}
