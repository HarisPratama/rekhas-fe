import {Component, OnInit, ViewChild} from '@angular/core';
import {Badge, BadgeModule} from 'primeng/badge';
import {Button} from 'primeng/button';
import {GenericTableComponent} from '../../components/global/generic-table/generic-table.component';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {WorkshopService} from '../../services/workshop/workshop.service';
import {TableLazyLoadEvent} from 'primeng/table';
import {PaginatorState} from 'primeng/paginator';
import {Workshop} from '../../services/workshop/shared/workshop.interface';
import {
  WorkshopDetailModalComponent
} from '../../components/workshop/workshop-detail-modal/workshop-detail-modal.component';
import {SearchInputComponent} from '../../components/shared/components/search-input/search-input.component';

@Component({
  selector: 'app-workshop',
  imports: [
    BadgeModule,
    Button,
    GenericTableComponent,
    WorkshopDetailModalComponent,
    SearchInputComponent,
  ],
  templateUrl: './workshop.component.html',
  styleUrl: './workshop.component.css'
})
export class WorkshopComponent implements OnInit {
  @ViewChild('workshopDetailModal') workshopDetailModal!: WorkshopDetailModalComponent;
  params: PaginationReq = {
    page: 1,
    limit: 10,
    orderBy: '',
    order: '',
    search: '',
    type: ''
  }
  virtualWorkshops: any[] = [];
  selectedWorkshop: any[] = [];
  totalRecords = 0;
  first = 0;
  rows = 5;
  loading = false;
  type: string = '';

  cols = [
    { field:'no', header: 'No.' },
    { field:'product_name', header: 'Product Name' },
    { field:'notes', header: 'Notes' },
    { field:'fabrics', header: 'Fabrics' },
    { field:'status', header: 'Status' },
    { field:'customer_name', header: 'Customer Name' },
    { field:'order', header: 'Order ID' },
    { field:'detail', header: 'Detail' },
  ];

  constructor(public workshopService: WorkshopService) { }

  ngOnInit() {
    this.virtualWorkshops = Array.from({ length: this.rows });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    if (event) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 5;
      this.params.page = Math.floor(this.first / this.rows) + 1;
      this.params.limit = this.rows;
      this.params.type = this.type;

      this.loadWorkshops();
    }
  }

  onSearch(query: string) {
    this.params.search = query;
    this.virtualWorkshops = Array.from({ length: this.rows });
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.workshopService.fetchWorkshops(this.params);
    this.workshopService.workshops.subscribe(data => {
      this.virtualWorkshops = data;
    })
    this.totalRecords = this.workshopService.pagination.total;
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.params.page = Math.floor(this.first / this.rows) + 1;
    this.params.limit = this.rows;

    this.virtualWorkshops = Array.from({ length: this.rows });
    this.loadWorkshops();
  }

  onSelectWorkshop(workshops: Workshop[]): void {
    this.selectedWorkshop = workshops;
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

  openDetailModal(workshop: Workshop) {
    this.workshopDetailModal.open(workshop);
  }
}
