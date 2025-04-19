import { Component } from '@angular/core';
import { AvatarModule} from "primeng/avatar";
import {Button} from "primeng/button";
import { CardModule} from "primeng/card";
import {Chip} from "primeng/chip";
import {CommonModule, CurrencyPipe, NgForOf} from "@angular/common";
import {DataView} from "primeng/dataview";
import {Dialog} from "primeng/dialog";
import {Divider} from "primeng/divider";
import { FloatLabelModule} from "primeng/floatlabel";
import { InputNumberModule} from "primeng/inputnumber";
import {Tag} from "primeng/tag";
import {FormsModule} from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {InvoiceService} from '../../../services/invoice/invoice.service';

@Component({
  selector: 'app-detail-invoice-modal',
    imports: [
      CardModule,
      FloatLabelModule,
      InputNumberModule,
      FormsModule,
      AvatarModule,
      Button,
      Chip,
      CurrencyPipe,
      DataView,
      Dialog,
      Divider,
      NgForOf,
      Tag,
      CommonModule,
      ToastModule
    ],
  templateUrl: './detail-invoice-modal.component.html',
  styleUrl: './detail-invoice-modal.component.css'
})
export class DetailInvoiceModalComponent {
  visible = false;
  generatingInvoice = false;
  comission = ''
  invoice: any;
  detailInvoice: any;

  constructor(
    private invoiceService: InvoiceService,
  ) {
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

  get createdAtFormatted(): string | undefined {
    return this.invoice?.created_at
      ? new Date(this.invoice.created_at).toDateString()
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
}
