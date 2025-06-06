import {Component, OnDestroy, OnInit} from '@angular/core';
import {CardModule} from 'primeng/card';
import {CartService} from '../../services/cart/cart.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Cart} from '../../services/cart/shared/interface/cart.interface';
import {CurrencyPipe} from '@angular/common';
import {Panel} from 'primeng/panel';
import {CustomerMeasurement} from '../../services/customer/shared/interface/customer.interface';
import {DividerModule} from 'primeng/divider';
import {SelectModule} from 'primeng/select';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePickerModule} from 'primeng/datepicker';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {OrderService} from '../../services/order/order.service';
import {CreateOrder} from '../../services/order/shared/interface/order.interface';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {InvoiceService} from '../../services/invoice/invoice.service';
import {debounceTime, distinctUntilChanged, Subject, Subscription, takeUntil} from 'rxjs';
import {UserService} from '../../services/user/user.service';

type NumericMeasurementKey = {
  [K in keyof CustomerMeasurement]: CustomerMeasurement[K] extends number ? K : never
}[keyof CustomerMeasurement];

@Component({
  selector: 'app-order-summary',
  imports: [CardModule, ButtonModule, ToastModule, InputTextModule, CurrencyPipe, Panel, DividerModule, SelectModule, RadioButtonModule, ReactiveFormsModule, DatePickerModule, FormsModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css',
  providers: [OrderService, MessageService],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    public orderService: OrderService,
    private messageService: MessageService,
    private invoiceService: InvoiceService,
    private userService: UserService,
  ) { }

  private destroy$ = new Subject<void>();

  cartId:string | null = null;
  cart: Cart | null = null;
  preview: boolean = false;
  loading: boolean = false;

  invoices:any[] = []
  selectedInvoice = new FormControl('');
  dueDate = new FormControl('');
  orderCategory = new FormControl('');
  paymentType = new FormControl('');
  paymentMethod = new FormControl('');
  bankName: string = '';
  accountNumber: string = '';

  ngOnInit() {
    this.cartId = this.route.snapshot.paramMap.get('cartId');
    if (this.cartId) {
      this.cartService.getCart(Number(this.cartId));
      this.cartService.cart
        .pipe(takeUntil(this.destroy$))
        .subscribe(cart => {
          this.cart = cart;
        })

      this.invoiceService.availableInvoices
        .pipe(takeUntil(this.destroy$))
        .subscribe(invoice => {
          this.invoices = invoice;
        })

      this.selectedInvoice.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(value => {
          if (value && this.cart && this.cart?.items && this.cart.items?.length > 0 && this.cart?.customer?.id) {
              this.cart?.items.map((item) => {
                this.getAvailableInvoices(item.product.id, this.cart?.customer?.id ?? 0)
              })
          }
        })
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.invoiceService.availableInvoices.next([]);
  }

  backToCart() {
    this.router.navigate(['/cart']);
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

  getAvailableInvoices(productId: number, customerId: number) {
    this.invoiceService.fetchAvailableInvoices({productId, customerId})
  }

  getTotalPrice(): number {
    return this.cart?.items?.reduce((total, item) => {
      const price = Number(item.product.price) || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0) ?? 0;
  }

  isDisabledBtn(): boolean {
    return (
      !this.dueDate.value ||
      !this.orderCategory.value ||
      !this.paymentType.value ||
      !this.paymentMethod.value ||
      (this.paymentMethod.value === 'transfer' &&
        (!this.bankName || !this.accountNumber))
    );
  }

  submitAction() {
    if (
      this.cart?.customer?.id &&
      this.orderCategory.value &&
      this.paymentMethod.value &&
      this.paymentType.value &&
      this.dueDate.value &&
      this.userService.userLoggedIn.id
    ) {
      const payload: CreateOrder = {
        customerId: this.cart?.customer?.id,
        priority: this.orderCategory.value,
        payment_method: this.paymentMethod.value,
        payment_type: this.paymentType.value,
        due_date: this.dueDate.value,
        status: 'pending',
        account_number: this.accountNumber,
        bank_name: this.bankName,
        sales_id: this.userService.userLoggedIn.id,
      }
      if (this.selectedInvoice.value) {
        payload.invoice_id = Number(this.selectedInvoice.value)
      }

      this.loading = true;
      this.orderService.createOrder(payload).subscribe({
        next: () => {
          this.messageService.add({detail: 'Successfully created order', life: 3000, severity:'success'});
          this.router.navigate(['/cart']);
          this.loading = false;
        },
        error: err => {
          this.messageService.add({detail: err?.error?.message ??'Failed created order', life: 3000, severity:'error'});
          this.loading = false;
        }
      })
    }

  }

  continueAction() {
    this.preview = !this.preview;
  }

}
