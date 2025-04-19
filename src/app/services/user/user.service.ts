import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {BehaviorSubject} from 'rxjs';
import {User} from './shared/interface/user.interface';
import {PaginationResp} from '../../../shared/models/pagination-resp.model';

interface Role {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private apiUrlRoles = `${environment.apiUrl}/roles`;

  roles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  couriers: any[] = [];
  employees: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  userByRole: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public pagination = new BehaviorSubject({
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  })

  constructor(private http: HttpClient) { }

  getRoles() {
    this.http.get<Role[]>(`${this.apiUrlRoles}`)
      .subscribe({
        next: result => {
          this.roles.next(result);
        }
      });
  }

  getEmployee(paramReq: PaginationReq) {
    const params: { [key: string]: any } = {};

    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })

    this.http.get<PaginationResp<User[]>>(this.apiUrl, {
      params
    }).subscribe({
      next: data => {
        this.employees.next(data.data);
        this.pagination.next({
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        })
      }
    });
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

  addEmployee(payload: any) {
    return this.http.post(this.apiUrl, payload);
  }

  addEmployeeWithProfile(payload: any, file: File) {
    const formData = new FormData();
    formData.append('profile', file);
    Object.keys(payload).forEach(key => {
      formData.append(key, payload[key]);
    });
    return this.http.post(this.apiUrl + '/profile', formData);
  }

}
