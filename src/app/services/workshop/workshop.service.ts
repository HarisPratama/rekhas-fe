import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {Workshop} from './shared/workshop.interface';
import {HttpClient} from '@angular/common/http';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {PaginationResp} from '../../../shared/models/pagination-resp.model';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private apiUrl = `${environment.apiUrl}/workshops`;
  public workshops: BehaviorSubject<Workshop[]> = new BehaviorSubject<Workshop[]>([]);
  public workshop: BehaviorSubject<Workshop | null> = new BehaviorSubject<Workshop | null>(null);
  public pagination = {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  }
  constructor(private http: HttpClient) { }

  fetchWorkshops(paramReq: PaginationReq) {
    const params: { [key: string]: any } = {};
    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })

    this.http.get<PaginationResp<Workshop[]>>(`${this.apiUrl}`, {
      params
    }).subscribe({
      next: (data) => {
        this.workshops.next(data.data)
        this.pagination = {
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        }
      }
    })
  }

  fetchWorkshopDetail(id: string): void {
    this.http.get<Workshop>(`${this.apiUrl}/${id}`)
      .subscribe({
        next: (data) => {
          this.workshop.next(data);
        }
      })
  }

  assignWorkshop(workshopId: number, tailorId: number, cutterId: number) {
    return this.http.patch(`${this.apiUrl}/${workshopId}/assign`, {
      tailorId,
      cutterId,
    })
  }

  scheduleDelivery(id: number, payload: any) {
    return this.http.post(`${this.apiUrl}/${id}/schedule-delivery`, payload)
  }

  updateStatus(id: number, status: string) {
    return this.http.patch(`${this.apiUrl}/${id}/update-status`, {status})
  }
}
