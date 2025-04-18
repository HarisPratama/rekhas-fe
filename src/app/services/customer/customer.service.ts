import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {BehaviorSubject} from 'rxjs';
import {PaginationResp} from '../../../shared/models/pagination-resp.model';
import {Customer} from './shared/interface/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;
  public customers: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public customer: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public measurements: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public pagination = {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  }
  constructor(private http: HttpClient) { }

  createCustomer(newCustomer: Customer) {
    return this.http.post(`${this.apiUrl}`, newCustomer);
  }

  getCustomers(paramReq: PaginationReq) {
    const params: { [key: string]: any } = {};
    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })

    this.http.get<PaginationResp<any[]>>(`${this.apiUrl}`, {
      params
    }).subscribe({
      next: (data) => {
        this.customers.next(data.data);
        this.pagination = {
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        }
      }
    })
  }

  createMeasurementCustomer(customerId: number, data:any) {
    return this.http.post(`${this.apiUrl}/${customerId}/measurements`, data)
  }

  getMeasurements(customerId: number) {
    this.http.get(`${this.apiUrl}/measurements/${customerId}`)
      .subscribe((data:any) => {
        this.measurements.next(data);
      })
  }

  deleteMeasurement(id: number) {
    return this.http.delete(`${this.apiUrl}/measurement/${id}`)
  }
}
