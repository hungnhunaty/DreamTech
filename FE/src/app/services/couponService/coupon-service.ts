import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  url:string = `http://localhost:5149/api/coupon`;

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
