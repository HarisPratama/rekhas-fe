import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {TextareaModule} from 'primeng/textarea';
import {AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import {CustomerService} from '../../../services/customer/customer.service';
import {debounceTime, distinctUntilChanged, Subject, Subscription, switchMap} from 'rxjs';
import {JsonPipe} from '@angular/common';
import {SelectChangeEvent, SelectModule} from 'primeng/select';
import {ProductService} from '../../../services/product/product.service';
import {CreateInvoiceDto} from '../../../services/invoice/shared/invoice.interface';
import {InvoiceService} from '../../../services/invoice/invoice.service';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-quick-invoice-modal',
  imports: [ToastModule, AutoCompleteModule, SelectModule, DialogModule, AutoComplete, DropdownModule, FormsModule, ButtonModule, TextareaModule],
  templateUrl: './quick-invoice-modal.component.html',
  styleUrl: './quick-invoice-modal.component.css',
  providers: [MessageService],
})
export class QuickInvoiceModalComponent implements OnInit, OnDestroy {
  display = false;
  loading = false;
  params = {
    page: 1,
    limit: 10,
    orderBy: '',
    order: '',
    search: '',
  }
  customers:any[] = [];

  categories = [
    { id: 1, name: 'COLLECTION' },
    { id: 2, name: 'REGULAR' },
    { id: 3, name: 'READY-TO-WEAR' },
  ];

  products: any[] = []

  selectedCustomer: any;
  selectedCategory: any;
  selectedProduct: any;
  notes: string = '';
  searchInput$ = new Subject<string>();
  customerSearchSub!: Subscription;
  productSearchSub!: Subscription;
  searchInputProduct$ = new Subject<string>();

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.customerSearchSub = this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          this.params.search = query;
          this.customerService.getCustomers(this.params);
          return this.customerService.customers;
        })
      )
      .subscribe(cust => {
        this.customers = cust;
      });
    this.productSearchSub = this.searchInputProduct$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          return this.productService.getProductsDropdown({type: this.selectedCategory?.name ?? '', search: query});
        })
      )
      .subscribe(resp => {
        this.products = resp.data;
      });
  }

  ngOnDestroy() {
    this.customerSearchSub?.unsubscribe();
    this.productSearchSub?.unsubscribe();
  }

  onAddNewCustomer() {
    // Handle logic to show new customer form/modal
    console.log('Add new customer clicked');
  }

  generateInvoice() {
    const invoiceData: CreateInvoiceDto = {
      customerId: this.selectedCustomer.id,
      productIds: [Number(this.selectedProduct.id)],
      notes: this.notes,
    };
    this.loading = true;
    this.invoiceService.createInvoice(invoiceData).subscribe({
      next: (result) => {
        this.messageService.add({detail: 'Successfully created invoice', life: 3000});
        setTimeout(() => {
          this.display = false;
          this.loading = false;
        }, 3000)
      },
      error: (e) => {
        this.loading = false;
        this.messageService.add({detail: e?.error?.message ?? 'Failed to create invoice', life: 3000});
      }
    })
  }

  searchCustomer(event: AutoCompleteCompleteEvent) {
    this.searchInput$.next(event.query);
  }

  searchProduct(event: AutoCompleteCompleteEvent) {
    this.searchInputProduct$.next(event.query);
  }

  onSelectCategory(e: SelectChangeEvent) {
    if (e.value?.name) {
      this.productService.getProductsDropdown({type: e.value?.name, search: ''})
        .subscribe(products => {
          this.products = products.data;
        })
    }
  }

}
