import {Component, OnInit, ViewChild} from '@angular/core';
import {Badge} from 'primeng/badge';
import {Button} from 'primeng/button';
import {GenericTableComponent} from '../../components/global/generic-table/generic-table.component';
import {SearchInputComponent} from '../../components/shared/components/search-input/search-input.component';
import {CurrencyPipe, UpperCasePipe} from '@angular/common';
import {
  WorkshopDetailModalComponent
} from '../../components/workshop/workshop-detail-modal/workshop-detail-modal.component';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {WorkshopService} from '../../services/workshop/workshop.service';
import {TableLazyLoadEvent} from 'primeng/table';
import {PaginatorState} from 'primeng/paginator';
import {Workshop} from '../../services/workshop/shared/workshop.interface';
import {CustomerService} from '../../services/customer/customer.service';

@Component({
  selector: 'app-customer',
  imports: [
    Badge,
    Button,
    GenericTableComponent,
    SearchInputComponent,
    UpperCasePipe,
    CurrencyPipe,
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  params: PaginationReq = {
    page: 1,
    limit: 10,
    orderBy: '',
    order: '',
    search: '',
    type: 'list'
  }
  virtualCustomer: any[] = [];
  selectedCustomer: any[] = [];
  totalRecords = 0;
  first = 0;
  rows = 5;
  loading = false;
  type: string = '';

  cols = [
    { field:'no', header: 'No.' },
    { field:'name', header: 'Customer Name' },
    { field:'num_of_orders', header: 'Num of Orders' },
    { field:'have_bought', header: 'Have Bought' },
    { field:'outstanding', header: 'Outstanding' },
    { field:'revenue', header: 'Revenue' },
    { field:'detail', header: 'Detail' },
  ];

  constructor(public customerService: CustomerService) { }

  ngOnInit() {
    this.virtualCustomer = Array.from({ length: this.rows });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    if (event) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 5;
      this.params.page = Math.floor(this.first / this.rows) + 1;
      this.params.limit = this.rows;
      this.params.type = 'list';

      this.loadCustomer();
    }
  }

  onSearch(query: string) {
    this.params.search = query;
    this.virtualCustomer = Array.from({ length: this.rows });
    this.loadCustomer();
  }

  loadCustomer(): void {
    this.customerService.getCustomers(this.params);
    this.customerService.customers.subscribe(data => {
      this.virtualCustomer = data;
    })
    this.totalRecords = this.customerService.pagination.total;
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.params.page = Math.floor(this.first / this.rows) + 1;
    this.params.limit = this.rows;

    this.virtualCustomer = Array.from({ length: this.rows });
    this.loadCustomer();
  }

  onSelectCustomer(workshops: Workshop[]): void {
    this.selectedCustomer = workshops;
  }

  generateStatus(status: string) {
    switch (status) {
      case 'on_request':
        return 'On Request'
      case 'on_process':
        return 'On Process'
      case 'completed':
        return 'Completed'
      case 'pending':
        return 'Pending'
      case 'ready':
        return 'Ready'
      default:
        return status;
    }
  }

  generateSeverity(status: string): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'on_process':
        return 'warn'
      case 'on_request':
        return 'info'
      case 'canceled':
        return 'danger'
      case 'completed':
        return 'success'
      case 'pending':
        return 'secondary'
      default:
        return 'contrast';
    }
  }
}
