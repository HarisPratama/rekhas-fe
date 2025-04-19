import { Component } from '@angular/core';
import {InvoiceService} from '../../../services/invoice/invoice.service';
import {ChipModule} from 'primeng/chip';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {InplaceModule} from 'primeng/inplace';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {FileSelectEvent, FileUploadModule} from 'primeng/fileupload';
import {ButtonModule} from 'primeng/button';
import {TextareaModule} from 'primeng/textarea';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-payment-detail-modal',
  imports: [
    TableModule,
    ButtonModule,
    TextareaModule,
    ChipModule,
    DialogModule,
    DividerModule,
    InplaceModule,
    FormsModule,
    InputNumber,
    ReactiveFormsModule,
    FileUploadModule,
    ToastModule,
    CurrencyPipe
  ],
  templateUrl: './payment-detail-modal.component.html',
  styleUrl: './payment-detail-modal.component.css',
  providers: [MessageService]
})
export class PaymentDetailModalComponent {
  visible = false;
  loading = false;
  invoice: any;
  detailInvoice: any;
  proveImage : File | null = null

  form = new FormGroup({
    amount: new FormControl(0, Validators.required),
    note: new FormControl('', Validators.required),
  })

  constructor(
    private invoiceService: InvoiceService,
    private messageService: MessageService,
  ) {
  }

  submitPayment() {
    this.loading = true;
    if (this.form.valid && this.proveImage) {
      const payload = {
        amount: this.form.value.amount,
        note: this.form.value.note,
        invoice_id: this.detailInvoice.id,
      }
      this.invoiceService.createPayment(payload, this.proveImage)
        .subscribe({
          next: () => {
            this.loading = false;
            this.form.reset();
            this.invoiceService.fetchDetailInvoice(this.detailInvoice.id)
            this.messageService.add({detail: 'Successfully created', life: 3000});
          },
          error: (err) => {
            this.loading = false;
            this.messageService.add({detail: err?.error?.message ?? 'Failed request', life: 3000});
          }
        })
    }

  }

  onSelectImage(e: FileSelectEvent) {
    this.proveImage = e.files[0];
  }


  open(invoice: any) {
    this.visible = true;
    this.invoice = invoice;
    if (this.invoice?.id) {
      this.invoiceService.fetchDetailInvoice(this.invoice.id);
      this.invoiceService.invoice.subscribe(resp => {
        this.detailInvoice = resp;
      })
    }
  }

  onClose() {
    this.visible = false;
  }

  getCreatedAtFormatted(date: string): string | undefined {
    return date
      ? new Date(date).toDateString()
      : undefined;
  }

}
