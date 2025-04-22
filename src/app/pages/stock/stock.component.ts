import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Stock } from '../../models/stock.model';
import { StockService } from '../../services/stock/stock.service';
import { AddStockComponent } from '../../components/stock/add-stock/add-stock.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PaginationReq } from '../../../shared/models/pagination-req.model';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';
import {GenericTableComponent} from '../../components/global/generic-table/generic-table.component';
import {ButtonModule} from 'primeng/button';
import {
  CreateDeliveryModalComponent
} from '../../components/delivery/create-delivery-modal/create-delivery-modal.component';
import {SearchInputComponent} from '../../components/shared/components/search-input/search-input.component';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    FormsModule,
    AddStockComponent,
    ToastModule,
    GenericTableComponent,
    ButtonModule,
    CreateDeliveryModalComponent,
    SearchInputComponent
  ],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class StockComponent implements OnInit {
  @ViewChild('deiverModal') deliverModal!: CreateDeliveryModalComponent;
  @ViewChild('addStockModal') addStockModal!: AddStockComponent;

  activeTab = '';
  stockFilter = '';

  stockTabs = [
    { label: 'All', value: '' },
    { label: 'Collection', value: 'COLLECTION' },
    { label: 'Regular', value: 'REGULAR' },
    { label: 'Ready to Wear', value: 'READY-TO-WEAR' },
  ];

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
    this.activeTab = type;
    this.virtualStocks = Array.from({ length: this.rows });
    this.loadStocks();
  }

  onSearch(query: any): void {
    this.params.search = query;
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
    const baseCheckpointId = stocks[0]?.checkpoint?.id;

    const isAllSameCheckpoint = stocks.every(
      stock => stock.checkpoint.id === baseCheckpointId
    );

    if (!isAllSameCheckpoint) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Maaf, anda tidak bisa mengirim stock lebih dari satu checkpoint',
        life: 7000
      });

      // Keep only stocks from the same checkpoint
      this.selectedStocks = stocks.filter(
        stock => stock.checkpoint.id === baseCheckpointId
      );
    } else {
      this.selectedStocks = stocks;
    }
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.params.page = Math.floor(this.first / this.rows) + 1;
    this.params.limit = this.rows;

    this.virtualStocks = Array.from({ length: this.rows });
    this.loadStocks();
  }

  openAddStockModal() {
    this.addStockModal.showModal = true;
  }
  openDeliverModal() {
    this.deliverModal.products.next(this.selectedStocks);
    this.deliverModal.showModal = true;
  }
}
