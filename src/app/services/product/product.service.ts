import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {Product, ProductDropdown} from '../../models/stock.model';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {PaginationResp} from '../../../shared/models/pagination-resp.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  product: BehaviorSubject<Product | null> = new BehaviorSubject<Product | null>(null);

  public pagination = {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  }
  constructor(private http: HttpClient) {}

  getTemplateUploadExcel() {
    return this.http.get(`${this.apiUrl}/template/download`, {
      responseType: 'blob',
    })
  }

  getProducts(paramReq: PaginationReq): void {
    this.products.next([]);
    const params: { [key: string]: any } = {};
    Object.keys(paramReq).map((key: string) => {
      const typedKey = key as keyof PaginationReq;
      if(paramReq[typedKey]) params[typedKey] = paramReq[typedKey];
    })
    this.http.get<PaginationResp<Product[]>>(`${this.apiUrl}`, {params})
    .subscribe(data => {
      this.products.next(data.data);
      this.pagination = {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      }
    });
  }

  getProductsDropdown({type, search}:{type: string, search: string}) {
    return this.http.get<{data: ProductDropdown[], total: number}>(`${this.apiUrl}/dropdown`, {
      params: {
        type,
        search,
      }
    });
  }

  getProductDetail(id: number): void {
    this.http.get<Product>(`${this.apiUrl}/${id}`)
      .subscribe(data => {
        this.product.next(data)
      })
  }

  uploadProduct(formData: FormData) {
    return this.http.post<Product>(`${this.apiUrl}/upload`, formData);
  }

  bulkUploadProduct(formData: FormData) {
    return this.http.post<Product>(`${this.apiUrl}/upload-excel`, formData);
  }

  bulkUploadProductImage(id: number,formData: FormData) {
    return this.http.post<Product>(`${this.apiUrl}/${id}/images`, formData);
  }
}
