import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Card} from 'primeng/card';
import {Chip} from 'primeng/chip';
import {CommonModule, CurrencyPipe, NgForOf} from '@angular/common';
import {DataView} from 'primeng/dataview';
import {Divider} from 'primeng/divider';
import {Tag} from 'primeng/tag';
import {Invoice} from '../../../services/invoice/shared/invoice.interface';
import {InvoiceService} from '../../../services/invoice/invoice.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-detail-invoice-template',
  imports: [
    CommonModule,
    Card,
    Chip,
    CurrencyPipe,
    DataView,
    Divider,
    NgForOf,
    Tag
  ],
  templateUrl: './detail-invoice-template.component.html',
  styleUrl: './detail-invoice-template.component.css'
})
export class DetailInvoiceTemplateComponent implements OnInit, OnChanges, OnDestroy {
  @Input() invoice!: Invoice;
  detailInvoice: Invoice | null = null;

  destroy: Subject<void> = new Subject();

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoice'] && changes['invoice'].currentValue?.id) {
      const newInvoice = changes['invoice'].currentValue as Invoice;

      if (newInvoice.id) {
        this.invoiceService.fetchDetailInvoice(newInvoice.id);
        this.invoiceService.invoice
          .pipe(takeUntil(this.destroy))
          .subscribe(val => {
            if (val) this.detailInvoice = val;
          });
      }
    }
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  get createdAtFormatted(): string | undefined {
    return this.detailInvoice?.created_at
      ? new Date(this.detailInvoice.created_at).toDateString()
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

}
