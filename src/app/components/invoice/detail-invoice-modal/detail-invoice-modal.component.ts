import {Component, ElementRef, ViewChild} from '@angular/core';
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
import {DetailInvoiceTemplateComponent} from '../detail-invoice-template/detail-invoice-template.component';

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
    ToastModule,
    DetailInvoiceTemplateComponent
  ],
  templateUrl: './detail-invoice-modal.component.html',
  styleUrl: './detail-invoice-modal.component.css'
})
export class DetailInvoiceModalComponent {
  @ViewChild('invoiceContent') invoiceContent!: ElementRef;

  visible = false;
  generatingPdf = false;
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
