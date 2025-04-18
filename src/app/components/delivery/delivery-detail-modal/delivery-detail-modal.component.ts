import { Component, Input } from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {ChipModule} from 'primeng/chip';
import {ButtonModule} from 'primeng/button';
import {DeliveryService} from '../../../services/delivery/delivery.service';
import {DataViewModule} from 'primeng/dataview';
import {CommonModule} from '@angular/common';
import {TagModule} from 'primeng/tag';
import {FileSelectEvent, FileUploadEvent, FileUploadModule} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-delivery-detail-modal',
  templateUrl: './delivery-detail-modal.component.html',
  styleUrls: ['./delivery-detail-modal.component.css'],
  imports: [CommonModule, ToastModule, FileUploadModule, TagModule, DialogModule, DataViewModule, DividerModule, ChipModule, ButtonModule],
  providers: [DeliveryService, MessageService],
})
export class DeliveryDetailModalComponent {
  visible = false;
  proveImage: File | null = null;
  onUpload = false;

  delivery: any;
  detailDelivery: any;

  constructor(
    public deliveryService: DeliveryService,
    private messageService: MessageService,
  ) {
  }

  open(delivery: any) {
    this.delivery = delivery;
    this.visible = true;
    if(delivery?.id) this.deliveryService.fetchDeliveryDetail(delivery.id)
    this.deliveryService.delivery
      .subscribe(data=>{
        this.detailDelivery = data;
      })
  }

  onClose() {
    this.visible = false;
  }

  uploadPhoto() {
    // TODO: Implement upload logic
    console.log('Upload delivery photo');
  }

  generateLetter() {
    // TODO: Implement PDF or letter generation
    console.log('Generate delivery letter');
  }

  get scheduledAtFormatted(): string | undefined {
    return this.delivery?.scheduled_at
      ? new Date(this.delivery.scheduled_at).toLocaleDateString()
      : undefined;
  }

  getSeverity(product: any) {
    switch (product?.status) {
      case 'DONE':
        return 'success';

      case 'ON_PROCESS':
        return 'warn';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return 'warn';
    }
  }

  proveImageUrl: string | null = null;

  onBasicUploadAuto(event: FileSelectEvent) {
    this.onUpload = true;
    if (this.delivery?.id && event.currentFiles && event.currentFiles.length > 0) {
      this.proveImage = event.currentFiles[0];

      // Clean up previous object URL
      if (this.proveImageUrl) {
        URL.revokeObjectURL(this.proveImageUrl);
      }

      this.proveImageUrl = URL.createObjectURL(this.proveImage);

      const formData = new FormData();
      formData.append('file', this.proveImage);
      this.deliveryService.uploadProveImage(this.delivery.id, formData)
        .subscribe({
          next: () => {
            this.messageService.add({detail: 'Success upload prove image', severity: 'success', life: 3000});
            this.deliveryService.fetchDeliveryDetail(this.delivery.id)
            this.onUpload = false;
          },
          error: error => {
            this.messageService.add({detail: error?.error?.message ?? 'Error uploading prove image', life: 3000});
            this.onUpload = false;
          }
        })
    }
  }
}
