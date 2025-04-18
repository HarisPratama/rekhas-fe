import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CreateOrder, OrderInterface} from './shared/interface/order.interface';
import {BehaviorSubject} from 'rxjs';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {PaginationResp} from '../../../shared/models/pagination-resp.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  public orders: BehaviorSubject<OrderInterface[]> = new BehaviorSubject<OrderInterface[]>([]);
  public order: BehaviorSubject<OrderInterface | null> = new BehaviorSubject<OrderInterface | null>(null);
  public pagination = {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  }
  constructor(private http: HttpClient) { }

  createOrder(payload: CreateOrder) {
    return this.http.post(`${this.apiUrl}/checkout`, payload)
  }

  fetchOrders(paramReq: PaginationReq) {
    const params: { [key: string]: any } = {};
    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })

    this.http.get<PaginationResp<OrderInterface[]>>(`${this.apiUrl}`, {
      params
    }).subscribe({
      next: (data) => {
        this.orders.next(data.data)
        this.pagination = {
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        }
      }
    })
  }

  fetchOrderDetail(id: string): void {
    this.http.get<OrderInterface>(`${this.apiUrl}/${id}`)
      .subscribe({
        next: (data) => {
          this.order.next(data);
        }
      })
  }
}
