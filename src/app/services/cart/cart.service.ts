import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Cart} from './shared/interface/cart.interface';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  public carts: BehaviorSubject<Cart[]> = new BehaviorSubject<Cart[]>([]);
  public cart: BehaviorSubject<Cart | null> = new BehaviorSubject<Cart | null>(null);

  constructor(private http: HttpClient) { }

  getCarts() {
    this.http.get<Cart[]>(`${this.apiUrl}`).subscribe((res) => {
      this.carts.next(res)
    })
  }

  getCart(id:number) {
    this.http.get<Cart>(`${this.apiUrl}/${id}`).subscribe((res) => {
      this.cart.next(res)
    })
  }

  createCart(payload: {customerId: number, productId: number, quantity: number, customerMeasurementId: string, collection_category: string}) {
      return this.http.post(`${this.apiUrl}/${payload.customerId}/cart`, {
        productId: payload.productId,
        quantity: payload.quantity,
        customerMeasurementId: payload.customerMeasurementId,
        collection_category: payload.collection_category,
      })
  }

  addToCartWithPhotos(customerId: number, formData: FormData) {
    return this.http.post(`${this.apiUrl}/${customerId}/cart-photos`, formData);
  }

  deleteCart(itemId: number) {
    return this.http.delete(`${this.apiUrl}/items/${itemId}`)
  }
}
