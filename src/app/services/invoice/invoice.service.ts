import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {OrderInterface} from '../order/shared/interface/order.interface';
import {HttpClient} from '@angular/common/http';
import {CreateInvoiceDto, Invoice} from './shared/invoice.interface';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {PaginationResp} from '../../../shared/models/pagination-resp.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;
  public invoices: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  public availableInvoices: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  public invoice: BehaviorSubject<Invoice | null> = new BehaviorSubject<Invoice | null>(null);
  public pagination = {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  }
  constructor(private http: HttpClient) { }

  createInvoice(payload: CreateInvoiceDto) {
    return this.http.post(`${this.apiUrl}`, payload)
  }

  createPayment(payload: any, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(payload).forEach(key => {
      formData.append(key, payload[key]);
    })

    return this.http.post(`${this.apiUrl}/payment`, formData)
  }

  fetchInvoices(paramReq: PaginationReq) {
    const params: { [key: string]: any } = {};
    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })

    this.http.get<PaginationResp<Invoice[]>>(`${this.apiUrl}`, {
      params
    }).subscribe({
      next: (data) => {
        this.invoices.next(data.data)
        this.pagination = {
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        }
      }
    })
  }

  fetchDetailInvoice(invoiceId: number) {
    this.http.get<Invoice>(`${this.apiUrl}/${invoiceId}`)
      .subscribe({
        next: (data) => {
          this.invoice.next(data)
        }
      })
  }

  fetchAvailableInvoices(param: {productId: number, customerId: number}) {
    this.http.get<Invoice[]>(`${this.apiUrl}/available`, {
      params: param
    }).subscribe({
      next: (data) => {
        const current = this.availableInvoices.getValue();
        this.availableInvoices.next([...current, ...data]);
      }
    })
  }
}
