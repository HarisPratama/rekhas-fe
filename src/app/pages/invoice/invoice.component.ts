import {Component, OnInit, ViewChild} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {InvoiceService} from '../../services/invoice/invoice.service';
import {TableLazyLoadEvent} from 'primeng/table';
import {PaginatorState} from 'primeng/paginator';
import {Badge} from 'primeng/badge';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {GenericTableComponent} from '../../components/global/generic-table/generic-table.component';
import {QuickInvoiceModalComponent} from '../../components/invoice/quick-invoice-modal/quick-invoice-modal.component';
import {InputTextModule} from 'primeng/inputtext';
import {Invoice} from '../../services/invoice/shared/invoice.interface';
import {
  DetailInvoiceModalComponent
} from '../../components/invoice/detail-invoice-modal/detail-invoice-modal.component';
import {
  PaymentDetailModalComponent
} from '../../components/invoice/payment-detail-modal/payment-detail-modal.component';

@Component({
  selector: 'app-invoice',
  imports: [ButtonModule, FormsModule, InputTextModule, DatePipe, GenericTableComponent, QuickInvoiceModalComponent, CurrencyPipe, DetailInvoiceModalComponent, PaymentDetailModalComponent, Badge],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  @ViewChild('quickInvoiceModalComponent') quickInvoiceModal!: QuickInvoiceModalComponent;
  @ViewChild('invoiceDetailModal') invoiceDetailModal!: DetailInvoiceModalComponent;
  @ViewChild('paymentDetailModal') paymentDetailModal!: PaymentDetailModalComponent;

  search = '';
  params: PaginationReq = {
    page: 1,
    limit: 10,
    orderBy: '',
    order: '',
    search: '',
    type: ''
  }
  virtualInvoices: any[] = [];
  selectedInvoices: any[] = [];
  totalRecords = 0;
  first = 0;
  rows = 5;
  loading = false;

  cols = [
    { field:'issued_at', header: 'Issued At ID', style: { minWidth: '200px' } },
    { field:'invoice', header: 'Invoice number', style: { minWidth: '200px' } },
    { field:'customer_detail', header: 'Customer Detail', style: { minWidth: '200px' } },
    { field:'customer_address', header: 'Customer Address', style: { minWidth: '200px' } },
    { field:'item', header: 'Item', style: { minWidth: '200px' } },
    { field:'fabrics', header: 'Fabrics', style: { minWidth: '200px' } },
    { field:'fabric_checkpoints', header: 'Fabric Checkpoints', style: { minWidth: '200px' } },
    { field:'sum', header: 'Sum', style: { minWidth: '200px' } },
    { field:'status', header: 'Pay Status', style: { minWidth: '200px' } },
    { field:'pay_method', header: 'Pay Method', style: { minWidth: '200px' } },
    { field:'actions', header: 'Actions', style: { minWidth: '200px' } },
  ];

  constructor(public invoiceService: InvoiceService) {
  }

  ngOnInit() {
    this.virtualInvoices = Array.from({ length: this.rows });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    if (event) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 5;
      this.params.page = Math.floor(this.first / this.rows) + 1;
      this.params.limit = this.rows;

      this.loadInvoice()
    }
  }

  loadInvoice() {
    this.invoiceService.fetchInvoices(this.params);
    this.invoiceService.invoices.subscribe(invoice => {
      this.virtualInvoices = invoice;
    })
    this.totalRecords = this.invoiceService.pagination.total;
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.params.page = Math.floor(this.first / this.rows) + 1;
    this.params.limit = this.rows;

    this.virtualInvoices = Array.from({ length: this.rows });
    this.loadInvoice();
  }

  onSelectInvoice(orders: any[]): void {
    this.selectedInvoices = orders;
  }

  showModal() {
    this.quickInvoiceModal.display = true;
  }

  getProductTypes(invoice: Invoice): string {
    return invoice?.products?.map(p => p?.type).filter(Boolean).join(', ') || '-';
  }

  getProductFabrics(invoice: Invoice): string {
    return invoice?.products?.map(p => p?.fabric).filter(Boolean).join(', ') || '-';
  }

  getCheckpointNames(invoice: Invoice): string {
    return invoice?.products
      ?.flatMap(p => p.checkpointStocks || [])
      ?.map(cs => cs?.checkpoint?.name)
      ?.filter(Boolean)
      .join(', ') || '-';
  }

  openDetailInvoice(invoice: Invoice) {
      this.invoiceDetailModal.open(invoice);
  }

  openDetailPayment(invoice: Invoice) {
    this.paymentDetailModal.open(invoice);
  }

  generateSeverity(status: string) {
    switch (status) {
      case 'PAID':
        return 'success'
      case 'PARTIAL':
        return 'info'
      case 'UNPAID':
        return 'warn'
      default:
        return 'contrast'
    }
  }

}
