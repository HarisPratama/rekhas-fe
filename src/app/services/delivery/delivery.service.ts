import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {PaginationResp} from '../../../shared/models/pagination-resp.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = `${environment.apiUrl}/deliveries`;
  public deliveries: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public delivery: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public pagination = {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  }

  constructor(private http: HttpClient) { }

  fetchDeliveries(paramReq: PaginationReq): void {
    const params: { [key: string]: any } = {};
    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })

    this.http.get<PaginationResp<any[]>>(`${this.apiUrl}`, {
      params
    }).subscribe({
      next: (data) => {
        this.deliveries.next(data.data);
        this.pagination = {
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        }
      }
    })
  }

  fetchDeliveryDetail(id: string): void {
    this.http.get(`${this.apiUrl}/${id}`)
      .subscribe({
        next: (data) => {
          this.delivery.next(data);
        }
      })
  }

  deliverToAnotherCheckpoint(payload: any) {
    return this.http.post(this.apiUrl + '/internal-transfer', payload);
  }

  uploadProveImage(deliveryId: number, formData: FormData) {
    return this.http.post(`${this.apiUrl}/${deliveryId}/proof`, formData);
  }
}
