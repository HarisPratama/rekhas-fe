import { Component } from '@angular/core';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {CommonModule} from '@angular/common';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {FormsModule} from '@angular/forms';
import {AddStockComponent} from '../../components/stock/add-stock/add-stock.component';
import {ToastModule} from 'primeng/toast';
import {GenericTableComponent} from '../../components/global/generic-table/generic-table.component';
import {ButtonModule} from 'primeng/button';
import {
  CreateDeliveryModalComponent
} from '../../components/delivery/create-delivery-modal/create-delivery-modal.component';
import {StockService} from '../../services/stock/stock.service';
import {MessageService} from 'primeng/api';
import {Stock} from '../../models/stock.model';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-checkpoint',
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    FormsModule,
    ToastModule,
    GenericTableComponent,
    ButtonModule,
  ],
  templateUrl: './checkpoint.component.html',
  providers: [MessageService],
  styleUrl: './checkpoint.component.css'
})
export class CheckpointComponent {

  virtualStocks: Stock[] = [];
  selectedStocks: Stock[] = [];
  loading = false;
  first = 0;
  rows = 5;
  totalRecords = 0;

  cols: Column[] = [
    { field: 'name', header: 'Product Name' },
    { field: 'code', header: 'Product Code' },
    { field: 'fabric', header: 'Fabric Code' },
    { field: 'quantity', header: 'Qty' },
    { field: 'description', header: 'Description' },
    { field: 'price', header: 'Price' },
    { field: 'created_at', header: 'Date Added' },
    { field: 'checkpoint', header: 'Checkpoint' },
    { field: 'image', header: 'Image' },
  ];

  params: PaginationReq = {
    page: 1,
    limit: 5,
    order: '',
    orderBy: '',
    search: '',
  };

  constructor(
    private stockService: StockService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.virtualStocks = Array.from({ length: this.rows });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    if (event) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 5;
      this.params.page = Math.floor(this.first / this.rows) + 1;
      this.params.limit = this.rows;

      this.loadStocks();
    }
  }

  getStocksByType(type: string) {
    this.params.type = type;
    this.virtualStocks = Array.from({ length: this.rows });
    this.loadStocks();
  }

  loadStocks(): void {
    this.loading = true;

    this.stockService.getStocks(this.params).subscribe({
      next: (res) => {
        this.virtualStocks = res.data;
        this.totalRecords = res.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching stocks:', err);
        this.loading = false;
      },
    });
  }

  onSelectStock(stocks: Stock[]): void {
    this.selectedStocks = stocks;
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.params.page = Math.floor(this.first / this.rows) + 1;
    this.params.limit = this.rows;

    this.virtualStocks = Array.from({ length: this.rows });
    this.loadStocks();
  }
}
