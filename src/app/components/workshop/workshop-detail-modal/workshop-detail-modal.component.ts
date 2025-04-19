import {Component, OnDestroy, OnInit} from '@angular/core';
import { ChipModule} from "primeng/chip";
import {CommonModule } from "@angular/common";
import { DataViewModule} from "primeng/dataview";
import { DialogModule} from "primeng/dialog";
import { DividerModule} from "primeng/divider";
import {TagModule} from "primeng/tag";
import {WorkshopService} from '../../../services/workshop/workshop.service';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';
import { PanelModule} from 'primeng/panel';
import {CustomerMeasurement} from '../../../services/customer/shared/interface/customer.interface';
import { ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, min, Subject, Subscription, switchMap} from 'rxjs';
import {UserService} from '../../../services/user/user.service';
import {InplaceModule} from 'primeng/inplace';
import {InputTextModule} from 'primeng/inputtext';
import {DatePickerModule} from 'primeng/datepicker';
import {CheckboxModule} from 'primeng/checkbox';
import {TextareaModule} from 'primeng/textarea';

type NumericMeasurementKey = {
  [K in keyof CustomerMeasurement]: CustomerMeasurement[K] extends number ? K : never
}[keyof CustomerMeasurement];


@Component({
  selector: 'app-workshop-detail-modal',
  imports: [
    CardModule,
    ButtonModule,
    ChipModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    TagModule,
    CommonModule,
    BadgeModule,
    PanelModule,
    ToastModule,
    AutoCompleteModule,
    FormsModule,
    InplaceModule,
    InputTextModule,
    DatePickerModule,
    CheckboxModule,
    TextareaModule
  ],
  templateUrl: './workshop-detail-modal.component.html',
  styleUrl: './workshop-detail-modal.component.css',
  providers: [MessageService],
})
export class WorkshopDetailModalComponent implements OnInit, OnDestroy {
  visible = false;
  workshop: any;
  detailWorkshop: any;
  loading = false;
  selectedMaster : any | null = null
  selectedWorker: any | null = null
  selectedCourier: any | null = null
  scheduleDate = ''
  searchInputMaster$ = new Subject<string>();
  searchInputWorker$ = new Subject<string>();
  searchInputCourier$ = new Subject<string>();
  masterSearchSub!: Subscription;
  workerSearchSub!: Subscription;
  courierSearchSub!: Subscription;
  params = {
    page: 1,
    limit: 10,
    orderBy: '',
    order: '',
    search: '',
  }
  addressDelivery = ''
  note = ''
  minDate: Date = new Date();
  isPriority = false;

  tailors:any[] = []
  workers:any[] = []
  couriers:any[] = []

  constructor(
    public workshopService: WorkshopService,
    public userService: UserService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.masterSearchSub = this.searchInputMaster$.
    pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.params.search = query;
        this.userService.getByRole(this.params, 'CUTTER');
        return this.userService.userByRole
      })
    ).subscribe(tailor => {
      this.tailors = tailor;
    })

    this.workerSearchSub = this.searchInputWorker$.
    pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.params.search = query;
        this.userService.getByRole(this.params, 'TAILOR');
        return this.userService.userByRole
      })
    ).subscribe(workers => {
      this.workers = workers;
    })

    this.courierSearchSub = this.searchInputCourier$.
    pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.params.search = query;
        this.userService.getByRole(this.params, 'COURIER');
        return this.userService.userByRole
      })
    ).subscribe(courier => {
      this.couriers = courier;
    })
  }

  ngOnDestroy() {
    this.workerSearchSub.unsubscribe();
    this.masterSearchSub.unsubscribe();
  }

  open(workshop: any) {
    this.visible = true;
    this.workshop = workshop;
    if (this.workshop?.id) {
      this.workshopService.fetchWorkshopDetail(this.workshop.id);
      this.workshopService.workshop.subscribe(resp => {
        this.detailWorkshop = resp;
      })
    }
  }

  searchMaster(e: AutoCompleteCompleteEvent) {
    this.searchInputMaster$.next(e.query);
  }

  searchWorker(e: AutoCompleteCompleteEvent) {
    this.searchInputWorker$.next(e.query);
  }

  searchCourier(e: AutoCompleteCompleteEvent) {
    this.searchInputCourier$.next(e.query);
  }

  get item(): any {
    return this.detailWorkshop?.orderItem?.product ?? {};
  }

  onClose() {
    this.visible = false;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'on_request':
        return 'info';
      case 'on_process':
        return 'warn';
      case 'completed':
        return 'success';
      default:
        return 'danger';
    }
  }

  getImageType(workshopType: string) {
    switch (workshopType) {
      case 'SHIRT':
        return '/assets/images/shirt-ss.png'
      case 'SUITE':
        return '/assets/images/suit-ss.png'
      case 'TROUSER':
        return '/assets/images/trouser-ss.png'
      default:
        return '/assets/images/shirt-ss.png';
    }
  }

  getType(workshopType: string) {
    switch (workshopType) {
      case 'READY-TO-WEAR':
        return 'SHIRT'
      default:
        return workshopType
    }
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

  updateStatus(status: string) {
    this.loading = true;
    if (!this.detailWorkshop?.id) return;
    if (status === 'on_process') {
      this.workshopService.updateStatus(this.workshop.id, status)
        .subscribe({
          next: () => {
            this.loading = false;
            this.messageService.add({ severity: 'success', detail: 'Successfully updated', life: 3000 });
            this.workshopService.fetchWorkshopDetail(this.workshop.id);
          },
          error: err => {
            this.loading = false;
            this.messageService.add({ severity: 'error', detail: err?.error?.message ?? 'Failed update', life: 3000 });
          }
        })
    } else if (status === 'ready') {
      if (this.selectedMaster?.id && this.selectedWorker?.id) {
        this.workshopService.assignWorkshop(this.detailWorkshop.id, this.selectedMaster.id, this.selectedWorker.id)
          .subscribe({
            next: () => {
              this.messageService.add({detail: 'Successfully assigned', life: 3000 });
              this.workshopService.fetchWorkshopDetail(this.workshop.id);
              this.loading = false;
            },
            error: err => {
              this.messageService.add({detail: err?.error?.message ?? 'Failed assign', life: 3000 });
              this.loading = false;
            }
          })
      }
    } else if (status === 'completed') {
      const addressDelivery = this.addressDelivery.length > 0 ? this.addressDelivery : this.detailWorkshop?.order?.customer?.address;
      const payload = {
        address: addressDelivery,
        courierId: this.selectedCourier?.id,
        scheduledDate: this.scheduleDate,
        isPriority: this.isPriority,
        note: this.note
      }
      this.workshopService.scheduleDelivery(this.detailWorkshop.id, payload)
        .subscribe({
          next: () => {
            this.messageService.add({detail: 'Successfully create schedule delivery', life: 3000 });
            this.workshopService.fetchWorkshopDetail(this.workshop.id);
            this.loading = false;
          },
          error: err => {
            this.messageService.add({detail: err?.error?.message ?? 'Failed create schedule', life: 3000 });
            this.loading = false;
          }
        })
    }

  }

  protected readonly min = min;
}
