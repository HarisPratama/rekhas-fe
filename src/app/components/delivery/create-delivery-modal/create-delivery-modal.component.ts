import {Component, OnInit} from '@angular/core';
import {FormControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {UserService} from '../../../services/user/user.service';
import {CheckpointService} from '../../../services/checkpoint/checkpoint.service';
import {DatePickerModule} from 'primeng/datepicker';
import {Stock} from '../../../models/stock.model';
import {BehaviorSubject, Subscription} from 'rxjs';
import {DeliveryService} from '../../../services/delivery/delivery.service';
import {MessageService} from 'primeng/api';
import {SelectModule} from 'primeng/select';

@Component({
  selector: 'app-create-delivery-modal',
  imports: [ReactiveFormsModule, SelectModule, DialogModule, ButtonModule, DropdownModule, DatePickerModule],
  providers: [UserService, DeliveryService],
  templateUrl: './create-delivery-modal.component.html',
  styleUrl: './create-delivery-modal.component.css'
})
export class CreateDeliveryModalComponent implements OnInit {
  subs = new Subscription();
  products: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  showModal = false;
  form: FormGroup = new FormGroup({});

  deliveryTypes = [
    { label: 'Checkpoint', value: 'checkpoint' },
    { label: 'Customer', value: 'customer' },
  ];
  checkpoints = [
    { label: 'Checkpoint A', value: 'A' },
    { label: 'Checkpoint B', value: 'B' },
    // Tambah checkpoint lain sesuai kebutuhan
  ];

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    public checkpointService: CheckpointService,
    public deliveryService: DeliveryService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm()
    this.userService.getCouriers();
    this.checkpointService.getCheckpointDropdown()
    this.prodSubcribtion()
  }

  initForm() {
    this.form = this.fb.group({
      deliveryType: [{ value: 'checkpoint' }],
      to_id: [null, Validators.required],
      scheduled_at: [null, Validators.required],
      items: this.fb.array([]),
      courier_id: [null, Validators.required],
      note: ['']
    });
  }

  prodSubcribtion(){
    this.initForm();
    const prodSub = this.products.subscribe((products) => {
      products.forEach((product) => {
        this.addItem(product);
      })
    })

    this.subs.add(prodSub);
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  getQuantityControl(index: number): FormControl {
    return this.form.get(['items', index, 'quantity']) as FormControl;
  }

  addItem(item: Stock) {
    const itemGroup = this.fb.group({
      id: [item.id],
      product: [item.product],
      checkpoint: [item.checkpoint],
      quantity: [1],
      max: [item.quantity]
    });

    this.items.push(itemGroup);
  }

  confirmDelivery() {
    if (this.form.valid) {
      const value = this.form.getRawValue()
      if (this.items.getRawValue()[0].checkpoint.id === value.to_id) {
        this.messageService.add({
          severity: 'info',
          summary: 'Tidak bisa mengirim barang ke checkpoint yg sama',
        })
        return;
      }

      const payload = {
        from_id: this.items.getRawValue()[0].checkpoint.id,
        to_id: value.to_id,
        scheduled_at: value.scheduled_at,
        courier_id: value.courier_id,
        note: value.note,
        is_priority: false,
        items: this.items.getRawValue().map((item) => ({
          product_id: item.product.id,
          quantity_delivered: item.quantity,
        })),
      }
      console.log(payload)
      this.deliveryService.deliverToAnotherCheckpoint(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successfully create delivery',
            detail: 'Pengiriman stock berhasil dijadwalkan',
            life: 5000
          });
          this.showModal = false;
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error creating delivery',
            detail: err,
            life: 3000
          })
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  protected readonly FormGroup = FormGroup;
}
