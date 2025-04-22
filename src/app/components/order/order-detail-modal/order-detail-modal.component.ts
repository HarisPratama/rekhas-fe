import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {Chip} from "primeng/chip";
import {CommonModule, CurrencyPipe, NgForOf} from "@angular/common";
import {DataView} from "primeng/dataview";
import {Dialog} from "primeng/dialog";
import {Divider} from "primeng/divider";
import {Tag} from "primeng/tag";
import {OrderService} from '../../../services/order/order.service';
import {CardModule} from 'primeng/card';
import {AvatarModule} from 'primeng/avatar';
import {FloatLabelModule} from 'primeng/floatlabel';
import {FormsModule} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {CreateInvoiceDto} from '../../../services/invoice/shared/invoice.interface';
import {InvoiceService} from '../../../services/invoice/invoice.service';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {DetailInvoiceTemplateComponent} from '../../invoice/detail-invoice-template/detail-invoice-template.component';

@Component({
  selector: 'app-order-detail-modal',
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
    ToastModule,
    DetailInvoiceTemplateComponent
  ],
  templateUrl: './order-detail-modal.component.html',
  styleUrl: './order-detail-modal.component.css',
  providers: [MessageService]
})
export class OrderDetailModalComponent {
  visible = false;
  generatingInvoice = false;
  comission = ''
  order: any;
  detailOrder: any;
  generatingPdf = false;

  constructor(
    public orderService: OrderService,
    private invoiceService: InvoiceService,
    private messageService: MessageService,
  ) {
  }

  open(order: any) {
    this.visible = true;
    this.order = order;
    if (this.order?.id) {
      this.orderService.fetchOrderDetail(this.order.id);
      this.orderService.order.subscribe(order => {
        this.detailOrder = order;
      })
    }
  }

  onClose() {
    this.visible = false;
  }

  generateInvoice() {
    if (this.detailOrder.id) {
      const invoiceData: CreateInvoiceDto = {
        orderId: this.detailOrder.id,
        customerId: this.detailOrder.customer.id,
        productIds: this.detailOrder.items.map((item: any) => item.product.id),
        total_amount: this.detailOrder.total_amount,
        notes: '',
      };
      this.generatingInvoice = true;
      this.invoiceService.createInvoice(invoiceData).subscribe({
        next: () => {
          this.messageService.add({detail: 'Successfully generated invoice', life: 3000});
          this.orderService.fetchOrderDetail(this.order.id);
          this.generatingInvoice = false;
        },
        error: (e) => {
          this.generatingInvoice = false;
          this.messageService.add({detail: e?.error?.message ?? 'Failed to create invoice', life: 3000});
        }
      })
    }

  }

  generateLetter() {
    // TODO: Implement PDF or letter generation
    console.log('Generate delivery letter');
  }

  get scheduledAtFormatted(): string | undefined {
    return this.order?.created_at
      ? new Date(this.order.created_at).toDateString()
      : undefined;
  }
  get dueDateFormatted(): string | undefined {
    return this.order?.due_date
      ? new Date(this.order.due_date).toDateString()
      : undefined;
  }

  getSeverity(product: any) {
    switch (product?.status) {
      case 'completed':
        return 'success';
      case 'on_process':
        return 'warn';
      case 'on_request':
        return 'info';
      default:
        return 'warn';
    }
  }

  previewPDF() {
    this.generatingPdf = true;
    const element = document.getElementById('invoiceContent');
    if (!element) return;

    // Tunggu semua gambar dalam element selesai dimuat
    const images = Array.from(element.querySelectorAll('img'));
    const promises = images.map((img: any) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        }
      });
    });

    Promise.all(promises).then(() => {
      import('html2pdf.js').then((module: any) => {
        const html2pdf = module.default;

        const options = {
          margin: 0.5,
          filename: 'invoice.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).outputPdf('dataurlnewwindow');

        this.generatingPdf = false;
      });
    });
  }

}
