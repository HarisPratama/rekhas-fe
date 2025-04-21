import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {CurrencyPipe, DatePipe, JsonPipe} from '@angular/common';
import {FrozenColumn, TableLazyLoadEvent, TableModule} from 'primeng/table';
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
import {Checkpoint, Stock} from '../../models/stock.model';
import {CheckpointService} from '../../services/checkpoint/checkpoint.service';
import {SelectModule} from 'primeng/select';
import {SearchInputComponent} from '../../components/shared/components/search-input/search-input.component';
import {DividerModule} from 'primeng/divider';
import {Subject, takeUntil} from 'rxjs';
import {CardModule} from 'primeng/card';
import {AvatarModule} from 'primeng/avatar';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {UserService} from '../../services/user/user.service';
import {User} from '../../services/user/shared/interface/user.interface';
import {FileSelectEvent, FileUploadModule} from 'primeng/fileupload';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-checkpoint',
  imports: [
    AvatarModule,
    CardModule,
    FileUploadModule,
    InputTextModule,
    TextareaModule,
    DividerModule,
    SelectModule,
    TableModule,
    PaginatorModule,
    FormsModule,
    ToastModule,
    GenericTableComponent,
    ButtonModule,
    AddStockComponent,
    CreateDeliveryModalComponent,
    SearchInputComponent,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './checkpoint.component.html',
  providers: [MessageService],
  styleUrl: './checkpoint.component.css'
})
export class CheckpointComponent implements OnInit, OnDestroy {

  virtualStocks: Stock[] = [];
  selectedStocks: Stock[] = [];
  loading = false;
  first = 0;
  rows = 5;
  totalRecords = 0;
  activeTab = '';
  onUpdateCheckpoint = false;
  selectedCheckpoint: number = 0;
  checkpoint: Checkpoint = {
    id: 0,
    type: '',
    name: '',
    code: '',
    image_url: '',
    address: '',
    phone: '',
    pic_id: 0,
  };
  isEditMode = false;

  checkpoint_name = '';
  checkpoint_phone = '';
  checkpoint_address = '';
  picSelected: User | null = null;
  imagePick: File | null = null;

  stockTabs = [
    { label: 'All', value: '' },
    { label: 'Collection', value: 'COLLECTION' },
    { label: 'Regular', value: 'REGULAR' },
    { label: 'Ready to Wear', value: 'READY-TO-WEAR' },
  ];

  cols = [
    { field: 'name', header: 'Product Name', style: { minWidth: '200px' } },
    { field: 'code', header: 'Product Code', style: { minWidth: '200px' } },
    { field: 'fabric', header: 'Fabric Code', style: { minWidth: '200px' } },
    { field: 'quantity', header: 'Qty', style: { minWidth: '200px' } },
    { field: 'description', header: 'Description', style: { minWidth: '200px' } },
    { field: 'price', header: 'Price', style: { minWidth: '200px' } },
    { field: 'created_at', header: 'Date Added', style: { minWidth: '200px' } },
    { field: 'image', header: 'Image', style: { minWidth: '200px' } },
    { field: 'checkpoint', header: 'Checkpoint', style: { minWidth: '200px' }, isFrozen: true },
  ];

  frozenColumns = [
    { field: 'checkpoint', header: 'Checkpoint' },
    { field: 'image', header: 'Image' },
  ]
  pic: any[] = []

  params: PaginationReq = {
    page: 1,
    limit: 5,
    order: '',
    orderBy: '',
    search: '',
  };
  private destroy$ = new Subject<void>();


  constructor(
    private stockService: StockService,
    private messageService: MessageService,
    public checkpointService: CheckpointService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.virtualStocks = Array.from({ length: this.rows });
    this.checkpointService.getCheckpointDropdown();
    this.checkpointService.checkpoint.
      pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(val => {
        if(val) this.checkpoint = val;
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleEdit() {
    const paramsReqPic: PaginationReq = {
      page: 1,
      limit: 5,
      order: '',
      orderBy: '',
      search: '',
    };
    this.userService.getEmployee(paramsReqPic)
    this.userService.employees
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.pic = res;
      })
    this.isEditMode = !this.isEditMode;
    this.checkpoint_name = this.checkpointName
    this.checkpoint_phone = this.checkpointPhone
    this.checkpoint_address = this.checkpointAddress
  }

  updateCheckpoint() {
    if (this.picSelected) {
      const payload: Checkpoint = {
        ...this.checkpoint,
        name: this.checkpoint_name,
        phone: this.checkpoint_phone,
        address: this.checkpoint_address,
        pic: this.picSelected,
        pic_id: this.picSelected.id
      }
      payload.full_image_url = undefined;
      const formData: FormData = new FormData();

      Object.keys(payload).forEach((key) => {
        const value = payload[key as keyof typeof payload];
        if (typeof value === 'object' && value !== null) {
          if (key === 'pic') {
            formData.append('pic', JSON.stringify(value));
          } else {
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (this.imagePick) {
        formData.append('image', this.imagePick);
      }
      this.onUpdateCheckpoint = true;

      this.checkpointService.updateCheckpointDetail(this.checkpoint.id, formData)
        .subscribe({
          next: (res) => {
            this.messageService.add({detail: 'Successfully updated checkpoint', severity: 'success'});
            this.onUpdateCheckpoint = false;
            location.reload();
          },
          error: (err) => {
            this.onUpdateCheckpoint = false;
            this.messageService.add({detail: err?.error?.message ?? 'Failed to update checkpoint', severity: 'error'});
          }
        })
    }
  }


  get picName(): string {
    return this.checkpoint.pic?.name ?? '-'
  }

  get checkpointName(): string {
    return this.checkpoint?.name ?? '-'
  }
  get checkpointAddress(): string {
    return this.checkpoint?.address ?? '-'
  }
  get checkpointPhone(): string {
    return this.checkpoint?.phone ?? '-'
  }
  get checkpointImage(): string {
    return this.checkpoint?.phone ?? '-'
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
    this.activeTab = type;
    this.params.type = type;
    this.virtualStocks = Array.from({ length: this.rows });
    if (this.selectedCheckpoint) {
      this.loadStocksByCheckpoint(this.selectedCheckpoint);
    } else {
      this.loadStocks();
    }
  }

  onPickCheckpoint(e: any) {
    this.params.page = 0;
    this.loadStocksByCheckpoint(e.value)
    this.checkpointService.getCheckpointDetail(e.value);
  }

  loadStocksByCheckpoint(checkpoint: number) {
    this.loading = true;

    this.stockService.getStockByCheckpoint(this.params, checkpoint).subscribe({
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
    console.log(event);
    console.log(this.params.page);
    this.virtualStocks = Array.from({ length: this.rows });
    if (this.selectedCheckpoint) {
      this.loadStocksByCheckpoint(this.selectedCheckpoint);
    } else {
      this.loadStocks();
    }
  }

  onSelectImage(e: FileSelectEvent): void {
    this.imagePick = e.files[0]
  }

  get imagePreview() {
    if (this.imagePick) {
      return URL.createObjectURL(this.imagePick);
    }

    return null;
  }
}
