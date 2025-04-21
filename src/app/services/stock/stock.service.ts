import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../../models/stock.model';
import { environment } from '../../../environments/environment';
import {PaginationResp} from '../../../shared/models/pagination-resp.model';
import {PaginationReq} from '../../../shared/models/pagination-req.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/checkpoint-stocks`;

  constructor(private http: HttpClient) {}

  getStocks(paramReq: PaginationReq): Observable<PaginationResp<Stock[]>> {
    const params: { [key: string]: any } = {};

    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })
    return this.http.get<PaginationResp<Stock[]>>(this.apiUrl, {
      params
    });
  }

  getStockByCheckpoint(paramReq: PaginationReq, checkpoint: number): Observable<PaginationResp<Stock[]>> {
    const params: { [key: string]: any } = {};

    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })

    return this.http.get<PaginationResp<Stock[]>>(this.apiUrl + '/checkpoint/' + checkpoint, {
      params
    });
  }
}
