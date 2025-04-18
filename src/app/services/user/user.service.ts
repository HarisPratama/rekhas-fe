import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  couriers: any[] = []
  userByRole: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) { }

  getEmployee() {
    return this.http.get(this.apiUrl);
  }

  getCouriers() {
    this.http.get<any[]>(this.apiUrl + '/couriers').subscribe({
      next: data => {
        this.couriers = data
      }
    });
  }

  getByRole(paramReq: PaginationReq, role: 'TAILOR' | 'CUTTER' | 'SALES' | 'DIRECTOR' | 'COURIER' | 'OFFICE') {
    const params: { [key: string]: any } = {};
    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })
    this.http.get<any>(this.apiUrl + '/by-role/', {
      params: {
        role,
        ...params,
      }
    }).subscribe({
      next: data => {
        this.userByRole.next(data.data);
      }
    })
  }
}
