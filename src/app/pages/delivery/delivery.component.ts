import {Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from '../../components/global/generic-table/generic-table.component';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {DatePipe} from '@angular/common';
import {MessageService} from 'primeng/api';
import {DeliveryService} from '../../services/delivery/delivery.service';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {PaginatorState} from 'primeng/paginator';
import {TableLazyLoadEvent} from 'primeng/table';
import {SelectModule} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {
  DeliveryDetailModalComponent
} from '../../components/delivery/delivery-detail-modal/delivery-detail-modal.component';
import {BadgeModule} from 'primeng/badge';
import {SearchInputComponent} from '../../components/shared/components/search-input/search-input.component';

interface Status {
  name: string;
  code: string;
}

@Component({
  selector: 'app-delivery',
  imports: [
    GenericTableComponent,
    ButtonModule,
    ToastModule,
    SelectModule,
    DatePipe,
    FormsModule,
    DeliveryDetailModalComponent,
    BadgeModule,
    SearchInputComponent
  ],
  providers: [MessageService, DeliveryService],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent implements OnInit {
  @ViewChild('deliveryDetailModal') deliveryDetailModal!: DeliveryDetailModalComponent;

  params: PaginationReq = {
    page: 1,
    limit: 5,
    order: '',
    orderBy: '',
    search: '',
  };

  cols = [
    { field:'no', header: 'No.' },
    { field:'code', header: 'Code' },
    { field:'scheduled_ad', header: 'Scheduled At' },
    { field:'delivered_at', header: 'Delivered At' },
    { field:'from', header: 'From' },
    { field:'to', header: 'To' },
    { field:'items', header: 'Items' },
    { field:'status', header: 'Status' },
    { field:'detail', header: 'Detail' }
  ];

  virtualDeliveries: any[] = [];
  selectedDeliveries: any[] = [];
  totalRecords = 0;
  first = 0;
  rows = 5;
  loading = false;
  type: 'order_delivery' | 'internal_transfer' = 'order_delivery';
  selectedStatus = '';
  status: Status[] = [
    { name: 'IN TRANSIT', code: 'in_transit' },
    { name: 'DELIVERED', code: 'delivered' },
    { name: 'SCHEDULED', code: 'scheduled'},
    { name: 'PENDING', code: 'pending'},
    { name: 'CANCELLED', code: 'cancelled'},
  ]
  constructor(public deliveryService: DeliveryService) {
  }

  ngOnInit() {
    this.virtualDeliveries = Array.from({ length: this.rows });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    if (event) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 5;
      this.params.page = Math.floor(this.first / this.rows) + 1;
      this.params.limit = this.rows;
      this.params.type = this.type;

      this.loadDeliveries();
    }
  }

  onSearch(query: string) {
    this.params.search = query;
    this.virtualDeliveries = Array.from({ length: this.rows });
    this.loadDeliveries()
  }

  loadDeliveries(): void {
    this.deliveryService.fetchDeliveries(this.params);
    this.deliveryService.deliveries.subscribe(data => {
      this.virtualDeliveries = data;
    })
    this.totalRecords = this.deliveryService.pagination.total;
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.params.page = Math.floor(this.first / this.rows) + 1;
    this.params.limit = this.rows;

    this.virtualDeliveries = Array.from({ length: this.rows });
    this.loadDeliveries();
  }

  onTabChange(type: 'order_delivery' | 'internal_transfer') {
    this.type = type;
    this.params.type = this.type;
    this.loadDeliveries();
  }

  onSelectDelivery(deliveries: any[]): void {
    this.selectedDeliveries = deliveries;
  }

  openModalDetail(delivery: any): void {
    this.deliveryDetailModal.open(delivery);
  }

  generateSeverity(status: string): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'on_process':
        return 'warn'
      case 'scheduled':
        return 'info'
      case 'canceled':
        return 'danger'
      case 'delivered':
        return 'success'
      case 'pending':
        return 'secondary'
      default:
        return 'contrast';
    }
  }

}
