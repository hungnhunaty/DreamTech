import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  url:string = `${environment.apiUrl}/coupon`;

  constructor(private route:Router, private http: HttpClient){}

  addCoupon(data: any):Observable<any>{
    return this.http.post<any>(`${this.url}/addCoupon`, data);
  }

  getAllCoupons():Observable<any>{
    return this.http.get<any>(`${this.url}/getCoupons`);
  }

  deleteCoupon(id:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/deleteCoupon/${id}`);
  }

  updateCoupon(data:any):Observable<any>{
    return this.http.put<any>(`${this.url}/updateCoupon`, data);
  }
}
