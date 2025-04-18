import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderService} from '../../services/order/order.service';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {OrderInterface} from '../../services/order/shared/interface/order.interface';
import {TableLazyLoadEvent} from 'primeng/table';
import {PaginatorState} from 'primeng/paginator';
import {Button, ButtonModule} from 'primeng/button';
import {GenericTableComponent} from '../../components/global/generic-table/generic-table.component';
import {BadgeModule} from 'primeng/badge';
import {OrderDetailModalComponent} from '../../components/order/order-detail-modal/order-detail-modal.component';

@Component({
  selector: 'app-order',
  imports: [CommonModule, ButtonModule, BadgeModule, GenericTableComponent, OrderDetailModalComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  @ViewChild('orderDetailModal') orderDetailModal!: OrderDetailModalComponent;
  params: PaginationReq = {
    page: 1,
    limit: 10,
    orderBy: '',
    order: '',
    search: '',
    type: ''
  }
  virtualOrders: any[] = [];
  selectedOrders: any[] = [];
  totalRecords = 0;
  first = 0;
  rows = 5;
  loading = false;
  type: string = '';

  cols = [
    { field:'code', header: 'Order ID' },
    { field:'invoice', header: 'Invoice number' },
    { field:'customer', header: 'Customer Name' },
    { field:'order_date', header: 'Order Date' },
    { field:'status', header: 'Status' },
    { field:'sales', header: 'Salesman' },
    { field:'detail', header: 'Detail' },
  ];

  constructor(public orderService: OrderService) { }

  ngOnInit() {
    this.virtualOrders = Array.from({ length: this.rows });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    if (event) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 5;
      this.params.page = Math.floor(this.first / this.rows) + 1;
      this.params.limit = this.rows;
      this.params.type = this.type;

      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.orderService.fetchOrders(this.params);
    this.orderService.orders.subscribe(data => {
      this.virtualOrders = data;
    })
    this.totalRecords = this.orderService.pagination.total;
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.params.page = Math.floor(this.first / this.rows) + 1;
    this.params.limit = this.rows;

    this.virtualOrders = Array.from({ length: this.rows });
    this.loadOrders();
  }

  onTabChange(type: 'order_delivery' | 'internal_transfer') {
    this.type = type;
    this.params.type = this.type;
    this.loadOrders();
  }

  onSelectOrder(orders: any[]): void {
    this.selectedOrders = orders;
  }

  generateStatus(status: string) {
    switch (status) {
      case 'pending':
        return 'On Going'
      case 'paid':
        return 'Paid'
      case 'canceled':
        return 'Cancelled'
      case 'completed':
        return 'Completed'
      default:
        return status;
    }
  }

  generateSeverity(status: string): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'pending':
        return 'warn'
      case 'paid':
        return 'info'
      case 'canceled':
        return 'danger'
      case 'completed':
        return 'success'
      default:
        return 'contrast';
    }
  }

  openDetailModal(order: any) {
    this.orderDetailModal.open(order);
  }
}
